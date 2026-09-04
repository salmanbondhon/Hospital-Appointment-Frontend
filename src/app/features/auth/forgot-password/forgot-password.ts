import {
  Component,
  inject
} from '@angular/core';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService,
  ForgotPasswordRequest
} from '../../../core/services/auth.service';


@Component({
  selector: 'app-forgot-password',

  standalone: true,

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './forgot-password.html',

  styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {

  private fb =
    inject(NonNullableFormBuilder);

  private authService =
    inject(AuthService);

  private router =
    inject(Router);


  // =========================
  // STATE
  // =========================

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  // =========================
  // FORM
  // =========================

  forgotPasswordForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]

  });


  // =========================
  // SUBMIT
  // =========================

  onSubmit(): void {

    if (this.forgotPasswordForm.invalid) {

      this.forgotPasswordForm.markAllAsTouched();

      return;

    }


    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    const model: ForgotPasswordRequest = {

      email:
        this.forgotPasswordForm
          .getRawValue()
          .email
          .trim()

    };


    this.authService
      .forgotPassword(model)
      .subscribe({

        next: (response) => {

          this.isLoading = false;


          if (response.success) {

            this.successMessage =
              'If an account with this email exists, a password reset link has been sent to your email.';

            this.forgotPasswordForm.reset();

          }

          else {

            this.errorMessage =
              response.message;

          }

        },


        error: (error) => {

          console.error(
            'Forgot password error:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to process your request. Please try again.';

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