/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurrentSemestersService } from './current-semesters.service';

describe('Service: CurrentSemesters', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentSemestersService]
    });
  });

  it('should ...', inject([CurrentSemestersService], (service: CurrentSemestersService) => {
    expect(service).toBeTruthy();
  }));
});
