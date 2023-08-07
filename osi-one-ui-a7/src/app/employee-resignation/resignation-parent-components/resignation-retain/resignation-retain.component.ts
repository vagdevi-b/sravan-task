import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { AppConstants } from '../../../shared/app-constants';
import { FileConstants } from '../../file-constants';
import { FileTypeNames } from '../../file-constants';


@Component({
  selector: 'app-resignation-retain',
  templateUrl: './resignation-retain.component.html',
  styleUrls: ['./resignation-retain.component.css']
})
export class ResignationRetainComponent implements OnInit {
  rowdata: any;
  flag: boolean = false;
  requestData: any;
  emprequestinfo: any;
  empresignationdetails: any;
  empresignationnotes: any;
  rmDetailsinfo: any = [];
  hrDetailsInfo: any = [];
  pdDetailsInfo: any = [];
  employeeDto: any;
  retainForm: FormGroup;
  filedata: any;
  selectedfiles: any[];
  attachments: any;
  mon: string;
  day: string;
  retaindate: string;
  retaindate1: string;
  retainDecesionDate: any;
  downloadFileUrl = AppConstants.resignationDownloadFile;
  @ViewChild('DatePickContainer') datePickContainer;
  sla_values: any = [];
  rmDiscussionData: any = [];
  hrDiscussionData: any = [];
  pdDiscussion: any = [];
  pdDiscussionData: any = [];
  rmDiscussion: any = [];
  hrDiscussion: any = [];
  spinner: boolean;
  lastDateAsPerPolicy: Date;
  isAccepted = false;
  userIdinfo: string;
  filterednotesdata: any = [];
  filteredAttachments: any = [];
  private filesInfo = FileConstants;
  newArr: string;
  notesdatasortrm: any = [];

  constructor(public router: Router, private employeeResignationService: EmployeeResignationService,
    private toastrService: ToastrService, private fb: FormBuilder,) {
    this.rowdata = this.router.getCurrentNavigation().extras.state.data;
    this.isAccepted = this.router.getCurrentNavigation().extras.state.Edit;
  }

  ngOnInit() {
    if (this.rowdata != "") {
      this.getrequestdatainfo();
    }
    this.userIdinfo = localStorage.getItem('userId');
    this.createForm();
    this.getallresignationreason();
  }
  createForm() {
    this.retainForm = this.fb.group({
      decisionDate: [''],
      hrPolicy: [''],
      title: ['']
    });
  }

