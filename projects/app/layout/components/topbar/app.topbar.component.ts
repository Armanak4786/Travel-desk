import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { LayoutService } from "../../service/app.layout.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, Subscription, timer } from "rxjs";
import { SidemenuService } from "../sidemenu/app.sidemenu.service";
import {
  AuthenticationService,
  CommonService,
  CurrencyService,
  DataService,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { UserProfileOverlayComponent } from "../user-profile-overlay/user-profile-overlay.component";

@Component({
  selector: "app-topbar",
  templateUrl: "./app.topbar.component.html",
  styleUrl: "./app.topbar.component.scss",
  providers: [DatePipe], 
})
export class AppTopBarComponent implements OnInit, OnDestroy {
  items!: MenuItem[];

  @ViewChild("menubutton") menuButton!: ElementRef;
  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;
  @ViewChild("topbarmenu") menu!: ElementRef;
  @ViewChild(UserProfileOverlayComponent)
  profileOverlay: UserProfileOverlayComponent;

  currentServerTimeA: string; 
  formattedDate: string; 
  private timeSubscription: Subscription;

  showFlag: boolean = false;
  searchInput: string = "";
  oidcUser: any;
  swingIcon = false;
  notificationValue = 0;

  options: string[] = ["Dealer ", "Commercial"];
  selectedOption: string = "";
  isDropdownOpen: boolean = false;
  selectedValue: any;
  currentRoute: any;
  enabledRoutes: string[] = ["/dealer", "/dealer/quick-quote"];
  isDealerDropdownEnabled = false;

  isSidemenuExpanded: boolean = false;

  constructor(
    public layoutService: LayoutService,
    public authSvc: AuthenticationService,
    private sidemenuService: SidemenuService,
    private validationSvc: ValidationService,
    public currencyService: CurrencyService,
    private dataService: DataService,
    private router: Router,
    private svc: CommonService,
    private confirmationService: ConfirmationService,
    private translateSvc: TranslateService,
    private toasterService: ToasterService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  async ngOnInit() {
    let accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      this.currencyService.initializeCurrency();
    }

    this.updateServerTime(); // Initial call

    this.timeSubscription = timer(0, 30000).subscribe(() => {
      this.updateServerTime(); // Refresh time
    });

    this.sidemenuService.sidemenuExpanded$.subscribe((expanded: boolean) => {
      this.isSidemenuExpanded = expanded;
    });

    this.dataService.notificationSubject.subscribe((event) => {
      let length = 0;
      length =
        event?.errors?.length + event?.warnings?.length + event?.infos?.length;
      this.notificationValue = length;
      this.swingIcon = true;
      setTimeout(() => {
        this.swingIcon = false;
      }, 4000);
    });

    await this.validationSvc.getValidations().subscribe(async (data) => {});
    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      });
    this.layoutService.activeTab$.subscribe((tab) => {
      this.checkRoute(this.router.url);
    });
  }

  showNotification(event: Event) {
    this.layoutService.showNotification(event);
    this.swingIcon = true;
    setTimeout(() => {
      this.swingIcon = false;
    }, 4000);
  }

  showOverlay(event: Event, target: any) {
    this.profileOverlay.toggle(event, target);
  }

  private updateServerTime() {
    const now = new Date();
    this.currentServerTimeA = this.datePipe.transform(
      now,
      "h:mm a, dd MMM yyyy"
    );
    this.formattedDate = this.datePipe.transform(now, "dd-MMM-yyyy");
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }


  confirmLogout() {
    this.confirmationService.confirm({
      message: "Are you sure you want to log out?",
      header: "Logout",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.logout();
      },
      reject: () => {

      }
    });
  }

  logout() {
    // this.authSvc.logout();
    // this.toasterService.showToaster({detail: "Logged out successfully."});
    this.router.navigate(['/authentication/login']);
  }

  toggleDropdown() {
    this.isDropdownOpen = this.isDropdownOpen ? false : true;
  }

  async onSelect(event: any) {
    this.selectedValue = event.value;
    this.currentRoute = this.router.url;
    let message = "dealerChangeWarningMsg";
  }

  @HostListener("document:click", ["$event"])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".custom-dropdown")) {
      this.isDropdownOpen = false;
    }
  }

  checkRoute(url: string) {
    if (this.enabledRoutes.includes(url)) {
      this.isDealerDropdownEnabled = true;
      return;
    }

    if (
      url.startsWith("/dealer/standard-quote/edit") ||
      url == "/dealer/standard-quote"
    ) {
      const activeTab = this.layoutService.getActiveTab();
      this.isDealerDropdownEnabled = activeTab === "asset_details";
      return;
    }

    this.isDealerDropdownEnabled = false;
  }
}