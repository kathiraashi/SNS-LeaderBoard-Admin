/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModelStudentImportComponent } from './model-student-import.component';

describe('ModelStudentImportComponent', () => {
  let component: ModelStudentImportComponent;
  let fixture: ComponentFixture<ModelStudentImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelStudentImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelStudentImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
