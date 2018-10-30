import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQueriesComponent } from './list-queries.component';

describe('ListQueriesComponent', () => {
  let component: ListQueriesComponent;
  let fixture: ComponentFixture<ListQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
