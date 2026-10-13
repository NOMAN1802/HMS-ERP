import { Test } from '@nestjs/testing';
import { healthResponseSchema } from '@hms/contracts';
import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns a response that matches the health contract', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    const body = moduleRef.get(HealthController).check();

    expect(healthResponseSchema.parse(body).service).toBe('api');
  });
});
