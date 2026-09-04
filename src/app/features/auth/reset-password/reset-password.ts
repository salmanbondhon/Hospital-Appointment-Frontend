import {
  Component,
  inject
} from '@angular/core';

import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  AuthService,
  ResetPasswordRequest
} from '../../../core/services/auth.service';


@Component({
  selector: 'app-reset-password',

  standalone: true,

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './reset-password.html',

  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent {

  private fb =
    inject(NonNullableFormBuilder);

  private authService =
    inject(AuthService);

  private route =
    inject(ActivatedRoute);

  private router =
    inject(Router);


  // =========================
  // STATE
  // =========================

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  // =========================
  // TOKEN + EMAIL
  // =========================

  email = '';

  token = '';


  // =========================
  // RESET PASSWORD FORM
  // =========================

  resetForm = this.fb.group({

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    confirmPassword: [
      '',
      Validators.required
    ]

  });


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {

    this.route.queryParams.subscribe(params => {

      this.email =
        params['email'] || '';

      this.token =
        params['token'] || '';

    });

  }


  // =========================
  // GETTERS
  // =========================

  get newPassword(): FormControl<string> {

    return this.resetForm.controls.newPassword;

  }


  get confirmPassword(): FormControl<string> {

    return this.resetForm.controls.confirmPassword;

  }


  // =========================
  // PASSWORD MATCH CHECK
  // =========================

  passwordsDoNotMatch(): boolean {

    const password =
      this.newPassword.value;

    const confirmPassword =
      this.confirmPassword.value;


    // Don't show mismatch when confirm password
    // hasn't been typed yet

    if (!confirmPassword) {

      return false;

    }


    return password !== confirmPassword;

  }


  // =========================
  // RESET PASSWORD
  // =========================

  onResetPassword(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // =========================
    // CHECK TOKEN
    // =========================

    if (!this.email || !this.token) {

      this.errorMessage =
        'Invalid or expired password reset link.';

      return;

    }


    // =========================
    // FORM VALIDATION
    // =========================

    if (this.resetForm.invalid) {

      this.resetForm.markAllAsTouched();

      return;

    }


    // =========================
    // PASSWORD MATCH
    // =========================

    if (this.passwordsDoNotMatch()) {

      this.errorMessage =
        'Passwords do not match.';

      return;

    }


    this.isLoading = true;


    // =========================
    // REQUEST MODEL
    // =========================

    const model: ResetPasswordRequest = {

      email: this.email,

      token: this.token,

      newPassword:
        this.newPassword.value

    };


    console.log(
      'Reset password request:',
      model
    );


    // =========================
    // API CALL
    // =========================

    this.authService
      .resetPassword(model)
      .subscribe({

        next: (response) => {

          this.isLoading = false;


          if (response.success) {

            this.successMessage =
              'Password reset successful! You can now login with your new password.';


            this.resetForm.reset();


            // Go to login after 2 seconds

            setTimeout(() => {

              this.router.navigate([
                '/login'
              ]);

            }, 2000);

          }

          else {

            this.errorMessage =
              response.message;

          }

        },


        error: (error) => {

          console.error(
            'Reset password error:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to reset password. The link may have expired.';

        }

      });

  }


  // =========================
  // BACK TO LOGIN
  // =========================

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }

}