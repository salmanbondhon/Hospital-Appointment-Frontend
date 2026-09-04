import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardService } from '../../core/services/dashboard.service';
import { AdminDashboard } from '../../core/models/admin-dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  dashboard: AdminDashboard | null = null;

  isLoading = true;
  errorMessage = '';

  today = new Date();

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    console.log('Loading dashboard started');

    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getAdminDashboard().subscribe({

      next: (data) => {

        console.log('Dashboard API response:', data);

        this.dashboard = data;
        this.isLoading = false;

        console.log('isLoading:', this.isLoading);
        console.log('dashboard:', this.dashboard);

        // Force UI refresh
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Dashboard API error:', error);

        this.isLoading = false;
        this.errorMessage = 'Unable to load dashboard data.';

        // Force UI refresh
        this.cdr.detectChanges();
      }

    });

  }

}