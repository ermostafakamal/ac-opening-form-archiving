import { Component, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ProgressService
} from '@dmsportal/ui';

import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { forEach } from 'lodash';
//import { LoaderService } from '../../loader.service';
import { Overlay } from '@angular/cdk/overlay';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'dmsportal-cbstoenadoc',
  templateUrl: './Cbstoenadoc.component.html',
  styleUrls: ['./Cbstoenadoc.component.scss']
})
export class CbstoenadocComponent implements OnInit {
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

  @Output()  searchFieldChange = new EventEmitter<any>();
  @Output()  headerFieldChange = new EventEmitter<any>();
  
  @Input() swHideInPrtView:any;
  @Input() swInPrtViewExcDt:any;
  @Input() parentData:any;  
  
  _noOfAccounts = 0;
  _noOfPages = 0;
  _printDate = new Date();

  btnViewReport = false;

    httpOptions = {
      headers: new HttpHeaders({  
        "Accept": "application/json; odata=verbose",
        "Content-Type": "application/json; odata=verbose",
        "X-HTTP-Method": "MERGE",
        'IF-MATCH': "*"
      }),
    };

  //=======for loader ====

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = 'green';
  public secondaryColour = '#ccc';
  public coloursEnabled = false;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px',
  };
  

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private service: ProgressService, 
    private overlay: Overlay, 
    private elRef: ElementRef
    ) { }

  ngOnInit(): void {
    
    this.FromDate = new Date((new Date()).setFullYear(new Date().getFullYear() - 1)); //new Date();
    this.ToDate = new Date();

    this.searchfieldsFormGroup = this.formBuilder.group({
      searchfields: this.formBuilder.group({
        ACC_NO: [''],
        CUSTOMER_CODE: [''],
        AC_TITLE: [''],
        MOBILE_NO: [''],
        NID_NO: [''],
        AC_TYPE: [''],
        TIN_NO: ['']
        // TRADE_LICENSE_NO: [""],
        // PASSPORT_NO: [""],
        // BIRTH_REGISTRATION_NO: [""]
      })
    });

    
    
  }


  viewReport() {
    this.loading = true;
    //================= start progress spiner ===========
    // const progressRef:any = this.service.showProgress(this.elRef);
    // progressRef();
    
    //-------------- end progress spiner ----------------
    this.searchFieldChange.emit(this.searchfieldsFormGroup.value);
    this.btnViewReport = true;
    this.loading = true;
    //this.headerFieldChange.emit(content);

    //const dpRes:any =  this.getAndSave();

    this.getAndSave().then((dp) => { 
      if(Object.prototype.hasOwnProperty.call(dp, 'aC_TITLE')){

        this.panelOpenState = false;
  
        this.searchfieldsFormGroup.patchValue({
          searchfields:{
            ACC_NO: dp.acC_NO,
            CUSTOMER_CODE: dp.customeR_CODE,
            AC_TITLE: dp.aC_TITLE,
            MOBILE_NO: dp.mobilE_NO,
            NID_NO: dp.niD_NO,
            AC_TYPE: dp.aC_TYPE,
            TIN_NO: dp.tiN_NO
          }            
        });
        this.loading = false;
        //setTimeout(()=>this.service.detach(progressRef),1000);
        setTimeout(function () { 
          window.location.href = window.location.origin;  
        }, 9000) ;
    
      }
    }) 
    .catch((error:any) => { 
        console.log(error); 
    });    

  }


  logout(): void {
    //this._loginService.logout();
  }

  showEmployeeloginForm(){
    this._swCustLoginfrm = false;
    this._swEmpLoginfrm = true;
  }



  async getAndSave(): Promise<any> {

    return new Promise<any>((resolve, reject) => { 
      
      const reqBody = { 
        "ACCOUNT_INFO": { 
        "ACC_NO": this.searchfieldsFormGroup.value.searchfields.ACC_NO, 
        "AUTH_DATA": "", 
        "REF_NO": "" 
        } 
      }
  
      //this.httpClient.post<any[]>("https://localhost:7213/api/AccessToken/CreateCbsData?accountNo=" + this.searchfieldsFormGroup.value.searchfields.ACC_NO, reqBody, this.httpOptions).subscribe({
      this.httpClient.post<any[]>("https://cbsaccessapi.bankasia-bd.com/api/AccessToken/CreateCbsData?accountNo=" + this.searchfieldsFormGroup.value.searchfields.ACC_NO, reqBody, this.httpOptions).subscribe({
          next: data => {
            resolve(data);
            return data;
          },
          error: error => {
            reject(error)
            console.error('There was an error!', error);
          }
      })
    })
		
	}

  showSelf() {
    const progressRef:any = this.service.showProgress(this.elRef);
    setTimeout(()=>this.service.detach(progressRef),5000);
  }  

  // ngOnDestroy(){
  //   this.appDataSubscription.unsubscribe();
  // };



}



