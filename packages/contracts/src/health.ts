import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string().min(1),
  time: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
