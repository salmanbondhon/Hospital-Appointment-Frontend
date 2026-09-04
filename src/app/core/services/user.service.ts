import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/User`;


  // =========================
  // AVAILABLE DOCTOR USERS
  // =========================

  getAvailableDoctorUsers(): Observable<User[]> {

    return this.http.get<User[]>(
      `${this.apiUrl}/available-doctors`
    );

  }


  // =========================
  // AVAILABLE PATIENT USERS
  // =========================

  getAvailablePatientUsers(): Observable<User[]> {

    return this.http.get<User[]>(
      `${this.apiUrl}/available-patients`
    );

  }

}