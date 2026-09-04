import { Component, inject, HostListener } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { DatePipe } from '@angular/common';

import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Notification } from '../core/models/notification.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  DatePipe,
  FooterComponent
],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);


  // =========================
  // USER
  // =========================

  userName: string = 'User';
  userRole: string = '';

// =========================
// USER MENU
// =========================

showUserMenu = false;


  // =========================
  // NOTIFICATIONS
  // =========================

  notifications: Notification[] = [];

  unreadCount: number = 0;

  showNotifications: boolean = false;


  // =========================
  // INITIALIZE
  // =========================

  constructor() {

    this.loadUserInfo();

    this.loadNotifications();

  }


  // =========================
  // USER INFORMATION
  // =========================

  loadUserInfo(): void {

    const token = this.authService.getToken();

    if (!token) {
      return;
    }

    try {

      const payload = token.split('.')[1];

      const decodedPayload =
        JSON.parse(atob(payload));

      this.userName =
        decodedPayload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ] ||
        decodedPayload['name'] ||
        decodedPayload['unique_name'] ||
        'User';

      this.userRole =
        this.authService.getUserRole() || '';

    }
    catch (error) {

      console.error(
        'Unable to read user information:',
        error
      );

    }

  }


  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  loadNotifications(): void {

    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (data) => {

          this.notifications = data;

          this.updateUnreadCount();

        },

        error: (error) => {

          console.error(
            'Failed to load notifications:',
            error
          );

        }

      });

  }


  // =========================
  // UNREAD COUNT
  // =========================

  updateUnreadCount(): void {

    this.unreadCount =
      this.notifications.filter(
        notification => !notification.isRead
      ).length;

  }


  // =========================
  // TOGGLE NOTIFICATIONS
  // =========================

  toggleNotifications(): void {

    this.showNotifications =
      !this.showNotifications;

    // Refresh when opening
    if (this.showNotifications) {

      this.loadNotifications();

    }

  }


  // =========================
  // MARK AS READ
  // =========================

  markAsRead(
    notification: Notification
  ): void {

    if (notification.isRead) {
      return;
    }

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.isRead = true;

          this.updateUnreadCount();

        },

        error: (error) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

        }

      });

  }


  // =========================
  // CLOSE DROPDOWN
  // =========================

@HostListener(
  'document:click',
  ['$event']
)
onDocumentClick(event: MouseEvent): void {

  const target =
    event.target as HTMLElement;


  // Close notification dropdown
  if (
    !target.closest('.notification-wrapper')
  ) {

    this.showNotifications = false;

  }


  // Close user dropdown
  if (
    !target.closest('.user-profile')
  ) {

    this.showUserMenu = false;

  }

}


  // =========================
// TOGGLE USER MENU
// =========================

toggleUserMenu(event: MouseEvent): void {

  event.stopPropagation();

  this.showUserMenu =
    !this.showUserMenu;

  // Close notification dropdown
  this.showNotifications = false;
}


// =========================
// GO TO PROFILE
// =========================

goToProfile(): void {

  this.showUserMenu = false;

  this.router.navigate([
    '/profile'
  ]);

}

  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/']);

  }

}