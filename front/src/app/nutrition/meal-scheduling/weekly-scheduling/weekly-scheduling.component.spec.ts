import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySchedulingComponent } from './weekly-scheduling.component';

describe('WeeklySchedulingComponent', () => {
  let component: WeeklySchedulingComponent;
  let fixture: ComponentFixture<WeeklySchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklySchedulingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklySchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
