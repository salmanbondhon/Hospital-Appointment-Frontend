import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { DoctorService } from '../../core/services/doctor.service';
import { DepartmentService } from '../../core/services/department.service';

import { Doctor } from '../../core/models/doctor.model';
import { Department } from '../../core/models/department.model';


@Component({
  selector: 'app-doctors',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './doctors.html',

  styleUrl: './doctors.css'
})
export class DoctorsComponent implements OnInit {

  private doctorService =
    inject(DoctorService);

  private departmentService =
    inject(DepartmentService);

  private fb =
    inject(FormBuilder);

  private cdr =
    inject(ChangeDetectorRef);

    private authService = inject(AuthService);

userRole: string | null = null;


  // =========================
  // DATA
  // =========================

  doctors: Doctor[] = [];

  departments: Department[] = [];


  // =========================
  // STATES
  // =========================

  isLoading = true;

  isSaving = false;

  showForm = false;

  editingDoctorId: number | null = null;


  errorMessage = '';

  successMessage = '';


  // =========================
  // FORM
  // =========================

  doctorForm = this.fb.group({

    fullName: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
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

    specialization: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    qualification: [
      '',
      [
        Validators.maxLength(100)
      ]
    ],

    experience: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    consultationFee: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    availableFrom: [
      '',
      Validators.required
    ],

    availableTo: [
      '',
      Validators.required
    ],

    departmentId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]

  });


  // =========================
  // INITIALIZE
  // =========================
