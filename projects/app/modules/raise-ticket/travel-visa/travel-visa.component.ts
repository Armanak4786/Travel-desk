import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-travel-visa',
  templateUrl: './travel-visa.component.html'
})
export class TravelVisaComponent implements OnInit {
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();

  formMode: Mode = Mode.create;
  formData: any = { travelType: 'International' };

  visaOptions: any[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "visaSection",
          cols: 12,
          headerTitle: "Visa Details",
          headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: " mb-3 w-full text-xs shadow-2 p-4 pb-0 border-round",
        },
    ],
    fields:[
              {
          type: "select",
          name: "visaRequired",
          label: "Visa Required",
          sectionName: "visaSection",
          labelClass: "text-xs",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          options: this.visaOptions,
          placeholder: "-- Select --",
          validators: [Validators.required],
          className: "col-12 md:col-12 lg:col-3 align-items-center",
        },
        {
          type: "files",
          name: "passportFile",
          label: "Passport",
          sectionName: "visaSection",
          className: "col-12 md:col-4 lg:col-4 mt-3",
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
