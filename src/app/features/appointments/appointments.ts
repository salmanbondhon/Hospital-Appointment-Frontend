import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AppointmentService } from '../../core/services/appointment.service';

import {
  Appointment,
  AppointmentStatus
} from '../../core/models/appointment.model';

import { DoctorService } from '../../core/services/doctor.service';

import { Doctor } from '../../core/models/doctor.model';

import { PatientService } from '../../core/services/patient.service';

import { Patient } from '../../core/models/patient.model';

import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-appointments',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ],

  templateUrl: './appointments.html',

  styleUrl: './appointments.css'
})
export class AppointmentsComponent implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private appointmentService =
    inject(AppointmentService);

  private doctorService =
    inject(DoctorService);

  private patientService =
    inject(PatientService);

  private authService =
    inject(AuthService);

  private fb =
    inject(FormBuilder);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // DATA
  // =====================================================

  appointments: Appointment[] = [];

  doctors: Doctor[] = [];

  patients: Patient[] = [];


  // =====================================================
  // STATE
  // =====================================================

  isLoading = true;

  isSaving = false;

  showForm = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // USER ROLE
  // =====================================================

  userRole: string | null = null;


  // =====================================================
  // APPOINTMENT STATUS ENUM
  // =====================================================

  AppointmentStatus =
    AppointmentStatus;


  // =====================================================
  // FORM
  // =====================================================

  appointmentForm = this.fb.group({

    // Doctor
    doctorId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],


    // Patient
    // Required only when Admin creates appointment
    patientId: [
      0
    ],


    // Date and time
    appointmentDate: [
      '',
      Validators.required
    ],


    // Problem
    problemDescription: [
      '',
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ]

  });


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.userRole =
      this.authService.getUserRole();

    console.log(
      'Current user role:',
      this.userRole
    );


    // Load appointments for everyone
    this.loadAppointments();


    // Patient and Admin can create appointments
    if (
      this.userRole === 'Patient' ||
      this.userRole === 'Admin'
    ) {

      this.loadDoctors();

    }


    // Admin needs patient list
    if (this.userRole === 'Admin') {

      this.loadPatients();

    }

  }


  // =====================================================
  // ROLE HELPERS
  // =====================================================

  isPatient(): boolean {

    return this.userRole === 'Patient';

  }


  isDoctor(): boolean {

    return this.userRole === 'Doctor';

  }


  isAdmin(): boolean {

    return this.userRole === 'Admin';

  }


  // =====================================================
  // CAN CREATE
  // =====================================================

  canCreateAppointment(): boolean {

    return (
      this.userRole === 'Patient' ||
      this.userRole === 'Admin'
    );

  }


  // =====================================================
  // CAN APPROVE
  // =====================================================

  canApprove(): boolean {

    return (
      this.userRole === 'Doctor' ||
      this.userRole === 'Admin'
    );

  }


  // =====================================================
  // CAN COMPLETE
  // =====================================================

  canComplete(): boolean {

    return (
      this.userRole === 'Doctor' ||
      this.userRole === 'Admin'
    );

  }


  // =====================================================
  // CAN CANCEL
  // =====================================================

  canCancel(): boolean {

    return (
      this.userRole === 'Doctor' ||
      this.userRole === 'Admin' ||
      this.userRole === 'Patient'
    );

  }


  // =====================================================
  // CAN DELETE
  // =====================================================

  canDelete(): boolean {

    return this.userRole === 'Admin';

  }


  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  loadAppointments(): void {

    console.log(
      'Loading appointments...'
    );


    this.isLoading = true;

    this.errorMessage = '';


    this.appointmentService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Appointments API response:',
            data
          );


          this.appointments = data;

          this.isLoading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Appointments API error:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to load appointments.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD DOCTORS
  // =====================================================

  loadDoctors(): void {

    console.log(
      'Loading doctors...'
    );


    this.doctorService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Doctors API response:',
            data
          );


          this.doctors = data;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Doctors API error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to load doctors.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  loadPatients(): void {

    console.log(
      'Loading patients...'
    );


    this.patientService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Patients API response:',
            data
          );


          this.patients = data;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Patients API error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to load patients.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  openAddForm(): void {

    if (!this.canCreateAppointment()) {

      return;

    }


    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';


    // Reset form

    this.appointmentForm.reset({

      doctorId: 0,

      patientId: 0,

      appointmentDate: '',

      problemDescription: ''

    });


    // Patient ID is only required
    // when Admin creates appointment

    if (this.isAdmin()) {

      this.appointmentForm.controls
        .patientId
        .setValidators([
          Validators.required,
          Validators.min(1)
        ]);

    }

    else {

      this.appointmentForm.controls
        .patientId
        .clearValidators();

    }


    this.appointmentForm.controls
      .patientId
      .updateValueAndValidity();

  }


  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.isSaving = false;

    this.appointmentForm.reset();

    this.errorMessage = '';

  }


  // =====================================================
  // CREATE APPOINTMENT
  // =====================================================

  createAppointment(): void {

    if (!this.canCreateAppointment()) {

      return;

    }


    // Validate form

    if (this.appointmentForm.invalid) {

      this.appointmentForm.markAllAsTouched();

      return;

    }


    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    // =====================================================
    // BASE MODEL
    // =====================================================

    const model: any = {

      doctorId:
        Number(
          this.appointmentForm.value.doctorId
        ),


      appointmentDate:
        this.appointmentForm.value
          .appointmentDate!,


      problemDescription:
        this.appointmentForm.value
          .problemDescription!
          .trim()

    };


    // =====================================================
    // ADMIN
    // =====================================================

    // Admin must specify which patient
    // the appointment belongs to.

    if (this.isAdmin()) {

      model.patientId =
        Number(
          this.appointmentForm.value.patientId
        );

    }


    console.log(
      'Creating appointment:',
      model
    );


    // =====================================================
    // API CALL
    // =====================================================

    this.appointmentService
      .create(model)
      .subscribe({

        next: (response) => {

          console.log(
            'Create appointment response:',
            response
          );


          this.isSaving = false;

          this.showForm = false;


          this.successMessage =
            'Appointment created successfully.';


          this.appointmentForm.reset();


          this.loadAppointments();

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Create appointment error:',
            error
          );


          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to create appointment.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // APPROVE APPOINTMENT
  // =====================================================

  approveAppointment(
    appointment: Appointment
  ): void {

    if (!this.canApprove()) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.appointmentService
      .approve(appointment.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Appointment approved successfully.';


          this.loadAppointments();

        },


        error: (error) => {

          console.error(
            'Approve appointment error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to approve appointment.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // COMPLETE APPOINTMENT
  // =====================================================

  completeAppointment(
    appointment: Appointment
  ): void {

    if (!this.canComplete()) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.appointmentService
      .complete(appointment.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Appointment completed successfully.';


          this.loadAppointments();

        },


        error: (error) => {

          console.error(
            'Complete appointment error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to complete appointment.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CANCEL APPOINTMENT
  // =====================================================

  cancelAppointment(
    appointment: Appointment
  ): void {

    if (!this.canCancel()) {

      return;

    }


    const confirmed =
      confirm(
        `Are you sure you want to cancel the appointment with ${appointment.doctorName}?`
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.appointmentService
      .cancel(appointment.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Appointment cancelled successfully.';


          this.loadAppointments();

        },


        error: (error) => {

          console.error(
            'Cancel appointment error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to cancel appointment.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // DELETE APPOINTMENT
  // =====================================================

  deleteAppointment(
    appointment: Appointment
  ): void {

    if (!this.canDelete()) {

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this appointment?'
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.appointmentService
      .delete(appointment.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Appointment deleted successfully.';


          this.loadAppointments();

        },


        error: (error) => {

          console.error(
            'Delete appointment error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to delete appointment.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // STATUS TEXT
  // =====================================================

  getStatusText(
    status: AppointmentStatus
  ): string {

    switch (status) {

      case AppointmentStatus.Pending:

        return 'Pending';


      case AppointmentStatus.Approved:

        return 'Approved';


      case AppointmentStatus.Completed:

        return 'Completed';


      case AppointmentStatus.Cancelled:

        return 'Cancelled';


      default:

        return 'Unknown';

    }

  }


  // =====================================================
  // STATUS CSS CLASS
  // =====================================================

  getStatusClass(
    status: AppointmentStatus
  ): string {

    switch (status) {

      case AppointmentStatus.Pending:

        return 'pending';


      case AppointmentStatus.Approved:

        return 'approved';


      case AppointmentStatus.Completed:

        return 'completed';


      case AppointmentStatus.Cancelled:

        return 'cancelled';


      default:

        return '';

    }

  }

}