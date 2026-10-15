// Validates a request body with a contracts schema (ADR-005). Failures become
// VALIDATION_FAILED with one entry per field, so the UI can highlight inputs.
import type { PipeTransform } from '@nestjs/common';
import { DomainError } from '@hms/domain-kernel';
import type { z } from 'zod';

export class ZodBodyPipe<S extends z.ZodType> implements PipeTransform<unknown, z.infer<S>> {
  constructor(private readonly schema: S) {}

  transform(value: unknown): z.infer<S> {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;
    const fields = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    throw new DomainError('VALIDATION_FAILED', 'Request body is invalid', { fields });
  }
}
