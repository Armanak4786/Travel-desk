import { Component } from "@angular/core";

import { LayoutService } from "projects/app-core/src/app/layout/service/app.layout.service";

@Component({
  selector: "app-root-login",
  templateUrl: "./root-login.component.html",
  styleUrls: ["./root-login.component.scss"],
})
export class RootLoginComponent {
  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {}

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
}
