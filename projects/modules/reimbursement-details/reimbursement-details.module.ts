import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuroUiFrameWork } from 'auro-ui';


import { ReimbursementDetailsRoutingModule } from './reimbursement-details-routing.module';
import { ReimbursementDetailsComponent } from './reimbursement-details.component';
import { ReimbursementDetailsCardComponent } from './component/reimbursement-details-card/reimbursement-details-card.component';
import { ExpenseDetailsComponent } from './component/expense-details/expense-details.component';
import { PeridiumComponent } from './component/peridium/peridium.component';
import { UserInfoCardComponent } from '../raise-ticket/component/user-info-card/user-info-card.component';
import { RaiseTicketModule } from '../raise-ticket/raise-ticket.module';


@NgModule({
  declarations: [ReimbursementDetailsComponent,
    ReimbursementDetailsCardComponent,
    ExpenseDetailsComponent,
    PeridiumComponent,
  ],
  imports: [
    ReimbursementDetailsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuroUiFrameWork,
    RaiseTicketModule
  ],
  exports:[
    ReimbursementDetailsComponent
  ]
})
export class ReimbursementDetailsModule { }
