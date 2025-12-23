import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRequestRoutingModule } from './view-request-routing.module';
import { ViewRequestComponent } from './view-request.component';
import { AuroUiFrameWork } from 'auro-ui';
import { RaiseTicketComponent } from '../raise-ticket/raise-ticket.component';
import { RaiseTicketModule } from '../raise-ticket/raise-ticket.module';
import { ReimbursementDetailsModule } from '../reimbursement-details/reimbursement-details.module';


@NgModule({
  declarations: [
    ViewRequestComponent,
  ],
  imports: [
    CommonModule,
    ViewRequestRoutingModule,
    AuroUiFrameWork,
    RaiseTicketModule,
    ReimbursementDetailsModule
  ]
})
export class ViewRequestModule { }
