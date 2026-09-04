export interface Appointment {
  id: number;

  doctorId: number;
  doctorName: string;

  patientId: number;
  patientName: string;

  appointmentDate: string;

  problemDescription: string;

  status: AppointmentStatus;
}

export enum AppointmentStatus {
  Pending = 1,
  Approved = 2,
  Completed = 3,
  Cancelled = 4
}