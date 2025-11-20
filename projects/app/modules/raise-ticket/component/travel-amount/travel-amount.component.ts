import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-travel-amount',
  templateUrl: './travel-amount.component.html'
})
export class TravelAmountComponent implements OnInit {
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();

  formMode: Mode = Mode.create;
  formData: any = { travelType: 'International' };

  advanceOptions: any[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  currencyOptions: any[] = [
    { label: "INR", value: "INR", flag: "assets/images/flags/ind_flag.png" },
    { label: "SGD", value: "SGD", flag: "assets/images/flags/sg_flag.png" },
    { label: "USD", value: "USD", flag: "assets/images/flags/usa_flag.png" },
    { label: "AED", value: "AED", flag: "assets/images/flags/ae_flag.png" },
    { label: "GBP", value: "GBP", flag: "assets/images/flags/gb_flag.png" },
    { label: "EUR", value: "EUR", flag: "assets/images/flags/eu_flag.png" },
  ];
  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "amountSection",
          cols: 12,
          headerTitle: "Amount / Cash Details",
          headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: " mb-3 w-full text-xs shadow-2 p-4 pb-0 border-round",
        },
    ],
    fields:[
      {
          type: "select",
          name: "advanceRequired",
          label: "Advance Required",
          sectionName: "amountSection",
          labelClass: "text-xs",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          options: this.advanceOptions,
          placeholder: "-- Select --",
          validators: [Validators.required],
          className: "col-12 md:col-12 lg:col-3 align-items-center",
        },
        {
          type: "select",
          name: "currency",
          label: "Currency",
          sectionName: "amountSection",
          labelClass: "text-xs",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          options: this.currencyOptions,
          placeholder: "-- Select --",
          className: "col-12 md:col-12 lg:col-3 align-items-center",
        },
        {
          type: "amount",
          name: "amount",
          label: "Amount",
          labelClass: "text-xs pt-2",
          inputClass: "gen-input pt-2",
          inputType: "vertical",
          sectionName: "amountSection",
          placeholder: "0.00",
          className: "col-12 md:col-12 lg:col-3 align-items-center",
        },
        {
          type: "amount",
          name: "amountInINR",
          label: "Amount in INR",
          sectionName: "amountSection",
          labelClass: "text-xs pt-2",
          inputClass: "gen-input pt-2 no-underline",
          inputType: "vertical",
          placeholder: "₹ 0.00",
          disabled: true,
          className: "col-12 md:col-12 lg:col-2 align-items-center amountINR",
        },
    ]
  };

  constructor() {}

  ngOnInit(): void {}

  // Parent helpers
  getValue(): any {
    return this.baseForm ? this.baseForm.form.getRawValue() : this.formData;
  }

  isValid(): boolean {
    return this.baseForm ? this.baseForm.form.valid : true;
  }

  markAllTouched(): void {
    if (this.baseForm) this.baseForm.form.markAllAsTouched();
  }

  // pass-through handlers
  handleValueChanges(ev: any) { this.valueChanges.emit(ev); }
  handleButtonEvent(ev: any) { this.formButtonEvent.emit(ev); }
}
