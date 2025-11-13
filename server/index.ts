import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { factory } from "./factory";
import { paymentRoutes } from "./routes/payment";

// Create the main app using the factory
const app = factory.createApp();

// Global middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check endpoint
app.get("/", async (c) => {
  const { PORT, NODE_ENV } = c.var;
  return c.json({
    success: true,
    message: "Zendfi Payment API is running",
    version: "1.0.0",
    environment: NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (c) => {
  return c.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.route("/api/v1/payments", paymentRoutes);

export const apiRoutes = app;
export type ApiRoutes = typeof apiRoutes;

// Start the server
const port = Number(process.env.PORT || 8000);

console.log(`🚀 Zendfi Payment API is running on http://localhost:${port}`);
console.log(`📖 API Documentation:`);
console.log(`   POST /api/v1/payments - Create a new payment`);
console.log(`   GET  /api/v1/payments/:id - Get payment by ID`);
console.log(`   GET  /api/v1/payments - Get all payments`);
console.log(`   DELETE /api/v1/payments/:id - Delete payment`);
console.log(`   GET  /health - Health check`);

serve({
  fetch: app.fetch,
  port,
});
