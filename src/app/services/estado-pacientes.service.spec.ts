import { TestBed } from '@angular/core/testing';

import { EstadoPacientesService } from './estado-pacientes.service';

describe('EstadoPacientesService', () => {
  let service: EstadoPacientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoPacientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
