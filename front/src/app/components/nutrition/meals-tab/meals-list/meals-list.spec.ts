import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsList } from './meals-list';

describe('MealsList', () => {
  let component: MealsList;
  let fixture: ComponentFixture<MealsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
