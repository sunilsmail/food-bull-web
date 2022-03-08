import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersGridComponent } from './all-users-grid.component';

describe('AllUsersGridComponent', () => {
  let component: AllUsersGridComponent;
  let fixture: ComponentFixture<AllUsersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUsersGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUsersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
