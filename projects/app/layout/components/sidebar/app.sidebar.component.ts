import { Component, ElementRef, Output, EventEmitter } from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";
import { AuthenticationService } from "auro-ui";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./app.sidebar.component.html",
  styleUrl: "./app.sidebar.component.scss",
})
export class AppSidebarComponent {
  //Sidebar overlay -- for smaller devices.
  constructor(
    public layoutService: LayoutService,
    public el: ElementRef,
    public authSvc: AuthenticationService,
    private router: Router
  ) {}

  @Output() iconClick = new EventEmitter<string>();

  onIconClick(icon: string): void {
    //Placeholder until paths are decided. Use navigation().
    this.iconClick.emit(icon);
  }

  navigate(path: string) {
    //Function to redirect from sidebar.
  }
}
