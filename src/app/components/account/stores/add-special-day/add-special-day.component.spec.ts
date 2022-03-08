import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecialDayComponent } from './add-special-day.component';

describe('AddSpecialDayComponent', () => {
  let component: AddSpecialDayComponent;
  let fixture: ComponentFixture<AddSpecialDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSpecialDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpecialDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
