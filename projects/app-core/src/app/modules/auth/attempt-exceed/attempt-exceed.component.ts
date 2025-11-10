import { Component, OnInit } from "@angular/core";
import { LayoutService } from "../../../layout/service/app.layout.service";
import { AuthenticationService } from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-attempt-exceed",
  templateUrl: "./attempt-exceed.component.html",
  styleUrl: "./attempt-exceed.component.scss",
})
export class AttemptExceedComponent implements OnInit {
  loginQuote: any = [
    {
      heading: "Financing New Zealanders For 85 Years",
      text: "This is just the first phase for UDC Live. Early next year we'll introduce transactional capability, which will enable you to transact on your UDC Telephone Call Account, set up new UDC Secured Term Investments, reinvest maturing funds and arrange repayment of matured funds. Your UDC Live account is a password protected service so you can be sure your confidential information remains exactly that.",
    },
    {
      heading: "Financing New Zealanders For 85 Years",
      text: "Ever thought that there must be an easier and faster way to manage your UDC investments like you do with your internet banking? Well now you can thanks to UDC Live, our new online system that lets you view your UDC Telephone Call Account and Secured Term Investments – anywhere, anytime",
    },
    {
      heading: "Financing New Zealanders For 85 Years",
      text: "UDC Live gives you up-to-date information on your investments held with us. It allows you to view your account balances and interest rates, update your contact details and download your interest and tax information.",
    },
  ];
  valCheck: string[] = ["remember"];

  password!: string;
  hidePassword: boolean = true;
  attemptExceed: FormGroup;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.attemptExceed = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false, [Validators.requiredTrue]],
    });
  }

  get containerClass() {
    return {
      "layout-theme-light": this.layoutService.config.colorScheme === "light",
      "layout-theme-dark": this.layoutService.config.colorScheme === "dark",
      "layout-overlay": this.layoutService.config.menuMode === "overlay",
      "layout-static": this.layoutService.config.menuMode === "static",
      "layout-static-inactive":
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config.menuMode === "static",
      "layout-overlay-active": this.layoutService.state.overlayMenuActive,
      "layout-mobile-active": this.layoutService.state.staticMenuMobileActive,
      "p-input-filled": this.layoutService.config.inputStyle === "filled",
      "p-ripple-disabled": !this.layoutService.config.ripple,
    };
  }

  redirectToLogin(): void {}
}
