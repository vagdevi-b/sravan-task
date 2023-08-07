import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { AttachmentpopupComponent } from '../../resignation-child-components/attachmentpopup/attachmentpopup.component';
import { NotepopupComponent } from '../../resignation-child-components/notepopup/notepopup.component';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../shared/app-constants';
import { FileConstants } from '../../file-constants';
import { FileTypeNames } from '../../file-constants';


@Component({
  selector: 'app-resignation-hr',
  templateUrl: './resignation-hr.component.html',
  styleUrls: ['./resignation-hr.component.css']
})
export class ResignationHrComponent implements OnInit {

  textdata: any;
  filesdata: any;
  filesresponse: any;
  rowdata: any;
  flag: boolean;
  requestData: any;
  emprequestinfo: any;
  empresignationdetails: any;
  empresignationnotes: any;
  employeeDto: any;
  rmDetailsinfo: any = [];
  hrDetailsInfo: any = [];
  pdDetailsInfo: any = [];
  notesdata: any = [];
  fileAttachments: any = [];
  fileAttachmentsinfo: any = [];
  userIdinfo: string;
  rmDiscussion: any = [];
  hrDiscussion: any = [];
  pdDiscussion: any = [];
  sla_values: any = [];
  rmDiscussionData: any = [];
  pdDiscussionData: any = [];
  flag1: boolean = false;
  displaySelectedReasons: any = [];
  downloadFileUrl = AppConstants.resignationDownloadFile;
  userName: string;
  lastDateAsPerPolicy: Date;
  filteredAttachments: any = [];
  flag2: boolean = false;
  isAccepted: any = false;
  fileName: any;
  userInfo: string;
  displaySelectedReasonsinfo: any = [];
  private filesInfo = FileConstants;
  filesArray: any = [];
  currentDate = new Date();
  notesdatasortrm: any = [];
  notesdatasorthr: any = [];
  selectedReasonsArray: any;

  constructor(private toastrService: ToastrService, private modalService: NgbModal, public router: Router, private employeeResignationService: EmployeeResignationService) {
    this.rowdata = this.router.getCurrentNavigation().extras.state.data;
    this.isAccepted = this.router.getCurrentNavigation().extras.state.Edit;

    if (this.rowdata.status === "Cancelled" || this.rowdata.status === "Inprogress" || this.rowdata.status === "Accepted") {
      if (this.rowdata.hrDiscussionStatus === true) {
        this.isAccepted = true;
      } else {
        this.isAccepted = false;
      }
    } else {
      this.isAccepted = false;
    }
  }

