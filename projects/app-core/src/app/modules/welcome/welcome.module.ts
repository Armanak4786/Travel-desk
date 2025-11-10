import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { AuroUiFrameWork } from 'auro-ui';

@NgModule({
  imports: [CommonModule, WelcomeRoutingModule, AuroUiFrameWork],
  declarations: [WelcomeComponent],
})
export class WelcomeModule {}
