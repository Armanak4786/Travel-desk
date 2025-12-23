import {
  Component,
  EventEmitter,
  OnInit,
  Output,Input,
  ViewChild,
} from "@angular/core";
import { BaseFormComponent, GenericFormConfig, Mode } from "auro-ui";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-reimbursement-details-card",
  templateUrl: "./reimbursement-details-card.component.html",
  styleUrl: "./reimbursement-details-card.component.scss",
})

export class ReimbursementDetailsCardComponent implements OnInit {
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  formMode: Mode = Mode.create;
  formData: {
  band: 10,
  grade: "SSE",
  cityVisited: "Pune",
  projectName: "XYZ",
  projectPin: "411001",
  fromDate: "02/01/2025",
  toDate: "05/01/2025",
};

  formConfig: GenericFormConfig = {
    api: "",
    cardType: "non-border",
    autoResponsive: true,
    sections: [
      {
        sectionName: "reimbursementDetailsCard",
        cols: 12,
        headerTitle: "Reimbursement Details",
        headerClass: "text-xs col-12 font-semibold text-primary",
        sectionClass:" mb-3 w-full text-xs mt-3 shadow-2 p-4 pb-0 bg-white border-round",
      },
    ],
    fields: [
      {
        type: "number",
        name: "band",
        inputType: "vertical",
        className: "col-2 no-underline band-text-left",
        label: "Band",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
      {
        type: "text",
        name: "grade",
        inputType: "vertical",
        className: "col-2 no-underline ml-8",
        label: "Grade",
        labelClass: "text-xs",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
      {
        type: "text",
        name: "cityVisited",
        inputType: "vertical",
        className: "col-2 no-underline ml-8",
        label: "City Visited",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
      {
        type: "text",
        name: "projectName",
        inputType: "vertical",
        className: "col-2 no-underline ml-8",
        label: "Project Name",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
      {
        type: "text",
        name: "projectPin",
        inputType: "vertical",
        className: "col-2 no-underline",
        label: "Project PIN",
        labelClass: "color-secondary",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
      {
        type: "text",
        name: "fromDate",
        inputType: "vertical",
        className: "col-2 no-underline ml-8",
        label: "From Date",
        labelClass: "color-secondary",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
      {
        type: "text",
        name: "toDate",
        inputType: "vertical",
        className: "col-2 no-underline ml-8",
        label: "To Date",
        labelClass: "color-secondary",
        sectionName: "reimbursementDetailsCard",
        disabled: true,
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  setTimeout(() => {
    this.baseForm.form.patchValue({
      band: 10,
      grade: "A1",
      cityVisited: "Mumbai",
      projectName: "Internal Portal",
      projectPin: "400001",
      fromDate: "01/01/2025",
      toDate: "05/01/2025"
    });
  });
}

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
  handleValueChanges(ev: any) {
    this.valueChanges.emit(ev);
  }
  handleButtonEvent(ev: any) {
    this.formButtonEvent.emit(ev);
  }
}
