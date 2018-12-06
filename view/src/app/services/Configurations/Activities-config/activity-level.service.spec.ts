/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActivityLevelService } from './activity-level.service';

describe('Service: ActivityLevel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityLevelService]
    });
  });

  it('should ...', inject([ActivityLevelService], (service: ActivityLevelService) => {
    expect(service).toBeTruthy();
  }));
});
