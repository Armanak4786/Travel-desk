import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AuroUiFrameWork } from "auro-ui";
import { PaginatorModule } from "primeng/paginator";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AuroUiFrameWork,
    PaginatorModule,
    FormsModule,
  ],
})
export class DashboardModule {}
