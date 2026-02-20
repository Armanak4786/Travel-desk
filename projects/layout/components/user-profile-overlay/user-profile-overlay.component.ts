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
import { EmployeeProfileService } from "projects/modules/shared/services/employee-profile.service";

@Component({
  selector: "app-user-profile-overlay",
  templateUrl: "./user-profile-overlay.component.html",
  styleUrl: "./user-profile-overlay.component.scss",
})
export class UserProfileOverlayComponent {
  @ViewChild("overlayPanel") overlayPanel: OverlayPanel;

  @Input() lastLoginTime: string = "";
  @Output() onLogout = new EventEmitter<void>();

  userInfo$ = this.employeeProfileService.employeeCardInfo$;

  constructor(
    public layoutService: LayoutService,
    public authSvc: AuthenticationService,
    public router: Router,
    private employeeProfileService: EmployeeProfileService
  ) {}

  getPlaceholderAvatarUrl(name: string | null | undefined, size: number = 40): string {
    const initials = this.getInitials(name);
    return `https://placehold.co/${size}x${size}/E0E0E0/757575?text=${encodeURIComponent(
      initials
    )}`;
  }

  getInitials(name: string | null | undefined): string {
    const cleaned = (name || "").trim();
    if (!cleaned) return "NA";

    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    const first = parts[0][0] || "";
    const last = parts[parts.length - 1][0] || "";
    return `${first}${last}`.toUpperCase();
  }

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
