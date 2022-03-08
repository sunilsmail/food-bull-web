import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreGridComponent } from './store-grid.component';

describe('StoreGridComponent', () => {
  let component: StoreGridComponent;
  let fixture: ComponentFixture<StoreGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
