import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepartmentModelComponent } from './create-department-model.component';

describe('CreateDepartmentModelComponent', () => {
  let component: CreateDepartmentModelComponent;
  let fixture: ComponentFixture<CreateDepartmentModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDepartmentModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepartmentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
