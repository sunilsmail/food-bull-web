import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreGroupComponent } from './add-store-group.component';

describe('AddStoreGroupComponent', () => {
  let component: AddStoreGroupComponent;
  let fixture: ComponentFixture<AddStoreGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStoreGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
