import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MasterDataService, DropdownOption } from 'projects/modules/shared/services/master-data.service';

@Component({
  selector: 'app-peridium',
  templateUrl: './peridium.component.html',
  styleUrls: ['./peridium.component.scss']
})
export class PeridiumComponent implements OnInit,OnChanges {
  peridiumForm: FormGroup;
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  @Output() totalChange = new EventEmitter<number>(); 
  grandTotal: number = 0;

  // Options - loaded from MasterDataService
  currencyOptions: DropdownOption[] = [];

  daysOptions = Array.from({ length: 30 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService
  ) {}

ngOnInit(): void {
  // Load master data options
  this.loadMasterDataOptions();

  // Just initialize the empty form container. 
  // Logic waits for ngOnChanges to ensure we have the correct Role.
  this.peridiumForm = this.fb.group({
    peridiumDetails: this.fb.array([])
  });

  if (!this.currentRole) {
      this.currentRole = sessionStorage.getItem('userRole') || 'Employee';
    }

    this.setupFormBasedOnRole();
}

/**
 * Load dropdown options from MasterDataService
 */
private loadMasterDataOptions(): void {
  this.currencyOptions = this.masterDataService.getCurrencyTypes();
}

ngOnChanges(changes: SimpleChanges): void {
    // 4. Update if Parent changes the input later
    if (changes['currentRole'] && !changes['currentRole'].isFirstChange()) {
       this.setupFormBasedOnRole();
    }
  }

  setupFormBasedOnRole() {
    this.peridiumDetails.clear();

    if (this.currentRole === 'Employee') {
        // CASE: EMPLOYEE
        this.peridiumForm.enable(); 
        this.addPeridiumItem(); 
    } else {
        // CASE: ADMIN
        this.loadMockData(); 
        this.peridiumForm.disable(); 
    }
  }

  // Helper to load dummy data for admins/viewers
  loadMockData() {
    // Get currency IDs from master data
    const usdId = this.masterDataService.getIdByName('currencyTypes', 'USD') || 2;
    const eurId = this.masterDataService.getIdByName('currencyTypes', 'EUR') || 3;

    const mockData = [
      { noOfDays: 5, currency: usdId, perDayAllowance: 50, forexRate: 83 },
      { noOfDays: 3, currency: eurId, perDayAllowance: 100, forexRate: 90 }
    ];

    mockData.forEach(data => {
      const group = this.createPeridiumItem();
      group.patchValue(data); 
      // patchValue triggers valueChanges, so calculation happens automatically
      this.peridiumDetails.push(group);
    });
  }

  get peridiumDetails(): FormArray {
    return this.peridiumForm.get('peridiumDetails') as FormArray;
  }

  createPeridiumItem(): FormGroup {
    // Default to USD (id: 2) from master data
    const defaultCurrencyId = this.masterDataService.getIdByName('currencyTypes', 'USD') || 2;

    const group = this.fb.group({
      noOfDays: [null, Validators.required],
      currency: [defaultCurrencyId, Validators.required],
      perDayAllowance: [null, Validators.required],
      totalAmount: [{ value: 0, disabled: true }], 
      forexRate: [1, Validators.required],
      inrAmount: [{ value: 0, disabled: true }]    
    });

    // Listen to changes for auto-calculation
    group.valueChanges.subscribe(val => {
      this.calculateRow(group);
    });

    return group;
  }

addPeridiumItem() {
    const item = this.createPeridiumItem();
    
    if (this.peridiumForm.disabled) {
       item.disable();
    } else {
       // CRITICAL: Even if form is Enabled, 'Total' & 'INR' must remain Disabled
       item.get('totalAmount')?.disable();
       item.get('inrAmount')?.disable();
    }
    
    this.peridiumDetails.push(item);
  }

  removePeridiumItem(index: number) {
    if (this.peridiumForm.disabled) return;
    this.peridiumDetails.removeAt(index);
  }

  calculateRow(group: FormGroup) {
    const days = group.get('noOfDays')?.value || 0;
    const allowance = group.get('perDayAllowance')?.value || 0;
    
    const total = days * allowance;
    if (group.get('totalAmount')?.value !== total) {
      group.get('totalAmount')?.setValue(total, { emitEvent: false });
    }
    
    const rate = group.get('forexRate')?.value || 0;
    const inrTotal = total * rate;

    if (group.get('inrAmount')?.value !== inrTotal) {
      group.get('inrAmount')?.setValue(inrTotal, { emitEvent: false });
    }
    
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    this.grandTotal = this.peridiumDetails.controls.reduce((acc, curr) => {
      const inr = curr.get('inrAmount')?.value || 0;
      return acc + inr;
    }, 0);
    
    this.totalChange.emit(this.grandTotal);
  }
}