import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergensTagsViewComponent } from './allergens-tags-view.component';

describe('AllergensTagsViewComponent', () => {
  let component: AllergensTagsViewComponent;
  let fixture: ComponentFixture<AllergensTagsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllergensTagsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergensTagsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
