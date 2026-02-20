import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeProfileService } from 'projects/modules/shared/services/employee-profile.service';
import { TravelRequestService, TravelRequestDetailData } from 'projects/modules/shared/services/travel-request.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {
  
  isViewOnly: boolean = false;
  requestId: string = '';
  userRole: string = sessionStorage.getItem('userRole') || 'Employee';
  activeTab: string = 'travel'; 
  currentStatus: string = 'Pending'; 
  userInfo$ = this.employeeProfileService.employeeCardInfo$;
  
  requestData: TravelRequestDetailData | null = null;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeProfileService: EmployeeProfileService,
    private travelRequestService: TravelRequestService
  ) {}

  ngOnInit(): void {
    this.isViewOnly = true;

    this.route.queryParams.subscribe(params => {
      this.requestId = params['id'];
      if (this.requestId) {
        this.loadRequestDetails(this.requestId);
      }
    });
  }

  async loadRequestDetails(id: string): Promise<void> {
    this.isLoading = true;
    const response = await this.travelRequestService.getTravelRequestById(id);
    if (response?.isSuccess && response.data) {
      this.requestData = response.data;
      this.currentStatus = response.data.statusName;
    }
    this.isLoading = false;
  }
}