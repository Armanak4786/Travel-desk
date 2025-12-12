import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RaiseTicketRoutingModule } from "./raise-ticket-routing.module";
import { RaiseTicketComponent } from "./raise-ticket.component";
import { AuroUiFrameWork } from "auro-ui";
import { TagModule } from "primeng/tag";
import { TravelAmountComponent } from "./component/travel-amount/travel-amount.component";
import { TravelDetailsComponent } from "./component/travel-details/travel-details.component";
import { TravelTypeComponent } from "./component/travel-type/travel-type.component";
import { TravelVisaComponent } from "./component/travel-visa/travel-visa.component";

@NgModule({
  declarations: [
    RaiseTicketComponent,
    TravelTypeComponent,
    TravelDetailsComponent,
    TravelAmountComponent,
    TravelVisaComponent,
  ],
  imports: [
    CommonModule,
    RaiseTicketRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AuroUiFrameWork,
    TagModule,
  ],
})
export class RaiseTicketModule {}
