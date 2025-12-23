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