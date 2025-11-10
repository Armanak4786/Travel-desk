import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-core-routing.module";
import { AppComponent } from "./components/root/app.component";
import { AuroUiFrameWork } from "auro-ui";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AppMenuitemComponent } from "./layout/components/menu/app.menuitem.component";
import { AppTopBarComponent } from "./layout/components/topbar/app.topbar.component";
import { AppFooterComponent } from "./layout/components/footer/app.footer.component";
import { AppSidemenuComponent } from "./layout/components/sidemenu/app.sidemenu.component";
import { AppMenuComponent } from "./layout/components/menu/app.menu.component";
import { AppSidebarComponent } from "./layout/components/sidebar/app.sidebar.component";
import { AppLayoutComponent } from "./layout/components/layout/app.layout.component";
import { AccordionModule } from "primeng/accordion";
import { UserProfileOverlayComponent } from "./layout/components/user-profile-overlay/user-profile-overlay.component";
import { LanguageSwitcherComponent } from "./layout/components/language-switcher/language-switcher.component";
import { TranslateModule } from "@ngx-translate/core";
import { NotificationBellComponent } from "./layout/components/notification-bell/notification-bell.component";
import { SubSidemenuComponent } from "./layout/components/sub-sidemenu/sub-sidemenu.component";
import { ReportsDialogComponent } from "./layout/components/reports-dialog/reports-dialog.component";

@NgModule({
  declarations: [
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppSidemenuComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
    AppComponent,
    UserProfileOverlayComponent,
    LanguageSwitcherComponent,
    NotificationBellComponent,
    SubSidemenuComponent,
    ReportsDialogComponent
  ],
  imports: [
    CommonModule,
    AuroUiFrameWork,
    AppRoutingModule,
    RouterModule,
    AccordionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class CoreAppModule {}
