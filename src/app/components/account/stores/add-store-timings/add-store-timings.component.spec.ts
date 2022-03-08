import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreTimingsComponent } from './add-store-timings.component';

describe('AddStoreTimingsComponent', () => {
  let component: AddStoreTimingsComponent;
  let fixture: ComponentFixture<AddStoreTimingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStoreTimingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
