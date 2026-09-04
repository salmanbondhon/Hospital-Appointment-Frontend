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
} from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private http = inject(HttpClient);

  private apiUrl =
    environment.apiUrl;


  // =========================
  // PATIENT PROFILE
  // =========================

  getMyPatientProfile(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/Patient/me`
    );

  }


  // =========================
  // DOCTOR PROFILE
  // =========================

  getMyDoctorProfile(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/Doctor/me`
    );

  }


  // =========================
  // CHANGE PASSWORD
  // =========================

 // =========================
// CHANGE PASSWORD
// =========================

changePassword(request: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {

  return this.http.put<any>(
    `${this.apiUrl}/User/change-password`,
    request
  );

}

}