import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoPacientesService {

  constructor() { }
  public nPat:number=0; 
  private nPatients = new BehaviorSubject<number>(0);

  // Método para actualizar la variable
  update(valor: number) {
    this.nPat=valor;
    this.nPatients.next(valor);
  }

  // Método para obtener la variable como Observable
  getPatients() {
    return this.nPatients.asObservable();
  }
}
