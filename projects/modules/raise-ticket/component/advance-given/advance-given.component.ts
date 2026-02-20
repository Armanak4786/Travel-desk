import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MasterDataService, DropdownOption } from "projects/modules/shared/services/master-data.service";

@Component({
  selector: "app-advance-given",
  templateUrl: "./advance-given.component.html",
  styleUrls: ["./advance-given.component.scss"],
})
export class AdvanceGivenComponent implements OnInit {
  advanceGivenForm: FormGroup;
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = "";
  // Dropdown Options - advanceTypeOptions not in master data, keep hardcoded
  advanceTypeOptions: any[] = [
    { label: "Cash", value: "Cash" },
    { label: "Forex Card", value: "Forex Card" },
    { label: "Online", value: "Online" },
    { label: "Not Applicable", value: "Not Applicable" },
  ];

  currencyOptions: DropdownOption[] = [];

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit(): void {
    // Load master data options
    this.loadMasterDataOptions();
    this.initForm();

    if (this.isReadOnly) {
      this.advanceGivenForm.disable();
    }
  }

  /**
   * Load dropdown options from MasterDataService
   */
  private loadMasterDataOptions(): void {
    this.currencyOptions = this.masterDataService.getCurrencyTypes();
  }

  get isTravelDeskAdmin(): boolean {
    return this.currentRole === "TravelDeskAdmin";
  }

  get isReadOnly(): boolean {
    return this.viewOnly || !this.isTravelDeskAdmin;
  }
  initForm() {
    // this.advanceGivenForm = this.fb.group({
    //   advanceGivenDetails: this.fb.array([])
    // });

    // // Add initial empty row
    // this.addAdvanceItem();
    if (!this.currentRole) {
      this.currentRole = sessionStorage.getItem("userRole") || "Employee";
    }
    this.advanceGivenForm = this.fb.group({
      advanceGiven: [false],
      advanceGivenDetails: this.fb.array([]),
    });

    if (this.advanceGivenForm.enabled) {
      this.addAdvanceItem();
    }
  }

  // Helper to get the FormArray
  get advanceGivenDetails(): FormArray {
    return this.advanceGivenForm.get("advanceGivenDetails") as FormArray;
  }

  // Create a single row (Group)
  createAdvanceItem(): FormGroup {
    const group = this.fb.group({
      advanceDate: [new Date(), Validators.required], // Added Date Field
      advanceType: [null, Validators.required],
      currency: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      forexRate: [null, [Validators.required, Validators.min(1)]],
      amountInINR: [{ value: 0, disabled: true }],
    });

    // Listen to changes on this specific row to calculate INR automatically
    group.valueChanges.subscribe((val) => {
      this.calculateINR(group);
    });

    return group;
  }

  addAdvanceItem() {
    console.log(this.isReadOnly,this.isTravelDeskAdmin)
    if (!this.isTravelDeskAdmin)return;
        const item = this.createAdvanceItem();

    // Critical: If main form is disabled, new row must be disabled too
    if (this.advanceGivenForm.disabled) {
      item.disable();
    }
    this.advanceGivenDetails.push(item);
  }

  removeAdvanceItem(index: number) {
        if (this.isReadOnly) return;
    this.advanceGivenDetails.removeAt(index);
  }

  // Simple calculation logic
  calculateINR(group: FormGroup) {
    const currency = group.get("currency")?.value;
    const amount = group.get("amount")?.value;
    const forexRate = group.get("forexRate")?.value;

    if (currency && amount && forexRate) {
      const total = amount * forexRate;
      // Patch the value without emitting event to avoid infinite loops
      group.get("amountInINR")?.setValue(total, { emitEvent: false });
    } else {
      group.get("amountInINR")?.setValue(0, { emitEvent: false });
    }
  }
}
