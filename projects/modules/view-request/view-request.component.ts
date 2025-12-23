import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {
  
  // State Variables
  isViewOnly:boolean=false;
  requestId: string = '';
  userRole: string = sessionStorage.getItem('userRole') || 'Employee';
  activeTab: string = 'travel'; 
  currentStatus: string = 'Pending'; 
    userInfo = {
    name: "Pradeep Sharma",
    employeeId: "AP8978870",
    department: "Banking",
    grade: "10",
    designation: "Sr. Associate Manager",
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.userRole !== "Employee") {
      this.isViewOnly = true;
    }

    this.route.queryParams.subscribe(params => {
      this.requestId = params['id'];
    });
  }
}