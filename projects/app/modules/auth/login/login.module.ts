import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginRoutingModule } from "./login-routing.module";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { AuroUiFrameWork } from "auro-ui";
import { AttemptExceedComponent } from "../attempt-exceed/attempt-exceed.component";
import { LandingComponent } from "./components/landing/landing.component";
import { RootLoginComponent } from "./components/root-login/root-login.component";
import { LoginComponent } from "./components/login/login.component";
import { AppFooterComponent } from "projects/app/layout/components/footer/app.footer.component";
import { AppTopBarComponent } from "projects/app/layout/components/topbar/app.topbar.component";
import { LanguageSwitcherComponent } from "projects/app/layout/components/language-switcher/language-switcher.component";


@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    AuroUiFrameWork,
    // AppTopBarComponent
  ],
  declarations: [
    RootLoginComponent,
    LoginComponent,
    LandingComponent,
    AttemptExceedComponent,
  ],
  exports: [RootLoginComponent, LandingComponent],
})
export class LoginModule {}
