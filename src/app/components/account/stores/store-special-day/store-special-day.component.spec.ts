import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSpecialDayComponent } from './store-special-day.component';

describe('StoreSpecialDayComponent', () => {
  let component: StoreSpecialDayComponent;
  let fixture: ComponentFixture<StoreSpecialDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSpecialDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSpecialDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
