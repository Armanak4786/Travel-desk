import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeridiumComponent } from './peridium.component';

describe('PeridiumComponent', () => {
  let component: PeridiumComponent;
  let fixture: ComponentFixture<PeridiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeridiumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeridiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