  onUpdateDocument(e: any) {
    if (e.target.files.length >= 1) {
      const uploadedfiles = []
      Array.prototype.push.apply(uploadedfiles, e.target.files)
      uploadedfiles.forEach((res) => {

        const name = res.name.substring(res.name.lastIndexOf('.') + 1);
        if (name == "docx" || name == "pdf" || name == "png" || name == "jpg" || name == "eml" || name == "DOCX"
          || name == "PDF" || name == "PNG" || name == "JPG" || name == "EML") {
          this.filedata = e.target.files;
          this.selectedfiles = [];
          Array.prototype.push.apply(this.selectedfiles, this.filedata);
          this.retainForm.controls['title'].patchValue(this.filedata[0].name);

          // Array.prototype.push.apply(this.selectedfilesdata, this.filedata);
        } else {
          this.toastrService.error("Selected File is Invalid");
        }

      });

    }
  }
  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.sla_values = response.osiLookupValueses;
    });
  }

  getrequestdatainfo(): void {
    this.spinner = true;
    this.employeeResignationService.getrequestdata(this.rowdata.id).subscribe((res: any) => {
      this.emprequestinfo = res;
      this.empresignationdetails = res.resignationResponseDto.osiResignationRequestDetails;
      this.empresignationnotes = res.resignationResponseDto.osiResignationRequestNotes;
      this.employeeDto = res.employeeDto;
      const tempArr = [];
      const empDesignation = this.employeeDto.designation.toLowerCase().split(" ");
      empDesignation.forEach(element => {

        const tempelement = element.charAt(0).toUpperCase() + element.slice(1);
        tempArr.push(tempelement);
      });
      this.newArr = tempArr.join(' ');
      this.emprequestinfo.resignationResponseDto.osiResignationRequestDto['employeeNumber'] = this.employeeDto.employeeNumber;
      this.attachments = res.resignationResponseDto.osiResignationRequestAttachments;
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
          if (element.role == "HR") {
            this.hrDiscussion = element.reasonCodes.split(",");
          } else if (element.role == "RM") {
            this.rmDiscussion = element.reasonCodes.split(",");
          } else {
            this.pdDiscussion = element.reasonCodes.split(",");
          }
        });
      }
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
      });
      this.flag = true;
      this.spinner = false;
      // this.sla_values.forEach(res => {


      // });
      // this.sla_values.forEach(res => { 


      // });
      this.getroledetails();
      this.empresignationnotes.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            // this.filterednotesdata.push(element);

            this.notesdatasortrm.push(element);
            this.filterednotesdata = this.notesdatasortrm.sort((a, b) => a.id - b.id).reverse();
          }
        }
        else {
          this.filterednotesdata = this.empresignationnotes.sort((a, b) => a.id - b.id).reverse();
        }
      });
      this.attachments.forEach(element => {

        if (Number(this.userIdinfo) == this.rowdata.requestRM) {
          if (element.roleId == this.rowdata.requestRM) {
            this.filteredAttachments.push(element);
          }
        }
        else {
          this.filteredAttachments = this.attachments;
        }
      });
    });
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

  closeRequest() {

    const retainDate = this.retainForm.get("decisionDate").value
    if (retainDate.month < 10) {
      this.mon = '0' + retainDate.month;
    } else {
      this.mon = retainDate.month;
    }
    if (retainDate.day < 10) {
      this.day = '0' + retainDate.day;
    } else {
      this.day = retainDate.day
    }
    this.retaindate1 = retainDate.year + "-" + this.mon + "-" + this.day;
    const info = this.emprequestinfo.resignationResponseDto.osiResignationRequestDto;
    info["id"] = this.rowdata.id;
    info["status"] = "Retained";
    info["decisionDate"] = moment().format('YYYY-MM-DD');
    info["pdDiscussionStatus"] = true;
    info["retainDecisionDate"] = this.retaindate1;
    info["continueWithExistingHrPolicy"] = this.retainForm.get("hrPolicy").value;
    this.employeeResignationService.saveResignationRequest(info).subscribe(res => {

      const obj = {
        "notes": "Employee has been retained ",
        "notesType": true,
        "roleId": localStorage.getItem('userId'),
        "role": "PD",
        "updatedBy": localStorage.getItem('userName'),
        "osiResignationRequestDto": this.emprequestinfo.resignationResponseDto.osiResignationRequestDto

      }
      this.employeeResignationService.saveNotes(obj).subscribe(response => { });

      this.toastrService.success("Employee Retained");
      this.router.navigate(['resignation/list']);

    });
  }

  save() {
    if (this.retainForm.get("decisionDate").value != undefined) {
      let forminfo = new FormData;
      if (this.selectedfiles && this.selectedfiles.length) {
        // for (let i = 0; i < this.selectedfiles.length; i++) {
        //   forminfo.append("files", this.selectedfiles[i]);
        // }


        const attachmentRequestMap = {}
        for (let i = 0; i < this.selectedfiles.length; i++) {
          forminfo.append("multipartFileList", this.selectedfiles[i]);
          attachmentRequestMap[this.selectedfiles[i].name] = this.retainForm.get('title').value;
        }

        forminfo.append("osiResignationRequestAttachmentDto", new Blob([JSON.stringify({
          roleId: Number(this.userIdinfo),
          category: "EMPLOYEE_RETAIN_PROCESS",
          attachmentRequestMap,
          osiResignationRequestDto: this.emprequestinfo.resignationResponseDto.osiResignationRequestDto,


        })], {
          type: "application/json"
        }));
        this.employeeResignationService.saveAttachment(forminfo).subscribe((res: any) => {

          if (res) {
            this.toastrService.success("Attachment Uploaded Successfully");
            this.closeRequest();
          }

        });


      } else {
        this.toastrService.error("Attachment is Required");
      }
    } else {
      this.toastrService.error("Please Select Retain Decision Date");
    }

  }

  navigateToInitiate() {
    this.router.navigate(['resignation/list']);
  }


  closeFix(event, datePicker) {

    if (!this.datePickContainer.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }
  getClassNameByFileType(fileType: string) {
    return FileConstants[fileType]
  }
  getFileType(fileType: string) {
    return FileTypeNames[fileType]
  }
}
