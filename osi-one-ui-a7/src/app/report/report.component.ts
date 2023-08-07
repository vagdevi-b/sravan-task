import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../shared/app-constants';
import { SimpleTimer } from 'ng2-simple-timer';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import { ReportService } from '../report/report.service';
import { ViewReport } from './viewreport';
import { Route } from '@angular/router/src/config';
import * as _ from "underscore";

@Component({
  selector: 'app-dashboard',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [ReportService]
})
export class ReportComponent implements OnInit {

  constructor(private router: Router, private reportService :ReportService, private route: ActivatedRoute) { }
  successMessage = "";
  errorMessage = "";
  isItPMOReports = false;
  reportsResponse: ViewReport[];
  reportsResponseExpense: ViewReport[] = [];
  reportsResponseEmployee: ViewReport[]= [];
  reportsResponseInvoice: ViewReport[]= [];
  reportsResponseTimesheet: ViewReport[]= [];
  reportsResponseProject: ViewReport[]= [];
  reportsResponseLeaves: ViewReport[]= [];
  reportsResponsePAndL: ViewReport[]= [];
  reportsResponseMisc: ViewReport[]= [];
  reportsResponsePMO: ViewReport[]= [];
  reportsResponseHR: ViewReport[]= [];
  reportsResponseFinance: ViewReport[]= [];
 // -- ALL Reports
 reportsResponseExpenseAll: ViewReport[] = [];
 reportsResponseEmployeeAll: ViewReport[]= [];
 reportsResponseInvoiceAll: ViewReport[]= [];
 reportsResponseTimesheetAll: ViewReport[]= [];
 reportsResponseProjectAll: ViewReport[]= [];
 reportsResponseLeavesAll: ViewReport[]= [];
 reportsResponsePAndLAll: ViewReport[]= [];
 reportsResponseMiscAll: ViewReport[]= [];
 reportsResponseVerification: ViewReport[]= [];
  ngOnInit() {
    this.getActiveReports();
    localStorage.removeItem("modifiedReport");
    localStorage.removeItem("navigation")
    if (this.router.url == '/reports/allReports'){
      localStorage.setItem("allOrEmployee", "all");
      this.isItPMOReports = true;
    }else{
      localStorage.setItem("allOrEmployee", "Employee");
    }
  }
  closeErrorMessage(id){
    $("#"+id).hide();
  }
  getAvailableAndFilterColumns(report){
   // console.log("rptMetaDataId"+report);
   localStorage.removeItem("savedReport");
    localStorage.setItem("report", JSON.stringify(report));
    this.router.navigate(['/reports/columns'],{relativeTo:this.route});
  }
  getActiveReports(){
    let i = 0;
    let em = 0;
    let ex = 0;
    let t = 0;
    let pr = 0;
    let pl = 0;
    let l = 0;
  let ms = 0;
  let pmo = 0;
  let hr = 0;
  let fin = 0;
 
  let iAll = 0;
  let emAll = 0;
  let exAll = 0;
  let tAll = 0;
  let prAll = 0;
  let plAll = 0;
  let lAll = 0;
  let msAll = 0;
  let verf = 0;
    this.reportService.getActiveReports().subscribe(response => {
      this.reportsResponse = response;
      for (let value of response) {
        let report : any = value;
        if(report.reportType1=='Expense'){
          this.reportsResponseExpense[ex] = report;
          ex++;
        }else if(report.reportType1=='Employee'){
          this.reportsResponseEmployee[em] = report;
          em++;
        }else if(report.reportType1=='Invoice'){
          this.reportsResponseInvoice[i] = report;
          i++;
        }else if(report.reportType1=='Timesheet'){
          this.reportsResponseTimesheet[t] = report;
          t++;
        }else if(report.reportType1=='Project'){
          this.reportsResponseProject[pr] = report;
          pr++;
        }else if(report.reportType1=='Leaves'){
          this.reportsResponseLeaves[l] = report;
          l++;
        }else if(report.reportType1=='PAndL'){
          this.reportsResponsePAndL[pl] = report;
          pl++;
        }else if(report.reportType1=='Misc'){
          this.reportsResponseMisc[ms] = report;
          ms++;
        }else if(report.reportType1=='PMO'){
          this.reportsResponsePMO[pmo] = report;
          pmo++;
        }else if(report.reportType1=='HR'){
          this.reportsResponseHR[hr] = report;
          hr++;
        }else if(report.reportType1=='Finance'){
          this.reportsResponseFinance[fin] = report;
          fin++;
        }
        // -- ALL Reports
        else if(report.reportType1=='Expense-All'){
          this.reportsResponseExpenseAll[exAll] = report;
          exAll++;
        }else if(report.reportType1=='Employee-All'){
          this.reportsResponseEmployeeAll[emAll] = report;
          emAll++;
        }else if(report.reportType1=='Invoice-All'){
          this.reportsResponseInvoiceAll[iAll] = report;
          iAll++;
        }else if(report.reportType1=='TimeSheet-All'){
          this.reportsResponseTimesheetAll[tAll] = report;
          tAll++;
        }else if(report.reportType1=='Project-All'){
          this.reportsResponseProjectAll[prAll] = report;
          prAll++;
        }else if(report.reportType1=='Leaves-All'){
          this.reportsResponseLeavesAll[lAll] = report;
          lAll++;
        }else if(report.reportType1=='PAndL-All'){
          this.reportsResponsePAndLAll[plAll] = report;
          plAll++;
        }else if(report.reportType1=='Misc-All'){
          this.reportsResponseMiscAll[msAll] = report;
          msAll++;
        }
        else if(report.reportType1=='Verification'){
          this.reportsResponseVerification[verf] = report;
          verf++;
        }
     }
     this.reportsResponsePMO =  _.sortBy(this.reportsResponsePMO, "rptName");
     this.reportsResponseHR =  _.sortBy(this.reportsResponseHR, "rptName");
     this.reportsResponseFinance =  _.sortBy(this.reportsResponseFinance, "rptName");
     this.reportsResponseExpenseAll =  _.sortBy(this.reportsResponseExpenseAll, "rptName");
     this.reportsResponseEmployeeAll =  _.sortBy(this.reportsResponseEmployeeAll, "rptName");
     this.reportsResponseInvoiceAll =  _.sortBy(this.reportsResponseInvoiceAll, "rptName");
     this.reportsResponseTimesheetAll =  _.sortBy(this.reportsResponseTimesheetAll, "rptName");
     this.reportsResponseProjectAll =  _.sortBy(this.reportsResponseProjectAll, "rptName");
     this.reportsResponseLeavesAll =  _.sortBy(this.reportsResponseLeavesAll, "rptName");
     this.reportsResponseMiscAll =  _.sortBy(this.reportsResponseMiscAll, "rptName");
     this.reportsResponseVerification=_.sortBy(this.reportsResponseVerification, "rptName");
    //  console.log("tst"+ this.reportsResponse[0].rptName);
    },
    Error => {
    //	this.setMessage(Error, AppConstants.errorMessageType);
    //	this.blockUI.stop();
    	window.scrollTo(0, 0);
    });
  }

}
