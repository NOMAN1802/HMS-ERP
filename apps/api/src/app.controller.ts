import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@hms/mod-identity-access';

// Root status route: confirms the API is up and which port it bound to. No session needed.
@Public()
@ApiTags('status')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Server status and bound port' })
  @Get()
  status(): { message: string } {
    const port = process.env.API_PORT ?? 4100;
    return { message: `NEST server is running on port ${port}` };
  }
}
