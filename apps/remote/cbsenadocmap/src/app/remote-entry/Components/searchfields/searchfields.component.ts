import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit,
  ViewChild, TemplateRef
 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoginService
} from '@dmsportal/shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { forEach } from 'lodash';

//============for ngx-loading..=========
import { DomSanitizer } from '@angular/platform-browser';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxLoadingComponent } from 'ngx-loading';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';

//----------ngx-loading ends----------

@Component({
  selector: 'dmsportal-searchfields',
  templateUrl: './searchfields.component.html',
  styleUrls: ['./searchfields.component.scss']
})
export class SearchfieldsComponent implements OnInit, AfterViewInit {
  userName = '';
  customerId = '';
  password = '';

  searchfieldsFormGroup!:FormGroup;

  panelOpenState = true;

  _swCustLoginfrm = true;
  _swEmpLoginfrm = false;

  
  uId = "";

  FromDate!:Date;
  ToDate!:Date;

  //libraries: Array<any>;

  _branchNames: any[] = [
    {value: '620 - BANANI-11', viewValue: '620 - BANANI-11', disabled: false}
  ];

  _userNames: any[] = [
    {value: 'All', viewValue: 'All', disabled: false}
  ];

  _reportTypes: any[] = [
    {value: 'Upload Report', viewValue: 'Upload Report', disabled: false},
    {value: 'Download Report', viewValue: 'Download Report', disabled: true},
    {value: 'Email Report', viewValue: 'Email Report', disabled: true},
    {value: 'Print Report', viewValue: 'Print Report', disabled: true},    
    {value: 'View Report', viewValue: 'View Report', disabled: true}
  ];

  _libraries:any[] = [
    {value: 'AOF', viewValue: 'AOF', disabled: false}
  ];

  isFrmDtEnbl = true;
  isToDtEnbl = true;

  @Output()  searchFieldChange = new EventEmitter<any>();
  @Output()  headerFieldChange = new EventEmitter<any>();
  @Output()  ngxPgLoading = new EventEmitter<any>();
  
  @Input() swHideInPrtView:any;
  @Input() swInPrtViewExcDt:any;
  @Input() parentData:any;
  
  
  _noOfAccounts = 0;
  _noOfPages = 0;
  _printDate = new Date();

    //============for ngx-loading..=========
    @ViewChild('ngxLoading', { static: false })
    ngxLoadingComponent!: NgxLoadingComponent;
  
    // @ViewChild('customLoadingTemplate', { static: false })
    // customLoadingTemplate!: TemplateRef<any>;
    // @ViewChild('emptyLoadingTemplate', { static: false })
    // emptyLoadingTemplate!: TemplateRef<any>;
    showingTemplate = false;
    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    public loading = true;
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
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
    private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit(): void {

    const userTypesApi = "https://dmsreportapi.bankasia-bd.com/api/DocUploader/GetAllDocUploaders";
    //============get user to bind user DDL ====
    this.httpClient.get<any[]>(userTypesApi)
    .subscribe(
      (users:any) => {
        for(let u=0; u<= users.length; u++){
          if(users[u] != null && typeof users[u] === 'object'){
            this._userNames.push({value: (Object.prototype.hasOwnProperty.call(users[u], 'userName'))? users[u].userName:'', viewValue: (Object.prototype.hasOwnProperty.call(users[u], 'userName'))? users[u].userName:'', disabled: false})
          }
          
        }        
      }
    );

    const branchApi = "https://dmsreportapi.bankasia-bd.com/api/BankasiaEnadoc/GetAllBranches?documentIndex=1";
    //============get user to bind user DDL ====
    this.httpClient.get<any[]>(branchApi)
    .subscribe(
      (branches:any) => {
        if(branches.length >1){
          for(let b=0; b<= branches.length; b++){
            if(branches[b] != null && typeof branches[b] === 'object'){
              this._branchNames.push({value: (Object.prototype.hasOwnProperty.call(branches[b], 'value'))? branches[b].value:'', viewValue: (Object.prototype.hasOwnProperty.call(branches[b], 'value'))? branches[b].value:'', disabled: false})
            }
          }

          this.loading = false;
        }
                
      }
    );

    this.FromDate = new Date((new Date()).setFullYear(new Date().getFullYear() - 1)); //new Date();
    this.ToDate = new Date();
    this._libraries = [
      {value: 'AOF', viewValue: 'AOF', disabled: false}
    ];

    this.searchfieldsFormGroup = this.formBuilder.group({

      Searchfields: this.formBuilder.group({
        Library: [this._libraries[0].value, Validators.compose([Validators.required])],
        BranchName: [this._branchNames[0].value, Validators.compose([Validators.required])],
        ReportType: [this._reportTypes[0].value, Validators.compose([Validators.required])],
        UserName: [this._userNames[0].value, Validators.compose([Validators.required])],
        FromDate: [this.FromDate, Validators.compose([Validators.required])],
        ToDate: [this.ToDate, Validators.compose([Validators.required])]
      })

    });

    this.loading = false;


  }

  ngAfterViewInit(){
    this.loading = false;
    //console.log();
  }
 

  viewReport() {
    this.searchFieldChange.emit(this.searchfieldsFormGroup.value);
    const content :any = document.getElementById('srcFldContent');
    this.headerFieldChange.emit(content);
    
    // this._loginService.checkCredentials(
    //   this.searchfieldsFormGroup.value.Searchfields.Library, 
    //   this.searchfieldsFormGroup.value.Searchfields.BranchName,
    //   this.searchfieldsFormGroup.value.Searchfields.UserName,
    //   this.searchfieldsFormGroup.value.Searchfields.ReportType,
    //   this.searchfieldsFormGroup.value.Searchfields.FromDate,
    //   this.searchfieldsFormGroup.value.Searchfields.ToDate);
  }

  logout(): void {
    this._loginService.logout();
  }

  showEmployeeloginForm(){
    this._swCustLoginfrm = false;
    this._swEmpLoginfrm = true;
  }

  // ngOnDestroy(){
  //   this.appDataSubscription.unsubscribe();
  // };



}


