import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsTab } from './ingredients-tab';

describe('IngredientsTab', () => {
  let component: IngredientsTab;
  let fixture: ComponentFixture<IngredientsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
