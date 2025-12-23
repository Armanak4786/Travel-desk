import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-travel-and-hospitility-expenses',
  templateUrl: './travel-and-hospitility-expenses.component.html',
  styleUrl: './travel-and-hospitility-expenses.component.scss'
})
export class TravelAndHospitilityExpensesComponent implements OnInit {
  
  // Use Setter pattern to ensure we can patch values safely if needed
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;

  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();
  
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  
  formMode: Mode = Mode.create;
  formData: any = { };

  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "travelHospitalitySection",
          cols: 12,
          headerTitle: "Travel & Hospitality Expenses (in INR)",
          headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: " mb-3 w-full text-xs shadow-2 p-4 pb-0 border-round bg-white",
        },
    ],
    fields:[
      {
        type: "amount",
        name: "approxTravelCost",
        inputType: "vertical",
        label: "Approx. Travel Cost",
        labelClass: "text-xs",
        // Default: specific class 'no-underline' hides borders
        className: "col-2 input-text-left no-underline", 
        sectionName: "travelHospitalitySection",
        disabled: true // Default: Disabled
      },
      {
        type: "amount",
        name: "approxAccommodationCost",
        inputType: "vertical",
        label: "Approx. Accommodation Cost",
        labelClass: "text-xs",
        className: "col-2 input-text-left ml-4 no-underline",
        sectionName: "travelHospitalitySection",
        disabled: true // Default: Disabled
      },
      {
        type: "amount",
        name: "totalCost",
        inputType: "vertical",
        label: "Total Cost",
        inputClass:"text-900",
        labelClass: "text-xs",
        className: "col-2 input-text-left ml-4 font-bold no-underline",
        sectionName: "travelHospitalitySection",
        disabled: true // Default: Always Disabled
      },
    ]
  };

  constructor() {}

  ngOnInit(): void {
    const isEditableAdmin = this.currentRole === 'TravelDeskAdmin'

    if (isEditableAdmin) {
      this.formConfig.fields.forEach((field: any) => {
        
        if (field.name === 'approxTravelCost' || field.name === 'approxAccommodationCost') {
            
            field.disabled = false; 
            if (field.className) {
                field.className = field.className.replace('no-underline', '').trim();
            }
        }
      });
    }
  }

  getValue(): any {
    return this.baseForm ? this.baseForm.form.getRawValue() : this.formData;
  }

  isValid(): boolean {
    return this.baseForm ? this.baseForm.form.valid : true;
  }

  markAllTouched(): void {
    if (this.baseForm) this.baseForm.form.markAllAsTouched();
  }

  handleValueChanges(ev: any) { 
    if (this.currentRole === 'TravelDeskAdmin') {
        this.calculateTotal(ev);
    }
    this.valueChanges.emit(ev); 
  }

  handleButtonEvent(ev: any) { this.formButtonEvent.emit(ev); }

  // Calculation Logic
  calculateTotal(formValue: any) {
    const travelCost = Number(formValue.approxTravelCost) || 0;
    const accomCost = Number(formValue.approxAccommodationCost) || 0;
    const total = travelCost + accomCost;

    if (this.baseForm && this.baseForm.form) {
        const currentTotal = this.baseForm.form.get('totalCost')?.value;
        if (currentTotal !== total) {
            this.baseForm.form.patchValue({ totalCost: total }, { emitEvent: false });
        }
    }
  }
}