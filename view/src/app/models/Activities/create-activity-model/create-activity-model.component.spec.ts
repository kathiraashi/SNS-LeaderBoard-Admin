import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityModelComponent } from './create-activity-model.component';

describe('CreateActivityModelComponent', () => {
  let component: CreateActivityModelComponent;
  let fixture: ComponentFixture<CreateActivityModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActivityModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
