import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQueriesComponent } from './edit-queries.component';

describe('EditQueriesComponent', () => {
  let component: EditQueriesComponent;
  let fixture: ComponentFixture<EditQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
