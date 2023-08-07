import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { AttachmentrmComponent } from '../../resignation-child-components/attachmentrm/attachmentrm.component';
import { ConfirmationPopupComponent } from '../../resignation-child-components/confirmation-popup/confirmation-popup.component';
import { NotepopupComponent } from '../../resignation-child-components/notepopup/notepopup.component';
import { AppConstants } from '../../../shared/app-constants';
import { FileConstants } from '../../file-constants';
import { FileTypeNames } from '../../file-constants';
import { CancelRequestComponent } from '../../resignation-child-components/cancel-request/cancel-request.component';



declare var $: any;
@Component({
  selector: 'app-resignation-rm',
  templateUrl: './resignation-rm.component.html',
  styleUrls: ['./resignation-rm.component.css']
})
export class ResignationRmComponent implements OnInit {
  textdata: any;
  notesdata: any = [];
  filesdata: any = [];
  filesresponse: any;
  userId: any;
  empdata: any;
  rmName: any;
  rmNameinfo: any;
  resignationRmForm: FormGroup;
  selectedReasonsArray: any = [];
  userName: string;
  rmNameAbbr: any;
  currentDate: string;
  userIdinfo: string;
  rmEmpId: any;
  rowData: any = [];
  resginfo: any;
  isRequestId = true;
  years: string;
  modalHeader: string;
  selectedfiles: any;
  notesObj: {};
  canSee: boolean = false;

  osiResignationRequestDto: any;
  notesinfo: any;
  rowdata: any;
  confirmEdit = false;
  employeeeditdata: any;
  payload: { osiResignationRequestDto: { employeeId: any; employeeName: any; employeeNumber: any; requestType: any; isReplacementRequired: any; levelOfDependency: any; requestPD: number; requestRM: any; requestHR: number; hrDiscussionStatus: boolean; pdDiscussionStatus: boolean; resignationDate: any; creationDate: any; requestedLWD: any; status: string; }; osiResignationRequestAttachmentDto: {}; osiResignationRequestDetailDto: {}; osiResignationRequestNotes: any[]; };
  flag: boolean = false;
  emprequestinfo: any;
  empresignationdetails: any;
  empresignationnotes: any;
  fileAttachments: any;
  employeeDto: any;
  rmDiscussion: any = [];
  hrDiscussion: any = [];
  sla_values: any = [];
  rmDiscussionData: any = [];
  currentDate1: string;
  showData: boolean = false;
  displaySelectedReasons: any = [];
  showreasons: boolean = false;
  downloadFileUrl = AppConstants.resignationDownloadFile;
  disabled: boolean = false;
  fileName: any;
  formArr: any = [];
  lastDateAsPerPolicy: any;
  filteredAttachments: any = [];
  notesdata1: any = [];
  hierarchyData: any = [];
  attachmentArray: any = [];
  selectedRm: any = [];
  filesName: any;
  newdate = new Date();
  filesArray: any = [];

  private filesInfo = FileConstants;
  userInfo: string;
  newArr: any;
  isCancelled: boolean = false;
  required: boolean = false;
  notesdatasort: any = [];

  constructor(public router: Router, private modalService: NgbModal, private toastrService: ToastrService, public fb: FormBuilder, private employeeResignationService: EmployeeResignationService) {
    this.confirmEdit = this.router.getCurrentNavigation().extras.state.Edit;
    if (this.confirmEdit === true) {
      this.rowdata = this.router.getCurrentNavigation().extras.state.data;
      this.showData = true;
      if (this.rowdata.status === "Cancelled") {
        this.isCancelled = true;
      } else {
        this.isCancelled = false;

      }

    }


  }

  ngOnInit() {

    this.createForm();
    this.getallresignationreason();
    this.getallresignationlist();
    this.userName = localStorage.getItem('userName');
    this.userIdinfo = localStorage.getItem('userId');
    this.userInfo = localStorage.getItem('userInfo');
    if (this.rowdata != undefined) {
      if (this.rowdata.id != "") {
        this.disabled = true;
      }
    }
    if (this.confirmEdit === true) {
      this.employeeResignationService.getresignationrequest(Number(this.userIdinfo)).subscribe(res => {
        if (res) {
          setTimeout(() => 1000);
          this.selectedRm = res.employeeDtoList
        }

        // this.selectedRm.forEach(element => {
        //   if (element.employeeId = this.rowdata.employeeId) {
        //     this.employeeeditdata = element;
        //   }
        // });
        this.getrequestdatainfo();
      });
      const obj = {};
      const pageNumber = 0;
      const pageSize = 100;
      this.employeeResignationService.getallresignationdata(obj, pageNumber, pageSize).subscribe(response => {
        this.hierarchyData = response.data.content;
      });
      // if (this.confirmEdit === true) {
      // }
    }


  }

