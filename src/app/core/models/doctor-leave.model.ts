export interface DoctorLeave {

  id: number;

  doctorId: number;

  doctorName: string;

  startDate: string;

  endDate: string;

  reason: string;

  isApproved: boolean;

}


export interface CreateLeave {

  startDate: string;

  endDate: string;

  reason: string;

}