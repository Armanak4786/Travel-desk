import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-travel-details',
  templateUrl: './travel-details.component.html',
  styleUrls: ['./travel-details.component.scss']
})
export class TravelDetailsComponent implements OnInit {
  travelForm: FormGroup;
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  // Options Data
  modeOfTransportOptions: any[] = [
    { label: "Air", value: "air",  image: "assets/images/transport/airplaneTilt.svg" },
    { label: "Train", value: "train",  image: "assets/images/transport/train.svg" },
    { label: "Bus", value: "bus", image: "assets/images/transport/bus.svg" },
    { label: "Cab", value: "cab",  image: "assets/images/transport/cab.svg" },
    { label: "Others", value: "others", image: "" },
  ];

  cityOptions: any[] = [
    { label: "Mumbai", subLabel: "BOM, Chhatrapati Shivaji Intl", value: "BOM" },
    { label: "Bangkok", subLabel: "BKK, Bangkok Thailand", value: "BKK" },
    { label: "New Delhi", subLabel: "DEL, Indira Gandhi Intl", value: "DEL" },
    { label: "Bengaluru", subLabel: "BLR, Kempegowda Intl", value: "BLR" }
  ];

  timeOptions: any[] = [
    { label: "(09:00 AM - 10:00 AM)", value: "09-10" },
    { label: "(12:00 PM - 04:00 PM)", value: "12-04" },
    { label: "(05:00 PM - 09:00 PM)", value: "05-09" },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.checkViewMode();
  }

  // Initialize the main form wrapper
  initForm() {
    this.travelForm = this.fb.group({
      travelDetails: this.fb.array([])
    });

if (this.currentRole !== 'Employee') {
    // If Admin/Finance: Load dummy data
    this.addSampleRows();
  } else if (!this.viewOnly) {
    // If Employee (Creator): Start with 1 empty row
    this.addTravelItem();
  }
  }

  addSampleRows() {
  // 1. Create Dummy Files (For the Eye Icon to work)
  const dummyTicket = new File(["dummy content"], "Flight_Ticket_BOM_BKK.pdf", { type: "application/pdf" });
  const dummyHotel = new File(["dummy content"], "Hotel_Booking_BKK.pdf", { type: "application/pdf" });

  // Row 1: Mumbai to Bangkok
  const row1 = this.createTravelItem();
  row1.patchValue({
    modeOfTransport: 'air',
    fromCity: 'BOM',
    toCity: 'BKK',
    departureDate: new Date(),
    departureTime: '09-10',
    returnDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days later
    returnTime: '12-04',
    isAccommodationRequired: true,
    accommodationLocation: 'Grand Hyatt Bangkok',
    nights: 5,
    uploadedDocuments: [dummyTicket, dummyHotel] // Attach dummy file object
  });
  this.travelDetails.push(row1);

  //   const row2 = this.createTravelItem();
  // row2.patchValue({
  //   modeOfTransport: 'air',
  //   fromCity: 'BOM',
  //   toCity: 'BKK',
  //   departureDate: new Date(),
  //   departureTime: '09-10',
  //   returnDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days later
  //   returnTime: '12-04',
  //   isAccommodationRequired: true,
  //   accommodationLocation: 'Grand Hotel',
  //   nights: 5,
  //   uploadedDocuments: [dummyTicket, dummyHotel] // Attach dummy file object
  // });
  // this.travelDetails.push(row2);
}

checkViewMode() {
  if (this.viewOnly || (this.currentRole && this.currentRole !== 'Employee')) {
    this.travelForm.disable(); // Disables all inputs, dropdowns, and rows
  }
}
  // Getter for easy access in HTML
  get travelDetails(): FormArray {
    return this.travelForm.get('travelDetails') as FormArray;
  }

  // Create a single row (Group) structure matching your Backend API needs
  createTravelItem(): FormGroup {
    return this.fb.group({
      modeOfTransport: ['air', Validators.required],
      fromCity: [null, Validators.required],
      toCity: [null, Validators.required],
      departureDate: [new Date(), Validators.required],
      departureTime: [null], // Optional based on UI
      returnDate: [null, Validators.required],
      returnTime: [null],
      isAccommodationRequired: [true],
      accommodationLocation: [''],
      nights: [2, [Validators.min(1)]],
uploadedDocuments: [[]]
    });
  }

addTravelItem() {
  const item = this.createTravelItem();
  
  // Ensure new row is disabled if the parent form is disabled
  if (this.travelForm.disabled) {
      item.disable();
  }
  
  this.travelDetails.push(item);
}


removeTravelItem(index: number) {
  // Prevent removal if view only
  if (this.travelForm.disabled) return;
  this.travelDetails.removeAt(index);
}

// 1. Handle File Selection (Native Input Event)
onFileSelect(event: any, rowIndex: number) {
  if (event.target.files && event.target.files.length > 0) {
    const group = this.travelDetails.at(rowIndex);
    const currentFiles = group.get('uploadedDocuments')?.value || [];
    
    // Convert FileList to Array and Append
    const newFiles = Array.from(event.target.files);
    const updatedFiles = [...currentFiles, ...newFiles];

    group.patchValue({ uploadedDocuments: updatedFiles });

    // Reset input value so the same file can be selected again if needed
    event.target.value = '';
  }
}

// 2. Remove File
removeDocument(rowIndex: number, fileIndex: number) {
  const group = this.travelDetails.at(rowIndex);
  const currentFiles = group.get('uploadedDocuments')?.value || [];
  
  // Remove item at specific index
  currentFiles.splice(fileIndex, 1);
  
  // Update the control
  group.patchValue({ uploadedDocuments: currentFiles });
}

// 3. View File Helper
viewFile(file: any) {
  if (file instanceof File) {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  } else {
    console.log('Viewing remote file:', file);
  }
}

// 4. Download File Helper
downloadFile(file: any) {
  if (file instanceof File) {
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    link.click();
    window.URL.revokeObjectURL(fileUrl);
  }
}

  onSave() {
    if (this.travelForm.valid) {
      const payload = this.travelForm.value;
      console.log('Ready for Backend API:', payload);
      // service.saveTravelDetails(payload).subscribe(...)
    } else {
      this.travelForm.markAllAsTouched();
    }
  }

  // Helper for UI styling of SelectButton
  getIconClass(option: any): string {
    return option.image ? '' : 'ml-0'; 
  }

  swapLocations(index: number) {
    const group = this.travelDetails.at(index);
    const fromVal = group.get('fromCity')?.value;
    const toVal = group.get('toCity')?.value;

    group.patchValue({
      fromCity: toVal,
      toCity: fromVal
    });
  }
  // Helper to calculate "X Days Y Nights"
  getDurationText(nights: number): string {
    if (!nights || nights < 0) return '0 Days 0 Nights';
    const days = nights + 1;
    // Handle pluralization if needed
    return `${days} Days ${nights} Night${nights !== 1 ? 's' : ''}`;
  }
}