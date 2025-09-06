import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientItem } from './ingredient-item';

describe('IngredientItem', () => {
  let component: IngredientItem;
  let fixture: ComponentFixture<IngredientItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
