import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSidemenuComponent } from './sub-sidemenu.component';

describe('SubSidemenuComponent', () => {
  let component: SubSidemenuComponent;
  let fixture: ComponentFixture<SubSidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubSidemenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
