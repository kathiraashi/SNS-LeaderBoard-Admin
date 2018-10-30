import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExtraCurricularActivitiesModelComponent } from './create-extra-curricular-activities-model.component';

describe('CreateExtraCurricularActivitiesModelComponent', () => {
  let component: CreateExtraCurricularActivitiesModelComponent;
  let fixture: ComponentFixture<CreateExtraCurricularActivitiesModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExtraCurricularActivitiesModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExtraCurricularActivitiesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
