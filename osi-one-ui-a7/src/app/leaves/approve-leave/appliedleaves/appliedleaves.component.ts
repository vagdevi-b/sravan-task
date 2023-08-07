import { HttpUtilities } from "./../../../shared/utilities/http-utilities";
import { Observable } from "rxjs";
import { Appliedleave } from "./../../../shared/utilities/appliedleave.model";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response } from "@angular/http";
// import * as $ from "jquery";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/mergeMap";
import { leave } from "@angular/core/src/profile/wtf_impl";

import { AppConstants } from "../../../shared/app-constants";
import { EmployeeLeaveService } from "../../../shared/services/employeeleave.service";
import { ApproveLeaveService } from "../../../shared/services/approveleave.service";
import { Leaves } from "../../../shared/utilities/leaves.model";
import { saveAs } from "file-saver/FileSaver";
declare var $: any;

@Component({
  selector: "app-appliedleaves",
  templateUrl: "./appliedleaves.component.html",
  styleUrls: ["./appliedleaves.component.css"]
})
export class AppliedleavesComponent implements OnInit {
  showLastAppliedLeaves: Boolean = false;
  showTeamLeaves: Boolean = false;
  showHolidays: Boolean = false;

  approvedLeavesLength: number;
  leaves: any;
  getLeaves: any;
  appliedLeave(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  errorMessage: any;
  downloadFiles: any;
  leaveAttachments: any;
  islayoutHide: boolean = true;
  appliedleave: any;
  private appData = AppConstants;
  isManager: boolean;
  leaveId:number=0;
  lastAppliedLeaves: any;
  holidayDtls: any;
  approvedLeaves: any;
  rejectReason = "";
  p;
  totalLeaveReq: number = 0;
  statusMessage: string;
  showMessage: Boolean;
  enableApproveButton : Boolean = false;
  enableCancelButton : Boolean = false;
  // isLeaveCanceled
  disableYesButton : Boolean =false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    private httpUtilities: HttpUtilities,
    private _employeeLeaveService: EmployeeLeaveService,
    private _approveLeaveService: ApproveLeaveService
  ) {}

  ngOnInit() {
    history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      //alert("Action is Not Permitted");
    history.go(1);
    }
    
    //this.isManager = true;
    this.getLeaves = new Array<Leaves>();
    this.lastAppliedLeaves = new Array<Leaves>();
    this.leaveId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.getEmployeeLastAppliedLeave(this.leaveId);
    this.getEmployeeLeaveDetailsAtApprovalTime(this.leaveId);
    this.dayByDayLeavesDetails(this.leaveId);
    this.getHolidaysAtRMApproval(this.leaveId);
    console.log("id leave " + this.leaveId);
    console.log(this.leaves);
   
    this.appliedleave = {};

