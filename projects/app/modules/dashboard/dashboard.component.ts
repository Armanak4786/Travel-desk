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

  allTravelRequests: any[] = [];
  filteredRequests: any[] = [];
  rowData: any[] = [];
  columnsAsset: any[] = [];

  selectedStatus: string = "All";
  yearOptions: any[] = [];
  selectedYear: number;


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
    this.yearOptions = [
      { label: "Current Year - 2025", value: 2025 },
      { label: "Previous Year - 2024", value: 2024 },
      { label: "2023", value: 2023 },
    ];
    this.selectedYear = 2025;
    this.defineColumns();
    this.loadMockData();
  }


  defineColumns() {
    this.columnsAsset = [
      { field: "requestNo", headerName: "Request No", sortable: true },
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
      { field: "type", headerName: "Type", sortable: true },
      { field: "countryCity", headerName: "Country / City", sortable: true },
      { field: "manager", headerName: "Manager", sortable: true },
      { field: "requestStatus", headerName: "Request Status", sortable: true },
      { field: "tripStatus", headerName: "Trip Status", sortable: true },
      {
        field: "actions", 
        headerName: "Action",
        format: "#icons",
        actions: "onCellClicked", 
      },
    ];
  }


  loadMockData() {
    const mockData = [
      {
        requestNo: "730827308981",
        travelDate: "2025-10-04T00:00:00Z", 
        returnDate: "2025-10-04T00:00:00Z",
        type: "Domestic",
        countryCity: "India / Noida",
        manager: "Mr. Satish Pawar",
        requestStatus: "Pending",
        tripStatus: "Pending",
        actions: [
          { actionName: "edit", icon: "pi pi-pencil", tooltip: "Edit Request" },
          { actionName: "view", icon: "pi pi-eye", tooltip: "View Details" },
        ],
      },
      {
        requestNo: "87162308623",
        travelDate: "2025-09-30T00:00:00Z",
        returnDate: "2025-09-30T00:00:00Z",
        type: "International",
        countryCity: "Thailand / Bangkok",
        manager: "Mr. Sujit Singh",
        requestStatus: "Approved",
        tripStatus: "Pending",
        actions: [
          { actionName: "edit", icon: "pi pi-pencil", tooltip: "Edit Request" },
          { actionName: "view", icon: "pi pi-eye", tooltip: "View Details" },
        ],
      },
      {
        requestNo: "37482901576",
        travelDate: "2025-08-15T00:00:00Z",
        returnDate: "2025-08-15T00:00:00Z",
        type: "International",
        countryCity: "USA / New York",
        manager: "Mr. Satish Pawar",
        requestStatus: "Rejected",
        tripStatus: "Completed",
        actions: [
          { actionName: "edit", icon: "pi pi-pencil", tooltip: "Edit Request" },
          { actionName: "view", icon: "pi pi-eye", tooltip: "View Details" },
        ],
      },
      {
        requestNo: "19574206384",
        travelDate: "2025-07-22T00:00:00Z",
        returnDate: "2025-07-22T00:00:00Z",
        type: "International",
        countryCity: "UK / London",
        manager: "Mr. Satish Pawar",
        requestStatus: "In Progress",
        tripStatus: "Completed",
        actions: [
          { actionName: "edit", icon: "pi pi-pencil", tooltip: "Edit Request" },
          { actionName: "view", icon: "pi pi-eye", tooltip: "View Details" },
        ],
      },
      {
        requestNo: "46028394720",
        travelDate: "2025-06-10T00:00:00Z",
        returnDate: "2025-06-10T00:00:00Z",
        type: "International",
        countryCity: "Japan / Tokyo",
        manager: "Mr. Satish Pawar",
        requestStatus: "On Hold",
        tripStatus: "Completed",
        actions: [
          { actionName: "edit", icon: "pi pi-pencil", tooltip: "Edit Request" },
          { actionName: "view", icon: "pi pi-eye", tooltip: "View Details" },
        ],
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

  onYearChange(event: any) {
    console.log("Selected year:", this.selectedYear);
  }


  refreshData() {
    console.log("Refreshing data...");
    this.loadMockData(); 
  }


  openFilters() {
    
  }

  raiseNewRequest() {
    this.router.navigate(["/raise-ticket"]);
    console.log("Navigating to new request page...");
  }


  onCellClick(event: any) {
    console.log("Cell click event:", event);
    const { actionName, rowData } = event;

    if (actionName === "edit") {

    } else if (actionName === "view") {

    }
  }


  onPageChange(event: any) {
    console.log("Page change event:", event);
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedData();
  }
}
