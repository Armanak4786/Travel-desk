import { Component, EventEmitter, OnInit, Output, ViewChild,Input } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-request-notes',
  templateUrl: './request-notes.component.html',
  styleUrl: './request-notes.component.scss'
})
export class RequestNotesComponent implements OnInit {
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
    @Input() viewOnly: boolean = false;
    @Input() currentRole: string = '';
  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();

  formMode: Mode = Mode.create;
  formData: any = { };

  get effectiveMode(): Mode {
    return this.viewOnly ? Mode.view : this.formMode;
  }

  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "requestNotesSection",
          cols: 12,
          headerTitle: "Notes",
          headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: "mt-3 w-full text-xs shadow-2 p-4 pb-0 border-round bg-white",
        },
    ],
    fields:[
      {
        type: "textArea",
        name: "requestNotes",
        inputType: "vertical",
        placeholder:"Write Here",
        rows:4,
        className: "col-12",
        sectionName: "requestNotesSection",
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {}

  patchFromApi(data: any): void {
    if (!data) return;
    const patchData = {
      requestNotes: data.descriptionNote || '',
    };
    if (this.baseForm?.form) {
      this.baseForm.form.patchValue(patchData);
    } else {
      this.formData = { ...this.formData, ...patchData };
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

  // pass-through handlers
  handleValueChanges(ev: any) { this.valueChanges.emit(ev); }
  handleButtonEvent(ev: any) { this.formButtonEvent.emit(ev); }


}
