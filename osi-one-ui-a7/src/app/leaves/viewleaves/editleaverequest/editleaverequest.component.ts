import { LeaveRequestService } from './../../../shared/services/leaveRequest.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import * as $ from 'jquery';
import { AppConstants } from '../../../shared/app-constants';
import { EditLeaveService } from '../../../shared/services/editleave.service';
import { ViewLeavesComponent } from '../viewleaves.component';
import { saveAs } from 'file-saver/FileSaver';
import { UploadFile } from '../../../shared/utilities/uploadfile';
import { ToastrService } from 'ngx-toastr';
import {forkJoin} from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-editleaverequest',
  templateUrl: './editleaverequest.component.html',
  styleUrls: ['./editleaverequest.component.css']
})
export class EditleaverequestComponent implements OnInit {
  allocatedHours: any;
  invalidTotalHours=false
  enableButton=false;
  selectedLeave='';
  @ViewChild('AttachmentFile') attachmentFile;
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;

  showMessage: boolean = false
  statusMessage = ''
  recievedMail: any[] = []
  downloadFiles: any;
  emailLength: boolean = false;
  applyingHours: any;
  applyingEditHours: any = [];
  files: any;
  leaveType: any;

  errorMessage: any;
  successMessage: any;
  notificationTimeOut: number = 5000;
  PTO: boolean;

  constructor(private router: Router, private route: ActivatedRoute,
    private _leaveRequestService: LeaveRequestService,
    private editLeaveService: EditLeaveService,
    private toastrService: ToastrService,
    private viewLeavesComponent: ViewLeavesComponent) { }

  email: any
  successTextAlert = '';
  showSuccessAlert: boolean = false;
  rejectionReason = ''
  searchedText = ''
  notifyData = [];
  mailArray = []
  addedEmails = [];
  selectedFile: File = null;
  maxFileSize5MB = 5242880;
  leaveAttachments = [];
  id: string;
  suggestedMailId = '';
  fromDate: string = "From Date";
  toDate: string = "To Date";
  selectedDates: boolean = false;
  dates: any[] = [];
  startDate: Date;
  statusCode: string;
  noOfHours: number = 0;
  dayType: string;
  days: number;
  validationError: any;
  inValidFields: any;
  private leaveReq: any;
  public fieldArray: Array<any> = [];
  editLeave: any[];
  data: any;
  public user: any = {};
  private appData = AppConstants
  leaveSelectedFromDate: { "year": number, "month": number, "day": number };
  leaveSelectedToDate: { "year": number, "month": number, "day": number };
  completed: boolean = false;
  totalHours = 0;
  leaveID: number;
  leaveIds: number;
  isStatusApprove: boolean = false
  enableCancelLeaveButton=false;
  leaveBalance:any;
  leaveDetails: any;
  isLOP: boolean = false;
  exactLeavebalance:any;
  enableSaveButton: boolean = false;

