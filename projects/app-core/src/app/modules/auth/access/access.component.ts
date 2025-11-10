import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
})
export class AccessComponent implements OnInit {
  constructor(public layoutService: LayoutService, private router: Router) {}

  ngOnInit(): void {
    // todo remove this code later
    this.router.navigate(['authentication/login']);
  }
}
