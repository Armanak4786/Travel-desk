import { Component, ViewChild } from "@angular/core";
import { OverlayPanel } from "primeng/overlaypanel";
import { LayoutService } from "../../service/app.layout.service";
import { AuthenticationService } from "auro-ui";
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
    public layoutService: LayoutService,
    public router: Router
  ) {}

  ngOnInit() {}

  logout() {}

  changePassword() {
    this.router.navigateByUrl("/authentication/change-password");
  }
}
