import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingTab } from './scheduling-tab';

describe('SchedulingTab', () => {
  let component: SchedulingTab;
  let fixture: ComponentFixture<SchedulingTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulingTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulingTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
