import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  MedicalRecord
} from '../models/medical-record.model';


@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  private http =
    inject(HttpClient);


  private apiUrl =
    `${environment.apiUrl}/MedicalRecord`;


  // =================================================
  // GET PATIENT MEDICAL HISTORY
  // =================================================

  getPatientHistory(
    patientId: number
  ): Observable<MedicalRecord[]> {

    return this.http.get<MedicalRecord[]>(
      `${this.apiUrl}/patient/${patientId}`
    );

  }

}