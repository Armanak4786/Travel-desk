import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'auro-ui';
import { Observable, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MasterDataService } from 'projects/modules/shared/services/master-data.service';
import { EmployeeProfileService } from 'projects/modules/shared/services/employee-profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl!: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private masterDataService: MasterDataService,
    private employeeProfileService: EmployeeProfileService
  ) {
    this.configService.waitForConfig().then(() => {
      const config = this.configService.getConfig();
      this.apiUrl = config.TravelDesk_Server;
    });
  }

  login(email: string, password: string): Observable<any> {
    return from(this.configService.waitForConfig()).pipe(
      switchMap(() => {
        const config = this.configService.getConfig();
        this.apiUrl = config.TravelDesk_Server;
        const url = `${this.apiUrl}/auth/token`;
        return this.http.post<any>(url, { email, password });
      }),
      tap((response: any) => {
        if (response?.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('accessToken', response.accessToken);
        }
      })
    );
  }

  logout() {
    // Clear master data cache
    this.masterDataService.clearCache();
    this.employeeProfileService.clearCache();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/authentication/login']);
  }
}

