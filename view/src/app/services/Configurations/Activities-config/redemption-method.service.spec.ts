/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RedemptionMethodService } from './redemption-method.service';

describe('Service: RedemptionMethod', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedemptionMethodService]
    });
  });

  it('should ...', inject([RedemptionMethodService], (service: RedemptionMethodService) => {
    expect(service).toBeTruthy();
  }));
});
