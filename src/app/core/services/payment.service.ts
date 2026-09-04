import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  Payment,
  CreatePayment
} from '../models/payment.model';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private http =
    inject(HttpClient);


  private apiUrl =
    `${environment.apiUrl}/Payment`;


  // =================================================
  // GET ALL PAYMENTS
  // =================================================

  getAll(): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      this.apiUrl
    );

  }


  // =================================================
  // GET PAYMENT BY ID
  // =================================================

  getById(
    id: number
  ): Observable<Payment> {

    return this.http.get<Payment>(
      `${this.apiUrl}/${id}`
    );

  }


  // =================================================
  // CREATE PAYMENT
  // =================================================

  create(
    payment: CreatePayment
  ): Observable<Payment> {

    return this.http.post<Payment>(
      this.apiUrl,
      payment
    );

  }


  // =================================================
  // DELETE PAYMENT
  // =================================================

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}