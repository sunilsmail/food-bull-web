import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddonsComponent } from './view-addons.component';

describe('ViewAddonsComponent', () => {
  let component: ViewAddonsComponent;
  let fixture: ComponentFixture<ViewAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
