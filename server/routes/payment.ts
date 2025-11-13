import { factory } from "../factory";
import { zValidator } from "@hono/zod-validator";
import { createPaymentSchema, paymentResponseSchema } from "../zod/schemas";
import { paymentService } from "../services/payment.service";
import { HTTPException } from "hono/http-exception";

export const paymentRoutes = factory.createApp();

/**
 * POST /payments
 * Create a new payment
 */
paymentRoutes.post("/", zValidator("json", createPaymentSchema), async (c) => {
  try {
    const paymentData = c.req.valid("json");

    // Create the payment
    const payment = await paymentService.createPayment(paymentData);

    // Validate the response against schema
    const validatedPayment = paymentResponseSchema.parse(payment);

    return c.json(
      {
        success: true,
        data: validatedPayment,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new HTTPException(500, {
      message: "Failed to create payment",
    });
  }
});

/**
 * GET /payments/:id
 * Get payment by ID
 */
paymentRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const payment = await paymentService.getPayment(id);

    if (!payment) {
      return c.json(
        {
          success: false,
          error: {
            code: "PAYMENT_NOT_FOUND",
            message: `Payment with ID ${id} not found`,
          },
        },
        404,
      );
    }

    const validatedPayment = paymentResponseSchema.parse(payment);

    return c.json({
      success: true,
      data: validatedPayment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw new HTTPException(500, {
      message: "Failed to fetch payment",
    });
  }
});

/**
 * GET /payments
 * Get all payments
 */
paymentRoutes.get("/", async (c) => {
  try {
    const payments = await paymentService.getAllPayments();

    // Validate all payments
    const validatedPayments = payments.map((payment) =>
      paymentResponseSchema.parse(payment),
    );

    return c.json({
      success: true,
      data: validatedPayments,
      meta: {
        count: validatedPayments.length,
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new HTTPException(500, {
      message: "Failed to fetch payments",
    });
  }
});

/**
 * DELETE /payments/:id
 * Delete payment by ID
 */
paymentRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const deleted = await paymentService.deletePayment(id);

    if (!deleted) {
      return c.json(
        {
          success: false,
          error: {
            code: "PAYMENT_NOT_FOUND",
            message: `Payment with ID ${id} not found`,
          },
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw new HTTPException(500, {
      message: "Failed to delete payment",
    });
  }
});
