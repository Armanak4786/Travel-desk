import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "auro-ui";
import { MessageService } from "primeng/api";
import { BehaviorSubject, firstValueFrom } from "rxjs";

export interface EmployeeCardInfo {
  name: string;
  // Display value for "Employee ID" on UI (this is employeeCode like "2561")
  employeeId: string;
  department: string;
  grade: string;
  designation: string;
  email?: string;
  avatar?: string;
}

interface EmployeeDto {
  employeeId: number;
  entityName: string;
  employeeCode: string;
  employeeName: string;
  emailID: string;
  designation: string;
  grade: string;
  businessUnit: string;
  reportingManagerEmpCode: string;
  buHeadEmpCode: string;
  createdAt: string;
}

interface EmployeeResponse {
  data: EmployeeDto;
  error: any;
  message: string | null;
  warnings: any;
  isSuccess: boolean;
}

interface EmployeeProfileCache {
  employeeId: number;
  card: EmployeeCardInfo;
}

@Injectable({
  providedIn: "root",
})
export class EmployeeProfileService {
  private readonly CACHE_KEY = "employeeProfile:v2";
  private readonly LEGACY_CACHE_KEY = "employeeProfile";
  private apiUrl: string = "";

  private readonly employeeCardInfoSubject =
    new BehaviorSubject<EmployeeCardInfo | null>(this.getCachedEmployeeCardInfo());

  readonly employeeCardInfo$ = this.employeeCardInfoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private messageService: MessageService
  ) {}

  /**
   * Fetches employee profile once per session (per employeeId) and caches it in sessionStorage.
   * Intended to be called once on successful login.
   */
  async fetchAndCacheEmployeeProfile(employeeId: number): Promise<EmployeeCardInfo | null> {
    if (!employeeId || Number.isNaN(employeeId)) {
      return null;
    }

    const existing = this.getCached();
    if (existing?.employeeId === employeeId && existing?.card) {
      this.employeeCardInfoSubject.next(existing.card);
      return existing.card;
    }

    try {
      await this.configService.waitForConfig();
      const config = this.configService.getConfig();
      this.apiUrl = config.TravelDesk_Server;

      const url = `${this.apiUrl}/Employees/${employeeId}`;
      const response = await firstValueFrom(this.http.get<EmployeeResponse>(url));

      if (response?.isSuccess && response?.data) {
        const dto = response.data;

        // Explicit mapping of ONLY fields used by the read-only UI card
        const card: EmployeeCardInfo = {
          name: dto.employeeName ?? "N/A",
          // UI shows employeeCode (e.g. "2561"), not the numeric employeeId (e.g. 97)
          employeeId: (dto.employeeCode ?? "N/A").toString(),
          department: dto.businessUnit ?? "N/A",
          grade: (dto.grade ?? "N/A").toString(),
          designation: dto.designation ?? "N/A",
          email: dto.emailID ?? undefined,
        };

        const cache: EmployeeProfileCache = { employeeId, card };
        sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
        this.employeeCardInfoSubject.next(card);
        return card;
      }

      throw new Error(response?.message || "Failed to fetch employee profile");
    } catch (error: any) {
      console.error("Error fetching employee profile:", error);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load employee profile. Please try again.",
      });
      return null;
    }
  }

  /**
   * Reads cached card info (if any) from sessionStorage.
   */
  getCachedEmployeeCardInfo(): EmployeeCardInfo | null {
    return this.getCached()?.card || null;
  }

  /**
   * Clears cached employee profile (call on logout).
   */
  clearCache(): void {
    sessionStorage.removeItem(this.CACHE_KEY);
    sessionStorage.removeItem(this.LEGACY_CACHE_KEY);
    this.employeeCardInfoSubject.next(null);
  }

  private getCached(): EmployeeProfileCache | null {
    const cached = sessionStorage.getItem(this.CACHE_KEY);
    if (!cached) return null;
    try {
      return JSON.parse(cached) as EmployeeProfileCache;
    } catch {
      return null;
    }
  }
}

