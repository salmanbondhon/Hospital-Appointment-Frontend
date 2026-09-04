import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
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

import { DoctorLeaveService } from '../../core/services/doctor-leave.service';

import {
  DoctorLeave
} from '../../core/models/doctor-leave.model';

import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-doctor-leaves',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ],

  templateUrl: './doctor-leaves.html',

  styleUrl: './doctor-leaves.css'
})
export class DoctorLeaves implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private leaveService =
    inject(DoctorLeaveService);

  private authService =
    inject(AuthService);

  private fb =
    inject(FormBuilder);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // DATA
  // =====================================================

  leaves: DoctorLeave[] = [];


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
  // FORM
  // =====================================================

  leaveForm = this.fb.group({

    startDate: [
      '',
      Validators.required
    ],

    endDate: [
      '',
      Validators.required
    ],

    reason: [
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


    this.loadLeaves();

  }


  // =====================================================
  // ROLE HELPERS
  // =====================================================

  isDoctor(): boolean {

    return this.userRole === 'Doctor';

  }


  isAdmin(): boolean {

    return this.userRole === 'Admin';

  }


  // =====================================================
  // LOAD LEAVES
  // =====================================================

  loadLeaves(): void {

    this.isLoading = true;

    this.errorMessage = '';


    // =================================================
    // DOCTOR
    // =================================================

    if (this.isDoctor()) {

      this.leaveService
        .getMyLeaves()
        .subscribe({

          next: (data) => {

            console.log(
              'My leaves:',
              data
            );

            this.leaves = data;

            this.isLoading = false;

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'My leaves API error:',
              error
            );

            this.isLoading = false;

            this.errorMessage =
              error?.error?.message ||
              'Unable to load your leaves.';

            this.cdr.detectChanges();

          }

        });

      return;

    }


    // =================================================
    // ADMIN
    // =================================================

    if (this.isAdmin()) {

      this.leaveService
        .getAll()
        .subscribe({

          next: (data) => {

            console.log(
              'All doctor leaves:',
              data
            );

            this.leaves = data;

            this.isLoading = false;

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Doctor leaves API error:',
              error
            );

            this.isLoading = false;

            this.errorMessage =
              error?.error?.message ||
              'Unable to load doctor leaves.';

            this.cdr.detectChanges();

          }

        });

      return;

    }


    // =================================================
    // OTHER ROLES
    // =================================================

    this.isLoading = false;

  }


  // =====================================================
  // OPEN FORM
  // =====================================================

  openAddForm(): void {

    if (!this.isDoctor()) {

      return;

    }


    this.showForm = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.leaveForm.reset({

      startDate: '',

      endDate: '',

      reason: ''

    });

  }


  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.isSaving = false;

    this.leaveForm.reset();

    this.errorMessage = '';

  }


  // =====================================================
  // CREATE LEAVE
  // =====================================================

  createLeave(): void {

    if (!this.isDoctor()) {

      return;

    }


    // =================================================
    // VALIDATE FORM
    // =================================================

    if (this.leaveForm.invalid) {

      this.leaveForm.markAllAsTouched();

      return;

    }


    const startDate =
      this.leaveForm.value.startDate!;

    const endDate =
      this.leaveForm.value.endDate!;

    const reason =
      this.leaveForm.value.reason!
        .trim();


    // =================================================
    // CHECK DATE
    // =================================================

    const start =
      new Date(startDate);

    const end =
      new Date(endDate);


    if (end < start) {

      this.errorMessage =
        'End date must be after start date.';

      return;

    }


    // =================================================
    // SAVE
    // =================================================

    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    const model = {

      startDate: startDate,

      endDate: endDate,

      reason: reason

    };


    console.log(
      'Creating doctor leave:',
      model
    );


    this.leaveService
      .create(model)
      .subscribe({

        next: (response) => {

          console.log(
            'Create leave response:',
            response
          );


          this.isSaving = false;

          this.showForm = false;


          this.successMessage =
            'Leave request submitted successfully.';


          this.leaveForm.reset();


          this.loadLeaves();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Create leave error:',
            error
          );


          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ||
            'Unable to submit leave request.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // APPROVE LEAVE
  // =====================================================

  approveLeave(
    leave: DoctorLeave
  ): void {

    if (!this.isAdmin()) {

      return;

    }


    const confirmed =
      confirm(
        `Are you sure you want to approve ${leave.doctorName}'s leave?`
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.leaveService
      .approve(leave.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Leave approved successfully.';


          this.loadLeaves();

        },


        error: (error) => {

          console.error(
            'Approve leave error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to approve leave.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // DELETE LEAVE
  // =====================================================

  deleteLeave(
    leave: DoctorLeave
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this leave?'
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.leaveService
      .delete(leave.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Leave deleted successfully.';


          this.loadLeaves();

        },


        error: (error) => {

          console.error(
            'Delete leave error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to delete leave.';


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // STATUS TEXT
  // =====================================================

  getStatusText(
    isApproved: boolean
  ): string {

    return isApproved
      ? 'Approved'
      : 'Pending';

  }


  // =====================================================
  // STATUS CSS CLASS
  // =====================================================

  getStatusClass(
    isApproved: boolean
  ): string {

    return isApproved
      ? 'approved'
      : 'pending';

  }

}