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
  FormsModule
} from '@angular/forms';

import {
  MedicalRecordService
} from '../../core/services/medical-record.service';

import {
  MedicalRecord
} from '../../core/models/medical-record.model';

import {
  AuthService
} from '../../core/services/auth.service';

import {
  PatientService
} from '../../core/services/patient.service';

import {
  Patient
} from '../../core/models/patient.model';


@Component({
  selector: 'app-medical-records',

  standalone: true,

 imports: [
  CommonModule,
  DatePipe,
  FormsModule
],

  templateUrl: './medical-records.html',

  styleUrl: './medical-records.css'
})
export class MedicalRecordsComponent
  implements OnInit {


  // =================================================
  // SERVICES
  // =================================================

  private medicalRecordService =
    inject(MedicalRecordService);


  private authService =
    inject(AuthService);


  private patientService =
    inject(PatientService);


  private cdr =
    inject(ChangeDetectorRef);


  // =================================================
  // DATA
  // =================================================

  medicalRecords: MedicalRecord[] = [];

  patients: Patient[] = [];


  // =================================================
  // STATE
  // =================================================

  isLoading = true;

  isLoadingPatients = false;

  errorMessage = '';

  successMessage = '';


  // =================================================
  // USER
  // =================================================

  userRole: string | null = null;

  patientId: number | null = null;


  // =================================================
  // SELECTED PATIENT
  // =================================================

  selectedPatientId: number = 0;


  // =================================================
  // INIT
  // =================================================

  ngOnInit(): void {

    this.userRole =
      this.authService.getUserRole();


    console.log(
      'Current user role:',
      this.userRole
    );


    this.loadMedicalRecords();

  }


  // =================================================
  // LOAD MEDICAL RECORDS
  // =================================================

  loadMedicalRecords(): void {

    this.isLoading = true;

    this.errorMessage = '';


    // =================================================
    // PATIENT
    // =================================================

    if (this.userRole === 'Patient') {

      this.loadPatientMedicalRecords();

      return;
    }


    // =================================================
    // ADMIN / DOCTOR
    // =================================================

    if (
      this.userRole === 'Admin' ||
      this.userRole === 'Doctor'
    ) {

      this.loadPatients();

      return;
    }


    // =================================================
    // UNKNOWN ROLE
    // =================================================

    this.isLoading = false;

    this.errorMessage =
      'You are not authorized to view medical records.';

  }


  // =================================================
  // LOAD CURRENT PATIENT PROFILE
  // =================================================

  private loadPatientMedicalRecords(): void {

    this.patientService
      .getMyProfile()
      .subscribe({

        next: (patient) => {

          console.log(
            'Current patient profile:',
            patient
          );


          if (!patient) {

            this.isLoading = false;

            this.errorMessage =
              'Patient profile not found.';

            this.cdr.detectChanges();

            return;
          }


          // =========================================
          // SAVE PATIENT ID
          // =========================================

          this.patientId =
            patient.id;


          console.log(
            'Current patient ID:',
            this.patientId
          );


          // =========================================
          // LOAD MEDICAL HISTORY
          // =========================================

          this.loadHistoryByPatientId(
            patient.id
          );

        },


        error: (error) => {

          console.error(
            'Patient profile API error:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to load patient profile.';


          this.cdr.detectChanges();

        }

      });

  }


  // =================================================
  // LOAD ALL PATIENTS
  // =================================================

  private loadPatients(): void {

    this.isLoadingPatients = true;

    this.isLoading = false;

    this.errorMessage = '';


    this.patientService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'Patients API response:',
            data
          );


          this.patients =
            data;


          this.isLoadingPatients = false;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Patients API error:',
            error
          );


          this.isLoadingPatients = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to load patients.';


          this.cdr.detectChanges();

        }

      });

  }


  // =================================================
  // PATIENT SELECTION
  // =================================================

  onPatientChange(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.medicalRecords = [];


    if (
      !this.selectedPatientId ||
      this.selectedPatientId === 0
    ) {

      this.patientId = null;

      return;

    }


    console.log(
      'Selected patient ID:',
      this.selectedPatientId
    );


    this.loadHistoryByPatientId(
      this.selectedPatientId
    );

  }


  // =================================================
  // LOAD HISTORY BY PATIENT ID
  // =================================================

  loadHistoryByPatientId(
    patientId: number
  ): void {

    this.patientId =
      patientId;


    this.isLoading = true;

    this.errorMessage = '';


    this.medicalRecordService
      .getPatientHistory(patientId)
      .subscribe({

        next: (data) => {

          console.log(
            'Medical records API response:',
            data
          );


          this.medicalRecords =
            data;


          this.isLoading = false;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Medical records API error:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to load medical records.';


          this.cdr.detectChanges();

        }

      });

  }


  // =================================================
  // ROLE HELPERS
  // =================================================

  isPatient(): boolean {

    return this.userRole === 'Patient';

  }


  isDoctor(): boolean {

    return this.userRole === 'Doctor';

  }


  isAdmin(): boolean {

    return this.userRole === 'Admin';

  }


  // =================================================
  // SELECTED PATIENT NAME
  // =================================================

  getSelectedPatientName(): string {

    const patient =
      this.patients.find(
        p => p.id === this.selectedPatientId
      );


    return patient?.fullName || '';

  }

}