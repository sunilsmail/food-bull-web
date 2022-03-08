import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactPersonComponent } from './view-contact-person.component';

describe('ViewContactPersonComponent', () => {
  let component: ViewContactPersonComponent;
  let fixture: ComponentFixture<ViewContactPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContactPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContactPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
