import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreGroupGridComponent } from './store-group-grid.component';

describe('StoreGroupGridComponent', () => {
  let component: StoreGroupGridComponent;
  let fixture: ComponentFixture<StoreGroupGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreGroupGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreGroupGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
