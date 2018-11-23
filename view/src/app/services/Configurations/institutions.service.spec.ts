/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InstitutionsService } from './institutions.service';

describe('Service: Institutions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstitutionsService]
    });
  });

  it('should ...', inject([InstitutionsService], (service: InstitutionsService) => {
    expect(service).toBeTruthy();
  }));
});
