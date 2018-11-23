import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLevelComponent } from './view-level.component';

describe('ViewLevelComponent', () => {
  let component: ViewLevelComponent;
  let fixture: ComponentFixture<ViewLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
