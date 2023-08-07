import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../shared/app-constants';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { FileConstants } from '../../file-constants';
import { FileTypeNames } from '../../file-constants';
import { RetainEmployeePopupComponent } from '../../resignation-child-components/retain-employee-popup/retain-employee-popup.component';


@Component({
  selector: 'app-resignation-accept',
  templateUrl: './resignation-accept.component.html',
  styleUrls: ['./resignation-accept.component.css']
})
export class ResignationAcceptComponent implements OnInit {
  @ViewChild('DatePickContainer2') datePickContainer2;
  rowdata: any;
  flag: boolean;
  requestData: any;
  emprequestinfo: any;
  empresignationdetails: any;
  empresignationnotes: any = [];
  employeeDto: any;
  rmDetailsinfo: any = [];
  hrDetailsInfo: any = [];
  pdDetailsInfo: any = [];
  acceptForm: FormGroup;
  relievingDateFormatted: string;
  ExpectedRelievingDateFormatted: string;
  data: any;
  relievingDate: any;
  expectedRelievingDate: any;
  emprequestinfo1: any;
  fileAttachments: any;
  rmDiscussion: any = [];
  hrDiscussion: any = [];
  sla_values: any;
  rmDiscussionData: any = [];
  hrDiscussionData: any = [];
  notesdata: any;
  userIdinfo: string;
  pdDiscussion: any = [];
  pdDiscussionData: any = [];
  downloadFileUrl = AppConstants.resignationDownloadFile;
  mon: string;
  day: string;
  mon1: string;
  day1: string;
  spinner: boolean = true;
  lastDateAsPerPolicy: Date;
  filteredAttachments: any = [];
  private filesInfo = FileConstants;
  disableSubmit: boolean = false;
  newArr: string;
  notesdatasortrm: any;

  constructor(private modalService: NgbModal, private toastrService: ToastrService, public router: Router, private employeeResignationService: EmployeeResignationService, private fb: FormBuilder) {
    this.rowdata = this.router.getCurrentNavigation().extras.state.data;
    if (this.rowdata.relievingDate != null) {
      this.disableSubmit = true;
    }
  }

  ngOnInit() {
    // if (this.rowdata != "") {
    //   this.getrequestdatainfo();
    // }
    this.getallresignationreason();
    this.createForm();
    this.getrequestdatainfo();
    this.userIdinfo = localStorage.getItem('userId');

  }

