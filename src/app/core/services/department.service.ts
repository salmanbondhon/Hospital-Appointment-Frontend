import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Department } from '../models/department.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Department`;


  // =========================
  // GET ALL
  // =========================

  getAll(): Observable<ApiResponse<Department[]>> {

    return this.http.get<ApiResponse<Department[]>>(
      this.apiUrl
    );

  }


  // =========================
  // GET BY ID
  // =========================

  getById(id: number): Observable<ApiResponse<Department>> {

    return this.http.get<ApiResponse<Department>>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // CREATE
  // =========================

  create(model: {
    name: string;
    description: string | null;
  }): Observable<ApiResponse<Department>> {

    return this.http.post<ApiResponse<Department>>(
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
      name: string;
      description: string | null;
    }
  ): Observable<ApiResponse<object>> {

    return this.http.put<ApiResponse<object>>(
      `${this.apiUrl}/${id}`,
      model
    );

  }


  // =========================
  // DELETE
  // =========================

  delete(id: number): Observable<ApiResponse<object>> {

    return this.http.delete<ApiResponse<object>>(
      `${this.apiUrl}/${id}`
    );

  }

}