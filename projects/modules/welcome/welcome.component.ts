import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { AuthenticationService } from "auro-ui";
import { environment } from "src/environments/environment.prod";

@Component({
  templateUrl: "./welcome.component.html",
})
export class WelcomeComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  constructor(public authSvc: AuthenticationService, private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
      if (environment.production) {
        this.oidcSecurityService
          .checkAuth()
          .subscribe(({ isAuthenticated }) => {
            if (isAuthenticated) {
              this.router.navigate(["/authentication/"]);
            } else {
              this.router.navigate(["/authentication/login"]);
            }
          });
      } else {
        this.router.navigate(["/authentication/"]);
      }
    }, 1000);
  }

  login() {
    this.authSvc.oidcLogin();
  }

  logout() {
    this.authSvc.oidcLogout();
  }
}
