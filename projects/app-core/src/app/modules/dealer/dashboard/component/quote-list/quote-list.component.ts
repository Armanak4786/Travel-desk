import { Component, effect, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-quote-list",
  templateUrl: "./quote-list.component.html",
  styleUrl: "./quote-list.component.scss",
})
export class QuoteListComponent implements OnInit {
  
  columnsAsset = [
    { field: "requestno", headerName: "Request No", sortable: true,
     },
    { field: "traveldate", headerName: "Travel Date", sortable: true },
    { field: "returndate", headerName: "Return Date", sortable: true },
    { field: "type", headerName: "Type", sortable: true },
    { field: "countrycity", headerName: "Country / City", sortable: true },
    { field: "manager", headerName: "Manager", sortable: true },
    { field: "requeststatus", headerName: "Request Status", sortable: true },
    { field: "tripstatus", headerName: "Trip Status", sortable: true },
    { field: "action", headerName: "Action", sortable: true },
  ];

  microservicesList = [];
  constructor() {}

  ngOnInit(): void {}
}
