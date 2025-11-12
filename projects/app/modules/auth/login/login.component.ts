import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {}