  getrequestdatainfo(): void {
    this.employeeResignationService.getrequestdata(this.rowdata.id).subscribe((res: any) => {
      const tempArr = [];
      this.flag = true;
      this.emprequestinfo = res;
      this.empresignationdetails = res.resignationResponseDto.osiResignationRequestDetails;
      this.empresignationnotes = res.resignationResponseDto.osiResignationRequestNotes;
      this.fileAttachments = res.resignationResponseDto.osiResignationRequestAttachments;
      this.fileAttachments.forEach(element => {
        this.fileAttachments.push(element.fileType.toLowerCase());
      });
      this.empdata = res.employeeDto;
      const empDesignation = this.empdata.designation.toLowerCase().split(" ");
      empDesignation.forEach(element => {

        const tempelement = element.charAt(0).toUpperCase() + element.slice(1);
        tempArr.push(tempelement);
      });
      this.newArr = tempArr.join(' ');
      if (this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.policyLWD == null) {
        if (this.empdata.onProbation === "No") {
          const currentDate = new Date(this.rowdata.resignationDate);
          this.lastDateAsPerPolicy = new Date(new Date().setDate(currentDate.getDate() + 90));
        } else {
          const currentDate = new Date(this.rowdata.resignationDate);
          this.lastDateAsPerPolicy = new Date(new Date().setDate(currentDate.getDate() + 30));
        }
      } else {
        this.lastDateAsPerPolicy = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.policyLWD;
      }
      if (res) {
        this.empresignationdetails.forEach(element => {
          if (Number(this.userIdinfo) == this.rowdata.requestHR || Number(this.userIdinfo) == this.rowdata.requestPD) {
            this.rmDiscussion = []
            this.rmDiscussion = element.reasonCodes.split(",");
            if (this.rmDiscussion.length) {
              this.sla_values.forEach(res => {
                this.rmDiscussion.forEach(res1 => {
                  if (res1 == res.lookupValue) {
                    this.rmDiscussionData.push(res.lookupDesc);
                  }
                });

              });
            }

          } else {
            this.selectedRm.forEach(res => {
              if (element.createdBy == res.employeeId) {
                this.rmDiscussion = []
                this.rmDiscussionData = [];
                this.rmDiscussion = element.reasonCodes.split(",");
                if (this.rmDiscussion.length) {
                  this.sla_values.forEach(info => {
                    this.rmDiscussion.forEach(data => {
                      if (data == info.lookupValue) {
                        this.rmDiscussionData.push(info.lookupDesc);
                      }
                    });

                  });
                }
              }

            });
          }


        });
      }


      if (Number(this.userIdinfo) == this.rowdata.requestHR || Number(this.userIdinfo) == this.rowdata.requestPD) {
        this.notesdata = this.empresignationnotes;
      } else {
        this.selectedRm.forEach(res => {
          this.empresignationnotes.forEach(element => {
            if (element.roleId == res.employeeId) {
              this.notesdatasort.push(element);
              this.notesdata = this.notesdatasort.sort((a, b) => a.id - b.id);
            }
          });
        });
      }


      if (Number(this.userIdinfo) == this.rowdata.requestHR || Number(this.userIdinfo) == this.rowdata.requestPD) {
        this.filteredAttachments = this.fileAttachments;
      } else {
        this.selectedRm.forEach(res => {
          this.fileAttachments.forEach(element => {
            if (element.createdBy == res.employeeId) {
              this.filteredAttachments.push(element);
            }
          });
        });
      }

    });
  }


  createForm() {
    this.resignationRmForm = this.fb.group({
      notesinfo: ['']
    });
  }

