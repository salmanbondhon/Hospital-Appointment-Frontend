import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Appointment
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Appointment`;










  // =========================
  // GET ALL APPOINTMENTS
  // =========================

  getAll(): Observable<Appointment[]> {

    return this.http.get<Appointment[]>(
      this.apiUrl
    );

  }


  // =========================
  // GET APPOINTMENT BY ID
  // =========================

  getById(id: number): Observable<Appointment> {

    return this.http.get<Appointment>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // CREATE
  // =========================

  create(model: {

    doctorId: number;

    appointmentDate: string;

    problemDescription: string;

  }): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      model
    );

  }


  // =========================
  // UPDATE
  // =========================

  update(
    id: number,
    model: {
      doctorId: number;
      patientId: number;
      appointmentDate: string;
      problemDescription: string;
      status: number;
    }
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      model
    );

  }


  // =========================
  // DELETE
  // =========================

  delete(id: number): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // APPROVE
  // =========================

  approve(id: number): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/approve`,
      {}
    );

  }


  // =========================
  // COMPLETE
  // =========================

  complete(id: number): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/complete`,
      {}
    );

  }


  // =========================
  // CANCEL
  // =========================

  cancel(id: number): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );

  }

}