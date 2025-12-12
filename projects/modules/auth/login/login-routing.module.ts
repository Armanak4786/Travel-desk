import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RootLoginComponent } from "./components/root-login/root-login.component";
import { LoginComponent } from "./components/login/login.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: RootLoginComponent,
        children: [
          {
            path: "",
            component: LoginComponent,
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
