/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SubjectsService } from './subjects.service';

describe('Service: Subjects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectsService]
    });
  });

  it('should ...', inject([SubjectsService], (service: SubjectsService) => {
    expect(service).toBeTruthy();
  }));
});
