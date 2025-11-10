import { Component, Output, EventEmitter } from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";
import { AuthenticationService, ToasterService } from "auro-ui";
import { Router } from "@angular/router";
import { SidemenuService } from "./app.sidemenu.service";
import { DashboardService } from "../../../modules/dealer/dashboard/services/dashboard.service";

@Component({
  selector: "app-sidemenu",
  templateUrl: "./app.sidemenu.component.html",
  styleUrl: "./app.sidemenu.component.scss",
})
export class AppSidemenuComponent {
  //This is the sidemenu, for Devices with width > 992px
  constructor(
    public layoutService: LayoutService,
    public authSvc: AuthenticationService,
    private router: Router,
    private sidemenuService: SidemenuService,
    private dashboardSvc: DashboardService,
    private toasterSvc: ToasterService
  ) {}

  isExpanded = false; // True when hovered
  isLocked = false; // True when locked
  isSubmenuOpen = false;

  onMouseEnter() {
    //Mouse enter logic, expands sidemenu
    if (!this.isLocked) {
      this.isExpanded = true;
      this.sidemenuService.toggleSidemenu(false);
    }
  }

  onMouseLeave() {
    //Shrinks sidemenu on mouse leave
    if (!this.isLocked) {
      this.isExpanded = false;
      this.sidemenuService.toggleSidemenu(false);
      this.isSubmenuOpen = false;
    }
  }

  toggleLock() {
    //To toggle the locking of the sidemenu
    this.isLocked = !this.isLocked;
    this.sidemenuService.toggleSidemenu(this.isLocked); // Notify the service
  }

  @Output() iconClick = new EventEmitter<string>(); // Placeholder to emulate click behavior

  onIconClick(icon: string): void {
    this.isSubmenuOpen = false;
    //Remove once paths are decided. Use naviagate below.
    this.iconClick.emit(icon);
  }

  navigate(path: string) {
    this.isSubmenuOpen = false;
    const isExternalUser = sessionStorage.getItem("externalUserType");
    if (isExternalUser?.includes("External")) {
      if (!this.dashboardSvc.userSelectedOption) {
        this.dashboardSvc.dealerAnimate = true;
        setTimeout(() => {
          this.dashboardSvc.dealerAnimate = false;
        }, 5000);

        this.toasterSvc.showToaster({
          detail: "Please select a dealer.",
        });
        return;
      }
    }

    //Function to redirect from menu.
    sessionStorage.removeItem("productCode");
    this.router.navigateByUrl(path);
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  closeSubmenu() {
    this.isSubmenuOpen = false;
  }
}
