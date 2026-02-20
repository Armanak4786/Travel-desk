import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MasterDataService, DropdownOption } from 'projects/modules/shared/services/master-data.service';

@Component({
  selector: 'app-travel-type',
  templateUrl: './travel-type.component.html'
})
export class TravelTypeComponent implements OnInit {

  // 1. USE SETTER TO HANDLE FORM READY STATE
  private _baseForm: BaseFormComponent | null = null;

  @ViewChild(BaseFormComponent)
  set baseForm(component: BaseFormComponent) {
    this._baseForm = component;
    if (component && component.form) {
      if (this.viewOnly || (this.currentRole && this.currentRole !== 'Employee')) {
        setTimeout(() => {
          component.form.disable();
          this.formMode = Mode.view;
          // Skip dummy data in view mode - will be patched from API
          if (!this.viewOnly && this.currentRole !== 'Employee') {
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
  formData: any = { travelType: 2 }; // Default for new requests (International = 2)

  travelTypeOptions: DropdownOption[] = [];
  expenseTypeOptions: DropdownOption[] = [];
  purposeOptions: DropdownOption[] = [];

  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "travelTypeRadio",
          headerTitle: "Travel Type",
          headerClass: "text-xs col-12 font-semibold text-primary",
          cols: 12,
          sectionClass: "w-full text-xs mb-0 pb-0 p-4 mt-2 shadow-2 border-round bg-white",
        },
        {
          sectionName: "travelTypeSection",
          headerTitle: "Project/Client Details",
          cols: 12,
          headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: " mb-3 w-full text-xs shadow-2 p-4 mt-0 pb-0 border-round justify-content-between bg-white",
        },
    ],
    fields: [] 
  };

  constructor(
    private router: Router,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('userRole') || 'Employee';

    // Load master data options
    this.loadMasterDataOptions();

    // 2. DEFINE FIELDS (Move here to handle hiding dynamically)
    this.formConfig.fields = [
        {
          type: "radio",
          name: "travelType",
          // label: "Travel Type",
          sectionName: "travelTypeRadio",
          options: this.travelTypeOptions,
          // validators: [Validators.required],
          className: "col-10",
          labelClass: "text-xs",
        },
        // {
        //   type: "button",
        //   name: "reimbursementBtn",
        //   label: "Reimbursement",
        //   sectionName: "travelTypeRadio",
        //   className:"flex justify-content-end w-10rem align-items-center p-2",
        //   btnType:"bg-btn",
        //   icon:'pi pi-upload',
        //   submitType:'internal',
        //   // 3. HIDE BUTTON FOR ADMINS
        //   hidden: (this.currentRole !== 'Employee' || this.viewOnly) 
        // },
        {
          type: "select",
          name: "expenseType",
          label: "Expense Type",
          labelClass: "text-xs",
          alignmentType: "vertical",
          sectionName: "travelTypeSection",
          options: this.expenseTypeOptions,
          placeholder: "-- Select --",
           // validators: [Validators.required],
          className: "col-3 w-16rem align-items-center pb-4 pl-2",
        },
        {
          type: "select",
          name: "purposeOfTravel",
          label: "Purpose of Travel",
          alignmentType: "vertical",
          labelClass: "text-xs label-pl-0",
          sectionName: "travelTypeSection",
          options: this.purposeOptions,
          placeholder: "-- Select --",
          // validators: [Validators.required],
          className: "col-3",
        },
        {
          type: "text",
          name: "clientProjectName",
          label: "Name of Client / Project",
          sectionName: "travelTypeSection",
          placeholder: "Enter name",
          inputType: "vertical",
          // validators: [Validators.required],
          labelClass: "text-xs pt-2",
          inputClass: "pt-2 pl-2",
          className: "col-3 align-items-center ",
        },
        {
          type: "text",
          name: "projectPin",
          label: "Project Pin",
          sectionName: "travelTypeSection",
          inputType: "vertical",
          // validators: [Validators.required],
          labelClass: "text-xs pt-2",
          inputClass: "pt-2 pl-2",
          className: "col-3 w-16rem align-items-center ",
        },
        // {
        //   type: "date",
        //   name: "travelDate",
        //   label: "Travel Date",
        //   inputType: "vertical",
        //   sectionName: "travelTypeSection",
        //   // validators: [Validators.required],
        //   inputClass: "pt-3",
        //   className: "col-2 w-10rem align-items-center",
        // },
        // {
        //   type: "date",
        //   name: "returnDate",
        //   label: "Return Date",
        //   inputType: "vertical",
        //   sectionName: "travelTypeSection",
        //   // validators: [Validators.required],
        //   inputClass: "pt-3",
        //   className: "col-2 w-10rem align-items-center",
        // },
    ];
  }

  // 4. HELPER TO PATCH DUMMY DATA
  patchAdminData(component: BaseFormComponent) {
    // Use IDs from master data
    const internationalId = this.masterDataService.getIdByName('travelTypes', 'International') || 2;
    const reimbursableId = this.masterDataService.getIdByName('expenseTypes', 'Reimbursable by Client') || 1;
    const projectRelatedId = this.masterDataService.getIdByName('purposeOfTravels', 'Project Related') || 2;

    const dummyData = {
      travelType: internationalId,
      expenseType: reimbursableId,
      purposeOfTravel: projectRelatedId,
      clientProjectName: 'Aurionpro Solutions',
      projectPin: "123456",
      travelDate: new Date(), // Today
      returnDate: new Date(new Date().setDate(new Date().getDate() + 5)) // 5 days later
    };

    component.form.patchValue(dummyData);
  }

  patchFromApi(data: any): void {
    if (!data) return;
    const patchData = {
      travelType: data.travelTypeId,
      expenseType: data.expenseTypeId,
      purposeOfTravel: data.purposeOfTravelId,
      clientProjectName: data.nameOfClientOrProject,
      projectPin: data.projectPin,
    };
    if (this._baseForm?.form) {
      this._baseForm.form.patchValue(patchData);
    } else {
      this.formData = { ...this.formData, ...patchData };
    }
  }

  getValue(): any {
    return this._baseForm?.form?.getRawValue() ?? this.formData;
  }

  isValid(): boolean {
    return this._baseForm?.form?.valid ?? true;
  }

  markAllTouched(): void {
    if (this._baseForm?.form) this._baseForm.form.markAllAsTouched();
  }

  handleValueChanges(ev: any) { this.valueChanges.emit(ev); }
  
  handleButtonEvent(event: any) { 
    if (event.field.name === "reimbursementBtn"){
      this.router.navigate(["/reimbursement-details"]);
    }
  }

  /**
   * Load dropdown options from MasterDataService
   */
  private loadMasterDataOptions(): void {
    this.travelTypeOptions = this.masterDataService.getTravelTypes();
    this.expenseTypeOptions = this.masterDataService.getExpenseTypes();
    this.purposeOptions = this.masterDataService.getPurposeOfTravels();

    // Set default travel type to International (id: 2) if options are available
    if (this.travelTypeOptions.length > 0) {
      const internationalOption = this.travelTypeOptions.find(opt => opt.label === 'International');
      this.formData.travelType = internationalOption?.value || this.travelTypeOptions[0].value;
    }
  }
}