  ngOnInit() {
    $('#loadingEditSubmitModal').modal('show');
    let leaveId = this.route.params["_value"].leaveId;
    this.leaveIds = leaveId;

    this.inValidFields = ["fromDate", "toDate", "leaveTypeId", "leaveReason", "uploadfile", "email"];
    this.validationError = { fromDate: false, toDate: false, leaveTypeId: false, leaveReason: false, uploadfile: false, email: false };

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

    this.editLeaveService.getEmployeeLeaveByLeaveId(leaveId).subscribe(listofleaves => {
      this.editLeave = listofleaves;

      this.enableCancelLeaveButton=false
      this._leaveRequestService.cancelstatus(this.editLeave['fromDate'], this.editLeave['toDate'])
        .subscribe(response => {
          this.enableCancelLeaveButton=response;
        });

      let fromdate: string[] = this.editLeave['fromDate'].split('-');
      this.leaveSelectedFromDate = { year: Number(fromdate[0]), month: Number(fromdate[1]), day: Number(fromdate[2]) };

      let todate: string[] = this.editLeave['toDate'].split('-');
      this.leaveSelectedToDate = { year: Number(todate[0]), month: Number(todate[1]), day: Number(todate[2]) };

      this.user.leaveTypeId = this.editLeave['leaveTypeId'];
      this.user.leaveId = this.editLeave['leaveId'];
      this.leaveID = this.editLeave['leaveId'];

      this.user.leaveReason = this.editLeave['leaveReason'];
      this.user.hours = this.editLeave['noOfHours'];
      this.user.email = this.editLeave['email']
      this.user.statusCode = this.editLeave['statusCode']
      this.rejectionReason = this.editLeave['rejectReason']

      //for disabling edit page on approved status
      if (this.user.statusCode === "Approved" || this.user.statusCode === "Submitted") {
        this.isStatusApprove = true;
      }
      this.user.leaveAttachments = this.editLeave['leaveAttachments'];
      if (this.user.leaveAttachments) {
        for (let i = 0; i < this.user.leaveAttachments.length; i++) {
          this.leaveAttachments.push(this.user.leaveAttachments[i]);
        }
      }
      //this.user.name=this.editLeave['emailName']
      let recievedMailName = []
      let recievedMailString = this.editLeave['emailName'];
      if (recievedMailString) {
        recievedMailName = recievedMailString.split(',')
      }
      let recievedEMail = []
      let recievedEMailString = this.editLeave['email'];
      if (recievedEMailString) {
        recievedEMail = recievedEMailString.split(',')
      }
      for (let i = 0; i < recievedEMail.length; i++) {
        let mailObj = { fullName: '', officeEmail: '' };
        mailObj.fullName = recievedMailName[i];
        mailObj.officeEmail = recievedEMail[i];
        this.recievedMail.push(mailObj);
      }

      this.user.leavesTransactionsDTOs = this.editLeave['leavesTransactionsDTOs'];
      this.applyingEditHours = this.editLeave['leavesTransactionsDTOs'];
      //  this.editLeave['leavesTransactionsDTOs'].forEach(data=>{
      //    this.applyingEditHours.push(data['noOfHours'])
      //  })
      this.editDateSelected();
      // this.dateSelected()
      $('#loadingEditSubmitModal').modal('hide');
    },
      error => this.errorMessage = <any>error);
  }

  // fromDateSelected() {
  //   this.dates = [];
  // }

  //holiday hrs
  getLeavesApplyingHours(fromdate, todate) {
    this.totalHours = 0;
    this._leaveRequestService.getLeavesApplyingHours(fromdate, todate, this.leaveID)
      .subscribe(response => {
        let leaveId = this.leaveID;
        let prevRes = this.applyingHours;
        if (response) {
          response.forEach(function (arr1Item) {
            prevRes.forEach(function (arr2Item) {
              if (arr1Item.date == arr2Item.date && arr1Item.leaveId == leaveId && arr1Item.leaveDescription == "Leave Applied") {
                arr1Item.noOfHours = arr2Item.noOfHours;
                arr1Item.leaveDescription = '';
              } else if (arr1Item.date == arr2Item.date && arr1Item.leaveId != leaveId && arr1Item.leaveDescription == "Leave Applied") {
                arr1Item.noOfHours = 0;
                //arr1Item.leaveDescription='';
              }
            })
          });
        }
        this.applyingHours = response;
        this.applyingHours.forEach(obj => this.totalHours = this.totalHours + Number(obj['noOfHours']));
        this.checkTotalHoursAndAllocatedHours();
      });
  }

  getEditLeavesApplyingHours(fromdate, todate) {
    this.totalHours = 0;
    this._leaveRequestService.getLeavesApplyingHours(fromdate, todate, this.leaveID)
      .subscribe(response => {

        if (this.applyingEditHours) {
          let prevRes = this.applyingEditHours;
          this.user.leavesTransactionsDTOs.forEach(x => {
            this.totalHours += Number(x.noOfHours);
          });

          if (response) {
            response.forEach(function (arr1Item) {
              if (arr1Item.leaveId == null) {

                prevRes.forEach(function (arr2Item) {
                  if (arr1Item.date === arr2Item.leaveDate) {
                    arr1Item.noOfHours = arr2Item.noOfHours;
                  }
                });
              }
            });
          }
        }
        this.applyingHours = response;
        this.checkTotalHoursAndAllocatedHours();
      });
  }

