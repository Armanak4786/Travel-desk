import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverDetailsComponent } from './approver-details.component';

describe('ApproverDetailsComponent', () => {
  let component: ApproverDetailsComponent;
  let fixture: ComponentFixture<ApproverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproverDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