  getallresignationlist() {
    const obj = {
      "loggedInUserId": localStorage.getItem('userId'),
    }
    const pageNumber = 0;
    const pageSize = 100;
    this.employeeResignationService.getallresignationdata(obj, pageNumber, pageSize).subscribe(response => {
      this.rowData = response.data.content;
    });
  }

  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.sla_values = response.osiLookupValueses;
    });
  }

  navigateToInitiate() {
    this.router.navigate(['resignation/list']);
  }

  employeedata(event) {
    this.getallresignationlist();
    if (event != null) {
      const tempArr = [];
      this.empdata = event;
      const empDesignation = event.designation.toLowerCase().split(" ");
      empDesignation.forEach(element => {

        const tempelement = element.charAt(0).toUpperCase() + element.slice(1);
        tempArr.push(tempelement);
      });
      this.newArr = tempArr.join(' ');
      this.rmName = this.empdata.rmEmailId.split("@");
      this.rmEmpId = this.empdata.rmEmpId;
      this.rmNameinfo = this.rmName[0].toLowerCase();
      this.rmNameAbbr = this.rmName[0].substring(0, 2).toUpperCase();
      this.newdate = new Date();
      this.currentDate = moment(this.newdate).format("YYYY MM DD");
      if (this.empdata.totalExperience != "") {
        this.years = "Years";
      } else {
        this.years = "-"
      }
    } else {

    }
  }


  show(e: any) {
    this.canSee = true;
  }

  hide(e: any) {
    if (e.target.value != "") {
      this.notesinfo = e.target.value;
      this.notesdata1.push(this.resignationRmForm.controls['notesinfo'].value);
      this.canSee = false;
    }
  }


  empinfo(e: any) {
    this.resginfo = e;
  }

  openNotesPopupModal(): void {
    const modalReference = this.modalService.open(NotepopupComponent, { backdrop: 'static' });
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
    modalReference.componentInstance.role = "RM";
    modalReference.result.then((res: any) => {
      if (res.status === "success") {
        this.textdata = res.notes;
        this.textdata.osiEmployeesCurrentDto = {
          userName: this.userName,
        }
        this.notesdata.push(this.textdata);
        // this.notesdata.push(res);
      }
    });
  }



  save(): any {
    if (this.resignationRmForm.controls['notesinfo'].value != "") {
      const textdata = this.resignationRmForm.controls['notesinfo'].value;
      this.notesdata.push(textdata);
    } else {
      this.toastrService.error("Please Enter Notes");
    }
  }



  openAttachPopupModal(): void {
    const role = ""
    const modalReference = this.modalService.open(AttachmentrmComponent);
    modalReference.componentInstance.role = "RM";
    modalReference.componentInstance.passEntry.subscribe((res) => {
      this.filesdata = [];
      this.filesArray = [];
      if (res.status === "success") {
        this.filesresponse = res.status;
        const files = [];
        this.filesdata = res.files;
        this.filesName = res.fileName;
        const fileObj = {};
        fileObj["type"] = res.files[0].type;
        fileObj["fileName"] = res.fileName;
        this.filesArray.push(fileObj);
      }
      if (this.confirmEdit == true) {
        if (this.filesdata && this.filesdata.length) {
          let formdata = new FormData;
          const attachmentRequestMap = {}
          for (let i = 0; i < this.filesdata.length; i++) {
            formdata.append("multipartFileList", this.filesdata[i]);
            attachmentRequestMap[this.filesdata[i].name] = res.fileName;
          }
          formdata.append("osiResignationRequestAttachmentDto", new Blob([JSON.stringify({
            roleId: localStorage.getItem('userId'),
            role: "RM",
            attachmentRequestMap,
            osiResignationRequestDto: this.emprequestinfo.resignationResponseDto.osiResignationRequestDto
          })], {
            type: "application/json"
          }));
          this.employeeResignationService.saveAttachment(formdata).subscribe((res: any) => {
            if (res) {
              this.toastrService.success("Attachment Uploaded Successfully");
            }
          });
        } 
      }
      this.modalService.dismissAll();
    })
  }

  discussionData(reasons: any) {
    this.selectedReasonsArray = reasons;
    if (this.selectedReasonsArray.filter(item => item === "OTHER REASONS").length > 0) {
      this.required = true;
      this.resignationRmForm.get('notesinfo').setValidators(Validators.required);
      this.resignationRmForm.get('notesinfo').updateValueAndValidity();
    } else {
      this.required = false;
      this.resignationRmForm.get('notesinfo').clearValidators();
      this.resignationRmForm.get('notesinfo').updateValueAndValidity();
    }
  }

  createPayload() {
    const newdate = new Date();
    this.currentDate1 = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.payload = {
      osiResignationRequestDto: {
        employeeId: this.empdata.employeeId ? this.empdata.employeeId : '',
        employeeName: this.empdata.employeeNumber ? this.empdata.employeeName : '',
        employeeNumber: this.empdata.employeeNumber ? this.empdata.employeeNumber : '',
        requestType: this.resginfo.resignationType ? this.resginfo.resignationType : '',
        isReplacementRequired: this.resginfo.replacementRequired,
        levelOfDependency: this.resginfo.dependencyType ? this.resginfo.dependencyType : '',
        requestPD: 0,
        requestRM: this.userIdinfo,
        requestHR: 0,
        hrDiscussionStatus: false,
        pdDiscussionStatus: false,
        resignationDate: this.resginfo.dateOfResignation ? this.resginfo.dateOfResignation : '',
        creationDate: this.currentDate1,
        requestedLWD: this.resginfo.requestedDateOfReleasing ? this.resginfo.requestedDateOfReleasing : '',
        status: "Initiated"
      },
      osiResignationRequestAttachmentDto: null,
      osiResignationRequestDetailDto: null,
      osiResignationRequestNotes: []
    }

    this.notesObj = {}

    if (this.notesdata1.length > 0) {
      this.notesdata1.forEach(element => {
        this.notesObj["notes"] = element;
        this.notesObj["notesType"] = true;
        this.notesObj["roleId"] = Number(this.userIdinfo);
        this.notesObj["role"] = "RM";
        this.notesObj["updatedBy"] = localStorage.getItem('userName');
      });
      this.payload.osiResignationRequestNotes.push(this.notesObj);
    }

    if (this.selectedReasonsArray.length > 0) {
      this.payload.osiResignationRequestDetailDto = {}
      this.payload.osiResignationRequestDetailDto["id"] = 0
      this.payload.osiResignationRequestDetailDto["reasonCodes"] = Array.prototype.map.call(this.selectedReasonsArray, function (item) {
        return item
      }).join(",");
      this.payload.osiResignationRequestDetailDto["roleId"] = Number(this.userIdinfo);
      this.payload.osiResignationRequestDetailDto["role"] = "RM";
    }
    if (this.filesdata.length > 0) {
      this.payload.osiResignationRequestAttachmentDto = {}
      this.payload.osiResignationRequestAttachmentDto["roleId"] = Number(this.userIdinfo);
      this.payload.osiResignationRequestAttachmentDto["role"] = "RM";
      this.payload.osiResignationRequestAttachmentDto["category"] = "RESIGNATION_REQUEST_PROCESS";
    }
  }

  checkValidation(e: any) {
    if (e) {
    }
  }

  cancelRequest() {
    const modalReference = this.modalService.open(CancelRequestComponent);
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
    modalReference.componentInstance.role = "RM";
    modalReference.result.then((res: any) => {

    });
  }

  onSave() {
    if (this.required && !this.notesinfo) {
      this.toastrService.error("Please Enter the Notes")
      return
    }

    if (this.resginfo == undefined || this.resginfo.dateOfResignation == undefined || this.resginfo.dependencyType == undefined || this.resginfo.replacementRequired == undefined || this.resginfo.resignationType == undefined || this.empdata == "" || this.selectedReasonsArray.length == 0 || this.filesdata.length == 0) {
      this.toastrService.error("Please Enter the Mandatory Fields")
    } else {

      this.createPayload();
      let forminfo = new FormData;

      if (this.filesdata.length > 0) {
        const attachmentRequestMap = {}
        for (let i = 0; i < this.filesdata.length; i++) {
          forminfo.append("multipartFileList", this.filesdata[i]);
          attachmentRequestMap[this.filesdata[i].name] = this.filesName;
        }
        this.payload.osiResignationRequestAttachmentDto["attachmentRequestMap"] = attachmentRequestMap;

      }


      forminfo.append("resignationRequestDto", new Blob([JSON.stringify(
        this.payload
      )], {
        type: "application/json"
      }));

      let modalReference = this.modalService.open(ConfirmationPopupComponent);
      modalReference.result.then((res: any) => {
        if (res.status === "success") {
          $('#loadingEditSubmitModal').modal('show');
          this.employeeResignationService.saveAllService(forminfo).subscribe((responsedata: any) => {
            this.isRequestId = false;
            if (responsedata) {

              const obj = {
                "notes": "Resignation Request has been Initiated",
                "notesType": true,
                "roleId": localStorage.getItem('userId'),
                "role": "RM",
                "updatedBy": localStorage.getItem('userName'),
                "osiResignationRequestDto": responsedata.osiResignationRequestDto

              }
              this.employeeResignationService.saveNotes(obj).subscribe(response => { 
                if(response){
                  $('#loadingEditSubmitModal').modal('hide');
                }
              });
              this.toastrService.success("Record Submitted Successfully");
              this.router.navigate(['resignation/list']);

            }
            $('#loadingEditSubmitModal').modal('hide');
          },
            (err: any) => {
              this.toastrService.error(err.error.error_message);
              $('#loadingEditSubmitModal').modal('hide');
            });
        }
      });
    }
  }

  getClassNameByFileType(fileType: string) {
    return FileConstants[fileType]
  }
  getFileType(fileType: string) {
    return FileTypeNames[fileType]
  }
}


