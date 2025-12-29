import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GenTableComponent, StorageService } from "auro-ui";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  @ViewChild("dt")
  dt: GenTableComponent;
userRole: string = '';
  allTravelRequests: any[] = [];
  filteredRequests: any[] = [];
  rowData: any[] = [];
  columnsAsset: any[] = [];

  selectedStatus: string = "All";
  yearOptions: any[] = [];
  selectedYear: number;
  actionOptions: any[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecord: number = 0;
  rowsPerPageOptions: any[] = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "30", value: 30 },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {

    this.userRole = sessionStorage.getItem('userRole') || 'Employee';
    this.yearOptions = [
      { label: "Current Year - 2025", value: 2025 },
      { label: "Previous Year - 2024", value: 2024 },
      { label: "2023", value: 2023 },
    ];
    this.actionOptions = [
      { actionName: "view", icon: "pi pi-eye", tooltip: "View Details" },
      { actionName: "upload", icon: "pi pi-upload", tooltip: "Upload Reimbursement" },
      { actionName: "delete", icon: "pi pi-trash", tooltip: "Delete Request" },
    ];
    this.selectedYear = 2025;
    this.defineColumns();
    this.loadMockData();
  }

  defineColumns() {
    this.columnsAsset = [
      { field: "requestNo", headerName: "Request No", sortable: true },
      ...(this.userRole !== 'Employee' ? [
      { field: "empName", headerName: "Employee Name", sortable: true },
      { field: "empCode", headerName: "Employee Code", sortable: true }
    ] : []),
      {
        field: "travelDate",
        headerName: "Travel Date",
        format: "#date",
        dateFormat: "dd MMM yyyy",
        sortable: true,
      },
      {
        field: "returnDate",
        headerName: "Return Date",
        sortable: true,
        format: "#date",
        dateFormat: "dd MMM yyyy",
      },
      { field: "type", headerName: "Type   ", sortable: true},
      { field: "countryCity", headerName: "Country / City", sortable: true },
      { field: "manager", headerName: "Manager", sortable: true },
      { field: "requestStatus", headerName: "Request Status", sortable: true },
      {
        field: "reimbursementStatus",
        headerName: "Reimbursement Status",
        sortable: true,
      },
      {
        field: "actions",
        headerName: "Action",
        format: "#icons",
        // actions: "onCellClicked",
      },
    ];
  }

  loadMockData() {

    // 1. Filter actions based on role
  let roleBasedActions = this.actionOptions;

  if (this.userRole === 'TravelDeskAdmin' || this.userRole === 'FinanceAdmin') {
    // Keep ONLY the 'view' action
    roleBasedActions = this.actionOptions.filter(action => action.actionName === 'view');
  }
    const mockData = [
      {
        requestNo: "730827308981",
        empName: "Sanket", 
      empCode: "EMP001",
        travelDate: "2025-10-04T00:00:00Z",
        returnDate: "2025-10-04T00:00:00Z",
        type: "Domestic",
        countryCity: "India / Noida",
        manager: "Mr. Satish Pawar",
        requestStatus: "Pending",
        reimbursementStatus: "Pending",
        actions: roleBasedActions,
      },
      {
        requestNo: "87162308623",
                empName: "Avinash", 
      empCode: "EMP005",
        travelDate: "2025-09-30T00:00:00Z",
        returnDate: "2025-09-30T00:00:00Z",
        type: "International",
        countryCity: "Thailand / Bangkok",
        manager: "Mr. Sujit Singh",
        requestStatus: "Approved",
        reimbursementStatus: "Pending",
        actions: roleBasedActions,
      },
      {
        requestNo: "37482901576",
                empName: "Parth", 
      empCode: "EMP009",
        travelDate: "2025-08-15T00:00:00Z",
        returnDate: "2025-08-15T00:00:00Z",
        type: "International",
        countryCity: "USA / New York",
        manager: "Mr. Satish Pawar",
        requestStatus: "Rejected",
        reimbursementStatus: "Completed",
        actions: roleBasedActions,
      },
      {
        requestNo: "19574206384",
                empName: "Rohit", 
      empCode: "EMP080",
        travelDate: "2025-07-22T00:00:00Z",
        returnDate: "2025-07-22T00:00:00Z",
        type: "International",
        countryCity: "UK / London",
        manager: "Mr. Satish Pawar",
        requestStatus: "In Progress",
        reimbursementStatus: "Completed",
        actions: roleBasedActions,
      },
      {
        requestNo: "46028394720",
                empName: "Jai", 
      empCode: "EMP077",
        travelDate: "2025-06-10T00:00:00Z",
        returnDate: "2025-06-10T00:00:00Z",
        type: "International",
        countryCity: "Japan / Tokyo",
        manager: "Mr. Satish Pawar",
        requestStatus: "Pending",
        reimbursementStatus: "Completed",
        actions: roleBasedActions,
      },
    ];
    this.allTravelRequests = mockData;
    this.filteredRequests = this.allTravelRequests;
    this.totalRecord = this.filteredRequests.length;
    this.updatePagedData();
  }

  onStatusTabChange(status: string) {
    this.selectedStatus = status;
    if (status === "All") {
      this.filteredRequests = this.allTravelRequests;
    } else {
      this.filteredRequests = this.allTravelRequests.filter(
        (request) => request.requestStatus === status
      );
    }

    this.totalRecord = this.filteredRequests.length;

    this.first = 0;

    this.updatePagedData();
  }

  updatePagedData() {
    this.rowData = this.filteredRequests.slice(
      this.first,
      this.first + this.rows
    );
  }

  refreshData() {
    this.loadMockData();
  }

  openFilters() {}

  raiseNewRequest() {
    this.router.navigate(["/raise-ticket"]);
  }

  uploadReimbursement() {
    this.router.navigate(["/reimbursement-details"]);
  }
onCellClick(event: any) {
    const { rowData } = event;
    let actionName = event.actionName; // Currently undefined per your log

    // FIX: Manually detect action from the native click event if 'actionName' is missing
    if (!actionName && event.event && event.event.target) {
      const targetClass = event.event.target.className || '';
      
      if (targetClass.includes('pi-eye')) {
        actionName = 'view';
      } else if (targetClass.includes('pi-upload')) {
        actionName = 'upload';
      } else if (targetClass.includes('pi-trash')) {
        actionName = 'delete';
      }
    }

    // Now execute your routing logic
    if (actionName === "view") {
      this.router.navigate(["/view-request"], {
        queryParams: { id: rowData.requestNo } 
      });

    } else if (actionName === "upload") {
      this.router.navigate(["/reimbursement-details"], {
         queryParams: { id: rowData.requestNo }
      });

    } else if (actionName === "delete") {
      console.log("Delete requested for:", rowData.requestNo);
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedData();
  }
}
