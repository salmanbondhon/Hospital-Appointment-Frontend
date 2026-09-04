import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/Doctor`;


  // =========================
  // GET ALL
  // =========================

  getAll(): Observable<Doctor[]> {

    return this.http.get<Doctor[]>(
      this.apiUrl
    );

  }


  // =========================
  // GET BY ID
  // =========================

  getById(
    id: number
  ): Observable<Doctor> {

    return this.http.get<Doctor>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // CREATE DOCTOR
  // =========================

  create(
    model: {
      fullName: string;
      email: string;
      password: string;

      specialization: string;
      qualification: string;

      experience: number;
      consultationFee: number;

      availableFrom: string;
      availableTo: string;

      departmentId: number;
    }
  ): Observable<Doctor> {

    return this.http.post<Doctor>(
      this.apiUrl,
      model
    );

  }


  // =========================
  // UPDATE DOCTOR
  // =========================

  update(
    id: number,
    model: {
      fullName: string;

      email: string;

      password?: string;

      specialization: string;
      qualification: string;

      experience: number;
      consultationFee: number;

      availableFrom: string;
      availableTo: string;

      departmentId: number;
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