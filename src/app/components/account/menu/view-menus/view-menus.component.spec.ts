import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMenusComponent } from './view-menus.component';

describe('ViewMenusComponent', () => {
  let component: ViewMenusComponent;
  let fixture: ComponentFixture<ViewMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMenusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
