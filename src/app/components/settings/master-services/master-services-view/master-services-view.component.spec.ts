import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterServicesViewComponent } from './master-services-view.component';

describe('MasterServicesViewComponent', () => {
  let component: MasterServicesViewComponent;
  let fixture: ComponentFixture<MasterServicesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterServicesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterServicesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