  ngOnInit() {
    if (this.rowdata != "") {
      this.getrequestdatainfo();
    }
    this.getallresignationreason();
    this.userIdinfo = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
    this.userInfo = localStorage.getItem('userInfo');


  }

  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.sla_values = response.osiLookupValueses;
    });
  }


  getrequestdatainfo(): void {
    this.employeeResignationService.getrequestdata(this.rowdata.id).subscribe((res: any) => {

      this.emprequestinfo = res;
      this.empresignationdetails = res.resignationResponseDto.osiResignationRequestDetails;
      this.empresignationnotes = res.resignationResponseDto.osiResignationRequestNotes;
      this.fileAttachmentsinfo = res.resignationResponseDto.osiResignationRequestAttachments;
      const result = this.fileAttachmentsinfo.map(item => ({
        ...item,
        fileType: item.fileType.toLowerCase()
      }))
      this.fileAttachments = result;
      this.employeeDto = res.employeeDto;
      if (this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.policyLWD == null) {

        if (this.employeeDto.onProbation === "No") {
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
          if (element.role == "RM") {
            this.rmDiscussion = element.reasonCodes.split(",");
          } else if (element.role == "PD") {
            this.pdDiscussion = element.reasonCodes.split(",");
          } else {
            this.hrDiscussion = element.reasonCodes.split(",");
            this.displaySelectedReasons.push(element);
            if (this.hrDiscussion.length) {

              this.hrDiscussion.forEach(ele => {
                this.sla_values.forEach(data => {
                  if (data.lookupValue == ele) {
                    this.flag1 = true;
                    // this.displaySelectedReasons.push(data);
                    this.displaySelectedReasonsinfo.push(data.lookupDesc);


                  };
                });
              });
            }
          }
        });
        this.flag = true;
      }
      this.sla_values.forEach(res => {
        this.rmDiscussion.forEach(res1 => {
          this.flag2 = true;
          if (res1 == res.lookupValue) {
            this.rmDiscussionData.push(res.lookupDesc);

          }
        });

      });
      this.sla_values.forEach(res => {
        this.pdDiscussion.forEach(res1 => {
          this.flag2 = true;
          if (res1 == res.lookupValue) {
            this.pdDiscussionData.push(res.lookupDesc);

          }
        });

      });
      this.empresignationnotes.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            this.notesdatasortrm.push(element);
            this.notesdata = this.notesdatasortrm.sort((a, b) => a.id - b.id);
            // this.notesdata.push(element);
          }
        }
        else {
          this.notesdatasorthr.push(element);
          this.notesdata = this.notesdatasorthr.sort((a, b) => a.id - b.id);
          // this.notesdata.push(element);
        }
      });
      // this.empresignationnotes.forEach(element => {
      //   this.notesdata.push(element);
      // });
      this.getroledetails();

      this.fileAttachmentsinfo.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            this.filteredAttachments.push(element);
          }
        }
        else {
          this.filteredAttachments = this.fileAttachmentsinfo;
        }
      });
    });
  }

  navigateToInitiate() {
    this.router.navigate(['resignation/list']);
  }



  getroledetails() {
    this.rmDetailsinfo = [];
    this.empresignationdetails.forEach((element: any) => {
      const getroleIdInfo = element.roleId;
      if (getroleIdInfo == this.rowdata.requestRM) {
        this.rmDetailsinfo.push(element);
      } else if (getroleIdInfo == this.rowdata.requestHR) {
        this.hrDetailsInfo.push(element);
      } else {
        this.pdDetailsInfo.push(element);
      }

    });
  }



  openNotesPopupModal(): void {
    const modalReference = this.modalService.open(NotepopupComponent, { backdrop: 'static' });
    modalReference.componentInstance.data = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.id;
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
    modalReference.componentInstance.role = "HR";
    modalReference.result.then((res: any) => {
      if (res.status === "success") {
        this.textdata = res.notes;
        // const obj = {
        //   createdDate: new Date(),
        //   notes: res.notes,
        //   osiEmployeesCurrentDto: {}
        // }
        this.textdata.osiEmployeesCurrentDto = {
          userName: this.userInfo,
        }
        this.notesdata.push(this.textdata);
      }
    });
  }


  openAttachPopupModal(): void {
    const modalReference = this.modalService.open(AttachmentpopupComponent, { backdrop: 'static' });
    modalReference.componentInstance.data = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.id;
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
    modalReference.componentInstance.role = "HR";
    modalReference.componentInstance.passEntry.subscribe((res) => {
      this.filesdata = [];
      if (res.status === "success") {
        this.filesresponse = res.status;
        this.filesdata = res.files;
        this.fileName = res.fileName;
        const fileObj = {};
        fileObj["type"] = res.files[0].type;
        fileObj["fileName"] = res.fileName;
        this.filesArray.push(fileObj);
      }
      this.modalService.dismissAll();
    })
  }

  discussionData(e: any) {
    this.selectedReasonsArray = e;
    if (this.selectedReasonsArray.filter(item => item === "OTHER REASONS").length > 0) {
      const modalReference = this.modalService.open(NotepopupComponent, { backdrop: 'static' });
      modalReference.componentInstance.data = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.id;
      modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
      modalReference.componentInstance.mandatory = "Mandatory";
      modalReference.componentInstance.role = "HR";


    }
  }

  onSave() {
    const payload = {};
    payload["id"] = this.rowdata.id;
    payload["status"] = "Inprogress";
    payload["hrDecisionDate"] = moment().format('YYYY-MM-DD');
    payload["hrDiscussionStatus"] = true;
    payload["requestHR"] = Number(this.userIdinfo);
    if (this.rowdata.hrDiscussionStatus === false && this.rowdata.status == "Initiated") {
      payload["status"] = "Inprogress"
    } else if (this.rowdata.hrDiscussionStatus === false && this.rowdata.status == "Accepted") {
      payload["status"] = "Accepted"
    } else {
      payload["status"] = "Retained"
    }
    this.employeeResignationService.updateHr(payload).subscribe(res => {
      if (res) {
        this.toastrService.success("Request Submitted Successfully");
        this.router.navigate(['resignation/list']);
      }
    });

  }
  getClassNameByFileType(fileType: string) {
    return FileConstants[fileType]
  }
  getFileType(fileType: string) {
    return FileTypeNames[fileType]
  }
}
