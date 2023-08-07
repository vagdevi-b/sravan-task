import { LeaveRequestService } from './../../../shared/services/leaveRequest.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";

//import * as $ from 'jquery';
import { AppConstants } from '../../../shared/app-constants';
import { ViewLeavesComponent } from '../viewleaves.component';
import { UploadFile } from '../../../shared/utilities/uploadfile';
import { Flash } from '../../../shared/utilities/flash';
import {forkJoin} from 'rxjs';

declare var $: any;

@Component({
  selector: "app-leaverequest",
  templateUrl: "./leaverequest.component.html",
  styleUrls: ["./leaverequest.component.css"],
})
export class LeaverequestComponent implements OnInit {
  @ViewChild("DatePickContainer1") datePickContainer1;
  @ViewChild("DatePickContainer2") datePickContainer2;
  @ViewChild("AttachmentFile") attachmentFile;

  @ViewChild("AlertSuccess") alertSuccess: ElementRef;
  @ViewChild("AlertError") alertError: ElementRef;
  successMessage: string;
  errorMessage: string;
  notificationTimeOut: number = 5000;

  notifyData = [];
  addedEmails = [];
  [x: string]: Object;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _leaveRequestService: LeaveRequestService,
    private viewLeavesComponent: ViewLeavesComponent,
    private toastrService: ToastrService
  ) {}

  // modal Variable
  invalidTotalHours: boolean = false;
  searchedText = "";
  files = [];
  maxFileSize5MB = 5242880;
  leaveAttachments = [];
  mailArray = [];
  
  leaveType: any; 
  leaveDetails: any;
  email: any;
  allocatedHours: number;
  enableButton: boolean = false;
  isLOP: boolean = false;
  selectedLeave = "";
  public rowData1;
  emailLength: boolean = false;
  private appData = AppConstants;
  isManager: boolean;
  isLeaveTypeId: boolean = false;
  suggestedMailId = [];
  disableOnAccural: boolean;
  selectedFile;
  successTextAlert = "";
  showSuccessAlert = false;
  public user: any = {};
  isNotManager: boolean = true;
  isNumber : boolean = true;
  //modal variable
  id: string;

  fromDate: string = "From Date";
  toDate: string = "To Date";
  leaveTypeId;
  selectedDates: boolean = false;
  dates: any[] = [];
  startDate: Date;
  noOfHours: number = 0;
  dayType: string;
  days: number;
  validationError: any;
  inValidFields: any;
  private leaveReq: any;
  public fieldArray: Array<any> = [];
  data: any;
  totalHours = 0;
  count = 0;
  dates_content: any;
  completed: boolean = false;
  applyingHours: any[] = [];
  leaveId: null;
  leaveSelectedFromDate: { year: number; month: number; day: number };
  leaveSelectedToDate: { year: number; month: number; day: number };

  isdisable:boolean;
  noOfdays:any;
  leaveBalance:any;
  exactLeavebalance:any;
  flash: Flash = new Flash();
  isPTO:boolean = false;

  ngOnInit() {
    $(".modal-backdrop").hide();

    // the code in subscribe will be executed after both calls finish
    forkJoin({
      leaveTypes: this._leaveRequestService.getLeaveTypes(),
      employeeLeavesDetails: this._leaveRequestService.getEmployeeLeavesDetails()
    }).subscribe(
      combinedResponse => {
        this.leaveType = combinedResponse.leaveTypes;
        this.leaveDetails = combinedResponse.employeeLeavesDetails;
        this.leaveBalance = this.leaveDetails[0].leaveBalance;

        this._leaveRequestService
          .removePTOIfNoLeaveBalance(this.leaveType, this.leaveBalance);
      },
      error => {
        this.toastrService.error(error);
      }
    );

    this.leaveSelectedFromDate = {
      year: Number(),
      month: Number(),
      day: Number(),
    };
    this.leaveSelectedToDate = {
      year: Number(),
      month: Number(),
      day: Number(),
    };

    this.inValidFields = [
      "fromDate",
      "toDate",
      "leaveTypeId",
      "leaveReason",
      "uploadfile",
      "email",
    ];
    this.validationError = {
      fromDate: false,
      toDate: false,
      leaveTypeId: false,
      leaveReason: false,
      uploadfile: false,
      email: false,
    };
  }

  getLeavesApplyingHours(fromdate, todate) {
    this.totalHours = 0;

    this._leaveRequestService
      .getLeavesApplyingHours(fromdate, todate, '')
      .subscribe((response) => {

        this.applyingHours = response;
        this.noOfdays = 0;
        this.applyingHours.forEach((obj) => {
          this.totalHours = this.totalHours + obj['noOfHours'];

          if (/Holiday/i.test(obj.leaveTypeName)) {
            this.toastrService.error(
              obj.leaveDescription,
              `Holiday On: ${obj.date}`
            );
          }
        });

        this.checkTotalHoursAndAllocatedHours();
      });
  }

  isHourNull = false;
  //to get editable hours in total hours
  checkTotalHours(val) {
    this.isHourNull = false;
    if (parseFloat(val) === null) {
      //to disable the buttons when null value is entered
      this.isHourNull = true;
    }
    this.totalHours = 0;
    this.applyingHours.forEach((x) => {
      if (x.noOfHours == null) {
        x.noOfHours = 0;
        this.enableButton = false;
        this.isHourNull = false;
      }
      this.totalHours += parseFloat(x.noOfHours);
    });
    this.checkTotalHoursAndAllocatedHours();
  }
 
 // Validates the value of hours to be between 0 and 8 
  numberOnly(event): boolean {
    //In Firefox, the keyCode property does not work on the onkeypress event (event.which ? event.which : event.keyCode;)
    const charCode = event.which ? event.which : event.keyCode; 
    var val = event.key;
    var num = event.target.value;
    var combinedValue = num + val;
    if (event.target.value.length >= 1) {

      var dotcontains = num.indexOf(".") != -1;
      if (dotcontains){
        if (charCode == 46) return false;
        else if(charCode == 53 || num.length >= 3 ){
          if(num.length >= 3 ){
            this.toastrService.error("Only one number after decimal is allowed");
            return false;
          }else if(combinedValue == 8.5){
            this.toastrService.error("Value should be between 0 and 8");
            return false;
          }
          return true;
        }else{
          this.toastrService.error("After decimal only literal 5 is allowed");
          return false;
        }
      }else if (charCode == 46) return true;
      else if ((charCode >= 48 && charCode <= 57) || charCode == 8)
      this.toastrService.error("Value should be between 0 and 8");
        return false;
    } else {
      if ((charCode >= 48 && charCode <= 56) || charCode == 8) {
        return true;
      }
      return false;
    }  
  }

  checkTotalHoursAndAllocatedHours() {
    if ( !this._leaveRequestService.isPTOOrLOP(this.selectedLeave)) {
      this.invalidTotalHours = false;
      this.enableButton = false;
     
      if (this.totalHours > this.allocatedHours) {
        this.invalidTotalHours = true;
        this.enableButton = true;
        let ref = this;
        if(this.selectedLeave == "LOSS OF PAY (LOP)" && this.leaveBalance <= 0){
          this.enableButton = false;
          this.isLOP = false;
        }
        if(this.exactLeavebalance <= 0){
          this.isLOP = false;
          this.enableButton = false;
        }

        this.isPTO = true;
        setTimeout(function () {
          ref.invalidTotalHours = false;
        }, 2000);
      }
    }
    
   
  }

  getHoursByLeaveId(leaveId) {
    this.invalidTotalHours = false;
    this.enableButton = false;
    this.isLOP = false;
    this.leaveType.forEach((x) => {
      if (x.leaveTypeId == leaveId) {
        this.selectedLeave = x.leaveTypeName;
      }
    });

    // not PTO or LOP
    if ( !this._leaveRequestService.isPTOOrLOP(this.selectedLeave)) {
      this._leaveRequestService
        .getHoursByLeaveId(leaveId)
        .subscribe((response) => {
          this.allocatedHours = response;
          this.checkTotalHoursAndAllocatedHours();
        });
    }
    // PTO
    else if (
        this._leaveRequestService.PTO_LEAVE_TYPE_REGEX.test(this.selectedLeave)
        && this.leaveBalance <= 0
        && !this._leaveRequestService.isInsufficientPTOHoursAllowed()
      ) {
        this.isLOP = true;
    }
  }


  //for date selection table
  dateSelected() {
    if (this.leaveSelectedFromDate.day && this.leaveSelectedToDate.day) {
      let fromdate =
        this.leaveSelectedFromDate.year +
        "-" +
        this.leaveSelectedFromDate.month +
        "-" +
        this.leaveSelectedFromDate.day;
      let todate =
        this.leaveSelectedToDate.year +
        "-" +
        this.leaveSelectedToDate.month +
        "-" +
        this.leaveSelectedToDate.day;
      this.selectedDates = true;
      this.getLeavesApplyingHours(fromdate, todate);
    }
  }

  getMailSuggestion(event) {
    this.addMailToNotify = false;
    this.emailLength = false;
    let mailId = event.target.value;
    if (event.keyCode == 13) {
      this.notifyData = [];
      // event.target.value = '';
      this._leaveRequestService
        .getMailSuggestion(mailId)
        .subscribe((response) => {
          this.notifyData = response;

          if (this.notifyData.length > 1) {
            event.target.value = "";
            $("#mailList").modal({ show: true });
          } else if (this.notifyData.length === 0) {
            this.emailLength = true;
          } else {
            event.target.value = "";
            let uniqueMail = this.notifyData[0];
            this.addedEmails.push(uniqueMail);
          }
        });
    }
  }

  filteredMailSearch(search) {
    this.searchedText = search;
    this.notifyData = [];

    this._leaveRequestService
      .getMailSuggestion(this.searchedText)
      .subscribe((response) => {
        response.forEach((data) => {
          this.notifyData.push(data);
        });
        // this.suggestedMailId = response;
      });
    this.searchedText = "";
  }

  selectedNotify(selectedData) {
    this.email = "";
    let mail = selectedData;
    this.addedEmails.push(selectedData);
    //  this.email+=selectedData.fullName;
    this.mailArray = selectedData.mail;
    $("#mailList").modal("hide");
  }

  removeEmail(index) {
    this.addedEmails.splice(index, 1);
  }

  onSubmit() {
    this.router.navigate(["/leaves/viewleaves"], { relativeTo: this.route });
  }
  onCancel() {
    this.router.navigate(["/leaves/viewleaves"], { relativeTo: this.route });
  }

  submitLeaveRequest() {
    this.user.fromDate =
      this.leaveSelectedFromDate.year +
      "-" +
      this.leaveSelectedFromDate.month +
      "-" +
      this.leaveSelectedFromDate.day;
    this.user.toDate =
      this.leaveSelectedToDate.year +
      "-" +
      this.leaveSelectedToDate.month +
      "-" +
      this.leaveSelectedToDate.day;
    this.user.noOfHours = this.totalHours;
    this.user.leavesTransactionsDTOs = [];

    this.leaveType.forEach((x) => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName;
      }
    });

    this.user.leaveAttachments = [];

    this.leaveAttachments.forEach((x) => {
      this.user.leaveAttachments.push({
        fileContent: x.fileContent,
        fileType: x.fileType,
        originalFileName: x.originalFileName,
      });
    });

    let ttHours = 0;

    this.applyingHours.forEach((x) => {
      if (Number(x.noOfHours) >= 0) {
        ttHours = ttHours + Number(x.noOfHours);
        this.user.leavesTransactionsDTOs.push({
          leaveDate: x.date,
          noOfHours: Number(x.noOfHours),
        });
      }
    });

    this.user.noOfHours = ttHours;

    let emailIds: string = "";
    let tmpMails = [];
    this.addedEmails.forEach((x) => {
      tmpMails.push(x.officeEmail);
      emailIds = emailIds + x.officeEmail + ",";
    });
    emailIds = emailIds.replace(/,\s*$/, "");
    this.user.email = emailIds;
    this.selectedLeave = this.user.leaveTypeName;
    $('#loadingEditSubmitModal').modal('show');
    this._leaveRequestService.submitLeaveRequest(this.user).subscribe(
      (requestService) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.user = requestService;

        this.exactLeavebalance = this.user.lowLeaveBalanceError;

        if (
          this.user.lowLeaveBalanceError <= 0
          && this._leaveRequestService.PTO_LEAVE_TYPE_REGEX.test(this.selectedLeave)
          && !this._leaveRequestService.isInsufficientPTOHoursAllowed()
        ) {
          this.toastrService.error("Low Leave Balance for applying PTO. Please apply for LOP");
        }
        else{
          this.viewLeavesComponent.createRowData();
          this.toastrService.success('Leave Request Submitted Successfully');

          this.router.navigate(
            ["/leaves/viewleaves"],
            { relativeTo: this.route }
          );
        }
      },
      (errorMessage) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastrService.error(errorMessage || 'Error while creating leave request..');
      }
    );
  }

  saveLeaveRequest() {

    this.enableSaveButton = true;
    this.user.fromDate =
      this.leaveSelectedFromDate.year +
      "-" +
      this.leaveSelectedFromDate.month +
      "-" +
      this.leaveSelectedFromDate.day;
    this.user.toDate =
      this.leaveSelectedToDate.year +
      "-" +
      this.leaveSelectedToDate.month +
      "-" +
      this.leaveSelectedToDate.day;
    this.user.noOfHours = this.totalHours;
    //this.user.leaveAttachments
    //this.user.uploadfile=this.files;
    this.user.leavesTransactionsDTOs = [];

    // this.user.leaveAttachments=this.leaveAttachments;
    this.user.leaveAttachments = [];

    this.leaveAttachments.forEach((x) => {
      this.user.leaveAttachments.push({
        fileContent: x.fileContent,
        fileType: x.fileType,
        originalFileName: x.originalFileName,
      });
    });
    // this.user.leaveAttachments=this.leaveAttachments;

    this.leaveType.forEach((x) => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName;
      }
    });

    let ttHours = 0;
    this.applyingHours.forEach((x) => {
      if (Number(x.noOfHours) >= 0) {
        ttHours = ttHours + Number(x.noOfHours);
        this.user.leavesTransactionsDTOs.push({
          leaveDate: x.date,
          noOfHours: Number(x.noOfHours),
        });
      }
    });

    this.user.noOfHours = ttHours;

    let emailIds: string = "";
    let tmpMails = [];
    this.addedEmails.forEach((x) => {
      tmpMails.push(x.officeEmail);
      emailIds = emailIds + x.officeEmail + ",";
    });
    emailIds = emailIds.replace(/,\s*$/, "");
    this.user.email = emailIds;

    if (
      !this._leaveRequestService
        .PTO_LEAVE_TYPE_REGEX
        .test(this.selectedLeave)
    ) {

      if (this.selectedLeave == "LOSS OF PAY (LOP)" && this.leaveBalance <= 0) {
        this.enableButton = false;
        this.isLOP = false;
      }
     

    }

    else {
      if (
        this.leaveBalance <= 0
        && !this._leaveRequestService.isInsufficientPTOHoursAllowed()
      ) {
        this.isLOP = true;
      }
    }

    this.selectedLeave = this.user.leaveTypeName;
    $('#loadingEditSubmitModal').modal('show');
    this._leaveRequestService.saveLeaveRequest(this.user).subscribe(
      (requestService) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.user = requestService;
        this.viewLeavesComponent.createRowData();
        this.exactLeavebalance = this.user.lowLeaveBalanceError;

        if (
          this.user.lowLeaveBalanceError <= 0
          && this._leaveRequestService.PTO_LEAVE_TYPE_REGEX.test(this.selectedLeave)
          && !this._leaveRequestService.isInsufficientPTOHoursAllowed()
        ) {
          this.toastrService.error(" Low Leave Balance for applying PTO. Please apply for LOP");
        }
        else{
          this.toastrService.success('Leave Request Saved Successfully');
          this.router.navigate(
            ["/leaves/viewleaves"],
            { relativeTo: this.route }
          );
        }
      },
      (errorMessage) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastrService.error(errorMessage || 'Error Creating Leave Request.');
      }
    );
  }

  editLeaveRequest() {
    this.user.noOfHours = this.totalHours;
    this.user.leavesTransactionsDTOs = [];

    let ttHours = 0;
    this.applyingHours.forEach((x) => {
      if (Number(x.noOfHours) !== 0) {
        ttHours = ttHours + Number(x.noOfHours);
        this.user.leavesTransactionsDTOs.push({
          leaveDate: x.date,
          noOfHours: Number(x.noOfHours),
        });
      }
    });

    this.leaveType.forEach((x) => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName;
      }
    });

    this.user.noOfHours = ttHours;

    let emailIds: string = "";
    let tmpMails = [];
    this.addedEmails.forEach((x) => {
      tmpMails.push(x.officeEmail);
      emailIds = emailIds + x.officeEmail + ",";
    });
    emailIds = emailIds.replace(/,\s*$/, "");
    this.user.email = emailIds;
    this._leaveRequestService.saveLeaveRequest(this.user).subscribe(
      (requestService) => {
        this.user = requestService;
      },
      (error) => (this.errorMessage = <any>error)
    );
  }

  validateField(field, value) {
    if (!value || value === "-- Select --" || value === -1 || value === "") {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
  }

  validateDate(field, date: { year: number; month: number; day: number }) {
    if (!date.year) {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
  }

  closeFix1(event, datePicker) {
    if (!this.datePickContainer1.nativeElement.contains(event.target)) {
      // check click origin
      datePicker.close();
    }
  }

  closeFix(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) {
      // check click origin
      datePicker.close();
    }
  }

  // Upload Files

  detectFiles(event: any) {
    // this.files = event.target.files;

    for (let i = 0; i < event.target.files.length; i++) {
      let fileExists = false;
      if (event.target.files[i].size > this.maxFileSize5MB) {
        this.errorMessage = "File Size Exceeds 5MB";
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, this.notificationTimeOut);
      } else if (!this.validateFile(event.target.files[i].name)) {
        this.errorMessage = "Invalid File Format";
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, this.notificationTimeOut);
      } else if (this.validateFile(event.target.files[i].name)) {
        // this.files.push(event.target.files[i]);
        //return false;
        for (let j = 0; j < this.leaveAttachments.length; j++) {
          if (
            this.leaveAttachments[j] &&
            this.leaveAttachments[j].originalFileName ==
              event.target.files[i].name
          ) {
            fileExists = true;
            this.errorMessage = "File Already Attached";
            this.alertError.nativeElement.classList.add("show");
            let ref = this;
            setTimeout(function () {
              ref.alertError.nativeElement.classList.remove("show");
            }, this.notificationTimeOut);
          }
        }
        if (!fileExists) {
          this.addFilesToLeaves(event.target.files[i]);
        }
      }
    }
    this.attachmentFile.nativeElement.value = "";
  }

  removeFile(index) {
    this.leaveAttachments.splice(index, 1);
  }

  validateFile(name: string) {
    let ext = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if (
      ext === "pdf" ||
      ext === "jpg" ||
      ext === "png" ||
      ext === "doc" ||
      ext === "txt" ||
      ext === "jpeg" ||
      ext === "docx" ||
      ext === "xlsx" ||
      ext === "xls" ||
      ext === "ppt" ||
      ext === "pptx" ||
      ext === "vsd" ||
      ext === "vsdx" ||
      ext === "zip" ||
      ext === "rtf" ||
      ext === "mpp" ||
      ext === "msg"
    ) {
      return true;
    } else {
      return false;
    }
  }

  addFilesToLeaves(file) {
    try {
      if (file) {
        // for (let file of this.files) {
        this.selectedFile = file;
        file.type.split("/")[0];
        let attachmentUrl;
        let reader = new FileReader();
        let uploadFile = new UploadFile();
        reader.onload = (e: any) => {
          attachmentUrl = reader.result;
          uploadFile.fileContent = attachmentUrl.substring(
            attachmentUrl.indexOf(",") + 1
          );
        };

        reader.onloadend = (e: any) => {
          uploadFile.fileType = file.type;
          uploadFile.originalFileName = file.name;

          if (this.selectedRowId > 0) {
            this.leaveAttachments.push(uploadFile);
          } else {
            this.leaveAttachments.push(uploadFile);
          }
        };

        reader.readAsDataURL(file);
      }
    } catch { }
  }
}
