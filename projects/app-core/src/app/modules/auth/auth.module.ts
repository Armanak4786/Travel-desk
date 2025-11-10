import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginModule } from './login/login.module';
import { AuroUiFrameWork } from 'auro-ui';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
@NgModule({
  declarations: [TermsConditionsComponent],
  imports: [CommonModule, AuthRoutingModule, LoginModule, AuroUiFrameWork],
  exports: [TermsConditionsComponent],
})
export class AuthModule {}
