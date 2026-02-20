import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RaiseTicketRoutingModule } from "./raise-ticket-routing.module";
import { RaiseTicketComponent } from "./raise-ticket.component";
import { AuroUiFrameWork } from "auro-ui";
import { TagModule } from "primeng/tag";
import { AdvanceGivenComponent} from "./component/advance-given/advance-given.component";
import { TravelDetailsComponent } from "./component/travel-details/travel-details.component";
import { TravelTypeComponent } from "./component/travel-type/travel-type.component";
import { TravelVisaComponent } from "./component/travel-visa/travel-visa.component";
import { TravelAndHospitilityExpensesComponent } from './component/travel-and-hospitility-expenses/travel-and-hospitility-expenses.component';
import { RequestNotesComponent } from './component/request-notes/request-notes.component';
import { UserInfoCardComponent } from "./component/user-info-card/user-info-card.component";
import { ApproverDetailsComponent } from "./component/approver-details/approver-details.component";
import { AdvanceRequiredComponent } from "./component/advance-required/advance-required.component";

@NgModule({
  declarations: [
    RaiseTicketComponent,
    TravelTypeComponent,
    TravelDetailsComponent,
    AdvanceGivenComponent,
    TravelVisaComponent,
    TravelAndHospitilityExpensesComponent,
    RequestNotesComponent,
    UserInfoCardComponent,
    ApproverDetailsComponent,    
    AdvanceRequiredComponent
  ],
  imports: [
    CommonModule,
    RaiseTicketRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AuroUiFrameWork,
    TagModule,
],
  exports: [
    RaiseTicketComponent,
    UserInfoCardComponent
  ]
})
export class RaiseTicketModule {}
