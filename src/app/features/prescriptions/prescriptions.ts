import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { AuthService }
  from '../../core/services/auth.service';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PrescriptionService }
  from '../../core/services/prescription.service';

import { AppointmentService }
  from '../../core/services/appointment.service';

import {
  Prescription
} from '../../core/models/prescription.model';

import {
  Appointment,
  AppointmentStatus
} from '../../core/models/appointment.model';


@Component({
  selector: 'app-prescriptions',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ],

  templateUrl: './prescriptions.html',

  styleUrl: './prescriptions.css'
})
export class PrescriptionsComponent
  implements OnInit {


  // =========================
  // SERVICES
  // =========================

  private prescriptionService =
    inject(PrescriptionService);

  private appointmentService =
    inject(AppointmentService);

  private authService =
    inject(AuthService);

  private fb =
    inject(FormBuilder);

  private cdr =
    inject(ChangeDetectorRef);


  // =========================
  // DATA
  // =========================

  prescriptions: Prescription[] = [];

  appointments: Appointment[] = [];

  completedAppointments: Appointment[] = [];


  // =========================
  // STATES
  // =========================

  isLoading = true;

  isSaving = false;

  showForm = false;

  isEditMode = false;

  editingPrescriptionId: number | null = null;


  errorMessage = '';

  successMessage = '';


  userRole: string | null = null;


  // =========================
  // ROLE HELPERS
  // =========================

  isDoctor(): boolean {

    return this.userRole === 'Doctor';

  }


  isAdmin(): boolean {

    return this.userRole === 'Admin';

  }


  canCreatePrescription(): boolean {

    return this.userRole === 'Doctor';

  }


  canUpdatePrescription(): boolean {

    return this.userRole === 'Doctor' ||
           this.userRole === 'Admin';

  }


  canDeletePrescription(): boolean {

    return this.userRole === 'Doctor' ||
           this.userRole === 'Admin';

  }


  // =========================
  // ENUM
  // =========================

  AppointmentStatus = AppointmentStatus;


  // =========================
  // FORM
  // =========================

  prescriptionForm = this.fb.group({

    appointmentId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    diagnosis: [
      '',
      [
        Validators.required
      ]
    ],

    medicines: [
      '',
      [
        Validators.required
      ]
    ],

    notes: [
      ''
    ]

  });


  // =========================
  // INITIALIZE
  // =========================

  ngOnInit(): void {

    this.userRole =
      this.authService.getUserRole();

    console.log(
      'Current user role:',
      this.userRole
    );

    this.loadPrescriptions();

  }


  // =========================
  // LOAD PRESCRIPTIONS
  // =========================

  loadPrescriptions(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.prescriptionService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Prescriptions API response:',
            data
          );

          this.prescriptions = data;

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Prescriptions API error:',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load prescriptions.';

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // OPEN CREATE FORM
  // =========================

  openAddForm(): void {

    if (!this.isDoctor()) {
      return;
    }

    this.isEditMode = false;

    this.editingPrescriptionId = null;

    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.prescriptionForm.reset({

      appointmentId: 0,

      diagnosis: '',

      medicines: '',

      notes: ''

    });


    this.loadCompletedAppointments();

  }


  // =========================
  // OPEN EDIT FORM
  // =========================

  openEditForm(
    prescription: Prescription
  ): void {

    if (!this.canUpdatePrescription()) {
      return;
    }


    this.isEditMode = true;

    this.editingPrescriptionId =
      prescription.id;

    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.prescriptionForm.patchValue({

      appointmentId:
        prescription.appointmentId,

      diagnosis:
        prescription.diagnosis,

      medicines:
        prescription.medicines,

      notes:
        prescription.notes

    });


    this.cdr.detectChanges();

  }


  // =========================
  // LOAD COMPLETED APPOINTMENTS
  // =========================

  loadCompletedAppointments(): void {

    this.appointmentService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Appointments for prescription:',
            data
          );


          this.appointments = data;


          this.completedAppointments =
            data.filter(
              appointment =>
                appointment.status ===
                AppointmentStatus.Completed
            );


          console.log(
            'Completed appointments:',
            this.completedAppointments
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Appointment API error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to load completed appointments.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // CLOSE FORM
  // =========================

  closeForm(): void {

    this.showForm = false;

    this.isEditMode = false;

    this.editingPrescriptionId = null;

    this.prescriptionForm.reset();

    this.errorMessage = '';

  }


  // =========================
  // CREATE / UPDATE
  // =========================

  savePrescription(): void {

    if (this.prescriptionForm.invalid) {

      this.prescriptionForm.markAllAsTouched();

      return;

    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    const diagnosis =
      this.prescriptionForm.value
        .diagnosis!
        .trim();


    const medicines =
      this.prescriptionForm.value
        .medicines!
        .trim();


    const notes =
      this.prescriptionForm.value
        .notes?.trim() || '';


    // ==========================
    // UPDATE
    // ==========================

    if (
      this.isEditMode &&
      this.editingPrescriptionId !== null
    ) {

      const model = {

        diagnosis,

        medicines,

        notes

      };


      console.log(
        'Updating prescription:',
        this.editingPrescriptionId,
        model
      );


      this.prescriptionService
        .update(
          this.editingPrescriptionId,
          model
        )
        .subscribe({

          next: (response) => {

            console.log(
              'Update prescription response:',
              response
            );


            this.isSaving = false;

            this.showForm = false;

            this.isEditMode = false;

            this.editingPrescriptionId = null;


            this.successMessage =
              'Prescription updated successfully.';


            this.prescriptionForm.reset();


            this.loadPrescriptions();


            this.cdr.detectChanges();

          },


          error: (error) => {

            console.error(
              'Update prescription error:',
              error
            );


            this.isSaving = false;


            this.errorMessage =
              error?.error?.message ||
              'Unable to update prescription.';


            this.cdr.detectChanges();

          }

        });


      return;

    }


    // ==========================
    // CREATE
    // ==========================

    const model = {

      appointmentId:
        Number(
          this.prescriptionForm.value
            .appointmentId
        ),

      diagnosis,

      medicines,

      notes

    };


    console.log(
      'Creating prescription:',
      model
    );


    this.prescriptionService
      .create(model)
      .subscribe({

        next: (response) => {

          console.log(
            'Create prescription response:',
            response
          );


          this.isSaving = false;

          this.showForm = false;


          this.successMessage =
            'Prescription created successfully.';


          this.prescriptionForm.reset();


          this.loadPrescriptions();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Create prescription error:',
            error
          );


          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to create prescription.';


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // DELETE
  // =========================

  deletePrescription(
    prescription: Prescription
  ): void {

    if (!this.canDeletePrescription()) {
      return;
    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this prescription?'
      );


    if (!confirmed) {
      return;
    }


    this.prescriptionService
      .delete(prescription.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Prescription deleted successfully.';


          this.loadPrescriptions();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Delete prescription error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to delete prescription.';


          this.cdr.detectChanges();

        }

      });

  }

}