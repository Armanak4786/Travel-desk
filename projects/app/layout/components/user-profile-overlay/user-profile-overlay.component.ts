import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";
import { AuthenticationService } from "auro-ui";
import { Router } from "@angular/router";
import { OverlayPanel } from "primeng/overlaypanel";

@Component({
  selector: "app-user-profile-overlay",
  templateUrl: "./user-profile-overlay.component.html",
  styleUrl: "./user-profile-overlay.component.scss",
})
export class UserProfileOverlayComponent {
  @ViewChild("overlayPanel") overlayPanel: OverlayPanel;

  @Input() lastLoginTime: string = "";
  @Output() onLogout = new EventEmitter<void>();

  userName: string = "Pradeep Sharma";
  userEmail: string = "pranalishaha@gmail.com";

  constructor(
    public layoutService: LayoutService,
    public authSvc: AuthenticationService,
    public router: Router
  ) {}

  public toggle(event: Event, target: any) {
    this.overlayPanel.toggle(event, target);
  }

  logout() {
    this.overlayPanel.hide();
    this.onLogout.emit();
  }

  changePassword() {
    this.overlayPanel.hide();
    this.router.navigateByUrl("/authentication/change-password");
  }

  onSettingsClick() {
    this.overlayPanel.hide();
  }

  onPreferencesClick() {
    this.overlayPanel.hide();
  }

  onEditProfileClick() {
    this.overlayPanel.hide();
  }
}
