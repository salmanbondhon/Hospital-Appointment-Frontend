import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/Notification`;


  // =========================
  // GET MY NOTIFICATIONS
  // =========================

  getMyNotifications(): Observable<Notification[]> {

    return this.http.get<Notification[]>(
      this.apiUrl
    );

  }


  // =========================
  // MARK AS READ
  // =========================

  markAsRead(id: number): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/read`,
      {}
    );

  }

}