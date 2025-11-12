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

  // --- Table Data and Columns ---
  allTravelRequests: any[] = [];
  filteredRequests: any[] = [];
  rowData: any[] = [];
  columnsAsset: any[] = [];

  // --- Filter Bar State ---
  selectedStatus: string = "All"; // For the 'All', 'Pending', 'Approved' tabs
  yearOptions: any[] = [];
  selectedYear: number;

  // --- Pagination State ---
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
    // Populate filter bar options
    this.yearOptions = [
      { label: "Current Year - 2025", value: 2025 },
      { label: "Previous Year - 2024", value: 2024 },
      { label: "2023", value: 2023 },
    ];
    this.selectedYear = 2025; // Set default

    // Define table columns
    this.defineColumns();

    // Load pseudo-data
    this.loadMockData();
  }

  /**
   * Sets the column definitions for the gen-table.
   */
  defineColumns() {
    this.columnsAsset = [
      { field: "requestNo", headerName: "Request No", sortable: true },
      {
        field: "travelDate",
        headerName: "Travel Date",
        format: "#date",
        dateFormat: "dd MMM yyyy", // Matches Figma format,
        sortable: true,
      },
      {
        field: "returnDate",
        headerName: "Return Date",
        sortable: true,
        format: "#date",
        dateFormat: "dd MMM yyyy", // Matches Figma format
      },
      { field: "type", headerName: "Type", sortable: true },
      { field: "countryCity", headerName: "Country / City", sortable: true },
      { field: "manager", headerName: "Manager", sortable: true },
      { field: "requestStatus", headerName: "Request Status", sortable: true },
      { field: "tripStatus", headerName: "Trip Status", sortable: true },
      {
        field: "actions", // Use 'actions' to match the previous component's pattern
        headerName: "Action",
        format: "#icons", // Tells gen-table to render icons
        actions: "onCellClicked", // Ensures onCellClick event is emitted
      },
    ];
  }

  /**
   * Populates the table with mock data based on the Figma design.
   */
  loadMockData() {
    const mockData = [
      {
        requestNo: "730827308981",
        travelDate: "2025-10-04T00:00:00Z", // Use ISO strings for dates
        returnDate: "2025-10-04T00:00:00Z",
        type: "Domestic",
        countryCity: "India / Noida",
        manager: "Mr. Satish Pawar",
        requestStatus: "Pending",
        tripStatus: "Pending",
        // The 'actions' array tells gen-table which icons to show
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
      // ... add more mock data as needed
    ];
    this.allTravelRequests = mockData;
    this.filteredRequests = this.allTravelRequests; // On load, filtered = all
    this.totalRecord = this.filteredRequests.length;
    this.updatePagedData(); // For client-side pagination
  }

  // --- STUB METHODS FOR UI ACTIONS ---

  /**
   * Handles clicking on the 'All', 'Pending', 'Approved', 'Rejected' tabs.
   * @param status The status that was clicked (e.g., 'All', 'Pending')
   */
  onStatusTabChange(status: string) {
    this.selectedStatus = status;
    // Filter from the master list
    if (status === "All") {
      this.filteredRequests = this.allTravelRequests;
    } else {
      this.filteredRequests = this.allTravelRequests.filter(
        (request) => request.requestStatus === status
      );
    }

    // Update total records for the paginator
    this.totalRecord = this.filteredRequests.length;

    // Reset pagination
    this.first = 0;

    // Update the paged data for the table
    this.updatePagedData();
  }

  updatePagedData() {
    this.rowData = this.filteredRequests.slice(
      this.first,
      this.first + this.rows
    );
  }
  /**
   * Handles changing the year dropdown.
   */
  onYearChange(event: any) {
    console.log("Selected year:", this.selectedYear);
    // Add logic here to re-fetch or filter data based on the selected year
  }

  /**
   * Handles the 'Refresh' button click.
   */
  refreshData() {
    console.log("Refreshing data...");
    this.loadMockData(); // Reload mock data for now
  }

  /**
   * Handles the 'Filter' button click.
   */
  openFilters() {
    console.log("Opening filters...");
    // This would typically open a sidebar or modal
  }

  /**
   * Handles the '+ Raise a Request' button click.
   */
  raiseNewRequest() {
    this.router.navigate(["/raise-ticket"]);
    console.log("Navigating to new request page...");
    // This would typically navigate to the form page
    // e.g., this.commonSvc.router.navigateByUrl('/travel/new-request');
  }

  /**
   * Handles actions from the table (e.g., edit, view).
   */
  onCellClick(event: any) {
    console.log("Cell click event:", event);
    const { actionName, rowData } = event;

    if (actionName === "edit") {
      console.log("Editing row:", rowData.requestNo);
      // Navigate to edit page
      // e.g., this.commonSvc.router.navigateByUrl(`/travel/edit/${rowData.requestNo}`);
    } else if (actionName === "view") {
      console.log("Viewing row:", rowData.requestNo);
      // Navigate to view/details page
      // e.g., this.commonSvc.router.navigateByUrl(`/travel/view/${rowData.requestNo}`);
    }
  }

  /**
   * Handles pagination changes.
   */
  onPageChange(event: any) {
    console.log("Page change event:", event);
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedData();
    // For server-side pagination, you would re-fetch data here.
    // For client-side, gen-table handles it, but we update state.
  }
}
