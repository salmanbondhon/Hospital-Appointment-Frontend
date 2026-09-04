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
  Patient
} from '../models/patient.model';


export interface CreatePatient {

  fullName: string;

  email: string;

  password: string;

  age: number;

  gender: string;

  phoneNumber: string;

  address: string;

  bloodGroup: string;
}


export interface UpdatePatient {

  fullName: string;

  email: string;

  password?: string;

  age: number;

  gender: string;

  phoneNumber: string;

  address: string;

  bloodGroup: string;
}


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private http =
    inject(HttpClient);


  private apiUrl =
    `${environment.apiUrl}/Patient`;


  // =================================================
  // GET ALL
  // =================================================

  getAll(): Observable<Patient[]> {

    return this.http.get<Patient[]>(
      this.apiUrl
    );
  }


  // =================================================
  // GET BY ID
  // =================================================

  getById(
    id: number
  ): Observable<Patient> {

    return this.http.get<Patient>(
      `${this.apiUrl}/${id}`
    );
  }


  // =================================================
// GET MY PROFILE
// =================================================

getMyProfile(): Observable<Patient> {

  return this.http.get<Patient>(
    `${this.apiUrl}/me`
  );

}

  // =================================================
  // CREATE
  // =================================================

  create(
    patient: CreatePatient
  ): Observable<Patient> {

    return this.http.post<Patient>(
      this.apiUrl,
      patient
    );
  }


  // =================================================
  // UPDATE
  // =================================================

  update(
    id: number,
    patient: UpdatePatient
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      patient
    );
  }


  // =================================================
  // DELETE
  // =================================================

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}