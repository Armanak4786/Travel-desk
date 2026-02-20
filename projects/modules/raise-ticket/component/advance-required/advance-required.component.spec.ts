import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceRequiredComponent } from './advance-required.component';

describe('AdvanceGivenComponent', () => {
  let component: AdvanceRequiredComponent;
  let fixture: ComponentFixture<AdvanceRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceRequiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
