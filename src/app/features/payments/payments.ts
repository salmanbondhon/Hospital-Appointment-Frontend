import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AppointmentService
} from '../../core/services/appointment.service';

import {
  Appointment,
  AppointmentStatus
} from '../../core/models/appointment.model';

import {
  PaymentService
} from '../../core/services/payment.service';

import {
  Payment,
  PaymentMethod,
  PaymentStatus
} from '../../core/models/payment.model';

import {
  AuthService
} from '../../core/services/auth.service';


@Component({
  selector: 'app-payments',

  standalone: true,

 imports: [
  CommonModule,
  DatePipe,
  FormsModule
],

  templateUrl: './payments.html',

  styleUrl: './payments.css'
})
export class PaymentsComponent
  implements OnInit {


  // =================================================
  // SERVICES
  // =================================================

  private appointmentService =
    inject(AppointmentService);


  private paymentService =
    inject(PaymentService);


  private authService =
    inject(AuthService);


  private cdr =
    inject(ChangeDetectorRef);


  // =================================================
  // DATA
  // =================================================

  appointments: Appointment[] = [];

  payments: Payment[] = [];


  // =================================================
  // STATE
  // =================================================

  isLoading = true;

  isPaying = false;

  errorMessage = '';

  successMessage = '';


  // =================================================
  // PAYMENT
  // =================================================

  selectedAppointment:
    Appointment | null = null;


  selectedPaymentMethod:
    PaymentMethod = PaymentMethod.Bkash;


  // =================================================
  // ENUMS FOR HTML
  // =================================================

  PaymentMethod = PaymentMethod;

  PaymentStatus = PaymentStatus;

  AppointmentStatus = AppointmentStatus;


  // =================================================
  // PAYMENT METHODS
  // =================================================

  paymentMethods = [

    {
      value: PaymentMethod.Cash,
      name: 'Cash'
    },

    {
      value: PaymentMethod.Card,
      name: 'Card'
    },

    {
      value: PaymentMethod.Bkash,
      name: 'bKash'
    },

    {
      value: PaymentMethod.Nagad,
      name: 'Nagad'
    },

    {
      value: PaymentMethod.SSLCommerz,
      name: 'SSLCommerz'
    },

    {
      value: PaymentMethod.Stripe,
      name: 'Stripe'
    }

  ];


  // =================================================
  // INIT
  // =================================================

  ngOnInit(): void {

    this.loadData();

  }


  // =================================================
  // LOAD DATA
  // =================================================

  loadData(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    // =================================================
    // LOAD APPOINTMENTS
    // =================================================

    this.appointmentService
      .getAll()
      .subscribe({

        next: (appointments) => {

          console.log(
            'Appointments:',
            appointments
          );


          this.appointments =
            appointments;


          // =========================================
          // LOAD PAYMENTS
          // =========================================

          this.loadPayments();

        },


        error: (error) => {

          console.error(
            'Appointments API error:',
            error
          );


          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load appointments.';


          this.cdr.detectChanges();

        }

      });

  }


  // =================================================
  // LOAD PAYMENTS
  // =================================================

  loadPayments(): void {

    this.paymentService
      .getAll()
      .subscribe({

        next: (payments) => {

          console.log(
            'Payments:',
            payments
          );


          this.payments =
            payments;


          this.isLoading = false;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Payments API error:',
            error
          );


          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load payments.';


          this.cdr.detectChanges();

        }

      });

  }


  // =================================================
  // SELECT APPOINTMENT
  // =================================================

  selectAppointment(
    appointment: Appointment
  ): void {

    this.selectedAppointment =
      appointment;


    this.errorMessage = '';

    this.successMessage = '';


    console.log(
      'Selected appointment:',
      appointment
    );

  }


  // =================================================
  // CHECK PAYMENT EXISTS
  // =================================================

  hasPayment(
    appointmentId: number
  ): boolean {

    return this.payments.some(
      payment =>
        payment.appointmentId === appointmentId
    );

  }


  // =================================================
  // GET PAYMENT
  // =================================================

  getPayment(
    appointmentId: number
  ): Payment | undefined {

    return this.payments.find(
      payment =>
        payment.appointmentId === appointmentId
    );

  }


  // =================================================
  // PAY NOW
  // =================================================

  payNow(): void {

    // ================================================
    // CHECK APPOINTMENT
    // ================================================

    if (!this.selectedAppointment) {

      this.errorMessage =
        'Please select an appointment.';

      return;

    }


    const appointment =
      this.selectedAppointment;


    // ================================================
    // CHECK CANCELLED
    // ================================================

    if (
      appointment.status ===
      AppointmentStatus.Cancelled
    ) {

      this.errorMessage =
        'Cancelled appointments cannot be paid.';

      return;

    }


    // ================================================
    // CHECK EXISTING PAYMENT
    // ================================================

    if (
      this.hasPayment(
        appointment.id
      )
    ) {

      this.errorMessage =
        'Payment already exists for this appointment.';

      return;

    }


    // ================================================
    // START PAYMENT
    // ================================================

    this.isPaying = true;

    this.errorMessage = '';

    this.successMessage = '';


    // ================================================
    // CREATE PAYMENT
    //
    // IMPORTANT:
    // We DO NOT send amount.
    //
    // Backend calculates:
    //
    // Doctor.ConsultationFee
    // ================================================

    this.paymentService
      .create({

        appointmentId:
          appointment.id,

        paymentMethod:
          this.selectedPaymentMethod

      })
      .subscribe({

        next: (payment) => {

          console.log(
            'Payment successful:',
            payment
          );


          this.isPaying = false;


          this.successMessage =
            `Payment successful. Amount: ৳${payment.amount}`;


          this.selectedAppointment =
            null;


          // =========================================
          // REFRESH PAYMENTS
          // =========================================

          this.loadPayments();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Payment API error:',
            error
          );


          this.isPaying = false;


          this.errorMessage =
            error?.error?.message ||
            'Payment failed.';


          this.cdr.detectChanges();

        }

      });

  }


  // =================================================
  // PAYMENT METHOD NAME
  // =================================================

  getPaymentMethodName(
    method: PaymentMethod
  ): string {

    switch (method) {

      case PaymentMethod.Cash:
        return 'Cash';

      case PaymentMethod.Card:
        return 'Card';

      case PaymentMethod.Bkash:
        return 'bKash';

      case PaymentMethod.Nagad:
        return 'Nagad';

      case PaymentMethod.SSLCommerz:
        return 'SSLCommerz';

      case PaymentMethod.Stripe:
        return 'Stripe';

      default:
        return 'Unknown';

    }

  }


  // =================================================
  // PAYMENT STATUS NAME
  // =================================================

  getPaymentStatusName(
    status: PaymentStatus
  ): string {

    switch (status) {

      case PaymentStatus.Pending:
        return 'Pending';

      case PaymentStatus.Paid:
        return 'Paid';

      case PaymentStatus.Failed:
        return 'Failed';

      case PaymentStatus.Refunded:
        return 'Refunded';

      default:
        return 'Unknown';

    }

  }


  // =================================================
  // CLOSE PAYMENT
  // =================================================

  closePayment(): void {

    this.selectedAppointment =
      null;

    this.errorMessage = '';

    this.successMessage = '';

  }

}