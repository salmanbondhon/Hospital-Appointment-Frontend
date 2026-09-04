import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  PatientService,
  CreatePatient,
  UpdatePatient
} from '../../core/services/patient.service';

import {
  Patient
} from '../../core/models/patient.model';


@Component({
  selector: 'app-patients',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './patients.html',

  styleUrl: './patients.css'
})
export class PatientsComponent
  implements OnInit {


  private patientService =
    inject(PatientService);


  private fb =
    inject(FormBuilder);


  private cdr =
    inject(ChangeDetectorRef);


  // =================================================
  // DATA
  // =================================================

  patients: Patient[] = [];


  // =================================================
  // STATE
  // =================================================

  isLoading = true;

  isSaving = false;

  showForm = false;

  editingPatientId:
    number | null = null;


  errorMessage = '';

  successMessage = '';


  // =================================================
  // FORM
  // =================================================

  patientForm =
    this.fb.group({

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
          Validators.email,
          Validators.maxLength(100)
        ]
      ],


      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],


      age: [
        0,
        [
          Validators.required,
          Validators.min(1)
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
          Validators.maxLength(20)
        ]
      ],


      address: [
        '',
        [
          Validators.required,
          Validators.maxLength(250)
        ]
      ],


      bloodGroup: [
        '',
        Validators.required
      ]

    });


  // =================================================
  // INIT
  // =================================================

  ngOnInit(): void {

    this.loadPatients();
  }


  // =================================================
  // LOAD PATIENTS
  // =================================================

  loadPatients(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.patientService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Patients API response:',
            data
          );


          this.patients = data;

          this.isLoading = false;

          this.cdr.detectChanges();
        },


        error: (error) => {

          console.error(
            'Patients API error:',
            error
          );


          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load patients.';


          this.cdr.detectChanges();
        }

      });
  }


  // =================================================
  // OPEN ADD FORM
  // =================================================

  openAddForm(): void {

    this.showForm = true;

    this.editingPatientId = null;

    this.errorMessage = '';

    this.successMessage = '';


    // Password required
    this.patientForm.controls.password
      .setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);


    this.patientForm.controls.password
      .updateValueAndValidity();


    this.patientForm.reset({

      fullName: '',

      email: '',

      password: '',

      age: 0,

      gender: '',

      phoneNumber: '',

      address: '',

      bloodGroup: ''

    });
  }


  // =================================================
  // OPEN EDIT FORM
  // =================================================

  editPatient(
    patient: Patient
  ): void {

    this.showForm = true;

    this.editingPatientId =
      patient.id;

    this.errorMessage = '';

    this.successMessage = '';


    this.patientForm.patchValue({

      fullName:
        patient.fullName,

      email:
        patient.email,

      password: '',

      age:
        patient.age,

      gender:
        patient.gender,

      phoneNumber:
        patient.phoneNumber,

      address:
        patient.address,

      bloodGroup:
        patient.bloodGroup

    });


    // Password is optional during update
    this.patientForm.controls.password
      .clearValidators();


    this.patientForm.controls.password
      .updateValueAndValidity();
  }


  // =================================================
  // CLOSE FORM
  // =================================================

  closeForm(): void {

    this.showForm = false;

    this.editingPatientId = null;

    this.patientForm.reset();


    // Password required again
    this.patientForm.controls.password
      .setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);


    this.patientForm.controls.password
      .updateValueAndValidity();


    this.errorMessage = '';
  }


  // =================================================
  // SAVE
  // CREATE + UPDATE
  // =================================================

  savePatient(): void {

    if (this.patientForm.invalid) {

      this.patientForm.markAllAsTouched();

      return;
    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    // =================================================
    // UPDATE
    // =================================================

    if (this.editingPatientId !== null) {

      const password =
        this.patientForm.value.password?.trim();


      const model: UpdatePatient = {

        fullName:
          this.patientForm.value.fullName!
            .trim(),

        email:
          this.patientForm.value.email!
            .trim(),

        ...(password
          ? { password }
          : {}),

        age:
          Number(
            this.patientForm.value.age
          ),

        gender:
          this.patientForm.value.gender!,

        phoneNumber:
          this.patientForm.value.phoneNumber!
            .trim(),

        address:
          this.patientForm.value.address!
            .trim(),

        bloodGroup:
          this.patientForm.value.bloodGroup!

      };


      console.log(
        'Updating patient:',
        model
      );


      this.patientService
        .update(
          this.editingPatientId,
          model
        )
        .subscribe({

          next: (response) => {

            console.log(
              'Update patient response:',
              response
            );


            this.successMessage =
              'Patient updated successfully.';


            this.isSaving = false;

            this.showForm = false;

            this.editingPatientId = null;

            this.patientForm.reset();


            this.loadPatients();

            this.cdr.detectChanges();
          },


          error: (error) => {

            console.error(
              'Update patient error:',
              error
            );


            this.isSaving = false;

            this.errorMessage =
              error?.error?.message ||
              'Unable to update patient.';


            this.cdr.detectChanges();
          }

        });


      return;
    }


    // =================================================
    // CREATE
    // =================================================

    const model: CreatePatient = {

      fullName:
        this.patientForm.value.fullName!
          .trim(),

      email:
        this.patientForm.value.email!
          .trim(),

      password:
        this.patientForm.value.password!,

      age:
        Number(
          this.patientForm.value.age
        ),

      gender:
        this.patientForm.value.gender!,

      phoneNumber:
        this.patientForm.value.phoneNumber!
          .trim(),

      address:
        this.patientForm.value.address!
          .trim(),

      bloodGroup:
        this.patientForm.value.bloodGroup!

    };


    console.log(
      'Creating patient:',
      model
    );


    this.patientService
      .create(model)
      .subscribe({

        next: (response) => {

          console.log(
            'Create patient response:',
            response
          );


          this.successMessage =
            'Patient created successfully.';


          this.isSaving = false;

          this.showForm = false;

          this.patientForm.reset();


          this.loadPatients();

          this.cdr.detectChanges();
        },


        error: (error) => {

          console.error(
            'Create patient error:',
            error
          );


          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to create patient.';


          this.cdr.detectChanges();
        }

      });
  }


  // =================================================
  // DELETE
  // =================================================

  deletePatient(
    patient: Patient
  ): void {

    const confirmed =
      confirm(
        `Are you sure you want to delete ${patient.fullName}?`
      );


    if (!confirmed) {
      return;
    }


    this.errorMessage = '';

    this.successMessage = '';


    this.patientService
      .delete(patient.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Patient deleted successfully.';


          this.loadPatients();

          this.cdr.detectChanges();
        },


        error: (error) => {

          console.error(
            'Delete patient error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to delete patient.';


          this.cdr.detectChanges();
        }

      });
  }
}