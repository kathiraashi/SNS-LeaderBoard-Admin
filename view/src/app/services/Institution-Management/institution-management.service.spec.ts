/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InstitutionManagementService } from './institution-management.service';

describe('Service: InstitutionManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstitutionManagementService]
    });
  });

  it('should ...', inject([InstitutionManagementService], (service: InstitutionManagementService) => {
    expect(service).toBeTruthy();
  }));
});
