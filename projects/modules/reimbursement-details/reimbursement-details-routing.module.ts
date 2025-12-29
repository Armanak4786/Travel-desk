import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReimbursementDetailsComponent } from './reimbursement-details.component';

const routes: Routes = [
  {
    path: '',
    component: ReimbursementDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReimbursementDetailsRoutingModule {}
