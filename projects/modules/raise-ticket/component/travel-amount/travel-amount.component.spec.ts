import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAmountComponent } from './travel-amount.component';

describe('TravelAmountComponent', () => {
  let component: TravelAmountComponent;
  let fixture: ComponentFixture<TravelAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
