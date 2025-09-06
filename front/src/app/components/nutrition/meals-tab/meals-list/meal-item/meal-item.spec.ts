import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealItem } from './meal-item';

describe('MealItem', () => {
  let component: MealItem;
  let fixture: ComponentFixture<MealItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
