import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';

import {
  ProfileService
} from '../../core/services/profile.service';


@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './profile.html',

  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);

  private profileService = inject(ProfileService);

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);


  // =====================================================
  // BASIC USER INFORMATION
  // =====================================================

  userId: number | null = null;

  userName: string | null = null;

  userEmail: string | null = null;

  userRole: string | null = null;


  // =====================================================
  // PROFILE
  // =====================================================

  profile: any = null;

  isLoading = false;

  errorMessage = '';


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  showChangePassword = false;

  currentPassword = '';

  newPassword = '';

  confirmPassword = '';

  isChangingPassword = false;

  passwordSuccessMessage = '';

  passwordErrorMessage = '';


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.userId =
      this.authService.getUserId();

    this.userName =
      this.authService.getUserName();

    this.userRole =
      this.authService.getUserRole();

    this.loadProfile();
  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.profile = null;


    // =====================================================
    // PATIENT
    // =====================================================

    if (this.userRole === 'Patient') {

      this.profileService
        .getMyPatientProfile()
        .subscribe({

          next: (data) => {

            this.profile = data;

            this.userEmail =
              data.email;

            this.isLoading = false;

            // Force UI update
            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Failed to load patient profile:',
              error
            );

            this.errorMessage =
              'Unable to load patient profile.';

            this.isLoading = false;

            this.cdr.detectChanges();
          }

        });

      return;
    }


    // =====================================================
    // DOCTOR
    // =====================================================

    if (this.userRole === 'Doctor') {

      this.profileService
        .getMyDoctorProfile()
        .subscribe({

          next: (data) => {

            this.profile = data;

            this.userEmail =
              data.email;

            this.isLoading = false;

            // Force UI update
            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Failed to load doctor profile:',
              error
            );

            this.errorMessage =
              'Unable to load doctor profile.';

            this.isLoading = false;

            this.cdr.detectChanges();
          }

        });

      return;
    }


    // =====================================================
    // ADMIN
    // =====================================================

    if (this.userRole === 'Admin') {

      this.profile = {

        id: this.userId,

        fullName: this.userName,

        email: this.getUserEmail(),

        role: this.userRole

      };

      this.userEmail =
        this.profile.email;

      this.isLoading = false;

      this.cdr.detectChanges();

      return;
    }


    // =====================================================
    // UNKNOWN ROLE
    // =====================================================

    this.errorMessage =
      'Unable to determine user role.';

    this.isLoading = false;

    this.cdr.detectChanges();
  }


  // =====================================================
  // GET EMAIL FROM JWT
  // =====================================================

  private getUserEmail(): string | null {

    const token =
      this.authService.getToken();

    if (!token) {
      return null;
    }

    try {

      const payload =
        token.split('.')[1];

      const decodedPayload =
        JSON.parse(atob(payload));

      return (
        decodedPayload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ] ||
        decodedPayload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress'
        ] ||
        decodedPayload['email'] ||
        null
      );

    }
    catch {

      return null;
    }
  }


  // =====================================================
  // OPEN CHANGE PASSWORD
  // =====================================================

  openChangePassword(): void {

    this.showChangePassword = true;

    this.passwordSuccessMessage = '';

    this.passwordErrorMessage = '';

    this.currentPassword = '';

    this.newPassword = '';

    this.confirmPassword = '';

    this.cdr.detectChanges();
  }


  // =====================================================
  // CLOSE CHANGE PASSWORD
  // =====================================================

  closeChangePassword(): void {

    if (this.isChangingPassword) {
      return;
    }

    this.showChangePassword = false;

    this.passwordSuccessMessage = '';

    this.passwordErrorMessage = '';

    this.currentPassword = '';

    this.newPassword = '';

    this.confirmPassword = '';

    this.cdr.detectChanges();
  }


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  changePassword(): void {

  // =====================================================
  // CLEAR OLD MESSAGES
  // =====================================================

  this.passwordSuccessMessage = '';
  this.passwordErrorMessage = '';


  // =====================================================
  // VALIDATION
  // =====================================================

  if (!this.currentPassword.trim()) {

    this.passwordErrorMessage =
      'Current password is required.';

    return;
  }


  if (!this.newPassword.trim()) {

    this.passwordErrorMessage =
      'New password is required.';

    return;
  }


  if (!this.confirmPassword.trim()) {

    this.passwordErrorMessage =
      'Please confirm your new password.';

    return;
  }


  if (this.newPassword !== this.confirmPassword) {

    this.passwordErrorMessage =
      'New password and confirm password do not match.';

    return;
  }


  if (this.currentPassword === this.newPassword) {

    this.passwordErrorMessage =
      'New password must be different from current password.';

    return;
  }


  // =====================================================
  // START REQUEST
  // =====================================================

  this.isChangingPassword = true;


const request = {

  currentPassword:
    this.currentPassword,

  newPassword:
    this.newPassword,

  confirmPassword:
    this.confirmPassword

};


  console.log(
    'Sending change password request:',
    request
  );


  // =====================================================
  // API REQUEST
  // =====================================================

  this.profileService
    .changePassword(request)
    .subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: (response) => {

        console.log(
          'Password changed successfully:',
          response
        );

        this.isChangingPassword = false;

        this.passwordSuccessMessage =
          'Password changed successfully.';

        this.passwordErrorMessage = '';

        // Clear fields
        this.currentPassword = '';

        this.newPassword = '';

        this.confirmPassword = '';

        this.cdr.detectChanges();

      },


      // =================================================
      // ERROR
      // =================================================

      error: (error) => {

        console.error(
          'Change password failed:',
          error
        );

        console.error(
          'Status:',
          error?.status
        );

        console.error(
          'Backend response:',
          error?.error
        );


        this.isChangingPassword = false;


        // ===============================================
        // GET ACTUAL BACKEND ERROR
        // ===============================================

        if (typeof error?.error === 'string') {

          this.passwordErrorMessage =
            error.error;

        }

        else if (error?.error?.message) {

          this.passwordErrorMessage =
            error.error.message;

        }

        else if (error?.error?.title) {

          this.passwordErrorMessage =
            error.error.title;

        }

        else if (error?.status === 401) {

          this.passwordErrorMessage =
            'Your session has expired. Please login again.';

        }

        else if (error?.status === 400) {

          this.passwordErrorMessage =
            'The current password is incorrect or the password request is invalid.';

        }

        else {

          this.passwordErrorMessage =
            'Unable to change password. Please try again.';

        }


        this.cdr.detectChanges();

      }

    });

}


  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  goBack(): void {

    this.router.navigate([
      '/dashboard'
    ]);
  }

}