import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-average-sales',
  templateUrl: './average-sales.component.html',
  styleUrl: './average-sales.component.scss',
})
export class AverageSalesComponent implements OnInit {
  data: any;

  options: any;

  time = 'Year';
  items = [{ name: 'YTD', code: 'YTD' }];
  commions = [{ name: 'MTD', code: 'MTD' }];

  constructor() {}
  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],

      datasets: [
        {
          label: 'First Dataset',
          data: [7, 10, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };

    // this.data = {
    //   labels: [
    //     'Jan',
    //     'Feb',
    //     'Mar',
    //     'Apr',
    //     'May',
    //     'Jun',
    //     'Jul',
    //     'Aug',
    //     'Sep',
    //     'Oct',
    //     'Nov',
    //     'Dec',
    //   ],
    //   datasets: [
    //     {
    //       label: 'First Dataset',
    //       data: [7, 10, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    //       fill: false,
    //       borderColor: documentStyle.getPropertyValue('--blue-500'),
    //       tension: 0.4,
    //     },
    //   ],
    // };

    //   this.options = {
    //     maintainAspectRatio: false,
    //     aspectRatio: 0.6,
    //     plugins: {
    //       legend: {
    //         labels: {
    //           color: textColor,
    //         },
    //       },
    //     },
    //     scales: {
    //       x: {
    //         ticks: {
    //           color: textColorSecondary,
    //         },
    //         grid: {
    //           color: surfaceBorder,
    //           drawBorder: false,
    //         },
    //       },
    //       y: {
    //         ticks: {
    //           color: textColorSecondary,
    //         },
    //         grid: {
    //           color: surfaceBorder,
    //           drawBorder: false,
    //         },
    //       },
    //     },
    //   };
    // }

    this.options = {
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
}
