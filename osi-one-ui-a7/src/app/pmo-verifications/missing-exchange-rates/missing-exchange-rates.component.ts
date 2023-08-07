import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Flash } from '../../shared/utilities/flash';

import { MissingExchangeRatesService } from "../../shared/services/missing-exchange-rates.service";

@Component({
  selector: 'missing-exchange-rates',
  templateUrl: './missing-exchange-rates.component.html',
  styleUrls: ['./missing-exchange-rates.component.css'],
  providers: [MissingExchangeRatesService]
})
export class MissingExchangeRatesComponent implements OnInit {
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;

  public crntPage :number;
  public fieldArray: Array<any> = [];
  selectedRowId: Number;

  public errorMessage: string;
  
  public paginationPageSize: any;
  
  responseData:any;
  showSuccessAlert=false;
  successTextMessage='';
  isTrascError: boolean = false;
  flash: Flash = new Flash();
  disableSync = true;

  constructor(private _missingExchangeRatesService: MissingExchangeRatesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.responseData=this.route.snapshot.params;
    console.log(this.responseData);
    if(this.responseData){
        this.showSuccessAlert = this.responseData.p1;
        this.successTextMessage = this.responseData.p2;
        let ref = this;
        setTimeout(function () {
            ref.showSuccessAlert = false
        }, 5000);
    }

    this.paginationPageSize = 10;

    this.getMissingExchangeRatesDates();
  }

  isSomeChecked(){
    let checkVal =  this.fieldArray.some(x=>x.state == true);
    if(checkVal){
      this.disableSync = false;
    }else{
      this.disableSync = true;
    }
  }

  getMissingExchangeRatesDates() {
    this._missingExchangeRatesService.getMissingExchangeRates().subscribe(response => {
      this.fieldArray = response;
      this.checkAll(null);
      console.log(response);
    },
    error => this.errorMessage = <any>error);
  }

  runMissingExchangeRates() {
    let exchangesArray = this.fieldArray.filter(x=>x.state == true);
    this.fieldArray = this.fieldArray.filter(x=>x.state == false);
    this.disableSync = true;

    console.log(exchangesArray.length);
    
    exchangesArray.forEach(data=>{
      delete data.state;
    })
    console.log("run exchange rates object======>>>>>>>>>" + JSON.stringify(exchangesArray));

    this._missingExchangeRatesService.runMissingExchangeRates(exchangesArray).subscribe(exchangeRatesObj => {
      
      console.log("after run : assigning exchangeRates======>>>>>>>>>" + exchangeRatesObj);
      
      if (exchangeRatesObj !== null) {
        this.isTrascError = true;
        this.flash.message = 'Exchange Rate Ran Successfully';
        this.flash.type = 'success';
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(function () {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.ngOnInit();
        }, 3000);
      }
    },
      error => {
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
        ref.ngOnInit();
      }, 3000);

    });
  }

  checkAll(event) {
    if (this.fieldArray.length == 1) {
      this.selectedRowId = this.fieldArray[0].id;
    }
    if(event != null) {
      this.fieldArray.forEach(x => x.state = event.target.checked);
    }
    else {
      this.fieldArray.forEach(x => x.state = true);
    }    
    this.isSomeChecked();
  }

  isAllChecked() {
    if (this.fieldArray.length == 0) {
      return false;
    }
    return this.fieldArray.every(_ => _.state);
  }

  onEditChecked(event) {
    this.isSomeChecked();
    if (event.target.checked) {
      console.log(" event target value : " + event.target.value);
      this.selectedRowId = event.target.value;
    } else {
      let count = 0;
      this.fieldArray.forEach(x => {
        if (x.state) {
          count++;
        }
      });
      if (count == 0) {
        this.selectedRowId = 0;
      } else if (count == 1) {
        this.fieldArray.forEach(x => {
          if (x.state) {
            this.selectedRowId = x.id;
          }
        });
      }
    }
  }  

}
