import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@hms/contracts';
import { Public } from '@hms/mod-identity-access';

// Liveness for the proxy and deploy checks; no session needed.
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    return { status: 'ok', service: 'api', time: new Date().toISOString() };
  }
}
