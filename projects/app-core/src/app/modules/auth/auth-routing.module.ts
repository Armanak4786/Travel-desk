import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RootLoginComponent } from "./login/components/root-login/root-login.component";
import { LandingComponent } from "./login/components/landing/landing.component";
import { TermsConditionsComponent } from "./terms-conditions/terms-conditions.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: RootLoginComponent,
        children: [
          {
            path: "",
            component: LandingComponent,
          },
        ],
        //canActivate: [AuthGuard],
      },
      {
        path: "error",
        loadChildren: () =>
          import("./error/error.module").then((m) => m.ErrorModule),
      },
      {
        path: "access",
        loadChildren: () =>
          import("./access/access.module").then((m) => m.AccessModule),
      },
      {
        path: "login",
        loadChildren: () =>
          import("./login/login.module").then((m) => m.LoginModule),
      },
      {
        path: "change-password",
        loadChildren: () =>
          import("./change-password/change-password.module").then(
            (m) => m.ChangePasswordModule
          ),
      },
      {
        path: "terms-condition",
        component: TermsConditionsComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
