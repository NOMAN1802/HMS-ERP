// Converts every error into RFC 9457 problem+json with a stable code (D section 8.3).
// DomainErrors keep their code and details; Nest HTTP errors map by status; anything else is
// an unexpected INTERNAL_ERROR whose message is never sent to the client.
import {
  Catch,
  HttpException,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { errorCodes, type ErrorCode } from '@hms/contracts';
import { DomainError } from '@hms/domain-kernel';

interface HttpResponseLike {
  status(code: number): HttpResponseLike;
  type(contentType: string): HttpResponseLike;
  send(body: string): void;
}

const statusToCode: Record<number, ErrorCode> = {
  400: 'VALIDATION_FAILED',
  401: 'UNAUTHENTICATED',
  403: 'PERMISSION_DENIED',
  404: 'NOT_FOUND',
  413: 'VALIDATION_FAILED',
  422: 'VALIDATION_FAILED',
  503: 'SERVICE_UNAVAILABLE',
};

// Fixed titles: the message of a framework error can contain parser internals.
const statusTitles: Record<number, string> = {
  400: 'Bad request',
  401: 'Login required',
  403: 'Not allowed',
  404: 'Not found',
  413: 'Request too large',
  422: 'Request is invalid',
  503: 'Service unavailable',
};

function isKnownCode(code: string): code is ErrorCode {
  return Object.hasOwn(errorCodes, code);
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponseLike>();
    if (!(exception instanceof DomainError) && !(exception instanceof HttpException)) {
      // The client only sees a generic message, so the real cause must be logged here.
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }
    const problem = toProblem(exception);
    response.status(problem.status).type('application/problem+json').send(JSON.stringify(problem));
  }
}

function toProblem(exception: unknown): Record<string, unknown> & { status: number } {
  if (exception instanceof DomainError && isKnownCode(exception.code)) {
    const status = errorCodes[exception.code];
    // Base fields last, so details can never override the status or code.
    return { ...exception.details, ...base(exception.code, status, exception.message) };
  }
  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const code = statusToCode[status] ?? 'INTERNAL_ERROR';
    return base(code, status, statusTitles[status] ?? 'Request failed');
  }
  return base('INTERNAL_ERROR', 500, 'Unexpected error');
}

function base(code: string, status: number, title: string) {
  return { type: `urn:hms:error:${code}`, title, status, code };
}
