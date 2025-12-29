import { Component, OnInit, ViewChild, Input,ElementRef, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  BaseFormComponent,
  GenericFormConfig,
  Mode,
    CommonService,
} from "auro-ui";

@Component({
  selector: 'app-reimbursement-details',
  templateUrl: './reimbursement-details.component.html',
  styleUrls: ['./reimbursement-details.component.scss']
})
export class ReimbursementDetailsComponent implements OnInit{
    onFormValueChange($event: any) {
    // handle form value change if needed
    return;
  }

    constructor(public svc: CommonService, private el: ElementRef,    private route: ActivatedRoute,) {
      this.svc = svc;
    }
      requestId: string = '';
@Input() viewOnly: boolean = false;
@Input() currentRole: string = '';
@Input() hideLayout: boolean = false;
  expenseTotal: number = 0;
  peridiumTotal: number = 0;
  advanceAmount: number = 2000;
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  formConfig: GenericFormConfig;
  formMode: Mode = Mode.create;
    userInfo = {
    name: "Pradeep Sharma",
    employeeId: "AP8978870",
    department: "Banking",
    grade: "10",
    designation: "Sr. Associate Manager",
  };
  ngOnInit(): void {
    // If it's a standalone page, get ID from URL to show in breadcrumb
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.requestId = params['id'];
      }
  })}

   onCancel(): void {
    this.svc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Cancel this ticket ",
      () => {
        this.svc.router.navigateByUrl("/dashboard");
      }
    );
    this.baseForm.form.reset({
      travelType: "International",
    });
  }

  onSave(): void {
    const formData = this.baseForm.value;
  }

  onSubmit(): void {
    if (this.baseForm.form.valid) {
      const formData = this.baseForm.value;
    } else {
      this.baseForm.form.markAllAsTouched();
    }
  }

  get balanceAmount(): number {
    // Sum of Expenses + Peridium
    const totalClaims = this.expenseTotal + this.peridiumTotal;
    
    // Subtract Advance to find what is Payable/Receivable
    return totalClaims - this.advanceAmount;
  }
  // Handlers for the events
  onExpenseTotalChange(amount: number) {
    this.expenseTotal = amount;
  }

  onPeridiumTotalChange(amount: number) {
    this.peridiumTotal = amount;
  }
}