  getHoursByLeaveId(leaveId) {
    this.invalidTotalHours = false;
    this.enableButton = false;
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

    checkTotalHoursAndAllocatedHours(){
      if ( !this._leaveRequestService.isPTOOrLOP(this.selectedLeave)) {
      this.invalidTotalHours=false
      this.enableButton=false;
        if(this.totalHours>this.allocatedHours){
          // alert('greater')
          this.invalidTotalHours=true;
          this.enableButton=true;
          let ref = this;
          if(this.selectedLeave == "LOSS OF PAY (LOP)" && this.leaveBalance <= 0){
            this.enableButton = false;
            this.isLOP = false;
          }
          if(this.exactLeavebalance <= 0){
            this.isLOP = false;
            this.enableButton = false;
            this.enableSaveButton = false;
           // this.toastrService.error(" Low Leave Balance");
          }
          this.PTO = true;
        setTimeout(function () {
          ref.invalidTotalHours = false
        },2000);
        }
      }
    }
    isHourNull=false;

  checkTotalHours(event) {
    this.isHourNull=false;
    if(event.target.value==""){
      this.isHourNull=true;
    }
    this.totalHours = 0;
    this.applyingHours.forEach(x => {
      if(x.noOfHours==null){
        x.noOfHours = 0;
          this.enableButton=false;
          this.isHourNull = false;
      }
      this.totalHours += Number(x.noOfHours);

    })
    this.checkTotalHoursAndAllocatedHours();
  }

  numberOnly(event): boolean {
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


  downloadFile(fileName: string, duplicateFileName: string, fileType: string, leaveId: string) {
    this._leaveRequestService.downloadFile(duplicateFileName, leaveId).subscribe(
      downloadObj => {
        this.downloadFiles = downloadObj;

        var byteCharacters = atob(this.downloadFiles.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: this.downloadFiles.fileType });
        //var url= window.URL.createObjectURL(blob);
        //window.open(url, "download,status=1");

        saveAs(blob, fileName)

        //window.open("data:image/png;base64,"+this.downloadFiles.fileContent,"_blank");
      },
      error => this.errorMessage = <any>error);
  }

  getMailSuggestion(event) {

    this.emailLength = false;
    let mailId = event.target.value;
    if (event.keyCode == 13) {
      this.notifyData = [];

      this._leaveRequestService.getMailSuggestion(mailId).subscribe
        (response => {
          // response.forEach(data => {
          //   this.notifyData.push(data);
          // });
          // this.suggestedMailId = response;

          this.notifyData = response;
          if (this.notifyData.length > 1) {
            event.target.value = '';
            $('#mailList').modal({ show: true });
          }
          else if (this.notifyData.length === 0) {
            this.emailLength = true;
          }
          else {
            event.target.value = '';
            let uniqueMail = this.notifyData[0];
            this.recievedMail.push(uniqueMail)
          }

        })




      // $('#mailList').modal({ show: true });
    }
  }

  selectedNotify(selectedData) {
    this.email = "";
    let mail = selectedData;
    this.recievedMail.push(selectedData);
    this.mailArray = selectedData.mail;
    $('#mailList').modal('hide');
  }

  filteredMailSearch(search) {
    this.searchedText = search;
    this.notifyData = [];

    this._leaveRequestService.getMailSuggestion(this.searchedText).subscribe
      (response => {
        response.forEach(data => {
          this.notifyData.push(data);
        });
      })
    this.searchedText = ''
  }

  removeEmail(index) {
    this.recievedMail.splice(index, 1);
  }

  //for date selection table
  dateSelected() {
    if (this.leaveSelectedFromDate.day && this.leaveSelectedToDate.day) {
      let fromdate = this.leaveSelectedFromDate.year + "-" + this.leaveSelectedFromDate.month + "-" + this.leaveSelectedFromDate.day;
      let todate = this.leaveSelectedToDate.year + "-" + this.leaveSelectedToDate.month + "-" + this.leaveSelectedToDate.day;
      this.selectedDates = true;
      this.getLeavesApplyingHours(fromdate, todate);
    }
  }

  editDateSelected() {
    if (this.leaveSelectedFromDate.day && this.leaveSelectedToDate.day) {
      let fromdate = this.leaveSelectedFromDate.year + "-" + this.leaveSelectedFromDate.month + "-" + this.leaveSelectedFromDate.day;
      let todate = this.leaveSelectedToDate.year + "-" + this.leaveSelectedToDate.month + "-" + this.leaveSelectedToDate.day;
      this.selectedDates = true;
      this.getEditLeavesApplyingHours(fromdate, todate);
    }
  }

  // setToDate(){
  //   let todate = this.leaveSelectedToDate.year+"-"+this.leaveSelectedToDate.month+"-"+this.leaveSelectedToDate.day;
  // }


  onSubmit() {
    this.router.navigate(['/leaves/leaves'], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route });
  }

