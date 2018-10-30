import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseModelComponent } from './create-course-model.component';

describe('CreateCourseModelComponent', () => {
  let component: CreateCourseModelComponent;
  let fixture: ComponentFixture<CreateCourseModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCourseModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
