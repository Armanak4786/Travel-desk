import { Component } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { CloseDialogData, CommonService } from "auro-ui";
import { AssigneeDiscloserComponent } from "../assignee-discloser/assignee-discloser.component";

@Component({
  selector: "app-assign-salesperson",
  templateUrl: "./assign-salesperson.component.html",
  styleUrl: "./assign-salesperson.component.scss",
})
export class AssignSalespersonComponent {
  closePopup() {
    this.commonSvc.dialogSvc.ngOnDestroy();
  }

  constructor(
    private service: DashboardService,
    public commonSvc: CommonService
  ) {}

  changeAssignee() {
    this.commonSvc.dialogSvc.ngOnDestroy();
    this.commonSvc.dialogSvc
      .show(AssigneeDiscloserComponent, "", {
        templates: {
          footer: null,
        },
        width: "40vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
  }

  selectedSalesPerson: any;

  selectedOriginatorNumber: any;
  selectedOriginatorName: any;

  listData: any = [
    { name: "Quote", code: "Quote" },
    { name: "AFV Loan", code: "AFVLoan" },
    { name: "Application", code: "Application" },
    { name: "Activated Contract List", code: "ActivatedContracts" },
  ];
}
