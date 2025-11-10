import { Component, ViewChild } from "@angular/core";
import { OverlayPanel } from "primeng/overlaypanel";
import { LayoutService } from "../../service/app.layout.service";
import { AuthenticationService } from "auro-ui";
import { DashboardService } from "../../../modules/dealer/dashboard/services/dashboard.service";
import { environment } from "src/environments/environment.prod";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-profile-overlay",
  templateUrl: "./user-profile-overlay.component.html",
  styleUrl: "./user-profile-overlay.component.scss",
})
export class UserProfileOverlayComponent {
  @ViewChild("overlayPanel") overlayPanel: OverlayPanel;

  userName: any;

  constructor(
    private overlayService: LayoutService,
    public authSvc: AuthenticationService,
    public dashboardService: DashboardService,
    public layoutService: LayoutService,
    public router: Router
  ) {}

  ngOnInit() {
    this.overlayService.toggleOverlay.subscribe((event) => {
      this.overlayPanel.toggle(event);
    });

    let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.dashboardService.decodeToken(accessToken);
    this.userName = decodedToken?.sub.replace(".", " ");
  }

  logout() {
    if (environment.FIS) {
      this.authSvc.revokeAllToken().subscribe({
        next: (revokeAllToken) => {
          localStorage.clear();
          sessionStorage.clear();
          this.authSvc.clearAuth();
          this.router.navigate(["/authentication/login"]).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          localStorage.clear();
          sessionStorage.clear();
          this.authSvc.clearAuth();
          this.router.navigate(["/authentication/login"]).then(() => {
            window.location.reload();
          });
        },
      });
    } else {
      this.authSvc.revokeSession().subscribe({
        next: (revokeSession) => {
          this.authSvc.oidcLogout();
        },
        error: (error) => {
          this.authSvc.oidcLogout();
        },
      });
    }
  }

  changePassword() {
    this.router.navigateByUrl("/authentication/change-password");
  }
}
