import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllergensTagsComponent } from './add-allergens-tags.component';

describe('AddAllergensTagsComponent', () => {
  let component: AddAllergensTagsComponent;
  let fixture: ComponentFixture<AddAllergensTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAllergensTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllergensTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
