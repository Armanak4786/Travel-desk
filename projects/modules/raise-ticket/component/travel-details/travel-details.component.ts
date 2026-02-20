import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MasterDataService, DropdownOption } from 'projects/modules/shared/services/master-data.service';
import { LocationSearchService, LocationOption } from 'projects/modules/shared/services/location-search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-travel-details',
  templateUrl: './travel-details.component.html',
  styleUrls: ['./travel-details.component.scss']
})
export class TravelDetailsComponent implements OnInit, OnDestroy {
  travelForm: FormGroup;
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  
  modeOfTransportOptions: DropdownOption[] = [];

  // Per-row city suggestions for autocomplete
  cityOptionsMap: Map<number, { from: LocationOption[], to: LocationOption[] }> = new Map();
  
  // Loading state per row
  loadingMap: Map<number, { from: boolean, to: boolean }> = new Map();

  // Search subjects for debouncing
  private searchSubjects: Map<string, Subject<{ query: string, rowIndex: number, field: 'from' | 'to' }>> = new Map();
  private destroy$ = new Subject<void>();

  timeOptions: any[] = [
    { label: "(09:00 AM - 10:00 AM)", value: "09-10" },
    { label: "(12:00 PM - 04:00 PM)", value: "12-04" },
    { label: "(05:00 PM - 09:00 PM)", value: "05-09" },
  ];

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private locationSearchService: LocationSearchService
  ) {}

  ngOnInit(): void {
    // Load master data options
    this.loadMasterDataOptions();
    this.initForm();
    this.checkViewMode();
  }

  /**
   * Load dropdown options from MasterDataService
   */
  private loadMasterDataOptions(): void {
    this.modeOfTransportOptions = this.masterDataService.getModeOfTransports();
  }

  // Initialize the main form wrapper
  initForm() {
    if(!this.currentRole){
        this.currentRole = sessionStorage.getItem("userRole") || "Employee";
    }
    this.travelForm = this.fb.group({
      travelDate: [new Date(), Validators.required],
      returnDate: [new Date(new Date().setDate(new Date().getDate() + 1)), Validators.required],
      travelDetails: this.fb.array([])
    });

if (this.viewOnly) {
    // View mode: don't add any rows, will be patched from API
  } else if (this.currentRole !== 'Employee') {
    // If Admin/Finance in create mode: Load dummy data
    this.addSampleRows();
  } else {
    // If Employee (Creator): Start with 1 empty row
    this.addTravelItem();
  }
  }

  addSampleRows() {
    // Create Dummy Files (For the Eye Icon to work)
    const dummyTicket = new File(["dummy content"], "Flight_Ticket_BOM_BKK.pdf", { type: "application/pdf" });
    const dummyHotel = new File(["dummy content"], "Hotel_Booking_BKK.pdf", { type: "application/pdf" });

    // Get Air mode ID from master data (default to 1)
    const airModeId = this.masterDataService.getIdByName('modeOfTransports', 'Air') || 1;

    // Create location objects for autocomplete compatibility
    const mumbaiLocation: LocationOption = {
      label: 'Mumbai',
      value: 'Mumbai',
      subLabel: 'BOM, Chhatrapati Shivaji Intl',
      type: 'airport',
      iataCode: 'BOM'
    };
    
    const bangkokLocation: LocationOption = {
      label: 'Bangkok',
      value: 'Bangkok',
      subLabel: 'BKK, Suvarnabhumi Airport',
      type: 'airport',
      iataCode: 'BKK'
    };

    // Row 1: Mumbai to Bangkok
    const row1 = this.createTravelItem();
    row1.patchValue({
      modeOfTransport: airModeId,
      fromCity: mumbaiLocation,
      toCity: bangkokLocation,
      departureDate: new Date(),
      departureTime: '09-10',
      returnDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      returnTime: '12-04',
      isAccommodationRequired: true,
      accommodationLocation: 'Grand Hyatt Bangkok',
      nights: 5,
      uploadedDocuments: [dummyTicket, dummyHotel]
    });
    this.travelDetails.push(row1);
    
    // Initialize options map for this row
    this.initRowCityOptions(0);
    this.setupAccommodationListener(row1, 0);
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

  patchFromApi(data: any): void {
    if (!data) return;

    this.travelForm.patchValue({
      travelDate: data.travelStartDate ? new Date(data.travelStartDate) : null,
      returnDate: data.travelEndDate ? new Date(data.travelEndDate) : null,
    });

    this.travelDetails.clear();

    const details = data.travelDetails || [];
    details.forEach((detail: any, index: number) => {
      const row = this.createTravelItem();
      
      // Create location objects for autocomplete compatibility
      const fromLocation = this.createLocationObject(detail.fromLocation);
      const toLocation = this.createLocationObject(detail.toLocation);
      
      row.patchValue({
        modeOfTransport: detail.modeOfTransportId,
        fromCity: fromLocation,
        toCity: toLocation,
        departureDate: detail.departureDate ? new Date(detail.departureDate) : null,
        departureTime: detail.departureTime || null,
        returnDate: detail.returnDate ? new Date(detail.returnDate) : null,
        returnTime: detail.returnTime || null,
        isAccommodationRequired: detail.accommodationRequired,
        accommodationLocation: detail.accomodationLocation,
        nights: detail.noOfNights,
      });
      
      if (this.travelForm.disabled) {
        row.disable();
      }
      this.travelDetails.push(row);
      
      // Initialize options map for this row
      this.initRowCityOptions(index);
      this.setupAccommodationListener(row, index);
    });
  }

  /**
   * Create a LocationOption object from a city name string (for API data)
   */
  private createLocationObject(cityName: string | null): LocationOption | null {
    if (!cityName) return null;
    return {
      label: cityName,
      value: cityName,
      subLabel: '',
      type: 'city'
    };
  }

  getValue(): any {
    return this.travelForm ? this.travelForm.getRawValue() : {};
  }

  isValid(): boolean {
    return this.travelForm ? this.travelForm.valid : true;
  }

  markAllTouched(): void {
    if (this.travelForm) this.travelForm.markAllAsTouched();
  }

  // Create a single row (Group) structure matching your Backend API needs
  createTravelItem(): FormGroup {
    // Default to Air (id: 1) from master data
    const defaultTransportId = this.modeOfTransportOptions.length > 0 
      ? this.modeOfTransportOptions[0].value 
      : 1;
    
    return this.fb.group({
      modeOfTransport: [defaultTransportId, Validators.required],
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
  
  const rowIndex = this.travelDetails.length;
  this.travelDetails.push(item);
  this.setupAccommodationListener(item, rowIndex);
}

/**
 * Subscribe to isAccommodationRequired changes and clear accommodation fields when set to false
 */
private setupAccommodationListener(row: FormGroup, rowIndex: number): void {
  row.get('isAccommodationRequired')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((isRequired: boolean) => {
      if (!isRequired) {
        row.patchValue({
          accommodationLocation: '',
          nights: null
        });
      }
    });
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
    return `${days} Days ${nights} Night${nights !== 1 ? 's' : ''}`;
  }

  /**
   * Initialize city options map for a row
   */
  private initRowCityOptions(rowIndex: number): void {
    if (!this.cityOptionsMap.has(rowIndex)) {
      this.cityOptionsMap.set(rowIndex, { from: [], to: [] });
    }
    if (!this.loadingMap.has(rowIndex)) {
      this.loadingMap.set(rowIndex, { from: false, to: false });
    }
  }

  /**
   * Handle autocomplete search event
   */
  onCitySearch(event: any, rowIndex: number, field: 'from' | 'to'): void {
    const query = event.query?.trim() || '';
    
    this.initRowCityOptions(rowIndex);
    
    if (query.length < 2) {
      const options = this.cityOptionsMap.get(rowIndex)!;
      options[field] = [];
      return;
    }

    // Set loading state
    const loading = this.loadingMap.get(rowIndex)!;
    loading[field] = true;

    // Get the mode of transport for this row
    const row = this.travelDetails.at(rowIndex);
    const modeId = row?.get('modeOfTransport')?.value || 1;

    this.locationSearchService.searchByMode(query, modeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          const options = this.cityOptionsMap.get(rowIndex);
          if (options) {
            options[field] = results;
          }
          const loadState = this.loadingMap.get(rowIndex);
          if (loadState) {
            loadState[field] = false;
          }
        },
        error: () => {
          const loadState = this.loadingMap.get(rowIndex);
          if (loadState) {
            loadState[field] = false;
          }
        }
      });
  }

  /**
   * Get city options for a specific row and field
   */
  getCityOptions(rowIndex: number, field: 'from' | 'to'): LocationOption[] {
    return this.cityOptionsMap.get(rowIndex)?.[field] || [];
  }

  /**
   * Check if search is loading for a specific row and field
   */
  isSearchLoading(rowIndex: number, field: 'from' | 'to'): boolean {
    return this.loadingMap.get(rowIndex)?.[field] || false;
  }

  /**
   * Handle city selection from autocomplete
   */
  onCitySelect(event: any, rowIndex: number, field: 'from' | 'to'): void {
    const row = this.travelDetails.at(rowIndex);
    const selectedOption = event;
    
    if (selectedOption && row) {
      const controlName = field === 'from' ? 'fromCity' : 'toCity';
      row.get(controlName)?.setValue(selectedOption);
    }
  }

  /**
   * Get display value for selected city
   */
  getSelectedCityLabel(rowIndex: number, field: 'from' | 'to'): string {
    const row = this.travelDetails.at(rowIndex);
    const controlName = field === 'from' ? 'fromCity' : 'toCity';
    const value = row?.get(controlName)?.value;
    
    if (typeof value === 'object' && value?.label) {
      return value.label;
    }
    return value || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}