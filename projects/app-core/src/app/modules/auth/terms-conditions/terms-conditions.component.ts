import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService, CommonService } from 'auro-ui';
import { LayoutService } from '../../../layout/service/app.layout.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss',
})
export class TermsConditionsComponent implements OnInit {
  messageType = 'WelcomeMessage';
  apiData: any;
  dealerId = 12;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private svc: CommonService
  ) {}
  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config.colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
      'layout-overlay': this.layoutService.config.menuMode === 'overlay',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config.menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config.inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config.ripple,
    };
  }

  ngOnInit(): void {
    this.getDeclarationData();
  }

  agree() {
    let reqbody = {
      dealerId: 12,
      messageID: 6,
      isActive: 1,
    };
    this.svc.data
      .post(
        `Declaration/save_acceptance_message?DealerId=${reqbody.dealerId}&MessageID=${reqbody.messageID}&quoteId=&IsActive=${reqbody.isActive}`,
        reqbody
      )
      .subscribe((res) => {
        this.apiData = res.data.content;
      });
  }

  getDeclarationData() {
    this.svc.data
      .get(
        `Declaration/get_welcome_messages?MessageType=${this.messageType}&DealerId=${this.dealerId}`
      )
      .subscribe((res) => {
        this.apiData = res.data.content;
      });
  }
}
