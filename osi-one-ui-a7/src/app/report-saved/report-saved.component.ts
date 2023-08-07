import { Component, OnInit } from "@angular/core";
import { ReportService } from "../report/report.service";
import { ViewReport } from "../report/viewreport";
import { AppConstants } from "../shared/app-constants";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Route } from "@angular/router/src/config";
import { JsonObject } from "@angular-devkit/core";
import * as _ from "underscore";
import { LeaveRequestService } from "../shared/services/leaveRequest.service";
import { log } from "util";
declare var $: any;
@Component({
  selector: "app-report-saved",
  templateUrl: "./report-saved.component.html",
  styleUrls: ["./report-saved.component.css"]
})
export class ReportSavedComponent implements OnInit {
  showTHis:boolean = true;
  shareToAll: boolean = false;
  searchedText : any;
  rptName : any;
  sharedBys : any;
  sortKey: any;
  initialReportSearchMsg : boolean;
  reportFileDownload: any;
  private userName: any;
  constructor(
    private router: Router,
    private _leaveRequestService: LeaveRequestService,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}
  successMessage: any;
  errorMessage: any;
  private viewReportsResponse: any;
  reportsResponse: ViewReport[];
  ngOnInit() {
    this.initialReportSearchMsg = true;
    this.userName = localStorage.getItem("userName");
    $("#successMessage").hide();
    $("#errorMessage").hide();
    localStorage.setItem("navigation", "savedReport");
	localStorage.removeItem("modifiedReport");
   if(localStorage.getItem("reportName")){
    this.rptName = localStorage.getItem("reportName");
   }
   if(localStorage.getItem("sharedBy")){
     this.sharedBys = localStorage.getItem("sharedBy");
      }
      if(localStorage.getItem("reportName") || localStorage.getItem("sharedBy")){
        this.searchReports();
      }

      this.onLoadReports('', '');
      
  }

  getSavedReport(report) {
    console.log("savedReport " + report);
    localStorage.removeItem("report");
    localStorage.setItem("savedReport", JSON.stringify(report));
    this.router.navigate(["/reports/columns"], { relativeTo: this.route });
  }
  reportReRun(report, fileType) {
    $("#loadingEditSubmitModal").modal({ show: true, backdrop: "static" });
    this.reportService
      .reportReRun(report.savedRptId, report.reportType,fileType)
      .subscribe(
        response => {
          let data : any =response;
          var myJson = JSON.stringify(response);
          localStorage.setItem("viewResponse", myJson);
          localStorage.setItem("navigation", "rerun");
          localStorage.removeItem("runReport");
          localStorage.setItem("saveReport", "saveReport");
          $("#loadingEditSubmitModal").modal("hide");
          // this.router.navigate(["/reports/viewReport"], { 
          //   relativeTo: this.route
          // });
          this.reportFileDownload = AppConstants.reportsDownloadURL + data.reportFileName + '.' + fileType;
          window.open(this.reportFileDownload, '_blank');
        },
        Error => {
          window.scrollTo(0, 0);
        }
      );
  }
  closeErrorMessage(id) {
    $("#" + id).hide();
  }
  deleteSavedReport() {
    this.reportService.deleteSavedReport(this.selectedReport).subscribe(
      response => {
        var myJson = JSON.stringify(response);
        localStorage.setItem("viewResponse", myJson);
        this.viewReportsResponse = JSON.parse(
          localStorage.getItem("viewResponse")
        );
        this.router.navigate(["/reports/savedReports"], {
          relativeTo: this.route
        });
        this.successMessage = this.viewReportsResponse.successMessage;
        $("#deleteReportModal").modal("hide");
        $("#successMessage").show();
        setTimeout(() => {
          $("#successMessage").hide();
          this.getAllSavedReports('', '');
        }, 1000);
        // this.router.navigate(['/reports/viewReport'],{relativeTo:this.route});
      },
      Error => {
        window.scrollTo(0, 0);
      }
    );
  }
  getAllSavedReports(rptName, sharedBy) {
    console.log(rptName);
    console.log(sharedBy);
    this.reportService.getAllSavedReports(rptName, sharedBy).subscribe(
      response => {
        this.reportsResponse = response;
      },
      Error => {
        window.scrollTo(0, 0);
      }
    );
  }
  onLoadReports(rptName, sharedBy) {
    this.showTHis = false;
    console.log(rptName);
    console.log(sharedBy);
    this.reportService.getAllSavedReports(rptName, sharedBy).subscribe(
      response => {
        this.reportsResponse = response.filter(x=>x.rptDesc == '');        
      },
      Error => {
        window.scrollTo(0, 0);
      }
    );
  }

  shareToEmp: any[] = [];

  selectedReport = "";
  selectedReportName= ""
  selectAllSearched = false;
  openToShareReport(report) {
    console.log(report);
    this.selectedReport = report.savedRptId;
    this.selectedReportName = report.rptName
  }

  checkAll(ev) {
    if(this.shareToEmp != null){
      this.shareToEmp.forEach(x => (x["state"] = ev.target.checked));}
  }

  isAllChecked() {
    if(this.shareToEmp != null) {
       return this.shareToEmp.every(x => x["state"]);
    }
  }

