import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-travel-amount',
  templateUrl: './travel-amount.component.html',
  styleUrls: ['./travel-amount.component.scss']
})
export class TravelAmountComponent implements OnInit {
  advanceForm: FormGroup;
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  // Dropdown Options
  advanceTypeOptions: any[] = [
    { label: "Cash", value: "Cash" },
    { label: "Forex Card", value: "Forex Card" },
    { label: "Online", value: "Online" },
    { label: "Not Applicable", value: "Not Applicable" },

  ];

  currencyOptions: any[] = [
    { label: "EUR", value: "EUR" },
    { label: "USD", value: "USD" },
    { label: "SGD", value: "SGD" },
    { label: "INR", value: "INR" },
    { label: "GBP", value: "GBP" }
  ];

  // Dummy exchange rates for demo calculation
  exchangeRates: { [key: string]: number } = {
    'EUR': 90.50,
    'USD': 83.00,
    'GBP': 105.00,
    'SGD': 62.00,
    'INR': 1
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.advanceForm = this.fb.group({
      advanceDetails: this.fb.array([])
    });

    // Add initial empty row
    this.addAdvanceItem();
  }

  // Helper to get the FormArray
  get advanceDetails(): FormArray {
    return this.advanceForm.get('advanceDetails') as FormArray;
  }

  // Create a single row (Group)
  createAdvanceItem(): FormGroup {
const group = this.fb.group({
      advanceDate: [new Date(), Validators.required], // Added Date Field
      advanceType: [null, Validators.required],
      currency: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      amountInINR: [{ value: 0, disabled: true }]
    });

    // Listen to changes on this specific row to calculate INR automatically
    group.valueChanges.subscribe(val => {
      this.calculateINR(group);
    });

    return group;
  }

  addAdvanceItem() {
    this.advanceDetails.push(this.createAdvanceItem());
  }

  removeAdvanceItem(index: number) {
    this.advanceDetails.removeAt(index);
  }

  // Simple calculation logic
  calculateINR(group: FormGroup) {
    const currency = group.get('currency')?.value;
    const amount = group.get('amount')?.value;

    if (currency && amount && this.exchangeRates[currency]) {
      const rate = this.exchangeRates[currency];
      const total = amount * rate;
      // Patch the value without emitting event to avoid infinite loops
      group.get('amountInINR')?.setValue(total, { emitEvent: false });
    } else {
      group.get('amountInINR')?.setValue(0, { emitEvent: false });
    }
  }
}