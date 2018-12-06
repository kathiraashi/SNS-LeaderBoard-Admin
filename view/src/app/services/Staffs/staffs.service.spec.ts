/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaffsService } from './staffs.service';

describe('Service: Staffs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffsService]
    });
  });

  it('should ...', inject([StaffsService], (service: StaffsService) => {
    expect(service).toBeTruthy();
  }));
});
