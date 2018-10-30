import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLevelComponent } from './create-level.component';

describe('CreateLevelComponent', () => {
  let component: CreateLevelComponent;
  let fixture: ComponentFixture<CreateLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
