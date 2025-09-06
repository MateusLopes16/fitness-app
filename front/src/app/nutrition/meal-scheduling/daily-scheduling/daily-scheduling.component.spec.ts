import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySchedulingComponent } from './daily-scheduling.component';

describe('DailySchedulingComponent', () => {
  let component: DailySchedulingComponent;
  let fixture: ComponentFixture<DailySchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailySchedulingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailySchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
