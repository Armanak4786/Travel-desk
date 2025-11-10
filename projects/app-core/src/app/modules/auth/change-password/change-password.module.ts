import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { AuroUiFrameWork } from 'auro-ui';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    AuroUiFrameWork,
    ChangePasswordRoutingModule,
  ],
  declarations: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
