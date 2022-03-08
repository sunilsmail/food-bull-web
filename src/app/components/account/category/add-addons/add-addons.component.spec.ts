import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddonsComponent } from './add-addons.component';

describe('AddAddonsComponent', () => {
  let component: AddAddonsComponent;
  let fixture: ComponentFixture<AddAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
