import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "./layout/components/layout/app.layout.component";
import { AuthGuard } from "auro-ui";
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
        path: "travel-details",
        loadChildren: () =>
          import("./modules/travel-details/travel-details.module").then(
            (m) => m.TravelDetailsModule
          ),
      },
      {
        path: "reimbursement-details",
        loadChildren: () =>
          import("./modules/travel-details/travel-details.module").then(
            (m) => m.TravelDetailsModule
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

  /* { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
