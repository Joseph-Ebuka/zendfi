import { CreatePaymentRequest, PaymentResponse, PaymentStatus } from '../zod/schemas';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demonstration (replace with actual database)
const payments: Map<string, PaymentResponse> = new Map();

export class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    const now = new Date();
    const payment: PaymentResponse = {
      id: uuidv4(),
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      token: request.token,
      status: 'pending',
      metadata: request.metadata,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Store the payment
    payments.set(payment.id, payment);

    // Simulate payment processing
    this.processPaymentAsync(payment.id);

    return payment;
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<PaymentResponse | null> {
    return payments.get(id) || null;
  }

  /**
   * Get all payments
   */
  async getAllPayments(): Promise<PaymentResponse[]> {
    return Array.from(payments.values());
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<PaymentResponse | null> {
    const payment = payments.get(id);
    if (!payment) {
      return null;
    }

    payment.status = status;
    payment.updatedAt = new Date().toISOString();
    payments.set(id, payment);

    return payment;
  }

  /**
   * Delete payment
   */
  async deletePayment(id: string): Promise<boolean> {
    return payments.delete(id);
  }

  /**
   * Simulate async payment processing
   */
  private async processPaymentAsync(paymentId: string): Promise<void> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const payment = payments.get(paymentId);
    if (!payment) return;

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    const newStatus = isSuccess ? 'completed' : 'failed';

    payment.status = newStatus;
    payment.updatedAt = new Date().toISOString();
    payments.set(paymentId, payment);
  }
}

export const paymentService = new PaymentService();
