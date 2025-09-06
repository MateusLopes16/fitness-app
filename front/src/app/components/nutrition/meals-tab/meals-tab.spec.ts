import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsTab } from './meals-tab';

describe('MealsTab', () => {
  let component: MealsTab;
  let fixture: ComponentFixture<MealsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
