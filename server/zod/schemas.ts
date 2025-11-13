import { z } from 'zod';

// Payment request schema
export const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').toUpperCase(),
  description: z.string().min(1, 'Description is required').max(255, 'Description too long'),
  token: z.string().min(1, 'Token is required'),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Payment response schema
export const paymentResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
  token: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Payment status enum
export const paymentStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

// JWT payload schema for future authentication
export const jwtPayloadSchema = z.object({
  sub: z.string(),
  role: z.string(),
  exp: z.number().refine((val) => val > Date.now() / 1000, {
    message: 'expired',
  }),
  iat: z.number(),
});

export type CreatePaymentRequest = z.infer<typeof createPaymentSchema>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
