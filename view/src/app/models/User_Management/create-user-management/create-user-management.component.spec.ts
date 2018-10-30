import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserManagementComponent } from './create-user-management.component';

describe('CreateUserManagementComponent', () => {
  let component: CreateUserManagementComponent;
  let fixture: ComponentFixture<CreateUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
