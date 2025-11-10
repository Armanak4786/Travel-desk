import { Component, inject, OnInit } from "@angular/core";
import { AuthenticationService, DataService } from "auro-ui";
import { LayoutService } from "projects/app-core/src/app/layout/service/app.layout.service";

import { DashboardService } from "../../../../dealer/dashboard/services/dashboard.service";
import { Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  title = "app-core";

  // user_role = {
  //   data: {
  //     roleName: "System Administrators",
  //     functions: [
  //       {
  //         functionName: "quote",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "asset _details",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "dealer_finance",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "dealer_commission",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "payment_summary",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "customer_details",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "borrowers_guarantors",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "notes",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "add_borrowers_guarantors",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "draft",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "financial_asset",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "financial_asset_hierarchy",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "asset_branding",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "asset_summary",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "search_and_add_asset",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "search_and_add_trade",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "cash_price",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "recommended_retail_price",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "additional_charges",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "add_ons_and_accessories",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "less_deposit",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "calculate_settlement",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "waive_lmf",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "calculate",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "key_information_disclosures",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "standard_payment_options",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "payment_schedule_segment",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "edit_schedule_segment",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "edit_schedule_add_segment",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "edit_segment_calculate",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "payment_schedule_amort",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "edit_schedule_amort",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "search_customer",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "search_results",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "add_existing_customer",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "personal_details",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "address_details_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "employment_details_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "financial_position_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "reference_details_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "confirmation_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "aplyid_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "bud_personal",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "delete_party",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "document_upload",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "preview_document",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "download_document",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "delete_document",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents_select",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents_preview",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents_download",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents_print",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents_email",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "generated_documents_docusign",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "search_note",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //       {
  //         functionName: "add_notes",
  //         accessType: ["View", "Add", "Update"],
  //       },
  //     ],
  //   },
  //   items: null,
  //   lookups: null,
  //   warnings: null,
  // };

  user_role: any;
  private readonly oidcSecurityService = inject(OidcSecurityService);
  constructor(
    public layoutService: LayoutService,
    private dataSvc: DataService,
    public dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    let accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      this.getRoleBasedPermissions();
    }
  }

  goToCommercial() {}

  getRoleBasedPermissions() {
    this.dataSvc.get("RolePermissions/RolePermissions").subscribe((res) => {
      this.user_role = res;
      if (this.user_role?.data?.functions) {
        const structuredData = {
          roleName: this.user_role.data.roleName,
          functions: this.user_role.data.functions.reduce(
            (acc: Record<string, string[]>, item: any) => {
              // Ensure functionName and accessType are valid
              if (item?.functionName && Array.isArray(item?.accessType)) {
                acc[item.functionName] = item.accessType; // Map functionName to accessType
              }
              return acc;
            },
            {}
          ),
        };
        sessionStorage.setItem("user_role", JSON.stringify(structuredData));
      }
    });
  }

  get containerClass() {
    return {
      "layout-theme-light": this.layoutService.config.colorScheme === "light",
      "layout-theme-dark": this.layoutService.config.colorScheme === "dark",
      "layout-overlay": this.layoutService.config.menuMode === "overlay",
      "layout-static": this.layoutService.config.menuMode === "static",
      "layout-static-inactive":
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config.menuMode === "static",
      "layout-overlay-active": this.layoutService.state.overlayMenuActive,
      "layout-mobile-active": this.layoutService.state.staticMenuMobileActive,
      "p-input-filled": this.layoutService.config.inputStyle === "filled",
      "p-ripple-disabled": !this.layoutService.config.ripple,
    };
  }
}