  hasEmailLength = false;
  getEmployeesToShare(searchedTxt) {
    this.hasEmailLength = false;
    // let searchedTxt = event.target.value;
    console.log(searchedTxt);

    this.shareToEmp = [];
    this._leaveRequestService
      .getMailSuggestion(searchedTxt)
      .subscribe(response => {
        this.shareToEmp = response;
        console.log(this.shareToEmp);

        if (this.shareToEmp.length === 0) {
          this.hasEmailLength = true;
        }
        this.shareToEmp.forEach(x => {
          x["state"] = false;
        });
      });
  }

  trackByFun(index) {
    return index;
  }

  shareReport(value) {
    $("#successMessage").hide();
    console.log(value);
    if (value.shareToAllEmployee) {
      //share to all employee
      let sendObj = {
        savedRptId   : this.selectedReport,
        employeeId : "0"
      }
      this.reportService.shareReport(sendObj).subscribe(resp =>  {console.log(resp
      )
      this.successMessage = "Report shared successfully";
      $("#shareReportModal").modal("hide");
      $("#successMessage").show();
       setTimeout(() => {
        $("#successMessage").hide();
      }, 3000);
    },  
    Error => {
      this.errorMessage = JSON.parse(Error._body).message;
      $("#errorMessage").show();
      $("#shareReportModal").modal("hide");
      setTimeout(() => {
       $("#errorMessage").hide();
     }, 3000);
    }
  ); 
    $("#shareReportModal").modal("hide");
    } else if (value.allSearched) {
      //share to all searched emp
      delete value.shareToAllEmployee;
      delete value.allSearched;
      var keys = Object.keys(value);
      var trueId = keys.filter(function(key) {
        return value[key];
      });
      let sendObj = {
        savedRptId   : this.selectedReport,
        employeeId : trueId.toString()
      }

      this.reportService.shareReport(sendObj).subscribe(resp => {
        console.log(resp)
        this.successMessage = "Report shared successfully";
        $("#shareReportModal").modal("hide");
        $("#successMessage").show();
         setTimeout(() => {
          $("#successMessage").hide();
        }, 3000);
    },  
    Error => {
      this.errorMessage = JSON.parse(Error._body).message;
      $("#shareReportModal").modal("hide");
      $("#errorMessage").show();
      setTimeout(() => {
       $("#errorMessage").hide();
     }, 3000);
    }
  ); 
     
    } else {
      delete value.shareToAllEmployee;
      delete value.allSearched;
      var keys = Object.keys(value);
      var trueId = keys.filter(function(key) {
        return value[key];
      });
      let sendObj = {
        savedRptId   : this.selectedReport,
        employeeId : trueId.toString()
      }

      console.log(sendObj);
      
       this.reportService.shareReport(sendObj).subscribe(resp => {
         console.log(resp)
       this.successMessage = "Report shared successfully";
       $("#shareReportModal").modal("hide");
       $("#successMessage").show();
        setTimeout(() => {
         $("#successMessage").hide();
       }, 3000);
      }, Error => {
        this.errorMessage = JSON.parse(Error._body).message;
        $("#errorMessage").show();
        $("#shareReportModal").modal("hide");
        setTimeout(() => {
         $("#errorMessage").hide();
       }, 3000);
      }); 
    }
  }
  flag = false;
  sorting(key) {
    this.sortKey = key;
    if (this.reportsResponse != null) {

      if (this.flag) {

        if (key === 'lastRundate') {
          this.flag = false
          this.reportsResponse.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return -(dateA.getTime() - dateB.getTime());
          });
        } else {
          this.flag = false
          this.reportsResponse.sort((a, b) => {
            if (a[key] > b[key]) return -1;
            if (a[key] < b[key]) return 1;
            return 0;
          })

        }
      } else {

        if (key === 'lastRundate') {
          this.flag = true
          this.reportsResponse.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return dateA.getTime() - dateB.getTime();
          });
        } else {
          this.flag = true
          this.reportsResponse.sort((a, b) => {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            return 0;
          })
        }
      }
      // let key = 'leaveId'


      // this.rowData.sort((a,b)=>{
      //   if(a[key] > b[key]) return -1;
      //   if(a[key] < b[key]) return 1
      //   return 0;
      // })

    }
  }
  deleteReport(report) {
    this.selectedReport = report.savedRptId;
  }

  searchReports(){
    console.log(this.rptName +"::"+this.sharedBys);
    if(this.rptName==undefined){
      this.rptName = '';
    }
    if(this.sharedBys==undefined){
      this.sharedBys= '';
    }
    this.getAllSavedReports(this.rptName, this.sharedBys);
    localStorage.setItem("reportName", this.rptName);
    localStorage.setItem("sharedBy", this.sharedBys);
    this.initialReportSearchMsg = false;
    this.sortKey = 'rptName'
    this.sorting('rptName');
  }

  clearSearch(){
    this.showTHis=true;
    this.rptName = '';
    this.sharedBys = '';
    localStorage.setItem("reportName", '');
    localStorage.setItem("sharedBy", '');
    this.reportsResponse = undefined;
    this.initialReportSearchMsg = true;
  }
}
