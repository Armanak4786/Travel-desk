import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAndHospitilityExpensesComponent } from './travel-and-hospitility-expenses.component';

describe('TravelAndHospitilityExpensesComponent', () => {
  let component: TravelAndHospitilityExpensesComponent;
  let fixture: ComponentFixture<TravelAndHospitilityExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelAndHospitilityExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelAndHospitilityExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
