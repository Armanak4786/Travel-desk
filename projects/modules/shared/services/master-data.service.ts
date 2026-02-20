import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'auro-ui';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

// Interface for master data items
export interface MasterDataItem {
  id: number;
  name: string;
}

// Interface for the complete master data response
export interface MasterData {
  currencyTypes: MasterDataItem[];
  expenseTypes: MasterDataItem[];
  modeOfTransports: MasterDataItem[];
  purposeOfTravels: MasterDataItem[];
  travelTypes: MasterDataItem[];
  reimbursementTypes: MasterDataItem[];
}

// Interface for API response
interface MasterDataResponse {
  data: MasterData;
  error: any;
  message: string | null;
  warnings: any;
  isSuccess: boolean;
}

// Interface for dropdown options
export interface DropdownOption {
  label: string;
  value: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private readonly CACHE_KEY = 'masterData';
  private apiUrl: string = '';

  // Image mapping for mode of transport
  private readonly transportImages: { [key: string]: string } = {
    'Air': 'assets/images/transport/airplaneTilt.svg',
    'Train': 'assets/images/transport/train.svg',
    'Bus': 'assets/images/transport/bus.svg',
    'Cab': 'assets/images/transport/cab.svg',
    'Others': ''
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private messageService: MessageService
  ) {}

  /**
   * Fetches master data from API and caches it in sessionStorage
   * Should be called once on successful login
   */
  async fetchAndCacheMasterData(): Promise<MasterData | null> {
    try {
      // Wait for config to be loaded
      await this.configService.waitForConfig();
      const config = this.configService.getConfig();
      this.apiUrl = config.TravelDesk_Server;

      const url = `${this.apiUrl}/MasterData`;
      const response = await firstValueFrom(this.http.get<MasterDataResponse>(url));

      if (response?.isSuccess && response?.data) {
        // Cache the data in sessionStorage
        sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response?.message || 'Failed to fetch master data');
      }
    } catch (error: any) {
      console.error('Error fetching master data:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'Failed to load master data. Please try again.'
      });
      return null;
    }
  }

  /**
   * Gets cached master data from sessionStorage
   */
  getMasterData(): MasterData | null {
    const cached = sessionStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Checks if master data is available in cache
   */
  hasCachedData(): boolean {
    return !!sessionStorage.getItem(this.CACHE_KEY);
  }

  /**
   * Clears cached master data (call on logout)
   */
  clearCache(): void {
    sessionStorage.removeItem(this.CACHE_KEY);
  }

  // ==================== DROPDOWN GETTERS ====================

  /**
   * Gets travel types for dropdown (Domestic, International)
   */
  getTravelTypes(): DropdownOption[] {
    const data = this.getMasterData();
    return data?.travelTypes?.map(item => ({
      label: item.name,
      value: item.id
    })) || [];
  }

  /**
   * Gets expense types for dropdown (Reimbursable by Client, Non Reimbursable)
   */
  getExpenseTypes(): DropdownOption[] {
    const data = this.getMasterData();
    return data?.expenseTypes?.map(item => ({
      label: item.name,
      value: item.id
    })) || [];
  }

  /**
   * Gets purpose of travel options for dropdown
   */
  getPurposeOfTravels(): DropdownOption[] {
    const data = this.getMasterData();
    return data?.purposeOfTravels?.map(item => ({
      label: item.name,
      value: item.id
    })) || [];
  }

  /**
   * Gets mode of transport options with images for SelectButton
   */
  getModeOfTransports(): DropdownOption[] {
    const data = this.getMasterData();
    return data?.modeOfTransports?.map(item => ({
      label: item.name,
      value: item.id,
      image: this.transportImages[item.name] || ''
    })) || [];
  }

  /**
   * Gets currency types for dropdown
   */
  getCurrencyTypes(): DropdownOption[] {
    const data = this.getMasterData();
    return data?.currencyTypes?.map(item => ({
      label: item.name,
      value: item.id
    })) || [];
  }

  /**
   * Gets reimbursement types for dropdown (Car, Travel, Food, Miscellaneous)
   */
  getReimbursementTypes(): DropdownOption[] {
    const data = this.getMasterData();
    return data?.reimbursementTypes?.map(item => ({
      label: item.name,
      value: item.id
    })) || [];
  }

  // ==================== HELPER METHODS ====================

  /**
   * Gets the name of a master data item by its ID and type
   */
  getNameById(type: keyof MasterData, id: number): string | null {
    const data = this.getMasterData();
    if (!data || !data[type]) return null;
    
    const item = data[type].find(i => i.id === id);
    return item?.name || null;
  }

  /**
   * Gets the ID of a master data item by its name and type
   */
  getIdByName(type: keyof MasterData, name: string): number | null {
    const data = this.getMasterData();
    if (!data || !data[type]) return null;
    
    const item = data[type].find(i => i.name.toLowerCase() === name.toLowerCase());
    return item?.id || null;
  }
}
