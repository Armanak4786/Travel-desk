import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'auro-ui';
import { Observable, of, from, throwError } from 'rxjs';
import { map, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { MasterDataService } from './master-data.service';

export interface LocationOption {
  label: string;
  value: string;
  subLabel: string;
  type: 'airport' | 'city' | 'station';
  iataCode?: string;
  countryCode?: string;
}

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AmadeusLocation {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  iataCode: string;
  address: {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
  };
}

interface AmadeusLocationResponse {
  data: AmadeusLocation[];
}

interface GeoapifyResult {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
  formatted?: string;
  result_type?: string;
}

interface GeoapifyResponse {
  results: GeoapifyResult[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationSearchService {
  private amadeusToken: string | null = null;
  private tokenExpiry: number = 0;
  private tokenRequest$: Observable<string> | null = null;

  // Mode of Transport IDs from master data
  private airModeId: number | null = null;
  private trainModeId: number | null = null;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private masterDataService: MasterDataService
  ) {
    this.initializeModeIds();
  }

  private initializeModeIds(): void {
    this.airModeId = this.masterDataService.getIdByName('modeOfTransports', 'Air');
    this.trainModeId = this.masterDataService.getIdByName('modeOfTransports', 'Train');
  }

  /**
   * Main entry point - routes to appropriate API based on transport mode
   */
  searchByMode(query: string, modeId: number): Observable<LocationOption[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    // Ensure mode IDs are initialized
    if (this.airModeId === null) {
      this.initializeModeIds();
    }

    if (modeId === this.airModeId) {
      return this.searchAirports(query);
    } else {
      return this.searchCities(query);
    }
  }

  /**
   * Search airports using Amadeus API
   */
  searchAirports(query: string): Observable<LocationOption[]> {
    return this.getAmadeusToken().pipe(
      switchMap(token => {
        const url = `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${encodeURIComponent(query)}&subType=AIRPORT,CITY&page[limit]=10`;
        
        // Use fetch to bypass Angular HTTP interceptors
        return from(
          fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(res => {
            if (!res.ok) {
              return res.json().then(err => Promise.reject(err));
            }
            return res.json() as Promise<AmadeusLocationResponse>;
          })
        );
      }),
      map(response => this.mapAmadeusResponse(response)),
      catchError(error => {
        console.error('Amadeus API error:', error);
        // Fallback to Geoapify if Amadeus fails
        return this.searchCities(query);
      })
    );
  }

  /**
   * Search cities using Geoapify API
   */
  searchCities(query: string): Observable<LocationOption[]> {
    return from(this.configService.waitForConfig()).pipe(
      switchMap(() => {
        const config = this.configService.getConfig();
        const apiKey = config.Geoapify_Api_Key;

        if (!apiKey) {
          console.warn('Geoapify API key not configured');
          return of([] as LocationOption[]);
        }

        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&format=json&limit=10&apiKey=${apiKey}`;
        
        return this.http.get<GeoapifyResponse>(url).pipe(
          map(response => this.mapGeoapifyResponse(response))
        );
      }),
      catchError(error => {
        console.error('Geoapify API error:', error);
        return of([]);
      })
    );
  }

  /**
   * Get Amadeus OAuth token (cached)
   */
  private getAmadeusToken(): Observable<string> {
    const now = Date.now();

    // Return cached token if still valid
    if (this.amadeusToken && now < this.tokenExpiry - 60000) {
      return of(this.amadeusToken);
    }

    // Return existing request if in progress
    if (this.tokenRequest$) {
      return this.tokenRequest$;
    }

    // Request new token
    this.tokenRequest$ = from(this.configService.waitForConfig()).pipe(
      switchMap(() => {
        const config = this.configService.getConfig();
        const clientId = config.Amadeus_Client_Id;
        const clientSecret = config.Amadeus_Client_Secret;

        if (!clientId || !clientSecret) {
          return throwError(() => new Error('Amadeus credentials not configured'));
        }

        const body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        body.set('client_id', clientId);
        body.set('client_secret', clientSecret);

        // Use fetch to bypass Angular HTTP interceptors that may add Authorization headers
        return from(
          fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body.toString()
          }).then(res => {
            if (!res.ok) {
              return res.json().then(err => Promise.reject(err));
            }
            return res.json() as Promise<AmadeusTokenResponse>;
          })
        );
      }),
      map(response => {
        this.amadeusToken = response.access_token;
        this.tokenExpiry = Date.now() + (response.expires_in * 1000);
        this.tokenRequest$ = null;
        return this.amadeusToken;
      }),
      shareReplay(1),
      catchError(error => {
        this.tokenRequest$ = null;
        return throwError(() => error);
      })
    );

    return this.tokenRequest$;
  }

  /**
   * Map Amadeus response to LocationOption[]
   */
  private mapAmadeusResponse(response: AmadeusLocationResponse): LocationOption[] {
    if (!response?.data) return [];

    return response.data.map(location => {
      const isAirport = location.subType === 'AIRPORT';
      const cityName = location.address?.cityName || location.name;
      const countryName = location.address?.countryName || '';
      
      return {
        label: cityName,
        value: cityName,
        subLabel: isAirport 
          ? `${location.iataCode}, ${location.name}`
          : `${location.iataCode || ''}, ${countryName}`.replace(/^, /, ''),
        type: isAirport ? 'airport' : 'city',
        iataCode: location.iataCode,
        countryCode: location.address?.countryCode
      } as LocationOption;
    });
  }

  /**
   * Map Geoapify response to LocationOption[]
   */
  private mapGeoapifyResponse(response: GeoapifyResponse): LocationOption[] {
    if (!response?.results) return [];

    return response.results.map(result => {
      const cityName = result.city || result.name || '';
      const state = result.state || '';
      const country = result.country || '';

      return {
        label: cityName,
        value: cityName,
        subLabel: [state, country].filter(Boolean).join(', '),
        type: 'city',
        countryCode: result.country_code?.toUpperCase()
      } as LocationOption;
    }).filter(opt => opt.label); // Filter out empty results
  }
}
