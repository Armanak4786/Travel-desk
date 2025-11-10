import { Component, effect, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-quote-list",
  templateUrl: "./quote-list.component.html",
  styleUrl: "./quote-list.component.scss",
})
export class QuoteListComponent implements OnInit {
  columnsAsset = [
    { field: "requestno", headerName: "requestno", sortable: true },
    { field: "traveldate", headerName: "traveldate", sortable: true },
  ];

  microservicesList = [];
  constructor() {}

  ngOnInit(): void {}
}
