import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMenuTreeModalComponent } from './copy-menu-tree-modal.component';

describe('CopyMenuTreeModalComponent', () => {
  let component: CopyMenuTreeModalComponent;
  let fixture: ComponentFixture<CopyMenuTreeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyMenuTreeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyMenuTreeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