  submitLeaveRequest() {
    this.user.fromDate = this.leaveSelectedFromDate.year + '-' + this.leaveSelectedFromDate.month + '-' + this.leaveSelectedFromDate.day;
    this.user.toDate = this.leaveSelectedToDate.year + '-' + this.leaveSelectedToDate.month + '-' + this.leaveSelectedToDate.day;
    this.user.noOfHours = this.totalHours;
    let ttHours = 0;

    this.applyingHours.forEach(x => {
      if (x.noOfHours != 0) {
        ttHours = ttHours + Number(x.noOfHours);
        this.user.leavesTransactionsDTOs.push(
          {

            "leaveDate": x.date,
            "noOfHours": Number(x.noOfHours)
          }
        )
      };
    });

    this.leaveType.forEach(x => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName
      }
    });

    this.user.noOfHours = ttHours;

    let emailIds: string = '';
    let tmpMails = [];
    this.addedEmails.forEach(x => {
      tmpMails.push(x.officeEmail);
      emailIds = emailIds + x.officeEmail + ','
    })
    emailIds = emailIds.replace(/,\s*$/, "");
    this.user.email = emailIds;
    this._leaveRequestService.submitLeaveRequest(this.user).subscribe(requestService => {
      this.user = requestService;
      this.viewLeavesComponent.createRowData()
      this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route });
    },
	error => {this.errorMessage=error;
      $("#errorMessage").show();
      });
  }
  saveLeaveRequest() {
    this.user.fromDate = this.leaveSelectedFromDate.year + '-' + this.leaveSelectedFromDate.month + '-' + this.leaveSelectedFromDate.day;
    this.user.toDate = this.leaveSelectedToDate.year + '-' + this.leaveSelectedToDate.month + '-' + this.leaveSelectedToDate.day;
    this.user.noOfHours = this.totalHours;
    this.user.leavesTransactionsDTOs = [];
    this.user.leaveAttachments = []

    this.leaveAttachments.forEach(x => {
      this.user.leaveAttachments.push({
        "attachmentId": x.attachmentId,
        "fileContent": x.fileContent,
        "fileType": x.fileType,
        "originalFileName": x.originalFileName
      })
    })

    this.leaveType.forEach(x => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName
      }
    });

    let ttHours = 0;

    if (this.applyingHours) {
      this.applyingHours.forEach(x => {
        if (x.noOfHours >= 0) {
          ttHours = ttHours + Number(x.noOfHours);
          this.user.leavesTransactionsDTOs.push(
            {

              "leaveDate": x.date,
              "noOfHours": Number(x.noOfHours)
            }
          )
        };
      });
    } else {
      if (this.applyingEditHours) {
        this.applyingEditHours.forEach(x => {
          if (x.noOfHours != 0) {
            ttHours = ttHours + Number(x.noOfHours);
            this.user.leavesTransactionsDTOs.push(
              {

                "leaveDate": x.leaveDate,
                "noOfHours": Number(x.noOfHours)
              }
            )
          };
        });
      }
    }
    this.user.noOfHours = ttHours;

    let emailIds: string = '';
    let tmpMails = [];
    this.recievedMail.forEach(x => {
      tmpMails.push(x.officeEmail);
      emailIds = emailIds + x.officeEmail + ','
    })
    emailIds = emailIds.replace(/,\s*$/, "");
    this.user.email = emailIds;

    this.selectedLeave = this.user.leaveTypeName;
    $('#loadingEditSubmitModal').modal('show');
    this._leaveRequestService.saveLeaveRequest(this.user).subscribe(requestService => {
      $('#loadingEditSubmitModal').modal('hide');
      this.user = requestService;
      this.exactLeavebalance = this.user.lowLeaveBalanceError;

      if (
        this.user.lowLeaveBalanceError <= 0
        && this._leaveRequestService.PTO_LEAVE_TYPE_REGEX.test(this.selectedLeave)
        && !this._leaveRequestService.isInsufficientPTOHoursAllowed()
      ){
        this.toastrService
          .error(' Low Leave Balance for applying PTO. Please apply for LOP');
      }
      else{
        this.viewLeavesComponent.createRowData();
        this.toastrService.success('Leave Request Created Successfully');
        this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route });
      }
    }, error => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toastrService.error('Error Creating Leave Request');
    });
  }

  editLeaveRequest() {
    this.user.fromDate = this.leaveSelectedFromDate.year + '-' + this.leaveSelectedFromDate.month + '-' + this.leaveSelectedFromDate.day;
    this.user.toDate = this.leaveSelectedToDate.year + '-' + this.leaveSelectedToDate.month + '-' + this.leaveSelectedToDate.day;
    this.user.noOfHours = this.totalHours;

    this.user.leavesTransactionsDTOs = [];

    this.user.leaveAttachments = []

    this.leaveAttachments.forEach(x => {
      // if (x.attachmentId) {
        this.user.leaveAttachments.push({
          "attachmentId": x.attachmentId,
          "fileContent": x.fileContent,
          "fileType": x.fileType,
          "originalFileName": x.originalFileName
        });


    })
    let ttHours = 0;

    if (this.applyingHours) {
      this.applyingHours.forEach(x => {
        if (x.noOfHours >= 0) {
          ttHours = ttHours + Number(x.noOfHours);
          this.user.leavesTransactionsDTOs.push(
            {
              "leaveDate": x.date,
              "noOfHours": Number(x.noOfHours)
            }
          )
        };
      });
    } else {
      if (this.applyingEditHours) {
        this.applyingEditHours.forEach(x => {
          if (x.noOfHours != 0) {
            ttHours = ttHours + Number(x.noOfHours);
            this.user.leavesTransactionsDTOs.push(
              {
                "leaveDate": x.leaveDate,
                "noOfHours": Number(x.noOfHours)
              }
            )
          };
        });
      }
    }

    this.leaveType.forEach(x => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName
      }
    });

    this.user.noOfHours = ttHours;

    let emailIds: string = '';
    let tmpMails = [];
    this.recievedMail.forEach(x => {
      tmpMails.push(x.officeEmail);
      emailIds = emailIds + x.officeEmail + ','
    })

    emailIds = emailIds.replace(/,\s*$/, "");
    this.user.email = emailIds;
    this.selectedLeave = this.user.leaveTypeName;
    $('#loadingEditSubmitModal').modal('show');
    this._leaveRequestService.editLeaveRequest(this.user).subscribe(requestService => {
      $('#loadingEditSubmitModal').modal('hide');
      this.user = requestService;
      this.exactLeavebalance = this.user.lowLeaveBalanceError;

      if (
        this.user.lowLeaveBalanceError <= 0
        && this._leaveRequestService.PTO_LEAVE_TYPE_REGEX.test(this.selectedLeave)
        && !this._leaveRequestService.isInsufficientPTOHoursAllowed()
      ) {
        this.toastrService.error(" Low Leave Balance for applying PTO. Please apply for LOP");
      }
      else{
        this.viewLeavesComponent.createRowData();
        this.toastrService.success('Leave Request Submitted Successfully');
        this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route });
      }
    },
     errorMessage => {
       $('#loadingEditSubmitModal').modal('hide');
       this.toastrService.error(errorMessage || 'Error Submitting Leave Request');
      });
  }


  cancelApprovedLeaveRequest() {
    this.user.fromDate = this.leaveSelectedFromDate.year + '-' + this.leaveSelectedFromDate.month + '-' + this.leaveSelectedFromDate.day;
    this.user.toDate = this.leaveSelectedToDate.year + '-' + this.leaveSelectedToDate.month + '-' + this.leaveSelectedToDate.day;
    this.user.rejectReason

    this.leaveType.forEach(x => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName
      }
    });

    if (this.user.rejectReason != null) {
      $('#loadingEditSubmitModal').modal('show');
      this._leaveRequestService.cancelApprovedLeaveRequest(this.user).subscribe(requestService => {
        $('#loadingEditSubmitModal').modal('hide');
        this.user = requestService;
        $('#cancelApprovedLeave').modal('hide');
        this.toastrService.success('Leave Request Cancelled Successfully');

        this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route });
      },
        error => {
          $('#loadingEditSubmitModal').modal('hide');
          this.toastrService.error('Error Cancelling Leave Request');
        });
    }
    else {
      this.showMessage = true;
      this.statusMessage = "Please enter reason..."

      let ref = this;
      setTimeout(function () {
        ref.showMessage = false
      }, 2000);
    }
  }



  cancelLeaveRequest() {
    this.user.fromDate = this.leaveSelectedFromDate.year + '-' + this.leaveSelectedFromDate.month + '-' + this.leaveSelectedFromDate.day;
    this.user.toDate = this.leaveSelectedToDate.year + '-' + this.leaveSelectedToDate.month + '-' + this.leaveSelectedToDate.day;


    this.leaveType.forEach(x => {
      if (x.leaveTypeId == this.user.leaveTypeId) {
        this.user.leaveTypeName = x.leaveTypeName
      }
    });

    $('#loadingEditSubmitModal').modal('show');
    this._leaveRequestService.cancelLeaveRequest(this.user.leaveId).subscribe(requestService => {
      $('#loadingEditSubmitModal').modal('hide');
      this.user = requestService;
      this.toastrService.success('Leave Request Cancelled Successfully');
      this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route });
    },
      error => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastrService.error('Error Cancelling Leave Request');
      });
  }

  validateField(field, value) {
    if (!value || value === '-- Select --' || value === -1 || value === '') {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
  }

  validateDate(field, date: { "year": number, "month": number, "day": number }) {
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

  // attachment

  detectFiles(event: any) {
    let fileExists = false;
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > this.maxFileSize5MB) {
        this.errorMessage = "File Size Exceeds 5MB";
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, this.notificationTimeOut);
      }
      else if (!this.validateFile(event.target.files[i].name)) {
        this.errorMessage = "Invalid File Format";
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, this.notificationTimeOut);

      }
      else if (this.validateFile(event.target.files[i].name)) {
        for (let j = 0; j < this.leaveAttachments.length; j++) {
          if (this.leaveAttachments[j] && (this.leaveAttachments[j].originalFileName == event.target.files[i].name)) {
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
    // if (this.leaveAttachments[index].attachmentId) {
    //   //call service to remove file with attachmentId
    //   //After response comes call splice
    //   this._leaveRequestService.deleteExistingAttachment(this.leaveAttachments[index].attachmentId).subscribe(requestService => {
    //     this.leaveAttachments.splice(index, 1);
    //   },
    //     error => this.errorMessage = <any>error);
    // } else {
    //   this.leaveAttachments.splice(index, 1);
    // }

  }

  validateFile(name: string) {
    let ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    if ((ext === 'pdf') || (ext === 'jpg') || (ext === 'png') || (ext === 'doc') || (ext === 'txt') || (ext === 'jpeg') || (ext === 'docx') || (ext === 'xlsx') || (ext === 'xls') || (ext === 'ppt') || (ext === 'pptx') || (ext === 'vsd') || (ext === 'vsdx') || (ext === 'zip') || (ext === 'rtf') || (ext === 'mpp') || (ext === 'msg')) {
      return true;
    }
    else {
      return false;
    }

  }

  addFilesToLeaves(file) {

    try {
      if (file && !file.attachmentId) {
        // for (let file of this.files) {
        this.selectedFile = file;

        file.type.split("/")[0];
        let attachmentUrl;

        let reader = new FileReader();
        let uploadFile = new UploadFile();
        reader.onload = (e: any) => {
          attachmentUrl = reader.result;
          uploadFile.fileContent = attachmentUrl.substring(attachmentUrl.indexOf(',') + 1);
        };

        reader.onloadend = (e: any) => {
          uploadFile.fileType = file.type;
          uploadFile.originalFileName = file.name;

          // Add the uploadFile to expense Files
          this.leaveAttachments.push(uploadFile);
        };

        reader.readAsDataURL(file);
        // }
      }
    } catch {
    }
  }

  // attachment
  closeFix(event, datePicker) {
    if (event.target.offsetParent == null)
      datePicker.close();
    else if (event.target.offsetParent.nodeName != "NGB-DATEPICKER")
      datePicker.close();
  }

  cancelstatus(fromdate, todate) {
    this.enableCancelLeaveButton=false
    this._leaveRequestService.cancelstatus(fromdate, todate)
      .subscribe(response => {
        this.enableCancelLeaveButton=response;
      });

  }

}
