import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceGivenComponent } from './advance-given.component';

describe('TravelAmountComponent', () => {
  let component: AdvanceGivenComponent;
  let fixture: ComponentFixture<AdvanceGivenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceGivenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceGivenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
