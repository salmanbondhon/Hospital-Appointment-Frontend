export interface AdminDashboard {
  totalUsers: number;
  totalDepartments: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  doctorsOnLeaveToday: number;
  totalPrescriptions: number;
}