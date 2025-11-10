import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DealerComponent } from "./dealer.component";
import { DealerRoutingModule } from "./dealer-routing.module";
import { AuroUiFrameWork } from "auro-ui";

@NgModule({
  declarations: [DealerComponent],
  imports: [CommonModule, DealerRoutingModule, AuroUiFrameWork],
  providers: [AuroUiFrameWork],
})
export class DealerModule {}
