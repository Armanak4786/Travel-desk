import { Component, OnInit } from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";
import { DataService } from "auro-ui";

@Component({
  selector: "app-footer",
  templateUrl: "./app.footer.component.html",
  styles: [ `::ng-deep {
  .microservices {
    .gen-table .p-datatable > .p-datatable-wrapper {
         max-height:300px ;
      overflow-y: auto;
    }
  }
}`]
})
export class AppFooterComponent implements OnInit {
  releaseInfo: any;
  microservicesList: any[] = [];
  visible: boolean = false;
  columnsAsset = [
    { field: "name", headerName: "Service", sortable: true },
    { field: "version", headerName: "Version", sortable: true },
    //{ field: "releaseType", headerName: "Release Scope", sortable: true },
  ];
  constructor(
    public layoutService: LayoutService,
    private dataSvc: DataService
  ) {}

  ngOnInit(): void {
    this.dataSvc.http
      .get("assets/data/versionFile.json")
      .subscribe((res: any) => {
        this.releaseInfo = res;

        if (res?.microservices) {
          this.microservicesList = Object.entries(res?.microservices || {}).map(
            ([name, serviceData]: any) => ({
              name,
              ...serviceData,
            })
          );
        }
      });
  }

  openVersionPopup() {
    this.visible = true;
  }
}
