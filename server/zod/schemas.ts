import { z } from "zod";

// Payment request schema (matches Zendfi API)
export const createPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .toUpperCase(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long")
    .optional(),
  token: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  allow_custom_amount: z.boolean().optional(),
  minimum_amount: z.number().optional(),
  maximum_amount: z.number().optional(),
  suggested_amount: z.number().optional(),
  webhook_url: z.string().url().optional(),
  settlement_preference_override: z.string().optional(),
  split_recipient: z.array(z.any()).optional(),
});

// Payment response schema (matches actual Zendfi API response)
export const paymentResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  token: z.string().optional(), // Token is missing in the actual response
  description: z.string().optional(), // Description is missing in the actual response
  status: z.enum(["Pending", "Confirmed", "Failed", "Expired"]),
  qr_code: z.string(),
  payment_url: z.string(),
  mode: z.enum(["test", "live"]),
  expires_at: z.string(),
  created_at: z.string().optional(), // created_at is missing in actual response
  customer_wallet: z.string().nullable().optional(),
  transaction_signature: z.string().nullable().optional(),
  confirmed_at: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  settlement_info: z
    .object({
      estimated_processing_time: z.string().nullable(),
      batch_schedule: z.string().nullable(),
      processing_message: z.string().nullable(),
    })
    .nullable()
    .optional(),
  split_ids: z.array(z.string()).nullable().optional(),
});

export type CreatePaymentRequest = z.infer<typeof createPaymentSchema>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
