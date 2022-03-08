import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoreGroupComponent } from './view-store-group.component';

describe('ViewStoreGroupComponent', () => {
  let component: ViewStoreGroupComponent;
  let fixture: ComponentFixture<ViewStoreGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStoreGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStoreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