  createForm() {
    this.acceptForm = this.fb.group({
      empRelievingDate: [''],
      empExpectedRelievingDate: [''],
      selectall: [false],
      knowledgeTransfer: [''],
      removalOfAccess: [''],
      exitInterview: ['']
    });
  }
  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.sla_values = response.osiLookupValueses;
    });
  }



  getrequestdatainfo(): void {
    this.employeeResignationService.getrequestdata(this.rowdata.id).subscribe((res: any) => {
      this.flag = true;
      this.emprequestinfo1 = res.employeeDto;
      this.emprequestinfo = res;
      this.empresignationdetails = res.resignationResponseDto.osiResignationRequestDetails;
      this.empresignationnotes = res.resignationResponseDto.osiResignationRequestNotes;
      this.fileAttachments = res.resignationResponseDto.osiResignationRequestAttachments;
      this.fileAttachments.forEach(element => {
        this.fileAttachments.push(element.fileType.toLowerCase());
      });
      this.employeeDto = res.employeeDto;
      const tempArr = [];
      const empDesignation = this.employeeDto.designation.toLowerCase().split(" ");
      empDesignation.forEach(element => {

        const tempelement = element.charAt(0).toUpperCase() + element.slice(1);
        tempArr.push(tempelement);
      });
      this.newArr = tempArr.join(' ');
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
          if (element.role == "HR") {
            this.hrDiscussion = element.reasonCodes.split(",");
          } else if (element.role == "RM") {
            this.rmDiscussion = element.reasonCodes.split(",");
          } else {
            this.pdDiscussion = element.reasonCodes.split(",");
          }
        });

        this.sla_values.forEach(res => {
          this.rmDiscussion.forEach(res1 => {
            if (res1 == res.lookupValue) {
              this.rmDiscussionData.push(res.lookupDesc);
            }
          });
          this.hrDiscussion.forEach(res1 => {
            if (res1 == res.lookupValue) {
              this.hrDiscussionData.push(res.lookupDesc);
            }
          });
          this.pdDiscussion.forEach(res1 => {
            if (res1 == res.lookupValue) {
              this.pdDiscussionData.push(res.lookupDesc);
            }
          });
          this.spinner = false;
        });
      }


      this.empresignationnotes.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            // this.notesdata.push(element);
            this.notesdatasortrm.push(element);
            this.notesdata = this.notesdatasortrm.sort((a, b) => a.id - b.id).reverse();
          }
        }
        else {
          this.notesdata = this.empresignationnotes.sort((a, b) => a.id - b.id).reverse();
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
      this.getroledetails();
    });


    if (this.rowdata.requestedLWD != null) {
      const exprelievingdate = {
        day: Number(this.rowdata.requestedLWD.split("-")[2]),
        month: Number(this.rowdata.requestedLWD.split("-")[1]),
        year: Number(this.rowdata.requestedLWD.split("-")[0]),
      }
      this.expectedRelievingDate = exprelievingdate;
      this.acceptForm.patchValue({
        empExpectedRelievingDate: exprelievingdate,

      });
    }

    if (this.rowdata.relievingDate == null) {
      const relievingDate = {
        day: Number(this.rowdata.expectedRelievingDate.split("-")[2]),
        month: Number(this.rowdata.expectedRelievingDate.split("-")[1]),
        year: Number(this.rowdata.expectedRelievingDate.split("-")[0]),
      }
      this.relievingDate = relievingDate;
      this.acceptForm.patchValue({
        empRelievingDate: relievingDate,
      });
    } else {
      const exprelievingdate1 = {
        day: Number(this.rowdata.relievingDate.split("-")[2]),
        month: Number(this.rowdata.relievingDate.split("-")[1]),
        year: Number(this.rowdata.relievingDate.split("-")[0]),
      }
      this.relievingDate = exprelievingdate1,
        this.acceptForm.patchValue({
          empRelievingDate: exprelievingdate1,
        });
    }

    // if (this.rowdata.requestedLWD != null && this.rowdata.expectedRelievingDate != null) {

    //   const exprelievingdate = {
    //     day: Number(this.rowdata.requestedLWD.split("-")[2]),
    //     month: Number(this.rowdata.requestedLWD.split("-")[1]),
    //     year: Number(this.rowdata.requestedLWD.split("-")[0]),
    //   }
    //   const relievingDate = {
    //     day: Number(this.rowdata.expectedRelievingDate.split("-")[2]),
    //     month: Number(this.rowdata.expectedRelievingDate.split("-")[1]),
    //     year: Number(this.rowdata.expectedRelievingDate.split("-")[0]),
    //   }
    //   this.expectedRelievingDate = exprelievingdate;
    //   this.relievingDate = relievingDate;
    //   this.acceptForm.patchValue({
    //     empRelievingDate: relievingDate,
    //     empExpectedRelievingDate: exprelievingdate,

    //   });
    // } else {
    //   if (this.rowdata.relievingDate != null) {
    //     const exprelievingdate1 = {
    //       day: Number(this.rowdata.relievingDate.split("-")[2]),
    //       month: Number(this.rowdata.relievingDate.split("-")[1]),
    //       year: Number(this.rowdata.relievingDate.split("-")[0]),
    //     }
    //     this.relievingDate = exprelievingdate1,
    //       this.acceptForm.patchValue({
    //         empRelievingDate: exprelievingdate1,
    //       });
    //   }
    //   if (this.rowdata.requestedLWD != null) {
    //     const relievingDate1 = {
    //       day: Number(this.rowdata.requestedLWD.split("-")[2]),
    //       month: Number(this.rowdata.requestedLWD.split("-")[1]),
    //       year: Number(this.rowdata.requestedLWD.split("-")[0]),
    //     }
    //     this.expectedRelievingDate = relievingDate1,
    //       this.acceptForm.patchValue({
    //         empExpectedRelievingDate: relievingDate1,
    //       });
    //   } else {
    //     this.acceptForm.patchValue({
    //       empExpectedRelievingDate: this.relievingDate,
    //     });
    //   }

    // }


    this.acceptForm.patchValue({
      knowledgeTransfer: this.rowdata.knowledgeTransfer,
      removalOfAccess: this.rowdata.removalOfAccess,
      exitInterview: this.rowdata.exitInterview,
    });
    if (this.rowdata.knowledgeTransfer == true && this.rowdata.removalOfAccess == true && this.rowdata.exitInterview == true) {
      this.acceptForm.patchValue({
        selectall: true,

      })
    }

  }


  navigateToInitiate() {
    this.router.navigate(['resignation/list']);
  }

  fieldsChange(values: any): void {
    if (values.currentTarget.checked === true) {
      this.acceptForm.get('knowledgeTransfer').setValue(true);
      this.acceptForm.get('removalOfAccess').setValue(true);
      this.acceptForm.get('exitInterview').setValue(true);
    } else {
      this.acceptForm.get('knowledgeTransfer').setValue(false);
      this.acceptForm.get('removalOfAccess').setValue(false);
      this.acceptForm.get('exitInterview').setValue(false);
    }
  }

  getRelievingDate(e) {
    if (e.month < 10) {
      this.mon = '0' + e.month;
    } else {
      this.mon = e.month;
    }
    if (e.day < 10) {
      this.day = '0' + e.day;
    } else {
      this.day = e.day
    }
    this.relievingDateFormatted = e.year + "-" + this.mon + "-" + this.day;
    this.getAcceptRelievingData();
  }
  getExpectedRelievingDate(e) {
    if (e.month < 10) {
      this.mon1 = '0' + e.month;
    } else {
      this.mon1 = e.month;
    }
    if (e.day < 10) {
      this.day1 = '0' + e.day;
    } else {
      this.day1 = e.day
    }
    this.ExpectedRelievingDateFormatted = e.year + "-" + this.mon1 + "-" + this.day1;
    this.getAcceptRelievingData();
  }

  getAcceptRelievingData() {
    const obj = {
      "empRelievingDate": this.relievingDateFormatted,
      "empExpectedRelievingDate": this.ExpectedRelievingDateFormatted,
      // "relievingCheckbox": this.acceptForm.get('relievingCheckbox').value,
    }
  }



  // getrequestdatainfo(): void {
  //   this.employeeResignationService.getrequestdata(this.rowdata.id).subscribe((res: any) => {
  //     this.flag = true;
  //     this.emprequestinfo = res;
  //     this.empresignationdetails = res.resignationResponseDto.osiResignationRequestDetails;
  //     this.empresignationnotes = res.resignationResponseDto.osiResignationRequestNotes;
  //     this.employeeDto = res.employeeDto;
  //     this.getroledetails();
  //   });
  // }


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

  closeFix(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  acceptResignation() {
    const info = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto;
    info["relievingDate"] = this.relievingDateFormatted;
    // info["expectedRelievingDate"] = this.relievingDateFormatted;
    // info["expectedRelievingDate"] = this.ExpectedRelievingDateFormatted,
    info["requestedLWD"] = this.ExpectedRelievingDateFormatted;
    info["knowledgeTransfer"] = this.acceptForm.get("knowledgeTransfer").value;
    info["removalOfAccess"] = this.acceptForm.get("removalOfAccess").value;
    info["exitInterview"] = this.acceptForm.get("exitInterview").value;
    info["decisionDate"] = moment().format('YYYY-MM-DD');
    if (this.rowdata.loggedInEmployeeRole == "PD") {
      info["pdDiscussionStatus"] = true;
    } else {
      info["hrDiscussionStatus"] = true;

    }
    this.employeeResignationService.saveResignationRequest(info).subscribe(res => {
      this.toastrService.success("Resignation Request Accepted");
      this.router.navigate(['resignation/list']);
      const obj = {
        "notes": "Relieving Date is updated to " + this.relievingDateFormatted,
        "notesType": true,
        "roleId": localStorage.getItem('userId'),
        "role": this.rowdata.loggedInEmployeeRole,
        "updatedBy": localStorage.getItem('userName'),
        "osiResignationRequestDto": this.emprequestinfo.resignationResponseDto.osiResignationRequestDto

      }
      this.employeeResignationService.saveNotes(obj).subscribe(response => { });

    });

  }

  retainEmployee() {
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

  getClassNameByFileType(fileType: string) {
    return FileConstants[fileType]
  }
  getFileType(fileType: string) {
    return FileTypeNames[fileType]
  }


  informEmployee() {
    const empId = this.emprequestinfo1.employeeId
    this.employeeResignationService.informEmployee(empId).subscribe((res: any) => {
      if (res) {
        this.toastrService.success(res.message);
      }
    },
      (err: any) => {

      });
  }

}
