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
  DoctorLeave,
  CreateLeave
} from '../models/doctor-leave.model';


@Injectable({
  providedIn: 'root'
})
export class DoctorLeaveService {

  private http =
    inject(HttpClient);


  private apiUrl =
    `${environment.apiUrl}/DoctorLeave`;


  // =================================================
  // DOCTOR - CREATE LEAVE
  // =================================================

  create(
    leave: CreateLeave
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      leave
    );

  }


  // =================================================
  // DOCTOR - GET MY LEAVES
  // =================================================

  getMyLeaves(): Observable<DoctorLeave[]> {

    return this.http.get<DoctorLeave[]>(
      `${this.apiUrl}/my-leaves`
    );

  }


  // =================================================
  // ADMIN - GET ALL LEAVES
  // =================================================

  getAll(): Observable<DoctorLeave[]> {

    return this.http.get<DoctorLeave[]>(
      this.apiUrl
    );

  }


  // =================================================
  // ADMIN - APPROVE
  // =================================================

  approve(
    id: number
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/approve`,
      {}
    );

  }


  // =================================================
  // ADMIN / DOCTOR - DELETE
  // =================================================

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );

  }

}