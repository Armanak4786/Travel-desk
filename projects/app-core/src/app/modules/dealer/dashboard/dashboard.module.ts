import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AuroUiFrameWork } from "auro-ui";
import { NotificationComponent } from "./component/notification/notification.component";
import { ApplicationOutcomeComponent } from "./component/application-outcome/application-outcome.component";
import { AverageSalesComponent } from "./component/average-sales/average-sales.component";
import { ExportDataComponent } from "./component/export-data/export-data.component";
import { MonthlyVolumesComponent } from "./component/monthly-volumes/monthly-volumes.component";
import { QuoteListComponent } from "./component/quote-list/quote-list.component";
import { WorkflowStatusComponent } from "./component/workflow-status/workflow-status.component";
import { AssignSalespersonComponent } from "./component/assign-salesperson/assign-salesperson.component";
import { AssigneeDiscloserComponent } from "./component/assignee-discloser/assignee-discloser.component";
import { PaginatorModule } from "primeng/paginator";

@NgModule({
  declarations: [
    DashboardComponent,
    NotificationComponent,
    MonthlyVolumesComponent,
    AverageSalesComponent,
    ApplicationOutcomeComponent,
    WorkflowStatusComponent,
    QuoteListComponent,
    ExportDataComponent,
    AssignSalespersonComponent,
    AssigneeDiscloserComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AuroUiFrameWork,
    PaginatorModule,
  ],
})
export class DashboardModule {}
