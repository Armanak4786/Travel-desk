import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementDetailsCardComponent } from './reimbursement-details-card.component';

describe('ReimbursementDetailsCardComponent', () => {
  let component: ReimbursementDetailsCardComponent;
  let fixture: ComponentFixture<ReimbursementDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementDetailsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
