/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AchievementTypeService } from './achievement-type.service';

describe('Service: AchievementType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AchievementTypeService]
    });
  });

  it('should ...', inject([AchievementTypeService], (service: AchievementTypeService) => {
    expect(service).toBeTruthy();
  }));
});
