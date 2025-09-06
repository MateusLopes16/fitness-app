import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMealItem } from './daily-meal-item';

describe('DailyMealItem', () => {
  let component: DailyMealItem;
  let fixture: ComponentFixture<DailyMealItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyMealItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyMealItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
