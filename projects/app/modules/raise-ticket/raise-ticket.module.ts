import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaiseTicketRoutingModule } from './raise-ticket-routing.module';
import { RaiseTicketComponent } from './raise-ticket.component';


@NgModule({
  declarations: [
    RaiseTicketComponent
  ],
  imports: [
    CommonModule,
    RaiseTicketRoutingModule
  ]
})
export class RaiseTicketModule { }
