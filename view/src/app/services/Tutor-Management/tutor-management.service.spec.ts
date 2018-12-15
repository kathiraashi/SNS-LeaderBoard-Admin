/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TutorManagementService } from './tutor-management.service';

describe('Service: TutorManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TutorManagementService]
    });
  });

  it('should ...', inject([TutorManagementService], (service: TutorManagementService) => {
    expect(service).toBeTruthy();
  }));
});
