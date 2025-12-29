import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-travel-type',
  templateUrl: './travel-type.component.html'
})
export class TravelTypeComponent implements OnInit {

  // 1. USE SETTER TO HANDLE FORM READY STATE
  @ViewChild(BaseFormComponent)
  set baseForm(component: BaseFormComponent) {
    if (component && component.form) {
      
      // LOGIC: If ViewOnly OR Not Employee (Admin)
      if (this.viewOnly || (this.currentRole && this.currentRole !== 'Employee')) {
        
        // A. Disable the form
        setTimeout(() => {
          component.form.disable();
          this.formMode = Mode.view; // Switch UI mode if supported
          
          // B. Patch Data ONLY if Admin (Not Employee)
          if (this.currentRole !== 'Employee') {
            this.patchAdminData(component);
          }
        });
      }
    }
  }

  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();
  
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  
  formMode: Mode = Mode.create;
  formData: any = { travelType: 'International' }; // Default for new requests

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
          sectionClass: " mb-3 w-full text-xs shadow-2 p-4 mt-0 pb-0 border-round bg-white",
        },
    ],
    fields: [] 
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('userRole') || 'Employee';

    // 2. DEFINE FIELDS (Move here to handle hiding dynamically)
    this.formConfig.fields = [
        {
          type: "radio",
          name: "travelType",
          label: "Travel Type",
          sectionName: "travelTypeRadio",
          options: this.travelTypeOptions,
          validators: [Validators.required],
          className: "col-10",
          labelClass: "text-xs",
        },
        {
          type: "button",
          name: "reimbursementBtn",
          label: "Reimbursement",
          sectionName: "travelTypeRadio",
          className:"flex justify-content-end w-10rem align-items-center p-2",
          btnType:"bg-btn",
          icon:'pi pi-upload',
          submitType:'internal',
          // 3. HIDE BUTTON FOR ADMINS
          hidden: (this.currentRole !== 'Employee' || this.viewOnly) 
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
          className: "col-2 w-16rem align-items-center pb-4",
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
          className: "col-2",
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
          className: "col-2 align-items-center ",
        },
        {
          type: "date",
          name: "travelDate",
          label: "Travel Date",
          inputType: "vertical",
          sectionName: "travelTypeSection",
          validators: [Validators.required],
          inputClass: "gen-input underline-calendar pt-3",
          labelClass:"pl-1",
          className: "col-2 align-items-center",
        },
        {
          type: "date",
          name: "returnDate",
          label: "Return Date",
          inputType: "vertical",
          sectionName: "travelTypeSection",
          validators: [Validators.required],
          inputClass: "gen-input underline-calendar pt-3",
          labelClass:"pl-1",
          className: "col-2 align-items-center",
        },
    ];
  }

  // 4. HELPER TO PATCH DUMMY DATA
  patchAdminData(component: BaseFormComponent) {
    const dummyData = {
      travelType: 'International',
      expenseType: 'reimbursableByClient',
      purposeOfTravel: 'projectRelated',
      clientProjectName: 'Aurionpro Solutions',
      travelDate: new Date(), // Today
      returnDate_: new Date(new Date().setDate(new Date().getDate() + 5)) // 5 days later
    };

    component.form.patchValue(dummyData);
  }

  // Parent helpers (Keep as is)
  getValue(): any {
    // We use a getter for baseForm now, but if you need to access the 'component' instance 
    // stored from the setter, you might need to save it to a private variable property.
    // However, usually the view query works alongside the setter.
    // simpler: just return the internal variable if needed, or rely on event emitters.
    return this.formData; 
  }

  isValid(): boolean {
    return true; // Always valid in view mode
  }

  markAllTouched(): void {
    // View only doesn't need touch
  }

  handleValueChanges(ev: any) { this.valueChanges.emit(ev); }
  
  handleButtonEvent(event: any) { 
    if (event.field.name === "reimbursementBtn"){
      this.router.navigate(["/reimbursement-details"]);
    }
  }
}