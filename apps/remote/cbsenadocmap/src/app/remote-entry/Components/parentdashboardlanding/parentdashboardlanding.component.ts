import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2,
  ElementRef,
  EventEmitter, 
  Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
//========to covert promise to observer======
import {
  from,
  forkJoin,
  combineLatest,
  Observable,
  Subscription,
  retry, 
  catchError,
  throwError,
  of,
  //map,
  Subject
} from 'rxjs';
import {
  map, groupBy, mergeMap, toArray
} from 'rxjs/operators';




import { Tablegrid, ColumnDefinition } from '@dmsportal/dashboard';
import * as moment from 'moment';
//---------date formate ends ---
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import { MasterdetailsrendererComponent } from '../masterdetailsrenderer/masterdetailsrenderer.component';

import { ActivatedRoute } from '@angular/router'; // to read the url route

//=========for voice recognition ===========
import { TransferState, makeStateKey } from '@angular/platform-browser';
//import { WebsocketService } from '@portal/core';
//import { io } from 'socket.io-client';

const configKey = makeStateKey('CONFIG');
//------------

//====import data from local storage ==
//import * as fs from 'fs';
//import * as path from 'path';



import { AgGridAngular } from 'ag-grid-angular';
import { 
  CellClickedEvent, 
  ColDef,
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ICellEditorParams,
  RowEditingStartedEvent,
  RowEditingStoppedEvent, 
} from 'ag-grid-community';

//===for editing starts====
//import * as $ from 'jquery';
//import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import Swal from 'sweetalert2';


//=============================
import { Grid, GridOptions } from 'ag-grid-community';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'ag-grid-enterprise';
//-------------------------

//==========for html to image =======
import * as htmlToImage from 'html-to-image';
import printDoc from "../pdfExport/printDoc";


import * as _ from 'lodash';


//============for ngx-loading..=========
import { DomSanitizer } from '@angular/platform-browser';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxLoadingComponent } from 'ngx-loading';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';

//----------ngx-loading ends----------


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

//--------------editing ends ---

//===========ajax service starts ====

export class HttpajaxService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(public http: HttpClient) { }


  public saveData(
    url: string, 
    data: any
    ): Observable<any> {
        return this.http.post(
          url, 
          data, 
          { headers: this.headers});
  }
}
//----------ajax service ends ----



declare let webkitSpeechRecognition: any; // for voice recognition



@Component({
  selector: 'dmsportal-parentdashboardlanding',
  templateUrl: './parentdashboardlanding.component.html',
  styleUrls: ['./parentdashboardlanding.component.scss'],
})
export class ParentdashboardlandingComponent implements OnInit, AfterViewInit {
  tg = new Tablegrid();

  siteAbsoluteUrl = window.location.origin;
  //siteAbsoluteUrl = 'https://enadocreport.com/';
  //public rowDataCM: string;
  public rowDataWP: any;
  mpTG = new Tablegrid();
  public workflows = [];
  rowData: any;

  ungroupedData: any = [];
  groupedData: any = [];

  public txtOfQuickSearchInpFld: any;
  //public rowHeight:any;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  rowData$!: Observable<any[]>;

  private logedInUser = {
    aDId: 0,
    name: '',
    email: '',
    empID: '',
    office: '',
    access: 'NoAccess',
  };

  private listInfo = {
    name: '',
    query: '',
    expand: '',
    select: '',
    filter: '',
    orderByPrm: '',
    orderByVal: false,
    top: 20,
  };

  private detListInfo = {
    name: '',
    query: '',
    expand: '',
    select: '',
    filter: '',
    top: 200000,
  };

  //=========for infinite scrolling and lazy loading start=========
  rowBuffer: any;
  cacheOverflowSize: any;
  maxConcurrentDatasourceRequests: any;
  infiniteInitialRowCount: any;
  maxBlocksInCache: any;
  components: any;

  private onGridReadyParamsApi: any;

  private dbTagUrlInfo = {
    titleTag: '',
    urlVoice: '',
    qryStrKeyVal: '',
    qryStrKeyTyp: 'GUID',
    mode1: '',
    mode2: '',
  };

  @ViewChild('filterTextBox') filterTextBox: any;

  private clickedDashboardInfo = {
    wfName: 'Upload Report',
    acessPermission: 'Unauthorized',
    listIndex: 0,
    serviceFnName: 'fetchListItemWithExpStFilOrd',
    config: {},
    mapedData: { d: [] },
    recMstLocDat: { d: [] },
  };

  socket: any;
  recentMstLocData: any;
  dashboardsListsInfo: any;
  elementRenderer!: any;
  updatedata!: any;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      //'Content-Type': 'application/json',

      // "ACCEPT": "application/json;odata=verbose",
      // "content-type": "application/json;odata=verbose"

