import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-application-outcome",
  templateUrl: "./application-outcome.component.html",
  styleUrl: "./application-outcome.component.scss",
})
export class ApplicationOutcomeComponent implements OnInit {
  data: any;

  options: any;

  applicationStatus: any;

  constructor(private svc: DashboardService) {}

  ngOnInit() {
    this.applicationStatus = this.svc.applicationStatus;
    const documentStyle = getComputedStyle(document.documentElement);

    this.data = {
      labels: ["Paid Out - 6", "Declined - 3", "Pending - 12", "Expired - 0"],
      datasets: [
        {
          data: [6, 3, 12, 1],
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
          ],
        },
      ],
    };

    this.options = {
      cutout: "60%",

      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
