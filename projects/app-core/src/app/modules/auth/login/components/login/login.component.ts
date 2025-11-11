import { Component, OnInit } from "@angular/core";
import { AuthenticationService, DataService } from "auro-ui";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LayoutService } from "projects/app-core/src/app/layout/service/app.layout.service";
import { Router } from "@angular/router";
import { FloatLabel } from "primeng/floatlabel";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  pageType: string = "login";

  valCheck: string[] = ["remember"];

  password!: string;
  hidePassword: boolean = true;
  loginForm: FormGroup;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private dataSvc: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Version:15.1");
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false, [Validators.requiredTrue]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  basicAuthentication() {
    if (
      !this.loginForm.controls["username"].value ||
      !this.loginForm.controls["password"].value
    ) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.router.navigate(["/dashboard"]);
  }
}
