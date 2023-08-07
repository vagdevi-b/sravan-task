import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { AcceptresignationpopupComponent } from '../../resignation-child-components/acceptresignationpopup/acceptresignationpopup.component';
import { AttachmentpopupComponent } from '../../resignation-child-components/attachmentpopup/attachmentpopup.component';
import { NotepopupComponent } from '../../resignation-child-components/notepopup/notepopup.component';
import { AppConstants } from '../../../shared/app-constants';
import { FileConstants } from '../../file-constants';
import { FileTypeNames } from '../../file-constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RetainEmployeePopupComponent } from '../../resignation-child-components/retain-employee-popup/retain-employee-popup.component';


@Component({
  selector: 'app-resignation-pd',
  templateUrl: './resignation-pd.component.html',
  styleUrls: ['./resignation-pd.component.css']
})
export class ResignationPdComponent implements OnInit {

  textdata: any;
  filesdata: any;
  filesresponse: any;
  rowdata: any;
  requestData: any;
  flag: boolean = false;
  notesdata: any = [];
  emprequestinfo: any;
  empresignationdetails: any;
  empresignationnotes: any = [];
  employeeDto: any;
  rmDetailsinfo: any = [];
  hrDetailsInfo: any = [];
  pdDetailsInfo: any = [];
  rmDiscussion: any = [];
  hrDiscussion: any = [];
  emprequestinfo1: any;
  rmDiscussion1: any = [];
  hrDiscussion1: any = [];
  hrReasons: any;
  fileAttachments: any;
  userIdinfo: string;
  sla_values: any = [];
  rmDiscussionData: any = [];
  hrDiscussionData: any = [];
  pdDiscussion: any = [];
  pdDiscussionData: any = [];
  displaySelectedReasons: any = [];
  flag1: boolean = false;
  downloadFileUrl = AppConstants.resignationDownloadFile;
  spinner: boolean = true;
  userName: string;
  isAccepted = false;
  lastDateAsPerPolicy: Date;
  filterednotesdata: any = [];
  filteredAttachments: any = [];
  fileName: any;
  userInfo: string;
  currentDate = new Date();
  displaySelectedReasonsinfo: any = [];
  filterForm: FormGroup;
  private filesInfo = FileConstants;
  pdNotesFilter: any = [];
  filesArray: any = [];
  resLwd: any;
  notesdatasortrm: any = [];
  selectedReasonsArray: any = [];

  constructor(private modalService: NgbModal, public router: Router, private fb: FormBuilder, private employeeResignationService: EmployeeResignationService) {
    this.isAccepted = this.router.getCurrentNavigation().extras.state.Edit;
    this.rowdata = this.router.getCurrentNavigation().extras.state.data;
    if (this.rowdata.status === "Cancelled") {
      this.isAccepted = false;
    } else {
      this.isAccepted = true;

    }
  }

  ngOnInit() {
    if (this.rowdata != "") {
      this.getrequestdatainfo();
    }
    this.getallresignationreason();
    this.notesdata = this.rowdata.osiResignationRequestNotes;
    this.userIdinfo = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
    this.userInfo = localStorage.getItem('userInfo');
    this.createForm();
  }

