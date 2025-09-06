import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsList } from './ingredients-list';

describe('IngredientsList', () => {
  let component: IngredientsList;
  let fixture: ComponentFixture<IngredientsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
