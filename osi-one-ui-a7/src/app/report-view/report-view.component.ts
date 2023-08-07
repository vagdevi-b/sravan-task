import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { AppConstants } from '../shared/app-constants';
import { SimpleTimer } from 'ng2-simple-timer';
import {NumericLiteral} from 'typescript';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import { ReportService } from '../report/report.service';
import { ViewReport } from '../report/viewreport';
import { JsonObject, JsonArray } from '@angular-devkit/core';
import * as _ from 'underscore';
import {saveAs as importedSaveAs} from "file-saver";
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

const MAX_PDF_RETRIES = 6;
const PDF_BEGIN_REGEX = /%PDF/g;
const PDF_END_REGEX = /%%EOF/;
const WAITING_TIME_IN_MS = 15000;

declare var $: any;
@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private router: Router,
    private reportService :ReportService,
    private route :ActivatedRoute,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) { }
  viewReportsResponse: any;
  headerColumns: any[string]=[];
  results: any[string] = [];
  reportName :any;
  reportPdfFileName :any;
  reportExcelFileName :any;
  savedOrRun : boolean;
  private pdfRetries: number;

  ngOnInit() {
    if(localStorage.getItem("action")=="run"){
      this.savedOrRun = false;
    }else{
      this.savedOrRun = true;
    }
    this.viewReportsResponse = JSON.parse(localStorage.getItem("viewResponse"));
    this.headerColumns = this.viewReportsResponse.columnHeaders;
    this.reportName = this.viewReportsResponse.reportName;
    this.pdfRetries = 0;
    this.setReportPdfUrl();
    this.reportExcelFileName = AppConstants.reportsDownloadURL+this.viewReportsResponse.reportFileName+'.xlsx';
    this.results = this.viewReportsResponse.results;
  }

  // reRun(){
  //   this.pdfRetries = 0;
  //   this.reportService.runReport(this.viewReportsResponse).subscribe(response => {
  //       var myJson: any = JSON.stringify(response);
  //       localStorage.setItem("viewResponse", myJson);
  //       this.viewReportsResponse = JSON.parse(localStorage.getItem("viewResponse"));
  //       this.setReportPdfUrl();
  //       this.reportExcelFileName = AppConstants.reportsDownloadURL+this.viewReportsResponse.reportFileName+'.xlsx';
  //     },
  //     Error => {
  //       //	this.setMessage(Error, AppConstants.errorMessageType);
  //       //	this.blockUI.stop();
  //       window.scrollTo(0, 0);
  //     });
  // }

  modifyReport(){
    let report = {
      "rptMetaDataId": this.viewReportsResponse.rptMetaDataId
    }
    localStorage.setItem("report", JSON.stringify(report));
    this.router.navigate(['/reports/columns'],{relativeTo:this.route});
  }

  downloadFile(){
    let reportsDTO  =  localStorage.getItem("reportss");
    console.log(JSON.parse(reportsDTO));
    this.reportService.downloadFile(reportsDTO).subscribe(blob => {
        importedSaveAs(blob, "test.pdf");
      }
    )
  }
  backToReportList(action){
    if(localStorage.getItem("navigation") == "rerun"){
      this.router.navigate(['/reports/savedReports'],{relativeTo:this.route});
    }else if(this.savedOrRun){
      localStorage.removeItem("modifiedReport");
      this.viewReportsResponse = JSON.parse(localStorage.getItem("viewResponse"));
      let savedReport = {
        active: null,
        allOrEmployee: this.viewReportsResponse.allOrEmployee,
        comments: this.viewReportsResponse.comments,
        displayFilterSummary: this.viewReportsResponse.displayFilterSummary==1?true:false,
        lastRundate: this.viewReportsResponse.lastRundate,
        reportType: this.viewReportsResponse.rptViewName,
        reportType1: null,
        rptDesc: "",
        rptMetaDataId: this.viewReportsResponse.rptMetaDataId,
        rptName: this.viewReportsResponse.reportName,
        rptQuery: null,
        savedRptId: this.viewReportsResponse.savedRptId
      }
      localStorage.setItem("savedReport", JSON.stringify(savedReport));
      this.router.navigate(['/reports/columns'],{relativeTo:this.route});
    }else{
      localStorage.removeItem("savedReport");
      localStorage.setItem("modifiedReport", "modifiedReport");
      this.router.navigate(['/reports/columns'],{relativeTo:this.route});
    }
    /* } else{
       localStorage.setItem("modifiedReport", "modifiedReport");
       this.router.navigate(['/reports/columns'],{relativeTo:this.route});
     } */
  }

  setReportPdfUrl() {
    $('#loadingEditSubmitModal').modal({ show: true, backdrop: 'static' });

    if (this.pdfRetries >= MAX_PDF_RETRIES) {
      this.toastrService.error('Error occurred while fetching the report PDF.');
      $('#loadingEditSubmitModal').modal('hide');
      this.backToReportList(undefined);
      return;
    }

    const pdfUrl = `${AppConstants.reportsDownloadURL}${this.viewReportsResponse.reportFileName}.pdf`;

    this.reportService.getReportPdf(pdfUrl)
      .subscribe(
        pdfBlob => {

          const beginPromise = pdfBlob.slice(0, 4)
            .text()
            .then(text => text && text.match(PDF_BEGIN_REGEX));

          const endPromise = pdfBlob.slice(pdfBlob.size - 20, pdfBlob.size)
            .text()
            .then(text => text && text.match(PDF_END_REGEX));

          Promise.all([beginPromise, endPromise])
            .then(values => {
              if (values.every(each => each)) {

                this.reportPdfFileName = this.sanitizer
                  .bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob));

                $('#loadingEditSubmitModal').modal('hide');
              } else {
                this.pdfRetries++;

                setTimeout(() => {
                  this.setReportPdfUrl();
                }, WAITING_TIME_IN_MS);

              }
            });
        },
        error => {
          console.debug('REPORT PDF DOWNLOAD FAILED. RETRYING...');
          this.pdfRetries++;

          setTimeout(() => {
            this.setReportPdfUrl();
          }, WAITING_TIME_IN_MS);
        }
      );
  }
}