    this._employeeLeaveService
      .getEmployeeLeaveById(this.leaveId)
      .subscribe(appliedLeave => {
        if (Object.keys(appliedLeave).length > 0) {
          this.appliedleave = appliedLeave;
          console.log(this.appliedLeave);
          if(this.appliedleave && (this.appliedleave.statusCode=='Approved' || this.appliedleave.statusCode=='Rejected' || this.appliedleave.statusCode=='Cancelled')){
            this.router.navigate(["/leaves/approve-leave"], { relativeTo: this.route });
          }
          this._approveLeaveService.getLeavesApplyingHours(appliedLeave.fromDate,appliedLeave.toDate, appliedLeave.leaveId)
          .subscribe(resp => {
               // this.dayByDayLeaves = resp
          })

        }
        this.isManager = this.appliedleave["manager"];
        this.leaveAttachments = appliedLeave["leaveAttachments"];
        console.log(" project data : " + JSON.stringify(this.appliedleave));
      }, error => (this.errorMessage = <any>error));
  }

  onReject(reason) {
    console.log("leaves : " + this.appliedleave);
    console.log("Rejected data...." + JSON.stringify(this.appliedleave));

    console.log(this.appliedleave.rejectReason);
    this.appliedleave.rejectReason = reason.rejectReason;
    if (this.appliedleave.rejectReason != "") {
      this._approveLeaveService
      .rejectedLeaves(this.appliedleave)
      .subscribe(requestService => {
        this.leaves = requestService;
        $("#modelReject").modal("hide");
        setTimeout(this.navigateToApprovalPage.bind(this,'rejected'), 1000);
        // this.router.navigate(["/leaves/approve-leave"], { relativeTo: this.route });
        }, error => (this.errorMessage = <any>error));
      } else {
        this.showMessage = true;
        this.statusMessage = "Please Enter Reason For Rejection";
        
        let ref = this;
        setTimeout(function() {
          ref.showMessage = false;
      }, 2000);
    }
   
  }

  onCancel() {
    this.router.navigate(["/leaves/approve-leave"], { relativeTo: this.route });

  }

  onApprove() {
    this.disableYesButton = true;
    this.enableApproveButton =true;
    $("#modelApprove").modal("hide");
    console.log("leaves : " + this.appliedleave);
    console.log("Approve data...." + JSON.stringify(this.appliedleave));
    this._approveLeaveService
      .approvedLeaves(this.appliedleave)
      .subscribe(requestService => {
        this.leaves = requestService;

        setTimeout(this.navigateToApprovalPage.bind(this,'approved'), 0);
      }, error => (this.errorMessage = <any>error));
  }
  successTextMessage;
  showSuccessAlert;


  navigateToApprovalPage(message) {
    if(message === 'approved'){
    this.successTextMessage = 'Leave Request Approved';
    this.showSuccessAlert = true
    console.log("i am in navigate");
    }else if(message === 'rejected'){
    this.successTextMessage = 'Leave Request Rejected';
    this.showSuccessAlert = true
    console.log("i am in navigate");
  }else if(message === 'cancelled'){
    this.successTextMessage = 'Leave Request Cancelled';
    this.showSuccessAlert = true
  }
  this.router.navigate(["/leaves/approve-leave",{p1:this.showSuccessAlert,p2:this.successTextMessage}], { relativeTo: this.route });
  }

  cancelApprovedLeave() {
    this.enableCancelButton =true;
    this.disableYesButton = true;
    $("#modelCancelLeave").modal("hide");
    console.log("leaves : " + this.appliedleave);
    console.log("Approve data...." + JSON.stringify(this.appliedleave));

    this._approveLeaveService
      .cancelApprovedLeave(this.appliedleave)
      .subscribe(requestService => {
        this.leaves = requestService;
        setTimeout(this.navigateToApprovalPage.bind(this,'cancelled'), 1000);

      }, error => (this.errorMessage = <any>error));
  }

  downloadFile(
    fileName: string,
    duplicateFileName: string,
    fileType: string,
    leaveId: string
  ) {
    console.log("sdfsdfsf");
    this._approveLeaveService
      .downloadFile(duplicateFileName, leaveId)
      .subscribe(downloadObj => {
        this.downloadFiles = downloadObj;
        console.log("Response : data : ", this.downloadFiles);
        console.log(
          "downloadObj.fileContent : ",
          this.downloadFiles.fileContent
        );

        var byteCharacters = atob(this.downloadFiles.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: this.downloadFiles.fileType });
        //var url= window.URL.createObjectURL(blob);
        //window.open(url, "download,status=1");

        saveAs(blob, fileName);

        //window.open("data:image/png;base64,"+this.downloadFiles.fileContent,"_blank");
      }, error => (this.errorMessage = <any>error));
  }

  getEmployeeLastAppliedLeave(leaveId) {
    console.log("getEmployeeLastAppliedLeave : Componenet ....." + leaveId);
    this._approveLeaveService
      .getEmployeeLastAppliedLeave(leaveId)
      .subscribe(requestService => {
        this.lastAppliedLeaves = requestService;

        this.lastAppliedLeaves.sort((a, b) => {
          const dateA = new Date(a.fromDate);
          const dateB = new Date(b.fromDate);
          return -(dateA.getTime() - dateB.getTime()); // to sort in desc order
        });

        if (this.lastAppliedLeaves.length > 0) {
          this.showLastAppliedLeaves = true;
        }

        console.log(
          "getEmployeeLastAppliedLeave : " +
            JSON.stringify(this.lastAppliedLeaves)
        );
      }, error => (this.errorMessage = <any>error));
  }

  getEmployeeLeaveDetailsAtApprovalTime(leaveId) {
    console.log("getEmployeeLastAppliedLeave : Componenet ....." + leaveId);
    this._approveLeaveService
      .getEmployeeLeaveDetailsAtApprovalTime(leaveId)
      .subscribe(requestService => {
        this.approvedLeaves = requestService;

        if (requestService.length > 0) {
          this.approvedLeavesLength = this.approvedLeaves.length;
          this.showTeamLeaves = true;
        }
        console.log(
          "getEmployeeLeaveDetailsAtApprovalTime : " +
            JSON.stringify(this.approvedLeaves)
        );
      }, error => (this.errorMessage = <any>error));
  }

  getHolidaysAtRMApproval(leaveId) {
    console.log("getHolidaysAtRMApproval : Componenet ....." + leaveId);
    this._approveLeaveService
      .getHolidaysAtRMApproval(leaveId)
      .subscribe(requestService => {
        this.holidayDtls = requestService;
        this.holidayDtls.sort((a, b) => {
          const dateA = new Date(a.holidayDate);
          const dateB = new Date(b.holidayDate);
          return dateA.getTime() - dateB.getTime(); // to sort in acn order
        });

        if (this.holidayDtls.length > 0) {
          this.showHolidays = true;
        }

        console.log(
          "getHolidaysAtRMApproval : " + JSON.stringify(this.holidayDtls)
        );
      }, error => (this.errorMessage = <any>error));
  }

  public dayByDayLeaves: any[] = [];
  dayByDayLeavesDetails(leaveId) {
    this._approveLeaveService.dayByDayLeavesDetails(leaveId).subscribe(resp => {
      this.dayByDayLeaves.push(resp);
      if (this.dayByDayLeaves.length > 0) {
        this.dayByDayLeaves = this.dayByDayLeaves[0]["leavesTransactionsDTOs"];
        console.log(this.dayByDayLeaves);
      }
    }, error => (this.errorMessage = <any>error));
  }



  getLeavesApplyingHours(fromDate,toDate){
   
  }
}
