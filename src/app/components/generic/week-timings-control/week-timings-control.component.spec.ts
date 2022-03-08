import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekTimingsControlComponent } from './week-timings-control.component';

describe('WeekTimingsControlComponent', () => {
  let component: WeekTimingsControlComponent;
  let fixture: ComponentFixture<WeekTimingsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekTimingsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekTimingsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
