import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, signal,inject } from '@angular/core';
import { Patient } from "../patient";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PatientDocument } from "../patient-document";
import { AuthService } from './auth.service';
import { EstadoPacientesService } from "./estado-pacientes.service";
@Injectable({
  providedIn: 'root'
})
export class VitalSignsService {
   
  private authService=inject(AuthService);
  private estadoPaciente=inject(EstadoPacientesService)
  constructor(private httpClient: HttpClient) { }
  getPatient(id: string): Observable<Patient> {
    const params = new HttpParams().set('id', id)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.httpClient.get<Patient>(environment.url + '/emergency/getOne', { params,headers:headers })
  }
  
  addPatient(patient: Patient): Observable<Patient> {
    patient.firstName=encodeURI(patient.firstName);
    patient.lastName=encodeURI(patient.lastName)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.token}`
    });
    this.estadoPaciente.update(this.estadoPaciente.nPat+1);
    return this.httpClient.post<Patient>(environment.url + '/emergency/add', patient,{headers:headers})
  }

  deletePatient(id: string): Observable<Patient> {
    const params = new HttpParams().set('id', id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.token}`
    });
    this.estadoPaciente.update(this.estadoPaciente.nPat-1);
    return this.httpClient.delete<Patient>(environment.url + '/emergency/delete', { params,headers });
  }

  getPatients(): Observable<PatientDocument[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.httpClient.get<PatientDocument[]>(environment.url + '/emergency/getall',{headers:headers})
  }

  putPatient(patient: { "id": string, firstName:string, lastName:string,"bloodPressureMax": number, "bloodPressureMin": number, "pulse": number,oxygen:number}): Observable<void> {
    patient.firstName=encodeURI(patient.firstName);
    patient.lastName=encodeURI(patient.lastName);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.token}`
    });
    return this.httpClient.put<void>(environment.url + '/emergency/put', patient,{headers:headers})
  }

}
