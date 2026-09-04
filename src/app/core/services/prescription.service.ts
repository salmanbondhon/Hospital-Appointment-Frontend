import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import {
  Prescription
} from '../models/prescription.model';


@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/Prescription`;


  // =========================
  // GET ALL
  // =========================

  getAll(): Observable<Prescription[]> {

    return this.http.get<Prescription[]>(
      this.apiUrl
    );

  }


  // =========================
  // GET BY ID
  // =========================

  getById(
    id: number
  ): Observable<Prescription> {

    return this.http.get<Prescription>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // CREATE
  // =========================

  create(model: {

    appointmentId: number;

    diagnosis: string;

    medicines: string;

    notes: string;

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

      diagnosis: string;

      medicines: string;

      notes: string;

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

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );

  }

}