      Accept: 'application/json; odata=verbose',
      'Content-Type': 'application/json; odata=verbose',
      'X-HTTP-Method': 'MERGE',
      'IF-MATCH': '*',
    }),
  };

  imgNode!: any;

  //downloadAs: SupportedExtensions = 'png';

  // exportAsConfig: ExportAsConfig = {
  //   type: 'xlsx', // the type you want to download
  //   elementIdOrContent: 'sampleTable', // the id of html/table element
  // };
  @ViewChild('basEnaReport', { static: false }) basEnaReport: ElementRef;
  @Output() headerFieldChange = new EventEmitter<any>();
  hideInPrtView = false;


  //========= print configuration with data grid ====
  PDF_HEADER_COLOR = "#f8f8f8";
  PDF_INNER_BORDER_COLOR = "#dde2eb";
  PDF_OUTER_BORDER_COLOR = "#babfc7";
  PDF_LOGO = "./assets/bashundhara.png";
  PDF_PAGE_ORITENTATION = "landscape";
  PDF_WITH_HEADER_IMAGE = true;
  PDF_WITH_FOOTER_PAGE_COUNT = true;
  PDF_HEADER_HEIGHT = 25;
  PDF_ROW_HEIGHT = 15;
  PDF_ODD_BKG_COLOR = "#fcfcfc";
  PDF_EVEN_BKG_COLOR = "#ffffff";
  PDF_WITH_CELL_FORMATTING = true;
  PDF_WITH_COLUMNS_AS_LINKS = true;
  PDF_SELECTED_ROWS_ONLY = false;
  //----------------------ends-----------------------

  swSavePdfBtn = false;
  swSavePdfWithoutDataBtn = false;
  swDataGridView = false;
  swPrtViewExcDtDiv = false;

  _parentData = {
    noOfAccounts : 0,
    noOfPages: 0
  }

  swReturnHomeBtn = false;

  //============for ngx-loading..=========
  @ViewChild('ngxLoading', { static: false })
  ngxLoadingComponent!: NgxLoadingComponent;

  @ViewChild('customLoadingTemplate', { static: false })
  customLoadingTemplate!: TemplateRef<any>;
  @ViewChild('emptyLoadingTemplate', { static: false })
  emptyLoadingTemplate!: TemplateRef<any>;
  showingTemplate = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate!: TemplateRef<any>;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px',
  };

  //----------ngx-loading ends----------



  

  constructor(
    private _actRoute: ActivatedRoute,
    //private websocketService: WebsocketService,
    private httpClient: HttpClient,
    elRenderer: Renderer2
    //private exportAsService: ExportAsService
  ) {
    this.elementRenderer = elRenderer;

    
  }



  getMappedData() {
    //========mapping for EmployeeReimbursement===========
    return new Promise((resolve, reject) => {
      if (this.clickedDashboardInfo.wfName == 'EmployeeReimbursement') {
        const mapedData = JSON.parse(JSON.stringify(this.rowData)).map(
          (e: any) => ({
            Title: e.Title,
            ID: e.ID,
            GUID: e.GUID,
            Modified: e.Modified,
            Created: e.Created,
            Status: e.Status,
            PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
            Author: {
              ID: e.Author.ID,
              Title: e.Author.Title,
              Office: e.Author.Office,
              JobTitle: e.Author.JobTitle,
            },
            EmployeeId: e.EmployeeId,
            Entitlement: e.Entitlement,
            GLCode: e.GLCode,
            CostCenter: e.CostCenter,
            TotalReimbursementAmount: e.TotalReimbursementAmount,
            ItemName: e.ItemName,
          })
        );

        //update local in memory from storage by recently fetched data from SP list
        this.clickedDashboardInfo.mapedData.d = mapedData;

        setTimeout(function () {
          //======performane testing =====
          const startForEach = performance.now();
          mapedData.forEach((x: any) => (x + x) * 10000000000);
          const endForEach = performance.now();
          console.log(
            `Speed [forEach]: ${endForEach - startForEach} miliseconds`
          );

          const startMap = performance.now();
          mapedData.map((x: any) => (x + x) * 10000000000);
          const endMap = performance.now();
          console.log(`Speed [map]: ${endMap - startMap} miliseconds`);
          //-----------------------
        }, 1000);

        resolve(mapedData);
        return mapedData;
      } else if (this.clickedDashboardInfo.wfName == 'MobileHandsetRequests') {
        const mapedData = JSON.parse(JSON.stringify(this.rowData)).map(
          (e: any) => ({
            Title: e.Title,
            ID: e.ID,
            GUID: e.GUID,
            Modified: e.Modified,
            Created: e.Created,
            Status: e.Status,
            PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
            Author: {
              ID: e.Author.ID,
              Title: e.Author.Title,
              Office: e.Author.Office,
              JobTitle: e.Author.JobTitle,
            },
            EmployeeId: e.EmployeeId,
            Justification: e.Justification,
          })
        );

        //update local in memory from storage by recently fetched data from SP list
        this.clickedDashboardInfo.mapedData.d = mapedData;

        setTimeout(function () {
          //======performane testing =====
          const startForEach = performance.now();
          mapedData.forEach((x: any) => (x + x) * 10000000000);
          const endForEach = performance.now();
          console.log(
            `Speed [forEach]: ${endForEach - startForEach} miliseconds`
          );

          const startMap = performance.now();
          mapedData.map((x: any) => (x + x) * 10000000000);
          const endMap = performance.now();
          console.log(`Speed [map]: ${endMap - startMap} miliseconds`);
          //-----------------------
        }, 1000);

        resolve(mapedData);
        return mapedData;
      } else if (this.clickedDashboardInfo.wfName == 'PoolCarRequisition') {
        const mapedData = JSON.parse(JSON.stringify(this.rowData)).map(
          (e: any) => ({
            Title: e.Title,
            ID: e.ID,
            GUID: e.GUID,
            Modified: e.Modified,
            Created: e.Created,
            Status: e.Status,
            PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
            Author: {
              ID: e.Author.ID,
              Title: e.Author.Title,
              Office: e.Author.Office,
              JobTitle: e.Author.JobTitle,
            },
            EmployeeId: e.EmployeeId,
            StartDate: e.StartDate,
            EndDate: e.EndDate,
            NoOfDays: e.NoOfDays,
            StartTime: e.StartTime,
            EndTime: e.EndTime,
            TotalHours: e.TotalHours,
            AccompaniedPersonNo: e.AccompaniedPersonNo,
            AccompaniedPersonsName: e.AccompaniedPersonsName,
            PurposeOfVisit: e.PurposeOfVisit,
          })
        );
        this.clickedDashboardInfo.mapedData.d = mapedData;

        resolve(mapedData);
        return mapedData;
      } else if (this.clickedDashboardInfo.wfName == 'EmployeeAdvanceRequest') {
        const mapedData = JSON.parse(JSON.stringify(this.rowData)).map(
          (e: any) => ({
            Title: e.Title,
            ID: e.ID,
            GUID: e.GUID,
            Modified: e.Modified,
            Created: e.Created,
            Status: e.Status,
            PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
            Author: {
              ID: e.Author.ID,
              Title: e.Author.Title,
              Office: e.Author.Office,
              JobTitle: e.Author.JobTitle,
            },
            EmployeeId: e.EmployeeId,
            Description: e.Description,
            Amount: e.Amount,
            Date: e.Date,
            PurposeType: e.PurposeType,
            Purpose: e.Purpose,
            Location: e.Location,
            AdjustmentAmount: e.AdjustmentAmount,
            ReasonNotAdjust: e.ReasonNotAdjust,
            ActualExpenditureDate: e.ActualExpenditureDate,
            ActualExpenditureAmount: e.ActualExpenditureAmount,
            ClaimOrRefundAmountDate: e.ClaimOrRefundAmountDate,
            ClaimOrRefundAmount: e.ClaimOrRefundAmount,
            MRNO: e.MRNO,
            IsAdjusted: e.IsAdjusted,
          })
        );

        //update local in memory from storage by recently fetched data from SP list
        this.clickedDashboardInfo.mapedData.d = mapedData;

        resolve(mapedData);
        return mapedData;
      } else if (this.clickedDashboardInfo.wfName == 'EmployeePaintDiscount') {
        const mapedData = JSON.parse(JSON.stringify(this.rowData)).map(
          (e: any) => ({
            Title: e.Title,
            ID: e.ID,
            GUID: e.GUID,
            Modified: e.Modified,
            Created: e.Created,
            Status: e.Status,
            PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
            Author: {
              ID: e.Author.ID,
              Title: e.Author.Title,
              Office: e.Author.Office,
              JobTitle: e.Author.JobTitle,
            },
            EmployeeId: e.EmployeeId,
            DeliveryOffice: e.DeliveryOffice,
          })
        );

        //update local in memory from storage by recently fetched data from SP list
        this.clickedDashboardInfo.mapedData.d = mapedData;

        resolve(mapedData);
        return mapedData;
      } else if (this.clickedDashboardInfo.wfName == 'HRServices') {
        const mapedData = JSON.parse(JSON.stringify(this.rowData)).map(
          (e: any) => ({
            Title: e.Title,
            ID: e.ID,
            GUID: e.GUID,
            Modified: e.Modified,
            Created: e.Created,
            Status: e.Status,
            PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
            Author: {
              ID: e.Author.ID,
              Title: e.Author.Title,
              Office: e.Author.Office,
              JobTitle: e.Author.JobTitle,
            },
            EmployeeId: e.EmployeeId,
            RequestFor: e.RequestFor,
            VisitPurpose: e.VisitPurpose,
            WhenNeed: e.WhenNeed,
            TaskAssignDate: e.TaskAssignDate,
            RequestedById: e.RequestedById,
          })
        );

        //update local in memory from storage by recently fetched data from SP list
        this.clickedDashboardInfo.mapedData.d = mapedData;

        resolve(mapedData);
        //return mapedData;
      }
    });

    //------mapping ends---------
  }

  async getGridReadyprocesses() {
    try {
      //await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      this.listInfo.top = 200000;
      await this.getRowData(this.clickedDashboardInfo);
      await this.getTitleTag(this.rowData);
      // # map data of this dashboard SP list  #
      await this.getMappedData();
      // # emit to loc Server to strore in loc file #
      //await this.updateLocalStorage();
      //this.websocketService.subscribe();
    } catch (err) {
      console.log('Error: ' + err);
    }
  }

  ngAfterViewInit():void {
    // console.log(
    //   'ngAfterViewInit called before onGridReady() and after ngOnInit() ...............'
    // );
    console.log(
      'ngAfterViewInit initialized !'
    );
  }

  onGridReady(params: any) {
    this.mpTG.gridApi = params.api;
    this.mpTG.gridColumnApi = params.columnApi;

    //======= late loading with all row data start ====
    this.listInfo.top = 200000;

    //this.getGridReadyprocesses();

    this.onGridReadyParamsApi = this.mpTG.gridApi; //for voice recognition

    //====for editing ===

    this.mpTG.rowNodeApi = params.rowNodeApi;
    this.mpTG.editType = 'fullRow';
  }

  createColDef(i: any) {
    const htmlEleRenderer = this.elementRenderer;

    return new Promise((resolve, reject) => {
      this.dashboardsListsInfo[i.listIndex].DbViewColDef.forEach(
        (element: any, index: number) => {
          const ftype = element.fldType;
          const eGui: HTMLDivElement = htmlEleRenderer.createElement('div');
          const mpTgColDef = new ColumnDefinition(i, element, eGui);
          return this.mpTG.columnDefs.push(mpTgColDef.fieldMapper(element));
        }
      );

      resolve(this.mpTG.columnDefs);
    });
  }





  getRecentMstrLocalData() {
    return new Promise((resolve, reject) => {
      if (this.clickedDashboardInfo.acessPermission == 'Public') {
        if (this.clickedDashboardInfo.recMstLocDat.d.length > 0) {
          //check wheather target file includes any array with no item
          this.rowData = this.clickedDashboardInfo.recMstLocDat.d;
          resolve(this.clickedDashboardInfo.recMstLocDat.d);
        } else {
          this.getRowData(this.clickedDashboardInfo).then((res) => {
            resolve(res);
          });
        }
      } else if (this.clickedDashboardInfo.acessPermission == 'Protected') {
        if (this.clickedDashboardInfo.recMstLocDat.d.length > 0) {
          //check wheather target file includes any array with no item

          if (this.logedInUser.access == 'FullAccess') {
            const myLocationData =
              this.clickedDashboardInfo.recMstLocDat.d.filter((item) => {
                return item['Author']['Office'] == this.logedInUser.office;
              });
            this.rowData = myLocationData;
            resolve(myLocationData);
          }
        } else {
          this.getRowData(this.clickedDashboardInfo).then((res) => {
            resolve(res);
          });
        }
      } else {
        this.rowData = [];
        resolve('Un authorized access !!');
      }
    });
  }

  getRowData(i: any, searchfields?: any) {

    this.loading = true;

    const fdate = (searchfields.FromDate.toISOString()).slice(0, -1);
    const edate = (searchfields.ToDate.toISOString()).slice(0, -1);
    const order = 'DESC';
    const limit = 100000;
    const offset = 0;
    const apiUrl = `https://dmsreportapi.bankasia-bd.com/api/BankasiaEnadoc/GetReport?type=${searchfields.ReportType}&branch=${searchfields.BranchName}&user=${searchfields.UserName}&fromDate=${fdate}&toDate=${edate}&order=${order}&limit=${limit}&offset=${offset}`;
    //const apiUrl = `https://localhost:7213/api/BankasiaEnadoc/GetReport?type=${searchfields.ReportType}&branch=${searchfields.BranchName}&user=${searchfields.UserName}&fromDate=${fdate}&toDate=${edate}&order=${order}&limit=${limit}&offset=${offset}`;

    return new Promise((resolve, reject) => {
      this.httpClient
        .get<any[]>(apiUrl)
        // .pipe(map(r => {
        //   r.map((c:any) => {
        //     return Object.entries(c).find(([key, value]) => {
        //       if (key == 'documentDate' || key == 'dateTime') {
        //         c[key] = (new Date(value as any)).toISOString();
        //       }
        //     });
        //   })
        //   return r;
        // }))
        .subscribe((items: any) => {
          this.rowData = [];
          //this.rowData = JSON.parse(JSON.stringify(items));
          this.rowData = items;

          this.ungroupedData = items;

          this.loading = false;

          resolve(this.rowData);
        });
    });
  }

  getSelectedDashboardInfo(i: any) {
    return new Promise((resolve, reject) => {
      this.listInfo.name =
        this.dashboardsListsInfo[i.listIndex].MasterListInfo.name;
      this.listInfo.select =
        this.dashboardsListsInfo[i.listIndex].MasterListInfo.select;
      this.listInfo.expand =
        this.dashboardsListsInfo[i.listIndex].MasterListInfo.expand;
      this.listInfo.orderByPrm =
        this.dashboardsListsInfo[i.listIndex].MasterListInfo.orderByPrm;
      this.listInfo.orderByVal =
        this.dashboardsListsInfo[i.listIndex].MasterListInfo.orderByVal;      

      resolve(this.listInfo);
    });
  }

  ifAuthGroupsMember(i: any): boolean {
    //should be implemented;
    return false;
  }

  
  

  //====step 2==
  dashboardGridDef() {
    return new Promise((resolve, reject) => {
      this.mpTG.columnDefs = [];
      //=============set column definition start ===========
      this.mpTG.defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true, //to resize; add resizable: false to any individual column to disable resizingng that col only
        enableValue: true,
        enableRowGroup: true,
        enablePivot: true,
        sortable: true,
        filter: true,
        editable: true,
      };

      this.mpTG.detailCellRenderer = 'myDetailCellRenderer';
      //this.mpTG.frameworkComponents = { myDetailCellRenderer: MasterdetailsrendererComponent };
      this.mpTG.frameworkComponents = {};
      //--------for action btn link rendering start -------
      this.mpTG.rowGroupPanelShow = 'always';

      //=========for setting features on every subgroup items start=======
      // this.mpTG.autoGroupColumnDef = {
      //   headerName: 'Group',
      //   field: 'RequestStatus',
      //   minWidth: 30,
      //   cellRenderer: 'agGroupCellRenderer',
      //   cellRendererParams: {
      //     //  checkbox: true
      //   },
      // };
      //------------ subitem fetures ends -----------
      this.mpTG.rowHeight = 24;
      this.mpTG.masterDetail = true;
      this.mpTG.rowSelection = 'multiple';
      this.mpTG.animateRows = true;
      this.mpTG.suppressDragLeaveHidesColumns = true;
      this.mpTG.groupUseEntireRow = true;
      this.mpTG.paginationPageSize = 1000;
      this.mpTG.floatingFilter = true;
      this.mpTG.cacheQuickFilter = true;
      this.mpTG.enableCharts = true;
      this.mpTG.enableRangeSelection = true;
      this.mpTG.suppressRowClickSelection = true;
      this.mpTG.groupDisplayType = 'groupRows';

      this.components = {
        loadingRenderer: function (params: any) {
          if (params.value !== undefined) {
            return params.value;
          } else {
            return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif">';
          }
        },
      };
      //-------------col def ends -------------------
      resolve(this.mpTG);
    });
  }

  async executeOnInitProcesses(searchfields) {
    try {
      //await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      await this.dashboardGridDef();
      await this.createColDef(this.clickedDashboardInfo);
      this.listInfo.top = 2000000;
      await this.getRowData(this.clickedDashboardInfo, searchfields);
      this.swDataGridView = true;
      // await this.getTitleTag(this.rowData);

    
  
  
    } catch (err) {
      console.log('Error: ' + err);
    }
  }

  async ngOnInit() {  
    
    const dbListsInfoUrl = './assets/dashboardslistsinfo.ts' ; 
    //const dbListsInfoUrl = 'http://localhost:4209/assets/dashboardslistsinfo.ts';
    this.httpClient.get(dbListsInfoUrl).subscribe((data) => {
      this.dashboardsListsInfo = data;
      if (this.dashboardsListsInfo.length > 0) {
        //this.executeOnInitProcesses();
      } else {
        alert('Fetching List info failed !');
      }
    });

    this.imgNode = document.getElementById('srcFldContent');
  }

  getTitleTag(rowData: any) {
    //=========split titleTag =========
    return new Promise((resolve, reject) => {
      if (
        Object.prototype.hasOwnProperty.call(
          this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].ViewUrl,
          'titleTag'
        )
      ) {
        this.dbTagUrlInfo.titleTag =
          this.dashboardsListsInfo[
            this.clickedDashboardInfo.listIndex
          ].ViewUrl.titleTag;
      } else if (rowData != undefined) {
        if (Object.prototype.hasOwnProperty.call(rowData[0], 'Title')) {
          if (rowData[0].Title != null && rowData[0].Title != '') {
            this.dbTagUrlInfo.titleTag = rowData[0].Title.split('-')[0] + '-';
          } else if (rowData[5].Title != null && rowData[5].Title != '') {
            this.dbTagUrlInfo.titleTag = rowData[5].Title.split('-')[0] + '-';
          } else {
            this.dbTagUrlInfo.titleTag = rowData[10].Title.split('-')[0] + '-';
          }
        } else if (
          Object.prototype.hasOwnProperty.call(rowData[0], 'RequestId')
        ) {
          if (rowData[0].RequestId != null && rowData[0].RequestId != '') {
            this.dbTagUrlInfo.titleTag =
              rowData[0].RequestId.split('-')[0] + '-';
          } else if (rowData[5].Title != null && rowData[5].Title != '') {
            this.dbTagUrlInfo.titleTag =
              rowData[5].RequestId.split('-')[0] + '-';
          } else {
            this.dbTagUrlInfo.titleTag =
              rowData[10].RequestId.split('-')[0] + '-';
          }
        } else if (
          Object.prototype.hasOwnProperty.call(rowData[0], 'RequestID')
        ) {
          if (rowData[0].RequestID != null && rowData[0].RequestID != '') {
            this.dbTagUrlInfo.titleTag =
              rowData[0].RequestID.split('-')[0] + '-';
          } else if (rowData[5].Title != null && rowData[5].Title != '') {
            this.dbTagUrlInfo.titleTag =
              rowData[5].RequestID.split('-')[0] + '-';
          } else {
            this.dbTagUrlInfo.titleTag =
              rowData[10].RequestID.split('-')[0] + '-';
          }
        }
      }
      resolve(this.dbTagUrlInfo);
    });
  }

  async getDbInfoNdData() {
    await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
    //await this.getRowData(this.clickedDashboardInfo);

    await this.getRecentMstrLocalData();
  }

  //===================== Export Table data to Excel start ==============
  onBtnExportDataAsExcel() {
    function rowGroupCallback(params: any) {
      return params.node.key;
    }

    this.mpTG.gridApi.exportDataAsExcel({
      processRowGroupCallback: rowGroupCallback,
    });
  }
  //===================== Export Table data to Excel end ==============

  //=============== Quick central filter function start ==========
  //--------method-1: (with angular)--------
  quickSearch() {
    this.mpTG.gridApi.setQuickFilter(this.txtOfQuickSearchInpFld);
  }
  //--------method-2: (with Jquery)--------required to include oninput=onFilterTextBoxChanged() in html file--------
  // onFilterTextBoxChanged(){
  //   this.gridApi.setQuickFilter(document.querySelector('#filter-text-box'));
  // }
  //=============== Quick central filter function ends ==========

  //============= set row height methods starts 100% working ==============
  getRowHeight(params: any) {
    return groupHeight;
    // if (params.node.group) {
    //   return groupHeight;
    // }
  }

  setGroupHeight(height: any) {
    groupHeight = height;
    this.mpTG.rowHeight = height;
    this.mpTG.gridApi.resetRowHeights();
  }

  setRowHeight(height: any) {
    // rowHeight = height;
    // this.mpTG.gridApi.resetRowHeights();

    this.mpTG.gridApi.forEachNode(function (rowNode: any) {
      //if (rowNode.data && rowNode.data.country === 'Russia') {
      // rowHeight = height;
      // this.mpTG.gridApi.resetRowHeights();
      rowNode.setRowHeight(height);
      //}
    });
    this.mpTG.gridApi.onRowHeightChanged();
  }
  //------- set row height methods ends ---------------

  //=========== voice recognition start ==========

  voiceSearch() {
    alert('Please say any word that you want to search with');

    const quickVoiceSearch = (txt: any) => {
      this.onGridReadyParamsApi.setQuickFilter(txt);
    };

    if ('webkitSpeechRecognition' in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      //const voiceSearchForm = this.formSearch.nativeElement;
      //const voiceHandler = this.hiddenSearchHandler.nativeElement;
      //const srcTxtVoiceHandler = this.filterTextBox.nativeElement; // for filter
      //console.log(voiceSearchForm);
      vSearch.onresult = function (e: any) {
        //console.log(voiceSearchForm);
        //voiceHandler.value = e.results[0][0].transcript;
        vSearch.stop();
        //console.log(voiceHandler);
        //alert(e.results[0][0].transcript);

        this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
        (document.getElementById('filter-text-box') as HTMLInputElement).value =
          this.txtOfQuickSearchInpFld;
        quickVoiceSearch(this.txtOfQuickSearchInpFld);

        //voiceSearchForm.submit();
      };

      vSearch.onerror = function (e: any) {
        console.log(e);
        vSearch.stop();
      };
    } else {
      alert('webkitSpeechRecognition is not available.');
      //console.log(this.state.get(configKey, undefined as any));
    }
  }

  viewByVoice() {
    alert(
      'Please say only the number of your request/application within 2-seconds'
    );

    const quickVoiceSearch = (txt: any) => {
      this.onGridReadyParamsApi.setQuickFilter(txt);

      let itm = [];
      let prKey = '';

      const reqDbInfo =
        this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex];

      if (
        Object.prototype.hasOwnProperty.call(
          reqDbInfo.MasterListInfo,
          'primaryKey'
        )
      ) {
        prKey = reqDbInfo.MasterListInfo.primaryKey;
        if (prKey != 'Title') {
          itm = this.rowData.filter(
            (item: any) => item[prKey] == this.dbTagUrlInfo.titleTag + txt
          );
        } else {
          itm = this.rowData.filter(
            (item: any) => item.Title == this.dbTagUrlInfo.titleTag + txt
          );
        }
      } else {
        itm = this.rowData.filter(
          (item: any) => item.Title == this.dbTagUrlInfo.titleTag + txt
        );
      }

      (document.getElementById('viewByVoiceText') as HTMLInputElement).value =
        '        ' + this.dbTagUrlInfo.titleTag + txt;

      if (reqDbInfo.ViewUrl.qryStrKeyTyp == 'GUID') {
        //this.dbTagUrlInfo.qryStrKeyVal = itm[0].GUID;
        const url =
          this.siteAbsoluteUrl +
          reqDbInfo.ViewUrl.siteUrl +
          this.dbTagUrlInfo.qryStrKeyVal +
          reqDbInfo.ViewUrl.mode;
        window.open(url, '_blank');
      } else if (reqDbInfo.ViewUrl.qryStrKeyTyp == 'ID') {
        //this.dbTagUrlInfo.qryStrKeyVal = itm[0].ID;
        const url =
          this.siteAbsoluteUrl +
          reqDbInfo.ViewUrl.siteUrl +
          this.dbTagUrlInfo.qryStrKeyVal +
          reqDbInfo.ViewUrl.mode;
        window.open(url, '_blank');
      }
    };

    if ('webkitSpeechRecognition' in window) {
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      //const voiceSearchForm = this.formSearch.nativeElement;
      //const voiceHandler = this.hiddenSearchHandler.nativeElement;
      //const srcTxtVoiceHandler = this.filterTextBox.nativeElement; // for filter
      //console.log(voiceSearchForm);
      vSearch.onresult = function (e: any) {
        //console.log(voiceSearchForm);
        //voiceHandler.value = e.results[0][0].transcript;
        vSearch.stop();

        this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
        //(document.getElementById('filter-text-box') as HTMLInputElement).value = this.txtOfQuickSearchInpFld;
        quickVoiceSearch(this.txtOfQuickSearchInpFld);

        //voiceSearchForm.submit();
      };

      vSearch.onerror = function (e: any) {
        console.log(e);
        vSearch.stop();
      };
    } else {
      alert('webkitSpeechRecognition is not available.');
      //console.log(this.state.get(configKey, undefined as any));
    }
  }

  clearSelection() {
    this.mpTG.gridApi.deselectAll();
    //this.agGrid.api.deselectAll();
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.mpTG.gridApi.paginationSetPageSize(Number(value));
  }

  //#### CRUD operation starts #### ===========
  async onAddRow() {
    const params = this.mpTG.grid;

    const columns = this.listInfo;

    let newRow: object = {};

    const colDefArray = this.mpTG.gridApi.columnModel.columnDefs;

    await Promise.all(
      colDefArray.map(async (el: any) => {
        const keyVal = (el: any) => {
          return new Promise((res, rej) => {
            const key = el.field;

            if (key == 'ID') {
              const objEle = { [key]: null };
              newRow = Object.assign(newRow, objEle);
            } else {
              const objEle = { [key]: '' };
              newRow = Object.assign(newRow, objEle);
            }

            res(newRow);
          });
        };

        await keyVal(el);
      })
    )
      .then((results) => {
        // this.rowData = [...this.rowData, newRow]
        // this.mpTG.gridApi.setRowData(this.rowData);

        //const nodeIndex = this.mpTG.gridApi.rowModel.rowsToDisplay.length - 1;
        const nodeIndex = 0;

        this.mpTG.gridApi.updateRowData({
          add: [newRow],
          addIndex: nodeIndex,
        });

        this.mpTG.defaultColDef.editable = true;

        const newRowNode = this.mpTG.gridApi.getRowNode(nodeIndex);
        newRowNode.setRowHeight(43);

        this.mpTG.gridApi.onRowHeightChanged();

        params.api.startEditingCell({
          rowIndex: nodeIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        });
      })
      .then(() => {
        // const listName = (params.node.data['odata.type']).slice(8, -8);

        const listInfo = {
          name: this.listInfo.name,
          //rId: params.node.data.Id,
          item: newRow,
        };
      });

    // //const confirm = window.confirm("Are you sure, you want to update this row ?");

    // //const apiUrl= `https://portal.bergerbd.com/_api/web/lists/getByTitle('WorkshopProposalMaster')/items(${params.node.data.Id})` ;

    // this.updatedata = Object.keys(params.node.data)
    //   .filter((key) => (key != "Author" && key != "Author@odata.navigationLinkUrl" && key != "Created" && key != "GUID" && key != "ID" && key != "Id" && key != "odata.editLink" && key != "odata.etag" && key != "odata.id" && key != "odata.type" && key != "[[Prototype]]" && key != "EmployeeId" && key != "PendingWith"))
    //   .reduce((obj, key) => {
    //       return Object.assign(obj, {
    //         [key]: params.node.data[key]
    //       });
    // }, {});

    // const listName = (params.node.data['odata.type']).slice(8, -8);

    //this.sharepointlistService.updateListItem(listInfo);

    //this.mpTG.gridApi.updateRowData({ add: [newRow] });

    // this.gridApi.getFilterInstance("col3").resetFilterValues();
    // this.gridApi.getFilterInstance("col4").resetFilterValues();
  }

  // onCellClicked(params: any) {
  //   //params:CellClickedEvent
  //   // Handle click event for action cells
  //   if (params.column.colId === 'ID' && params.event.target.dataset.action) {
  //     const action = params.event.target.dataset.action;

  //     if (action === 'add') {
  //       const rowIndex = 1 + params.node.rowIndex;
  //       let rowDataOnAdd: any[] = [];
  //       rowDataOnAdd = [];
  //       this.rowData = [];
  //       this.rowData = rowDataOnAdd;
  //       this.mpTG.gridApi.setRowData(rowDataOnAdd);
  //     } else if (action === 'edit') {
  //       this.mpTG.defaultColDef.editable = true;
  //       params.api.startEditingCell({
  //         rowIndex: params.node.rowIndex,
  //         // gets the first columnKey
  //         colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
  //       });

  //       //== resize the Row Height ===
  //       params.node.setRowHeight(43);
  //       this.mpTG.gridApi.onRowHeightChanged();
  //     } else if (action === 'delete') {
  //       params.api.applyTransaction({
  //         remove: [params.node.data],
  //       });
  //     } else if (action === 'update') {
  //       Swal.fire({
  //         title: 'Are you sure?',
  //         text: "You won't be able to revert this!",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, update it!',
  //       }).then((result: any) => {
  //         if (result.isConfirmed) {
  //           params.api.stopEditing(false);
  //           //const confirm = window.confirm("Are you sure, you want to update this row ?");

  //           this.updatedata = Object.keys(params.node.data)
  //             .filter(
  //               (key) =>
  //                 key != 'Author' &&
  //                 key != 'Author@odata.navigationLinkUrl' &&
  //                 key != 'Created' &&
  //                 key != 'GUID' &&
  //                 key != 'ID' &&
  //                 key != 'Id' &&
  //                 key != 'odata.editLink' &&
  //                 key != 'odata.etag' &&
  //                 key != 'odata.id' &&
  //                 key != 'odata.type' &&
  //                 key != '[[Prototype]]' &&
  //                 key != 'EmployeeId' &&
  //                 key != 'PendingWith' &&
  //                 key != 'undefined'
  //             )
  //             .reduce((obj, key) => {
  //               return Object.assign(obj, {
  //                 [key]: params.node.data[key],
  //               });
  //             }, {});

  //           if (params.node.data.ID == null) {
  //             if (
  //               isNaN(this.updatedata.RemainingBalance) ||
  //               isNaN(this.updatedata.ReceivedQty) ||
  //               isNaN(this.updatedata.OpeningBalance)
  //             ) {
  //               alert(
  //                 'RemainingBalance, ReceivedQty and OpeningBalance fields allows only numerical value !'
  //               );
  //               return false;
  //             }
  //             const listName = this.listInfo.name;
  //             const listInfo = {
  //               name: listName,
  //               //rId: params.node.data.Id,
  //               item: this.updatedata,
  //             };

  //             this.sharepointlistService
  //               .saveListItem(listInfo)
  //               .then((res: any) => {
  //                 const accessoryCode = this.updatedata.AccessoryCode;
  //                 const stockListsUrl =
  //                   "https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('ITAccessoriesStock')/items?&$top=2000&$select=ID,GUID,RemainingBalance&$filter=AccessoryCode eq '" +
  //                   accessoryCode +
  //                   "'";

  //                 this.httpClient.get(stockListsUrl).subscribe((data: any) => {
  //                   const stockListItems = JSON.parse(
  //                     JSON.stringify(data['value'])
  //                   );

  //                   if (stockListItems.length > 0) {
  //                     const remBal = this.updatedata.RemainingBalance;
  //                     const availability = this.updatedata.Availability;
  //                     const stockListInfo = {
  //                       name: 'ITAccessoriesStock',
  //                       rId: stockListItems[0].ID,
  //                       item: {
  //                         RemainingBalance: remBal,
  //                         Availability: availability,
  //                       },
  //                     };

  //                     this.sharepointlistService.updateListItem(stockListInfo);
  //                   } else {
  //                     //===save in the "ITAccessoriesStock" list as a new item
  //                     const newData = {
  //                       AccessoryCode: this.updatedata.AccessoryCode,
  //                       AccessoryCategory: this.updatedata.AccessoryCategory,
  //                       AccessorySubCategory:
  //                         this.updatedata.AccessorySubCategory,
  //                       AccessoryName: this.updatedata.AccessoryName,
  //                       RemainingBalance: Number(
  //                         this.updatedata.RemainingBalance
  //                       ),
  //                       UOM: this.updatedata.UOM,
  //                       Availability: this.updatedata.Availability,
  //                     };

  //                     const stockListInfo = {
  //                       name: 'ITAccessoriesStock',
  //                       //rId: stockListItems[0].ID,
  //                       item: newData,
  //                     };

  //                     this.sharepointlistService.saveListItem(stockListInfo);
  //                   }
  //                 });
  //               });
  //           } else {
  //             if (
  //               isNaN(this.updatedata.RemainingBalance) ||
  //               isNaN(this.updatedata.ReceivedQty) ||
  //               isNaN(this.updatedata.OpeningBalance)
  //             ) {
  //               alert(
  //                 'RemainingBalance, ReceivedQty and OpeningBalance fields allows only numerical value !'
  //               );
  //               return false;
  //             }
  //             const listName = params.node.data['odata.type'].slice(8, -8);
  //             const listInfo = {
  //               name: listName,
  //               rId: params.node.data.Id,
  //               item: this.updatedata,
  //             };

  //             this.sharepointlistService
  //               .updateListItem(listInfo)
  //               .then((res: any) => {
  //                 const accessoryCode = this.updatedata.AccessoryCode;
  //                 const stockListsUrl =
  //                   this.siteAbsoluteUrl +
  //                   "/leaveauto/_api/web/lists/getByTitle('ITAccessoriesStock')/items?&$top=2000&$select=ID,GUID,RemainingBalance&$filter=AccessoryCode eq '" +
  //                   accessoryCode +
  //                   "'";

  //                 this.httpClient.get(stockListsUrl).subscribe((data: any) => {
  //                   const stockListItems = JSON.parse(
  //                     JSON.stringify(data['value'])
  //                   );

  //                   if (stockListItems.length > 0) {
  //                     const remBal = this.updatedata.RemainingBalance;
  //                     const availability = this.updatedata.Availability;
  //                     const stockListInfo = {
  //                       name: 'ITAccessoriesStock',
  //                       rId: stockListItems[0].ID,
  //                       item: {
  //                         RemainingBalance: remBal,
  //                         Availability: availability,
  //                       },
  //                     };

  //                     this.sharepointlistService.updateListItem(stockListInfo);
  //                   } else {
  //                     alert('Fetching List info failed !');
  //                   }
  //                 });
  //               });
  //           }
  //         }

  //         //== resize the Row Height ===
  //         params.node.setRowHeight(25);
  //         this.mpTG.gridApi.onRowHeightChanged();

  //         return null;
  //       });
  //     } else if (action === 'cancel') {
  //       params.api.stopEditing(true);

  //       //== resize the Row Height ===
  //       params.node.setRowHeight(25);
  //       this.mpTG.gridApi.onRowHeightChanged();
  //     }
  //   }
  // }

  onRowEditingStarted(params: RowEditingStartedEvent) {
    //this.mpTG.gridApi.refreshCells({force: true});
    params.api.refreshCells({
      columns: ['ID'],
      rowNodes: [params.node],
      force: true,
    });
  }

  onRowEditingStopped(params: RowEditingStoppedEvent) {
    params.api.refreshCells({
      columns: ['ID'],
      rowNodes: [params.node],
      force: true,
    });
  }

  onCellEditingStarted(event: CellEditingStartedEvent) {
    console.log('cellEditingStarted');
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    console.log('cellEditingStopped');
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  //=======for serchfields child Component ==========
  searchFldChange(value): void {
    const wfName = value.Searchfields.ReportType;

    if (wfName) {
      this.clickedDashboardInfo.wfName = wfName;
      this.clickedDashboardInfo.listIndex = this.dashboardsListsInfo.findIndex(
        (item: any) => item.WfName === wfName
      );
      const wfIndex = this.clickedDashboardInfo.listIndex;
      // # pushing clickedDashboardInfo from 'this.dashboardsListsInfo' file to in memory #
      this.clickedDashboardInfo.config = this.dashboardsListsInfo[wfIndex];
      this.executeOnInitProcesses(value.Searchfields);
    } else {
      alert('Workflow Name not found !');
    }

    this.imgNode = document.getElementById('srcFldContent');
  }

  

  public printView() {    

    this.imgNode = document.getElementById('basEnaReport');
    this.hideInPrtView = true;
    this.swSavePdfBtn = true;
    this.swSavePdfWithoutDataBtn = false;
    this.swReturnHomeBtn = true;

    //========= for Account Count and Page Count start ==================
    from(this.ungroupedData).pipe(
      groupBy((x:any) => x.accountNo), // using groupBy from Rxjs
      //mergeMap((group:any) => group.toArray()),// GroupBy dont create a array object so you have to flat it
      mergeMap((obs:any) => {
        return obs.pipe(
            toArray()
            // map(items => {
            //     return { [obs.key]: items }
            // })
        )
      }), 
      //toArray(),
      map((g:any) => {// mapping 
        return {
          AccountNo: g[0].AccountNo,//take the first AccountNo because we grouped them by AccountNo
          PageCount: _.sumBy(g, 'pageCount'), // using lodash to sum PageCount
        }
      })
      )
      .pipe( toArray() ) //toArray to loop on it with ngFor
      .subscribe((d:any) => {
        this._parentData.noOfAccounts = d.length;
        this._parentData.noOfPages = _.sumBy(d, 'PageCount');
        this.groupedData = d;
      }); 
      //-----------Page count ends----------------

    const filteredData:any = [];
    this.mpTG.gridApi.forEachNodeAfterFilter((node:any) => {
      filteredData.push(node.data);
    });


  }

  public printViewWithoutData(): void {   
    
    this.swDataGridView = false;
    this.hideInPrtView = false;
    this.swPrtViewExcDtDiv = true;
    this.swSavePdfBtn = false;
    this.swSavePdfWithoutDataBtn = true;
    this.swReturnHomeBtn = true;

    // this.ungroupedData.push({
    //   accountNo:"1232456786",
    //   accountTitle:"Shamiur",
    //   accountType:"Current Account",
    //   birthRegNo:"dsadsa1348",
    //   branchName:"620 - BANANI-11",
    //   cidNo:"CID003",
    //   dateTime: "2023-11-15T12:26:48.853",
    //   documentId:6,
    //   documentType:"Signature Card",
    //   fileLocation:"CDE123",
    //   ipAddress:null,
    //   mobileNo:"01672981516",
    //   nidNo:"123456789123456",
    //   pageCount:1,
    //   passport:"2",
    //   recipient:null,
    //   tinNo:"TIN00125",
    //   tradeLicNo:"Trade125",
    //   userName:"AOFUploader"});

    //   this.ungroupedData.push({
    //     accountNo:"1232456787",
    //     accountTitle:"Shamiur",
    //     accountType:"Current Account",
    //     birthRegNo:"dsadsa1348",
    //     branchName:"620 - BANANI-11",
    //     cidNo:"CID003",
    //     dateTime: "2023-11-15T12:26:48.853",
    //     documentId:6,
    //     documentType:"Signature Card",
    //     fileLocation:"CDE123",
    //     ipAddress:null,
    //     mobileNo:"01672981516",
    //     nidNo:"123456789123456",
    //     pageCount:1,
    //     passport:"2",
    //     recipient:null,
    //     tinNo:"TIN00125",
    //     tradeLicNo:"Trade125",
    //     userName:"AOFUploader"})

    //     this.ungroupedData.push({
    //       accountNo:"1232456788",
    //       accountTitle:"Shamiur",
    //       accountType:"Current Account",
    //       birthRegNo:"dsadsa1348",
    //       branchName:"620 - BANANI-11",
    //       cidNo:"CID003",
    //       dateTime: "2023-11-15T12:26:48.853",
    //       documentId:6,
    //       documentType:"Signature Card",
    //       fileLocation:"CDE123",
    //       ipAddress:null,
    //       mobileNo:"01672981516",
    //       nidNo:"123456789123456",
    //       pageCount:1,
    //       passport:"2",
    //       recipient:null,
    //       tinNo:"TIN00125",
    //       tradeLicNo:"Trade125",
    //       userName:"AOFUploader"});
    //       this.ungroupedData.push({
    //         accountNo:"1232456788",
    //         accountTitle:"Shamiur",
    //         accountType:"Current Account",
    //         birthRegNo:"dsadsa1348",
    //         branchName:"620 - BANANI-11",
    //         cidNo:"CID003",
    //         dateTime: "2023-11-15T12:26:48.853",
    //         documentId:6,
    //         documentType:"Signature Card",
    //         fileLocation:"CDE123",
    //         ipAddress:null,
    //         mobileNo:"01672981516",
    //         nidNo:"123456789123456",
    //         pageCount:8,
    //         passport:"2",
    //         recipient:null,
    //         tinNo:"TIN00125",
    //         tradeLicNo:"Trade125",
    //         userName:"AOFUploader"})

    //========= for Account Count and Page Count start ==================
    from(this.ungroupedData).pipe(
      groupBy((x:any) => x.accountNo), // using groupBy from Rxjs
      //mergeMap((group:any) => group.toArray()),// GroupBy dont create a array object so you have to flat it
      mergeMap((obs:any) => {
        return obs.pipe(
            toArray()
            // map(items => {
            //     return { [obs.key]: items }
            // })
        )
      }), 
      //toArray(),
      map((g:any) => {// mapping 
        return {
          AccountNo: g[0].AccountNo,//take the first AccountNo because we grouped them by AccountNo
          PageCount: _.sumBy(g, 'pageCount'), // using lodash to sum PageCount
        }
      })
      )
      .pipe( toArray() ) //toArray to loop on it with ngFor
      .subscribe((d:any) => {
        this._parentData.noOfAccounts = d.length;
        this._parentData.noOfPages = _.sumBy(d, 'PageCount');
        this.groupedData = d;
      }); 
      //-----------Page count ends----------------

  }


  //==================add Header and print with data-grid start=============
  saveAllAsPdf(event):void{
    const imgNode:any = document.getElementById('srcFldContent');

    htmlToImage
      .toPng(imgNode)
      .then( (dataUrl)=> {
        event.preventDefault();
        const printParams = {  
          PDF_HEADER_COLOR: this.PDF_HEADER_COLOR,
          PDF_INNER_BORDER_COLOR: this.PDF_INNER_BORDER_COLOR,
          PDF_OUTER_BORDER_COLOR: this.PDF_OUTER_BORDER_COLOR,
          PDF_LOGO: dataUrl,
          PDF_PAGE_ORITENTATION: this.PDF_PAGE_ORITENTATION,
          PDF_WITH_HEADER_IMAGE: this.PDF_WITH_HEADER_IMAGE,
          PDF_WITH_FOOTER_PAGE_COUNT: this.PDF_WITH_FOOTER_PAGE_COUNT,
          PDF_HEADER_HEIGHT: this.PDF_HEADER_HEIGHT,
          PDF_ROW_HEIGHT: this.PDF_ROW_HEIGHT,
          PDF_ODD_BKG_COLOR: this.PDF_ODD_BKG_COLOR,
          PDF_EVEN_BKG_COLOR: this.PDF_EVEN_BKG_COLOR,
          PDF_WITH_CELL_FORMATTING: this.PDF_WITH_CELL_FORMATTING,
          PDF_WITH_COLUMNS_AS_LINKS: this.PDF_WITH_COLUMNS_AS_LINKS,
          PDF_SELECTED_ROWS_ONLY: this.PDF_SELECTED_ROWS_ONLY
        };
        printDoc(printParams, this.mpTG.gridApi, this.mpTG.gridColumnApi);
      })
      //.then(dataUrl => downloadDataUrl(dataUrl, "assets/images/user-image.png"))
      .catch((error)=> {
        console.error('oops, something went wrong!', error);
      });

  }

    //==================add Header and print with data-grid start=============
    saveAllWithoutDataAsPdf(event):void{
      this.swSavePdfBtn = false;
      this.swSavePdfWithoutDataBtn = false;
      const savePdfBtnDivEl:any = document.getElementById('savePdfBtnDiv');
      if (savePdfBtnDivEl != null ) {
        savePdfBtnDivEl.style.display = 'none';
        window.print(); 
      }else{
        window.print(); 
      }

       
    }
    
    //-----------------------data -grid print ends-----------------------
  
  //-----------------------return to home-----------------------
  returnToHome(event):void{
    window.location.href = this.siteAbsoluteUrl ;       
  }
}

//let rowHeight; 
let groupHeight:any;
