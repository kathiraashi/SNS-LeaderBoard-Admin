import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffsModelComponent } from './create-staffs-model.component';

describe('CreateStaffsModelComponent', () => {
  let component: CreateStaffsModelComponent;
  let fixture: ComponentFixture<CreateStaffsModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStaffsModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStaffsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
