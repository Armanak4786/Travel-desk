import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelVisaComponent } from './travel-visa.component';

describe('TravelVisaComponent', () => {
  let component: TravelVisaComponent;
  let fixture: ComponentFixture<TravelVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelVisaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
