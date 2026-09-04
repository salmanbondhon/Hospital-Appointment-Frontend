import {
  Component,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  AuthService,
  RegisterRequest
} from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})
export class LoginComponent {

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

  isRegisterMode = false;


  // =========================
  // LOGIN FORM
  // =========================

  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      Validators.required
    ]

  });


  // =========================
// PASSWORD MATCH CHECK
// =========================

passwordsDoNotMatch(): boolean {

  const password =
    this.registerForm.controls.password.value;

  const confirmPassword =
    this.registerForm.controls.confirmPassword.value;

  return (
    confirmPassword.length > 0 &&
    password !== confirmPassword
  );

}

 // =========================
// REGISTER FORM
// =========================

registerForm = this.fb.group({

  fullName: [
    '',
    [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-Z\s.'-]+$/)
    ]
  ],

  email: [
    '',
    [
      Validators.required,
      Validators.email
    ]
  ],

  password: [
    '',
    [
      Validators.required,
      Validators.minLength(6)
    ]
  ],

  confirmPassword: [
    '',
    [
      Validators.required
    ]
  ],

  age: [
    18,
    [
      Validators.required,
      Validators.min(1),
      Validators.max(120)
    ]
  ],

  gender: [
    '',
    Validators.required
  ],

  phoneNumber: [
    '',
    [
      Validators.required,
      Validators.pattern(/^01[3-9]\d{8}$/)
    ]
  ],

  address: [
    '',
    Validators.required
  ],

  bloodGroup: [
    '',
    Validators.required
  ]

});

  // =========================
  // SHOW REGISTER
  // =========================

  showRegister(): void {

    this.isRegisterMode = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.loginForm.reset();

  }


  // =========================
  // SHOW LOGIN
  // =========================

  showLogin(): void {

    this.isRegisterMode = false;

    this.errorMessage = '';

    this.successMessage = '';

    this.registerForm.reset({

      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      gender: '',
      phoneNumber: '',
      address: '',
      bloodGroup: ''

    });

  }



  // =========================
  // LOGIN
  // =========================

  // =========================
// LOGIN
// =========================

onLogin(): void {

  if (this.loginForm.invalid) {

    this.loginForm.markAllAsTouched();

    return;

  }


  this.isLoading = true;

  this.errorMessage = '';

  this.successMessage = '';


  this.authService
    .login(this.loginForm.getRawValue())
    .subscribe({

      next: (response) => {

        this.isLoading = false;


        if (response.success) {

          // =========================
          // SAVE TOKEN
          // =========================

          this.authService.saveToken(
            response.data.token
          );


          // =========================
          // GET USER ROLE
          // =========================

          const role =
            this.authService.getUserRole();


          console.log('Logged in role:', role);


          // =========================
          // ROLE-BASED REDIRECT
          // =========================

          if (role === 'Admin') {

            this.router.navigate([
              '/dashboard'
            ]);

          }

          else if (role === 'Doctor') {

            this.router.navigate([
              '/appointments'
            ]);

          }

          else if (role === 'Patient') {

            this.router.navigate([
              '/appointments'
            ]);

          }

          else {

            // Unknown role
            this.errorMessage =
              'Unable to determine user role.';

            this.authService.logout();

          }

        }

        else {

          this.errorMessage =
            response.message;

        }

      },


      error: (error) => {

        console.error(
          'Login error:',
          error
        );

        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Invalid email or password.';

      }

    });

}


    // =========================
// FORGOT PASSWORD
// =========================

goToForgotPassword(): void {

  this.router.navigate([
    '/forgot-password'
  ]);

}


  // =========================
  // REGISTER
  // =========================

  onRegister(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }


    const form =
      this.registerForm.getRawValue();


    // =========================
    // PASSWORD CHECK
    // =========================

    if (
      form.password !==
      form.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;

    }


    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    // =========================
    // REGISTRATION MODEL
    // =========================

    const model: RegisterRequest = {

      fullName:
        form.fullName.trim(),

      email:
        form.email.trim(),

      password:
        form.password,

      age:
        Number(form.age),

      gender:
        form.gender,

      phoneNumber:
        form.phoneNumber.trim(),

      address:
        form.address.trim(),

      bloodGroup:
        form.bloodGroup

    };


    console.log(
      'Registering patient:',
      model
    );


    this.authService
      .register(model)
      .subscribe({

        next: (response) => {

          console.log(
            'Registration response:',
            response
          );


          this.isLoading = false;


          if (response.success) {

            this.successMessage =
              'Registration successful! Your patient account has been created.';


            this.registerForm.reset({

              fullName: '',
              email: '',
              password: '',
              confirmPassword: '',
              age: 18,
              gender: '',
              phoneNumber: '',
              address: '',
              bloodGroup: ''

            });


            // Go back to login after a short delay

            setTimeout(() => {

              this.isRegisterMode = false;

              this.successMessage = '';

            }, 1800);

          }

          else {

            this.errorMessage =
              response.message;

          }

        },


        error: (error) => {

          console.error(
            'Registration error:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to register.';

        }

      });

  }

}