import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService, DataService } from "auro-ui";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  isloading: boolean;
  isAuthenticated = false;

  lastPoppedUrl: string;
  yScrollStack: number[] = [];

  constructor(
    public dataService: DataService,
    private authSvc: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // if (environment.production) {
    //   this.authSvc.isAuthenticated$.subscribe((isAuthenticated: any) => {
    //     if (isAuthenticated) {
    //       // this.router.navigate(["authentication/"]);
    //     } else {
    //       this.router.navigate(["authentication/login"]);
    //     }
    //   });
    // }

    this.dataService.loading$.subscribe((isloading: boolean) => {
      this.isloading = isloading;
    });
  }
}
