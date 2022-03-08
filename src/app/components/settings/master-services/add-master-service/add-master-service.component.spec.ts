import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasterServiceComponent } from './add-master-service.component';

describe('AddMasterServiceComponent', () => {
  let component: AddMasterServiceComponent;
  let fixture: ComponentFixture<AddMasterServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMasterServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
