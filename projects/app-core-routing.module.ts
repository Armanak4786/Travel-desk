import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "./layout/components/layout/app.layout.component";
import { AuthGuard } from "auro-ui";
import { ViewRequestComponent } from './modules/view-request/view-request.component';
const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./modules/welcome/welcome.module").then(
            (m) => m.WelcomeModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        data: { breadcrumb: "Dashboard" },
        canActivate: [AuthGuard],
      },
      {
        path: "raise-ticket",
        loadChildren: () =>
          import("./modules/raise-ticket/raise-ticket.module").then(
            (m) => m.RaiseTicketModule
          ),
      },
      {
        path: "view-request",
        loadChildren: () =>
          import("./modules/view-request/view-request.module").then(
            (m) => m.ViewRequestModule
          ),
      },
      {
        path: "reimbursement-details",
        loadChildren: () =>
          import("./modules/reimbursement-details/reimbursement-details.module").then(
            (m) => m.ReimbursementDetailsModule
          ),
      },
    ],
  },
  {
    path: "unauthorized",
    loadChildren: () =>
      import("./modules/auth/access/access.module").then((m) => m.AccessModule),
  },
  {
    path: "authentication",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    // canActivate: [AuthGuard],
  },
  { path: 'view-request', loadChildren: () => import('./modules/view-request/view-request.module').then(m => m.ViewRequestModule) },

  /* { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