  createForm() {
    this.filterForm = this.fb.group({
      viewall: [{ value: true, disabled: true }],
      hr: [true],
      rm: [true],

    });
  }

  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.sla_values = response.osiLookupValueses;
    });
  }


  getrequestdatainfo(): void {
    this.employeeResignationService.getrequestdata(this.rowdata.id).subscribe((res: any) => {


      this.emprequestinfo1 = res.employeeDto;
      this.emprequestinfo = res;
      this.empresignationdetails = res.resignationResponseDto.osiResignationRequestDetails;
      this.empresignationnotes = res.resignationResponseDto.osiResignationRequestNotes;
      this.fileAttachments = res.resignationResponseDto.osiResignationRequestAttachments;
      this.fileAttachments.forEach(element => {
        this.fileAttachments.push(element.fileType.toLowerCase());
      });
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
          } else if (element.role == "HR") {
            this.hrDiscussion = element.reasonCodes.split(",");
          } else {
            this.pdDiscussion = element.reasonCodes.split(",");
            this.displaySelectedReasons.push(element);
            if (this.pdDiscussion.length) {
              this.pdDiscussion.forEach(ele => {
                this.sla_values.forEach(data => {
                  if (data.lookupValue == ele) {
                    this.flag1 = true;
                    this.displaySelectedReasonsinfo.push(ele);
                  }
                });
              });
            }

          }
        });
        this.flag = true;
      }
      this.sla_values.forEach(res => {
        this.rmDiscussion.forEach(res1 => {
          if (res1 == res.lookupValue) {
            this.rmDiscussionData.push(res.lookupDesc);
          }
        });

      });
      this.sla_values.forEach(res => {
        this.hrDiscussion.forEach(res1 => {
          if (res1 == res.lookupValue) {
            this.hrDiscussionData.push(res.lookupDesc);
          }
        });

      });
      this.getroledetails();
      this.empresignationnotes.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            this.notesdatasortrm.push(element);
            this.filterednotesdata = this.notesdatasortrm.sort((a, b) => a.id - b.id);
            // this.filterednotesdata.push(element);
          }
        }
        else {
          this.filterednotesdata = this.empresignationnotes.sort((a, b) => a.id - b.id);
          this.pdNotesFilter = JSON.parse(JSON.stringify(this.filterednotesdata));

        }
      });
      this.fileAttachments.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            this.filteredAttachments.push(element);
          }
        }
        else {
          this.filteredAttachments = this.fileAttachments;
        }
      });

    });


  }
  filterNotesall(e: any) {
    if (e.currentTarget.checked === true) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "PD");
    }
  }
  filterNotesHr(e: any) {
    if (e.currentTarget.checked === true && this.filterForm.value['rm'] === false) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "HR" || item.role == "PD");
    }
    else if (e.currentTarget.checked === true && this.filterForm.value['rm'] === true) {
      this.filterednotesdata = this.pdNotesFilter;
    }
    else if (e.currentTarget.checked === false && this.filterForm.value['rm'] === false) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "PD");
    }
    else if (e.currentTarget.checked === false && this.filterForm.value['rm'] === true) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "RM" || item.role == "PD");
    }
  }
  filterNotesRm(e: any) {
    if (e.currentTarget.checked === true && this.filterForm.value['hr'] === false) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "RM" || item.role == "PD");
    }
    else if (e.currentTarget.checked === true && this.filterForm.value['hr'] === true) {
      this.filterednotesdata = this.pdNotesFilter;
    }
    else if (e.currentTarget.checked === false && this.filterForm.value['hr'] === false) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "PD");
    }
    else if (e.currentTarget.checked === false && this.filterForm.value['hr'] === true) {
      this.filterednotesdata = this.pdNotesFilter.filter((item: any) =>
        item.role == "HR" || item.role == "PD");
    }
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


    this.spinner = false;

  }

  discussionData(e: any) {
    this.selectedReasonsArray = e;
    if (this.selectedReasonsArray.filter(item => item === "OTHER REASONS").length > 0) {
      const modalReference = this.modalService.open(NotepopupComponent, { backdrop: 'static' });
      modalReference.componentInstance.data = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.id;
      modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
      modalReference.componentInstance.role = "PD";
      modalReference.componentInstance.mandatory = "Mandatory";

    }
  }

  openNotesPopupModal(): void {
    const modalReference = this.modalService.open(NotepopupComponent, { backdrop: 'static' });
    modalReference.componentInstance.data = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.id;
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
    modalReference.componentInstance.role = "PD";
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
        this.filterednotesdata.push(this.textdata);
        this.notesdata.push(res);
      }
    });
  }

  openAttachPopupModal(): void {
    const modalReference = this.modalService.open(AttachmentpopupComponent, { backdrop: 'static' });
    modalReference.componentInstance.data = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto.id;
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;
    modalReference.componentInstance.role = "PD";
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



  navigateToRetain() {
    const modalReference = this.modalService.open(RetainEmployeePopupComponent);
    modalReference.componentInstance.completeEmpInfo = this.emprequestinfo;

    modalReference.result.then((res: any) => {
      if (res.status === "success") {
        
        const payload = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto;
        payload["requestPD"] = Number(this.userIdinfo);
        payload["loggedInEmployeeRole"] = "PD";
        this.router.navigate(["resignation/retain"], {
          state: {
            data: payload,
            Edit: true
          }
        });
      }
    });
  }

  openAcceptResignation() {
    const payload = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto;
    payload["requestPD"] = Number(this.userIdinfo);
    const modalReference = this.modalService.open(AcceptresignationpopupComponent);
    modalReference.componentInstance.data = payload;
    // modalReference.result.then((res: any) => { });

    modalReference.result.then((res: any) => {
      if (res.status === "success") {
        this.resLwd = res.data;

        if (res.data != undefined) {
          const obj = {
            "notes": "Last working Day is updated to " + this.resLwd.expectedRelievingDate,
            "notesType": true,
            "roleId": localStorage.getItem('userId'),
            "role": "PD",
            "updatedBy": localStorage.getItem('userName'),
            "osiResignationRequestDto": this.emprequestinfo.resignationResponseDto.osiResignationRequestDto

          }
          this.employeeResignationService.saveNotes(obj).subscribe(response => {
            this.notesdata.push(response);
          });
        }
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
