import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { LayoutService } from "../../service/app.layout.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter, Subscription, timer } from "rxjs";
import { SidemenuService } from "../sidemenu/app.sidemenu.service";
import { DashboardService } from "../../../modules/dealer/dashboard/services/dashboard.service";
import {
  AuthenticationService,
  CommonService,
  CurrencyService,
  DataService,
  ToasterService,
  ValidationService,
} from "auro-ui";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-topbar",
  templateUrl: "./app.topbar.component.html",
  styleUrl: "./app.topbar.component.scss",
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];

  @ViewChild("menubutton") menuButton!: ElementRef;

  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

  @ViewChild("topbarmenu") menu!: ElementRef;
  currentServerTimeA: string;
  showFlag: boolean = false;
  searchInput: string = "";
  private timeSubscription: Subscription;
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
  constructor(
    public layoutService: LayoutService,
    public authSvc: AuthenticationService,
    private sidemenuService: SidemenuService,
    public dashboardService: DashboardService,
    private validationSvc: ValidationService,
    public currencyService: CurrencyService,
    private dataService: DataService,
    private router: Router,
    private svc: CommonService,
    private confirmationService: ConfirmationService,
    private translateSvc: TranslateService,
    private toasterService: ToasterService
  ) {}

  isSidemenuExpanded: boolean = false;

  async ngOnInit() {
    let accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      this.currencyService.initializeCurrency();
    }
    let decodedToken = this.dashboardService.decodeToken(accessToken);

    this.updateServerTime();

    this.timeSubscription = timer(0, 30000).subscribe(() => {
      this.updateServerTime();
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
    this.dashboardService.quoteRoute.next(false);

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

  showOverlay(event: Event) {
    this.layoutService.showOverlay(event);
  }
  private updateServerTime() {
    this.currentServerTimeA = this.layoutService.getCurrentTimeString();
  }
  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  logout() {}

  toggleDropdown() {
    this.isDropdownOpen = this.isDropdownOpen ? false : true;
  }

  async onSelect(event: any) {
    this.selectedValue = event.value;

    this.currentRoute = this.router.url;
    let message = "dealerChangeWarningMsg";
    if (this.currentRoute == "/dealer/quick-quote") {
      this.dashboardService.quoteRoute.next(true);
      this.confirmBox(event, message);
    } else {
      this.confirmBox(event, message);
      this.dashboardService.quoteRoute.next(false);
    }
  }

  confirmBox(event, message) {
    this.confirmationService.confirm({
      message: this.translateSvc.instant(message),
      icon: "", // or '' to remove
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-primary",
      rejectButtonStyleClass: "p-button-outlined",
      accept: () => {
        this.dashboardService?.quoteRoute.next(false);
        this.dashboardService.setDealerToLocalStorage(event.value);
      },
      reject: () => {
        const dealerValue = sessionStorage.getItem("dealerPartyNumber");
        const dealerName = sessionStorage.getItem("dealerPartyName");
        this.dashboardService.userSelectedOption = {
          name: dealerName,
          num: Number(dealerValue),
        };
      },
    });
    setTimeout(() => {
      const dialog = document.querySelector(".p-confirm-dialog");
      dialog?.classList.add("topbar-confirm-dialog");
    });
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
