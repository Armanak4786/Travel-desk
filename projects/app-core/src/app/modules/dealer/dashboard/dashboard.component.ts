import { Component, OnInit } from "@angular/core";
import { StorageService } from "auro-ui";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  constructor(private storageSvc: StorageService) {}

  ngOnInit(): void {}
}
