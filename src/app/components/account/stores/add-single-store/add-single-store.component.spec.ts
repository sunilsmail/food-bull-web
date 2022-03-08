import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleStoreComponent } from './add-single-store.component';

describe('AddSingleStoreComponent', () => {
  let component: AddSingleStoreComponent;
  let fixture: ComponentFixture<AddSingleStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSingleStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
