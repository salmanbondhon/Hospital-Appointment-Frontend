import { PaymentMethod } from './payment.model';

export interface CreatePayment {
  appointmentId: number;
  paymentMethod: PaymentMethod;
}