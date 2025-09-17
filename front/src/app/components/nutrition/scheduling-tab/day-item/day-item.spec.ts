import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayItem } from './day-item';

describe('DayItem', () => {
  let component: DayItem;
  let fixture: ComponentFixture<DayItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
