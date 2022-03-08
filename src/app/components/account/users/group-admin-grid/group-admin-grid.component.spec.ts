import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminGridComponent } from './group-admin-grid.component';

describe('GroupAdminGridComponent', () => {
  let component: GroupAdminGridComponent;
  let fixture: ComponentFixture<GroupAdminGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAdminGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAdminGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
