/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LevelsService } from './levels.service';

describe('Service: Levels', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelsService]
    });
  });

  it('should ...', inject([LevelsService], (service: LevelsService) => {
    expect(service).toBeTruthy();
  }));
});
