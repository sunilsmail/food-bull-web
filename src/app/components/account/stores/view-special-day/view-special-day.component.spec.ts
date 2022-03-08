import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSpecialDayComponent } from './view-special-day.component';

describe('ViewSpecialDayComponent', () => {
  let component: ViewSpecialDayComponent;
  let fixture: ComponentFixture<ViewSpecialDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSpecialDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSpecialDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
