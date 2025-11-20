import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-travel-type',
  templateUrl: './travel-type.component.html'
})
export class TravelTypeComponent implements OnInit {
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();

  formMode: Mode = Mode.create;
  formData: any = { travelType: 'International' };

    travelTypeOptions: any[] = [
    { label: "Domestic", value: "Domestic" },
    { label: "International", value: "International" },
  ];

  expenseTypeOptions: any[] = [
    { label: "Reimbursable by Client", value: "reimbursableByClient" },
    { label: "Non Reimbursable", value: "nonReimbursable" },
  ];

  purposeOptions: any[] = [
    { label: "Client Meeting", value: "clientMeeting" },
    { label: "Seminar", value: "seminar" },
    { label: "Internal Meeting", value: "internalMeeting" },
    { label: "Project Related", value: "projectRelated" },
    { label: "New Buisness", value: "newBuisness" },
  ];
  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "travelTypeRadio",
          cols: 12,
          sectionClass: "w-full text-xs mb-0 pb-0",
        },
        {
          sectionName: "travelTypeSection",
          headerTitle: "Travel Type",
          cols: 12,
          headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: " mb-3 w-full text-xs shadow-2 p-4 pb-0 border-round",
        },
    ],
    fields: [
    {
          type: "radio",
          name: "travelType",
          label: "Travel Type",
          sectionName: "travelTypeRadio",
          options: this.travelTypeOptions,
          validators: [Validators.required],
          className: "col-12",
          labelClass: "text-xs",
        },

        {
          type: "select",
          name: "expenseType",
          label: "Expense Type",
          labelClass: "text-xs",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          sectionName: "travelTypeSection",
          options: this.expenseTypeOptions,
          placeholder: "-- Select --",
          validators: [Validators.required],
          className: "col-12 md:col-6 lg:col-2 align-items-center pb-4",
        },
        {
          type: "select",
          name: "purposeOfTravel",
          label: "Purpose of Travel",
          alignmentType: "vertical",
          labelClass: "text-xs",
          inputClass: "gen-select",
          sectionName: "travelTypeSection",
          options: this.purposeOptions,
          placeholder: "-- Select --",
          validators: [Validators.required],
          className: "col-12 md:col-6 lg:col-2",
        },
        {
          type: "text",
          name: "clientProjectName",
          label: "Name of Client / Project",
          sectionName: "travelTypeSection",
          placeholder: "Enter name",
          inputType: "vertical",
          validators: [Validators.required],
          labelClass: "text-xs pt-2",
          inputClass: "gen-input pt-2",
          className: "col-12 md:col-12 lg:col-2 align-items-center ",
        },
        {
          type: "date",
          name: "travelDate",
          label: "Travel Date",
          inputType: "vertical",
          sectionName: "travelTypeSection",
          validators: [Validators.required],
          inputClass: "gen-input underline-calendar pt-3",
          className: "col-12 md:col-6 lg:col-2 align-items-center",
        },
        {
          type: "date",
          name: "returnDate_",
          label: "Return Date",
          inputType: "vertical",
          sectionName: "travelTypeSection",
          validators: [Validators.required],
          inputClass: "gen-input underline-calendar pt-3",
          className: "col-12 md:col-6 lg:col-2 align-items-center",
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