ngOnInit(): void {

  this.userRole =
    this.authService.getUserRole();

  this.loadDoctors();

}


  // =========================
  // LOAD DOCTORS
  // =========================

  loadDoctors(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.doctorService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Doctors API response:',
            data
          );

          this.doctors = data;

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Doctors API error:',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load doctors.';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // OPEN ADD FORM
  // =========================

  openAddForm(): void {

    this.showForm = true;

    this.editingDoctorId = null;

    this.errorMessage = '';

    this.successMessage = '';


    // Email enabled for CREATE

    this.doctorForm.controls.email.enable();


    // Password required for CREATE

    this.doctorForm.controls.password.setValidators([

      Validators.required,

      Validators.minLength(6)

    ]);

    this.doctorForm.controls.password.updateValueAndValidity();


    this.doctorForm.reset({

      fullName: '',

      email: '',

      password: '',

      specialization: '',

      qualification: '',

      experience: 0,

      consultationFee: 0,

      availableFrom: '',

      availableTo: '',

      departmentId: 0

    });


    this.loadDepartments();

  }


  // =========================
  // OPEN EDIT FORM
  // =========================

  openEditForm(
    doctor: Doctor
  ): void {

    this.showForm = true;

    this.editingDoctorId = doctor.id;

    this.errorMessage = '';

    this.successMessage = '';


    // Email MUST remain enabled

    this.doctorForm.controls.email.enable();


    // Password is optional during UPDATE

    this.doctorForm.controls.password.clearValidators();

    this.doctorForm.controls.password.updateValueAndValidity();


    // Load existing doctor data

    this.doctorForm.patchValue({

      fullName:
        doctor.fullName,

      email:
        doctor.email,

      password:
        '',

      specialization:
        doctor.specialization,

      qualification:
        doctor.qualification,

      experience:
        doctor.experience,

      consultationFee:
        doctor.consultationFee,

      availableFrom:
        doctor.availableFrom,

      availableTo:
        doctor.availableTo,

      departmentId:
        doctor.departmentId

    });


    console.log(
      'Editing doctor:',
      doctor
    );


    this.loadDepartments();

  }


  // =========================
  // LOAD DEPARTMENTS
  // =========================

  loadDepartments(): void {

    this.departmentService
      .getAll()
      .subscribe({

        next: (response) => {

          console.log(
            'Departments:',
            response
          );


          if (response.success) {

            this.departments =
              response.data;

          }

          else {

            this.errorMessage =
              response.message;

          }


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Department error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load departments.';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // CLOSE FORM
  // =========================

  closeForm(): void {

    this.showForm = false;

    this.editingDoctorId = null;


    // Restore CREATE validation

    this.doctorForm.controls.email.enable();


    this.doctorForm.controls.password.setValidators([

      Validators.required,

      Validators.minLength(6)

    ]);

    this.doctorForm.controls.password.updateValueAndValidity();


    this.doctorForm.reset();


    this.errorMessage = '';

  }


  // =========================
  // CREATE / UPDATE
  // =========================

  createDoctor(): void {

    if (this.doctorForm.invalid) {

      this.doctorForm.markAllAsTouched();

      return;

    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    // =====================================================
    // UPDATE
    // =====================================================

    if (this.editingDoctorId !== null) {

      const formValue =
        this.doctorForm.getRawValue();


      const updateModel = {

        fullName:
          formValue.fullName?.trim() || '',

        email:
          formValue.email?.trim() || '',

        password:
          formValue.password?.trim() || '',

        specialization:
          formValue.specialization?.trim() || '',

        qualification:
          formValue.qualification?.trim() || '',

        experience:
          Number(formValue.experience),

        consultationFee:
          Number(formValue.consultationFee),

        availableFrom:
          formValue.availableFrom || '',

        availableTo:
          formValue.availableTo || '',

        departmentId:
          Number(formValue.departmentId)

      };


      console.log(
        'UPDATING DOCTOR:',
        updateModel
      );


      this.doctorService
        .update(
          this.editingDoctorId,
          updateModel
        )
        .subscribe({

          next: (response) => {

            console.log(
              'Update doctor response:',
              response
            );


            this.isSaving = false;

            this.showForm = false;

            this.editingDoctorId = null;


            this.successMessage =
              'Doctor updated successfully.';


            this.doctorForm.reset();


            this.loadDoctors();


            this.cdr.detectChanges();

          },


          error: (error) => {

            console.error(
              'Update doctor error:',
              error
            );


            console.error(
              'Server response:',
              error?.error
            );


            this.isSaving = false;


            this.errorMessage =
              error?.error?.message ||
              error?.error?.Message ||
              'Unable to update doctor.';


            this.cdr.detectChanges();

          }

        });


      return;

    }


    // =====================================================
    // CREATE
    // =====================================================

    const formValue =
      this.doctorForm.getRawValue();


    const createModel = {

      fullName:
        formValue.fullName?.trim() || '',

      email:
        formValue.email?.trim() || '',

      password:
        formValue.password?.trim() || '',

      specialization:
        formValue.specialization?.trim() || '',

      qualification:
        formValue.qualification?.trim() || '',

      experience:
        Number(formValue.experience),

      consultationFee:
        Number(formValue.consultationFee),

      availableFrom:
        formValue.availableFrom || '',

      availableTo:
        formValue.availableTo || '',

      departmentId:
        Number(formValue.departmentId)

    };


    console.log(
      'CREATING DOCTOR:',
      createModel
    );


    this.doctorService
      .create(createModel)
      .subscribe({

        next: (response) => {

          console.log(
            'Create doctor response:',
            response
          );


          this.isSaving = false;

          this.showForm = false;


          this.successMessage =
            'Doctor created successfully.';


          this.doctorForm.reset();


          this.loadDoctors();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Create doctor error:',
            error
          );


          console.error(
            'Server response:',
            error?.error
          );


          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ||
            error?.error?.Message ||
            'Unable to create doctor.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // DELETE DOCTOR
  // =========================

  deleteDoctor(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this doctor?'
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.doctorService
      .delete(id)
      .subscribe({

        next: (response) => {

          console.log(
            'Delete doctor response:',
            response
          );


          this.successMessage =
            'Doctor deleted successfully.';


          this.loadDoctors();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Delete doctor error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            error?.error?.Message ||
            'Unable to delete doctor.';


          this.cdr.detectChanges();

        }

      });

  }

}