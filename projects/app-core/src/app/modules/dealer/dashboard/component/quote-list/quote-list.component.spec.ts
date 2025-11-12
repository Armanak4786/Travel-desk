import { ComponentFixture, TestBed } from '@angular/core/testing';

// Updated import to match the new component class name
import { TravelRequestListComponent } from './quote-list.component'; 

// Updated describe block to match the new component name
describe('TravelRequestListComponent', () => { 
  let component: TravelRequestListComponent;
  let fixture: ComponentFixture<TravelRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelRequestListComponent] // Use the new component name here
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelRequestListComponent); // Use the new component name here
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});