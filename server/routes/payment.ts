import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { createPaymentSchema } from "../zod/schemas.js";

const app = new Hono();

// Get environment variables
const ZENDFI_API_KEY = process.env.ZENDFI_API_KEY;
const ZENDFI_API_URL = process.env.ZENDFI_API_URL || "https://api.zendfi.tech";

if (!ZENDFI_API_KEY) {
  console.error(" ZENDFI_API_KEY is required in environment variables");
  process.exit(1);
}

// Helper function to make Zendfi API requests
async function makeZendfiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${ZENDFI_API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ZENDFI_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Zendfi API error: ${response.status} - ${JSON.stringify(errorData)}`,
    );
  }

  return response.json();
}

/**
 * POST /api/v1/payments
 * Create a new payment
 */
app.post("/", zValidator("json", createPaymentSchema), async (c) => {
  try {
    const paymentData = c.req.valid("json");
    console.log(
      "Creating payment with data:",
      JSON.stringify(paymentData, null, 2),
    );

    // Make request to Zendfi API
    const zendfiResponse = await makeZendfiRequest("/api/v1/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });

    console.log(
      "Zendfi API response:",
      JSON.stringify(zendfiResponse, null, 2),
    );

    return c.json(
      {
        success: true,
        data: zendfiResponse,
      },
      201,
    );
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    throw new HTTPException(500, {
      message: "Failed to create payment",
    });
  }
});

/**
 * GET /api/v1/payments/:id
 * Get payment by ID
 */
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log(`Getting payment: ${id}`);

    const zendfiResponse = await makeZendfiRequest(`/api/v1/payments/${id}`);

    console.log("Payment found:", JSON.stringify(zendfiResponse, null, 2));

    return c.json({
      success: true,
      data: zendfiResponse,
    });
  } catch (error) {
    // console.error("Error fetching payment:", error);

    if (error instanceof Error && error.message.includes("404")) {
      return c.json(
        {
          success: false,
          error: {
            code: "PAYMENT_NOT_FOUND",
            message: `Payment with ID ${c.req.param("id")} not found`,
          },
        },
        404,
      );
    }

    throw new HTTPException(500, {
      message: `Failed to fetch payment ${c.req.param("id")} ${error.message}`,
    });
  }
});

export { app as paymentRoutes };
