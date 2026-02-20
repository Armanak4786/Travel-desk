import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrl: './user-info-card.component.scss'
})
export class UserInfoCardComponent implements OnInit {

  /**
   * Input property to receive user details.
   * Expected structure: { name, employeeId, department, grade, designation, avatar? }
   */
  @Input() userInfo: any;

  constructor() {}

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

  ngOnInit(): void {
    // Safety check: If no data is passed, initialize as empty object 
    // to prevent template errors like "cannot read property of undefined"
    if (!this.userInfo) {
      this.userInfo = {
        name: 'N/A',
        employeeId: 'N/A',
        department: 'N/A',
        grade: 'N/A',
        designation: 'N/A',
        avatar: ''
      };
    }
  }
}