import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MasterDataService, DropdownOption } from 'projects/modules/shared/services/master-data.service';

@Component({
  selector: 'app-advance-required',
  templateUrl: './advance-required.component.html',
  styleUrls: ['./advance-required.component.scss'] 
})
export class AdvanceRequiredComponent implements OnInit {

  advanceRequiredForm: FormGroup;

  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = ''; 
  @Output() onAdvanceRequiredChange = new EventEmitter<boolean>();

  currencyOptions: DropdownOption[] = [];

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit(): void {
    this.loadMasterDataOptions();
    this.initForm();

    if (this.viewOnly) {
      // View mode: don't load dummy data, will be patched from API
    } else if (!this.isEmployee) {
      this.loadDummyData();
    }

    if (this.isReadOnly) {
      this.advanceRequiredForm.disable();
    }
  }

  /**
   * Load dropdown options from MasterDataService
   */
  private loadMasterDataOptions(): void {
    this.currencyOptions = this.masterDataService.getCurrencyTypes();
  }

  get isEmployee(): boolean {
    return this.currentRole === 'Employee';
  }

  get isReadOnly(): boolean {
    return this.viewOnly || !this.isEmployee;
  }

  initForm() {
    if(!this.currentRole){
        this.currentRole = sessionStorage.getItem("userRole") || "Employee";
    }
    this.advanceRequiredForm = this.fb.group({
      advanceRequired: [false], 
      advanceRequiredDetails: this.fb.array([])
    });

    this.advanceRequiredForm.get('advanceRequired')?.valueChanges.subscribe(isRequired => {
      this.onAdvanceRequiredChange.emit(isRequired);

      // Only allow auto-add/clear if the form is enabled (Employee mode)
      // If it's disabled (dummy data loaded), we don't want this listener clearing our data.
      if (this.advanceRequiredForm.enabled) {
        if (!isRequired) {
          this.advanceRequiredDetails.clear();
        } else if (this.advanceRequiredDetails.length === 0) {
          this.addAdvanceItem();
        }
      }
    });
  }

  get advanceRequiredDetails(): FormArray {
    return this.advanceRequiredForm.get('advanceRequiredDetails') as FormArray;
  }

  patchFromApi(data: any): void {
    if (!data) return;

    const details = data.advanceRequiredDetails || [];
    const hasAdvance = details.length > 0;

    this.advanceRequiredForm.patchValue({ advanceRequired: hasAdvance });

    this.advanceRequiredDetails.clear();

    details.forEach((detail: any) => {
      const group = this.createAdvanceItem();
      group.patchValue({
        currency: detail.currencyTypeId,
        amount: detail.amount,
        forexRate: detail.forexRate,
      });
      this.calculateINR(group);
      if (this.advanceRequiredForm.disabled) {
        group.disable();
      }
      this.advanceRequiredDetails.push(group);
    });

    if (hasAdvance) {
      this.onAdvanceRequiredChange.emit(true);
    }
  }

  getValue(): any {
    return this.advanceRequiredForm ? this.advanceRequiredForm.getRawValue() : {};
  }

  isValid(): boolean {
    return this.advanceRequiredForm ? this.advanceRequiredForm.valid : true;
  }

  markAllTouched(): void {
    if (this.advanceRequiredForm) this.advanceRequiredForm.markAllAsTouched();
  }

  createAdvanceItem(): FormGroup {
    const group = this.fb.group({
      currency: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      forexRate: [null, [Validators.required, Validators.min(1)]],
      amountInINR: [{ value: 0, disabled: true }]
    });

    group.valueChanges.subscribe(val => {
      this.calculateINR(group);
    });

    return group;
  }

  addAdvanceItem() {
    // Guard: Prevent manual add in ReadOnly mode
    if (this.isReadOnly && !this.advanceRequiredForm.get('advanceRequired')?.value) return;

    const item = this.createAdvanceItem();

    // Critical: If main form is disabled, new row must be disabled too
    if (this.advanceRequiredForm.disabled) {
      item.disable();
    }

    this.advanceRequiredDetails.push(item);
  }

  removeAdvanceItem(index: number) {
    if (this.isReadOnly) return;
    
    this.advanceRequiredDetails.removeAt(index);
    if (this.advanceRequiredDetails.length === 0) {
      this.advanceRequiredForm.get('advanceRequired')?.setValue(false);
    }
  }

  calculateINR(group: FormGroup) {
    const amount = group.get('amount')?.value;
    const forexRate = group.get('forexRate')?.value;

    if (amount && forexRate) {
      const total = amount * forexRate;
      group.get('amountInINR')?.setValue(total, { emitEvent: false });
    } else {
      group.get('amountInINR')?.setValue(0, { emitEvent: false });
    }
  }

  // --- DUMMY DATA GENERATOR ---
  loadDummyData() {
    // 1. Set Toggle to YES
    this.advanceRequiredForm.patchValue({ advanceRequired: true });

    // Get currency IDs from master data
    const usdId = this.masterDataService.getIdByName('currencyTypes', 'USD') || 2;
    const eurId = this.masterDataService.getIdByName('currencyTypes', 'EUR') || 3;

    // 2. Data to populate (using IDs)
    const dummyRows = [
      { currency: usdId, amount: 500, forexRate: 83.50 },
      { currency: eurId, amount: 200, forexRate: 90.20 }
    ];

    // 3. Clear existing and add rows
    this.advanceRequiredDetails.clear();

    dummyRows.forEach(data => {
      const group = this.createAdvanceItem();
      group.patchValue(data);
      
      // Force calculation of INR since patchValue might not trigger the math immediately
      this.calculateINR(group);

      this.advanceRequiredDetails.push(group);
    });

    // 4. Emit the change so parent component knows to show the 'Advance Given' section
    this.onAdvanceRequiredChange.emit(true);
  }
}