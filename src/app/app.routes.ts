import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password';
import { DashboardComponent } from './features/dashboard/dashboard';
import { DepartmentsComponent } from './features/departments/departments';
import { DoctorsComponent } from './features/doctors/doctors';
import { PatientsComponent } from './features/patients/patients';
import { AppointmentsComponent }
  from './features/appointments/appointments';

  import { PrescriptionsComponent }
  from './features/prescriptions/prescriptions';

  import { MedicalRecordsComponent }
  from './features/medical-records/medical-records';

  import { PaymentsComponent }
  from './features/payments/payments';


import { LayoutComponent } from './layout/layout';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // =========================
  // Public Route
  // =========================

  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
  path: 'forgot-password',
  component: ForgotPasswordComponent
},

{
  path: 'reset-password',
  component: ResetPasswordComponent
},
  // =========================
  // Protected Routes
  // =========================

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'departments',
        component: DepartmentsComponent
      },

       {
    path: 'doctors',
    component: DoctorsComponent
  },
  {
  path: 'patients',
  component: PatientsComponent
},
{
  path: 'appointments',
  component: AppointmentsComponent
},
{
  path: 'prescriptions',
  component: PrescriptionsComponent
},
{
  path: 'medical-records',
  component: MedicalRecordsComponent
},
{
  path: 'payments',
  component: PaymentsComponent
},

  {
    path: 'doctor-leaves',
    loadComponent: () =>
      import('./features/doctor-leaves/doctor-leaves')
        .then(m => m.DoctorLeaves)
  },

  {
  path: 'profile',
  loadComponent: () =>
    import('./features/profile/profile')
      .then(m => m.ProfileComponent)
}

    ]
  },

  // =========================
  // Invalid URL
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];