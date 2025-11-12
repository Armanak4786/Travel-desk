import { Injectable, signal } from "@angular/core";
import { DataService, StorageService } from "auro-ui";
import { BehaviorSubject, firstValueFrom, map } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  userName: String;
  userSelectedOption: any;
  userSelectedPartyNo: any;
  userOptions: any;
  userCodeName: any;
  dealerAnimate: boolean = false;
  userType: "Internal" | "External" = "Internal";
  introducers: any;

  // public onOriginatorChange = new BehaviorSubject<any>(null);
  public onOriginatorChange = signal<any>(null);
  public quoteRoute = new BehaviorSubject<any>(false);
  public isProductSelected: boolean = false;
  public isDealerCalculated: boolean;
  public programChange$ = new BehaviorSubject<boolean>(false);

  private readonly ACTIVATED_CONTRACT_STATE_LIST = "Complete Activated";
  private readonly ACTIVATED_PRODUCT_LIST = "CSA-C-Assigned,CSA-B-Assigned";

  applicationStatus = [
    { img: "assets/images/icon/card-edit.svg", count: 68, name: "Started" },
    { img: "assets/images/icon/card-tick.svg", count: 42, name: "Submitted" },
    {
      img: "assets/images/icon/wallet-money.svg",
      count: 1080250,
      name: "Applications Value",
    },
  ];

  workFlow = [
    { label: "Quote", amount: 1500, count: 20 },
    { label: "Assessment", amount: 500, count: 10 },
    { label: "Approved", amount: 500, count: 12 },
    { label: "With Customer for Signing", amount: 200, count: 10 },
    { label: "Verification", amount: 300, count: 15 },
    { label: "Settlement", amount: 500, count: 10 },
  ];

  activatedContractListActions = [
    {
      action: "open",
      name: "open",
      icon: "fa-regular fa-ellipsis",
    },
  ];
  actions = [
    {
      action: "edit",
      name: "edit",
      icon: "fa-regular fa-pen-to-square",
      color: "--primary-color",
    },
    {
      action: "copy",
      name: "copy",
      icon: "fa-regular fa-clone",
      color: "--primary-color",
    },
    {
      action: "view",
      name: "view",
      icon: "fa-regular fa-eye",
      color: "--primary-color",
    },
    {
      action: "delete",
      name: "delete",
      icon: "fa-regular fa-trash-can",
      color: "--danger-color",
    },
  ];

  constructor(
    // private service: DashboardService,
    public data: DataService,
    private router: Router,
    private http: HttpClient,
    private stoteSvc: StorageService
  ) {
    this.loadProducts();
  }

  async getQuoteList(pageNo, pageSize) {
    // ?PageNo=1&PageSize=600
    let quoteList = await this.data
      .get(`Contract/get_allcontract?PageNo=${pageNo}&PageSize=${pageSize}`)
      .pipe(
        map((res) => {
          return res?.data || null;
        })
      )
      .toPromise();

    this.quoteListingData = this.getBindQuoteTableData(quoteList);
    return quoteList;
  }

  getBindQuoteTableData(quoteList: any) {
    let apiData = [];
    quoteList?.forEach((quote) => {
      let obj = {
        StartDate: quote?.calcDt,
        contractId: quote?.contractId,
        // CustomerName: quote?.customerParty?.extName || "--",
        CustomerName:
          quote?.customerParty?.extName || quote?.originatorReference,
        LoanAmount: quote?.amtFinanced,
        LoanTerm: quote?.termMonths,
        RepaypemntFrequency: "--",
        actions: this.actions,
        dealerName: quote?.dealer?.extName,
        dealerId: quote?.dealer?.partyNo,
        product: quote?.product,
      };
      apiData.push(obj);
      this.quoteListingData = [...apiData];
    });
    // this.apiData.push(this.hardCoded);

    this.quoteListingData = [...apiData];
    this.quoteListing.next(this.quoteListingData);
    // this.cd.detectChanges();
  }

  getUserCode(): string | null {
    const token = sessionStorage.getItem("accessToken");
    const decodedToken = this.decodeToken(token);
    return decodedToken?.preferred_username || decodedToken?.sub || null;
  }

  async getActivatedContracts() {
    const userCode = this.getUserCode();
    const body = {
      userCode: userCode,
      dealerId: null,
      contractStateList: this.ACTIVATED_CONTRACT_STATE_LIST,
      productList: this.ACTIVATED_PRODUCT_LIST,
    };

    let contracts = await this.data
      .post(`Settlement/get_grid_activatedloans`, body)
      .pipe(map((res) => res?.data || []))
      .toPromise();

    this.activatedContractData = this.bindActivatedContracts(contracts);

    // push everything to BehaviorSubject once
    this.activatedContractList.next(this.activatedContractData);
    return this.activatedContractData;
  }

  // bindActivatedContracts(contractList: any) {
  //   let apiData = [];
  //   contractList?.forEach((contract) => {
  //     let obj = {
  //       id: contract?.id,
  //       loanId: contract?.loanId,
  //       customerName: contract?.customerName,
  //       asset: contract?.asset,
  //       regNo: contract?.regNo,
  //       loanAmount: contract?.loanAmount,
  //       maturityDate: contract?.maturityDate,
  //       product: contract?.product,
  //       loanBalance: contract?.loanBalance,
  //       phone: contract?.phone,
  //       email: contract?.email,
  //       actions: this.actions,
  //     };
  //     apiData.push(obj);
  //   });

  //   this.activatedContractData = [...apiData];
  //   this.activatedContractList.next(this.activatedContractData);
  //   return this.activatedContractData;
  // }

  bindActivatedContracts(contractList: any) {
    return (
      contractList?.map((contract) => ({
        id: contract?.id,
        loanId: contract?.loanID,
        customerName: contract?.customerName,
        asset: contract?.asset,
        regNo: contract?.regoNo,
        loanAmount: contract?.amount,
        maturityDate: contract?.maturityDate,
        product: contract?.product,
        loanBalance: contract?.loanBalance,
        phone: contract?.phone,
        email: contract?.email,
        actions: this.actionForActivatedContractList,
      })) || []
    );
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      // console.error('Invalid Token', error);
      return null;
    }
  }

  actionForActivatedContractList = [
    {
      icon: "fa-solid fa-ellipsis",
    },
  ];

  quoteListingData: any = [];
  quoteListing = new BehaviorSubject<any>(this.quoteListingData);

  activatedContractData: any = [];
  activatedContractList = new BehaviorSubject<any>(this.activatedContractData);

  applicationListing = new BehaviorSubject<any>([
    {
      id: 1,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 1",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Weekly",
      status: "Pending",
      actions: this.actions,
    },
    {
      id: 2,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 2",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: this.actions,
    },
    {
      id: 3,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 3",
      LoanAmount: "5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: this.actions,
    },
    {
      id: 4,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 4",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: this.actions,
    },
    {
      id: 5,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 5",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: this.actions,
    },
    {
      id: 6,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 6",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: this.actions,
    },
    {
      id: 7,
      StartDate: new Date("2024-10-21T00:00:00"),
      ApplicationID: "ABC9720r97239294",
      CustomerName: "Customer Name 7",
      LoanAmount: "$5000",
      LoanTerm: "5 yrs",
      RepaypemntFrequency: "Monthly",
      status: "In-process",
      actions: this.actions,
    },
  ]);

  activatedContractListing = new BehaviorSubject<any>([
    {
      id: 1,
      loanId: "321321",
      customerName: "David",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 2,
      loanId: "321321",
      customerName: "John",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 3,
      loanId: "321321",
      customerName: "paul",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 4,
      loanId: "321321",
      customerName: "Micky",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 5,
      loanId: "321321",
      customerName: "abc",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 6,
      loanId: "321321",
      customerName: "Customer Name 1",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 7,
      loanId: "3396",
      customerName: "Bh Na",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 8,
      loanId: "3580",
      customerName: "Ani Vin",
      maturityDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      loanAmount: "5000",
      product: "CSV",
      loanBalance: "$00,0000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
  ]);

  afvLoanListing = new BehaviorSubject<any>([
    {
      id: 1,
      loanId: "321321",
      customerName: "David",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 2,
      loanId: "321321",
      customerName: "John",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 3,
      loanId: "321321",
      customerName: "paul",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 4,
      loanId: "321321",
      customerName: "Micky",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",

      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 5,
      loanId: "321321",
      customerName: "abc",
      futureValDate: new Date("2024-10-21T00:00:00"),
      maxPermittedKM: "30,000",

      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 6,
      loanId: "321321",
      customerName: "Customer Name 1",
      maxPermittedKM: "30,000",

      futureValDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
    {
      id: 7,
      loanId: "3396",
      customerName: "Customer Name 2",
      maxPermittedKM: "30,000",

      futureValDate: new Date("2024-10-21T00:00:00"),
      asset: "1234",
      regNo: "342423",
      futureValAmount: "5000",
      loanBalance: "00000",
      phone: "9898387246",
      email: "abc@gmail.com",
      actions: this.actionForActivatedContractList,
    },
  ]);

  async callOriginatorApi() {
    let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.decodeToken(accessToken);
    let sub = decodedToken?.preferred_username || decodedToken?.sub;
    let introducersData = await this.data
      .get(`User/get_introducers?userCode=${sub}`)
      .pipe(
        map((res) => {
          return res?.data || null;
        })
      )
      .toPromise();
    this.introducers =
      introducersData?.introducers.map((item) => ({
        originatorNo: item.originatorNo,
        waive: item.waiveLoanMaintenanceFee,
      })) || [];
    let users = introducersData?.introducers;
    let jsonArray = Array.isArray(users)
      ? users
          .map((item) => ({
            label: item.originatorName,
            value: {
              num: item.originatorNo,
              name: item.originatorName,
            },
            id: item?.originatorId,
            ...item,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
    this.userOptions = jsonArray;
    let defaultUser = users?.find((ele) => {
      return ele.isDefault == true;
    });
    if (introducersData?.externalUserType?.includes("External")) {
      let userSelected;
      this.userType = "External";
      sessionStorage.setItem("externalUserType", this.userType);

      let num = sessionStorage.getItem("dealerPartyNumber");
      let name = sessionStorage.getItem("dealerPartyName");
      if (num && name) {
        userSelected = { name: name, num: Number(num) };
      }
      if (userSelected) {
        this.userSelectedOption = { name: name, num: Number(num) };
        // this.setDealerToLocalStorage(this.userSelectedOption)
      } else {
        this.userSelectedOption = {
          name: defaultUser.originatorName,
          num: defaultUser.originatorNo,
        };
        // this.setDealerToLocalStorage(this.userSelectedOption)
      }
      this.setDealerToLocalStorage(this.userSelectedOption);
      this.isDealerCalculated = false;
    } else {
      sessionStorage.removeItem("dealerPartyNumber");
      sessionStorage.removeItem("dealerPartyName");
      sessionStorage.setItem("externalUserType", "Internal");
    }
  }

  setDealerToLocalStorage(value) {
    let dealerValue = value?.num;
    let dealerName = value?.name;

    let currentRoute = this.router.url;
    if (currentRoute == "/dealer/quick-quote" || currentRoute === "/dealer") {
      sessionStorage.setItem("dealerPartyNumber", dealerValue);
      sessionStorage.setItem("dealerPartyName", dealerName);
    }
    if (currentRoute != "/dealer") {
      this.isDealerCalculated = true; // reset calc status
    }
    // this.onOriginatorChange.next(value);
    this.onOriginatorChange.set(value);

    // const isExternalUser = localStorage.getItem('externalUserType');

    // if (dealerValue && isExternalUser?.includes('External')) {
    //   this.onOriginatorChange.next(dealerValue);
    // }
  }

  private currentRowDataSubject = new BehaviorSubject<any>(null);
  public currentRowData$ = this.currentRowDataSubject.asObservable();

  setCurrentRowData(data: any) {
    this.currentRowDataSubject.next(data);
  }

  getCurrentRowData() {
    return this.currentRowDataSubject.value;
  }

  private products: any[] = [];
  async loadProducts(): Promise<void> {
    if (!this.products || this.products.length === 0) {
      const res = await firstValueFrom(
        this.http.get<any>("assets/api-json/productCode.json")
      );

      this.products = res?.ProductCode || [];
    }
  }

  getCodeByName(name: string): string | null {
    if (!this.products || this.products.length === 0) {
      return null;
    }

    let item = this.products.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );

    if (!item) {
      item = this.products.find(
        (p) => p.description?.toLowerCase() === name.toLowerCase()
      );
    }

    if (!item) {
      item = this.products.find(
        (p) =>
          p.description?.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(p.description?.toLowerCase())
      );
    }

    return item ? item.parentCode : null;
  }
  async getCustomerStatement(
    contractId: string | number,
    productCode: string
  ): Promise<any> {
    try {
      const url = `Contract/customer_statement?contractId=${contractId}&PRCode=${productCode}`;

      const response = await this.data
        .get(url)
        .pipe(
          map((res) => {
            return res?.data || res || null;
          })
        )
        .toPromise();

      return response;
    } catch (error) {
      throw error;
    }
  }
}
