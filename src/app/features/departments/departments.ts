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

import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../core/models/department.model';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class DepartmentsComponent implements OnInit {

  private departmentService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private authService = inject(AuthService);

userRole: string | null = null;

  departments: Department[] = [];

  isLoading = true;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;

  // null = Add mode
  // number = Edit mode
  editingDepartmentId: number | null = null;

  departmentForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    description: [
      '',
      [
        Validators.maxLength(500)
      ]
    ]
  });


  ngOnInit(): void {

  this.userRole =
    this.authService.getUserRole();

  this.loadDepartments();

}

  // =========================
  // LOAD DEPARTMENTS
  // =========================

  loadDepartments(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getAll().subscribe({

      next: (response) => {

        console.log('Departments API response:', response);

        if (response.success) {

          this.departments = response.data;

        } else {

          this.errorMessage = response.message;

        }

        this.isLoading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Departments API error:', error);

        this.isLoading = false;

        this.errorMessage =
          'Unable to load departments.';

        this.cdr.detectChanges();

      }

    });

  }


  // =========================
  // OPEN ADD FORM
  // =========================

  openAddForm(): void {

    this.editingDepartmentId = null;

    this.departmentForm.reset();

    this.showForm = true;

    this.successMessage = '';
    this.errorMessage = '';

  }


  // =========================
  // OPEN EDIT FORM
  // =========================

  editDepartment(department: Department): void {

    console.log(
      'Editing department:',
      department
    );

    this.editingDepartmentId = department.id;

    this.departmentForm.patchValue({

      name: department.name,

      description: department.description ?? ''

    });

    this.showForm = true;

    this.successMessage = '';
    this.errorMessage = '';

  }


  // =========================
  // CLOSE FORM
  // =========================

  closeForm(): void {

    this.showForm = false;

    this.editingDepartmentId = null;

    this.departmentForm.reset();

    this.successMessage = '';
    this.errorMessage = '';

  }


  // =========================
  // SAVE DEPARTMENT
  // =========================

  saveDepartment(): void {

    if (this.departmentForm.invalid) {

      this.departmentForm.markAllAsTouched();

      return;

    }

    this.isSaving = true;

    this.errorMessage = '';
    this.successMessage = '';


    const model = {

      name: this.departmentForm.value.name!.trim(),

      description:
        this.departmentForm.value.description?.trim() || null

    };


    // =========================
    // EDIT
    // =========================

    if (this.editingDepartmentId !== null) {

      this.departmentService
        .update(
          this.editingDepartmentId,
          model
        )
        .subscribe({

          next: (response) => {

            console.log(
              'Update department response:',
              response
            );

            if (response.success) {

              this.successMessage =
                'Department updated successfully.';

              this.showForm = false;

              this.editingDepartmentId = null;

              this.departmentForm.reset();

              this.loadDepartments();

            } else {

              this.errorMessage =
                response.message;

            }

            this.isSaving = false;

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(
              'Update department error:',
              error
            );

            this.isSaving = false;

            this.errorMessage =
              'Unable to update department.';

            this.cdr.detectChanges();

          }

        });

      return;
    }


    // =========================
    // ADD
    // =========================

    this.departmentService
      .create(model)
      .subscribe({

        next: (response) => {

          console.log(
            'Create department response:',
            response
          );

          if (response.success) {

            this.successMessage =
              'Department created successfully.';

            this.showForm = false;

            this.departmentForm.reset();

            this.loadDepartments();

          } else {

            this.errorMessage =
              response.message;

          }

          this.isSaving = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Create department error:',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            'Unable to create department.';

          this.cdr.detectChanges();

        }

      });

  }


    // =========================
  // DELETE DEPARTMENT
  // =========================

  deleteDepartment(department: Department): void {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.departmentService.delete(department.id).subscribe({

      next: (response) => {

        console.log(
          'Delete department response:',
          response
        );

        if (response.success) {

          this.successMessage =
            'Department deleted successfully.';

          this.loadDepartments();

        } else {

          this.errorMessage =
            response.message;

        }

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Delete department error:',
          error
        );

        this.errorMessage =
          'Unable to delete department.';

        this.cdr.detectChanges();

      }

    });

  }



}