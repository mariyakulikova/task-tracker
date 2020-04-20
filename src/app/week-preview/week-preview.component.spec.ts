import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPreviewComponent } from './week-preview.component';

describe('WeekPreviewComponent', () => {
  let component: WeekPreviewComponent;
  let fixture: ComponentFixture<WeekPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
