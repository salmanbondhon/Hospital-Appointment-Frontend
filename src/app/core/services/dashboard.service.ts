import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { AdminDashboard } from '../models/admin-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Dashboard`;

  getAdminDashboard(): Observable<AdminDashboard> {

    return this.http.get<AdminDashboard>(
      `${this.apiUrl}/admin`
    );

  }
}