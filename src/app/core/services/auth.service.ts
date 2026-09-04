import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { ApiResponse } from '../models/api-response.model';


export interface RegisterRequest {

  fullName: string;

  email: string;

  password: string;

  age: number;

  gender: string;

  phoneNumber: string;

  address: string;

  bloodGroup: string;

}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/Auth`;


  // =========================
  // LOGIN
  // =========================

  login(
    model: LoginRequest
  ): Observable<ApiResponse<LoginResponse>> {

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      model
    );

  }


  // =========================
  // REGISTER
  // =========================

  register(
    model: RegisterRequest
  ): Observable<ApiResponse<any>> {

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/register`,
      model
    );

  }


    // =========================
  // FORGOT PASSWORD
  // =========================

  forgotPassword(
    model: ForgotPasswordRequest
  ): Observable<ApiResponse<any>> {

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/forgot-password`,
      model
    );

  }


  // =========================
  // RESET PASSWORD
  // =========================

  resetPassword(
    model: ResetPasswordRequest
  ): Observable<ApiResponse<any>> {

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/reset-password`,
      model
    );

  }

  // =========================
  // TOKEN
  // =========================

  saveToken(token: string): void {

    localStorage.setItem(
      'token',
      token
    );

  }


  getToken(): string | null {

    return localStorage.getItem('token');

  }



   // =========================
  // GET USER ROLE
  // =========================

getUserRole(): string | null {

  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {

    const payload = token.split('.')[1];

    const decodedPayload =
      JSON.parse(atob(payload));

    return (
      decodedPayload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] ||
      decodedPayload['role'] ||
      null
    );

  } catch (error) {

    console.error(
      'Unable to decode JWT:',
      error
    );

    return null;

  }

}


// =========================
// GET USER NAME
// =========================

getUserName(): string | null {

  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {

    const payload = token.split('.')[1];

    const decodedPayload =
      JSON.parse(atob(payload));

    return (
      decodedPayload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ] ||
      decodedPayload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/name'
      ] ||
      decodedPayload['name'] ||
      decodedPayload['unique_name'] ||
      null
    );

  } catch (error) {

    console.error(
      'Unable to decode user name from JWT:',
      error
    );

    return null;
  }
}

// =========================
// GET USER ID
// =========================

getUserId(): number | null {

  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {

    const payload = token.split('.')[1];

    const decodedPayload =
      JSON.parse(atob(payload));

    const userId =
      decodedPayload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ||
      decodedPayload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'
      ] ||
      decodedPayload['nameid'] ||
      decodedPayload['sub'];

    return userId
      ? Number(userId)
      : null;

  } catch (error) {

    console.error(
      'Unable to decode user ID from JWT:',
      error
    );

    return null;

  }

}


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    localStorage.removeItem('token');

  }


  // =========================
  // LOGIN STATUS
  // =========================

  isLoggedIn(): boolean {

    return this.getToken() != null;

  }

}

