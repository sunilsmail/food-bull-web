import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAdminGridComponent } from './store-admin-grid.component';

describe('StoreAdminGridComponent', () => {
  let component: StoreAdminGridComponent;
  let fixture: ComponentFixture<StoreAdminGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAdminGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAdminGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
