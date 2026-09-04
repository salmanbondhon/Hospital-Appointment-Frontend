export enum PaymentMethod {
  Cash = 1,
  Card = 2,
  Bkash = 3,
  Nagad = 4,
  SSLCommerz = 5,
  Stripe = 6
}


export enum PaymentStatus {
  Pending = 1,
  Paid = 2,
  Failed = 3,
  Refunded = 4
}


export interface Payment {

  id: number;

  appointmentId: number;

  patientName: string;

  doctorName: string;

  amount: number;

  paymentMethod: PaymentMethod;

  status: PaymentStatus;

  transactionId: string;

  paymentDate: string;
}


export interface CreatePayment {

  appointmentId: number;

  paymentMethod: PaymentMethod;
}