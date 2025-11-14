import "dotenv/config";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { paymentRoutes } from "./routes/payment.js";

const app = new Hono();

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
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Zendfi Payment API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8000,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (c) => {
  return c.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.route("/api/v1/payments", paymentRoutes);

// Start the server
const port = Number(process.env.PORT || 8000);

console.log(`🚀 Zendfi Payment API is running on http://localhost:${port}`);
console.log(`📖 API Documentation:`);
console.log(`   POST /api/v1/payments - Create a new payment`);
console.log(`   GET  /api/v1/payments/:id - Get payment by ID`);
console.log(`   GET  /health - Health check`);

serve({
  fetch: app.fetch,
  port,
});
