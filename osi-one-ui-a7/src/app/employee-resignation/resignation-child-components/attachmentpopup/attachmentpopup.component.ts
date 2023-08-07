import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import * as _ from 'underscore';
import { last } from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attachmentpopup',
  templateUrl: './attachmentpopup.component.html',
  styleUrls: ['../../../../../src/assets/css/resignation.css']
})
export class AttachmentpopupComponent implements OnInit {
  hideDelete: Boolean = false;
  updateResume: boolean = false;
  currentFileUpload: File;
  profileid: any = '';
  fileType: any;
  filedata: any = [];
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  selectedfiles: any = [];
  postFileArray: any = [];
  selectedfilesdata: any = [];
  filelist: any;
  maxFileSize5MB = 5242880;
  data: any;
  completeEmpInfo: any
  attachmentpopup: FormGroup;
  formArr: any[];
  role: any;



  constructor(public fb: FormBuilder, private employeeResignationService: EmployeeResignationService, private activemodel: NgbActiveModal, private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.createForm();
    if (this.completeEmpInfo) {
      this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto['employeeNumber'] = this.completeEmpInfo.employeeDto.employeeNumber;
    }
  }

  createForm() {
    this.attachmentpopup = this.fb.group({
      title: [''],
    });
  }

  onUpdateDocument(e: any) {
    this.filelist = e.target.files[0];

    // if (e.target.files.length >= 1) {
    //   const uploadedfiles = []
    //   for (let i = 0; i < e.target.files.length; i++) {
    //     let fileExists = false;
    //     if (e.target.files[i].size > this.maxFileSize5MB) {
    //       this.toastrService.error("File Size greater than 5MB");
    //     } else if (e.target.files.length > 1) {
    //       this.toastrService.error("Single File can be uploaded");
    //     } else if (!this.validateFile(e.target.files[i].name)) {
    //       this.toastrService.error("Invalid File Format");
    //     } else if (e.target.files[i].size < this.maxFileSize5MB && this.validateFile(e.target.files[i].name)) {
    //       for (let j = 0; j <= this.selectedfiles.length; j++) {
    //         if (this.selectedfiles[j] && (this.selectedfiles[j].originalFileName == e.target.files[i].name)) {
    //           fileExists = true;
    //         }
    //       }
    //       if (!fileExists) {
    //         this.selectedfiles = [];
    //         this.selectedfiles.push(e.target.files[i]);
    //         this.attachmentpopup.controls['title'].patchValue(this.selectedfiles[i].name);
    //       }
    //     }
    //   }


    // }
    if (e.target.files.length > 0) {

      let fileExists = false;
      if (this.filelist.size > this.maxFileSize5MB) {
        this.toastrService.error("File Size greater than 5MB");
      } else if (!this.validateFile(this.filelist.name)) {
        this.toastrService.error("Invalid File Format");
      } else if (this.filelist.size < this.maxFileSize5MB && this.validateFile(this.filelist.name)) {
        for (let j = 0; j <= this.selectedfiles.length; j++) {
          if (this.selectedfiles[j] && (this.selectedfiles[j].originalFileName == this.filelist.name)) {
            fileExists = true;
          }
        }
        if (!fileExists) {
          this.selectedfiles = [];
          this.selectedfiles.push(this.filelist);
          this.attachmentpopup.controls['title'].patchValue(this.filelist.name.split('.').slice(0, -1).join('.'));
        }
      }

    }

  }


  validateFile(name: string) {
    let ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    if ((ext === 'pdf') || (ext === 'jpg') || (ext === 'png') || (ext === 'doc') || (ext === 'txt') || (ext === 'jpeg') || (ext === 'docx') || (ext === 'eml')) {
      return true;
    }
    else {
      return false;
    }
  }


  save(): any {
    if (this.selectedfiles && this.selectedfiles.length) {
      let forminfo = new FormData;
      const fName = this.attachmentpopup.get('title').value;
      this.passEntry.emit({ status: "success", files: this.selectedfiles, fileName: fName });

      const attachmentRequestMap = {}
      for (let i = 0; i < this.selectedfiles.length; i++) {
        forminfo.append("multipartFileList", this.selectedfiles[i]);
        attachmentRequestMap[this.selectedfiles[i].name] = this.attachmentpopup.get('title').value;
      }

      // for (let i = 0; i < this.selectedfiles.length; i++) {

      // forminfo.append("files", this.selectedfiles[i]);
      //   const obj = {
      //     multipartFile: this.selectedfiles[i],
      //     displayName: this.attachmentpopup.get('title').value,
      //   }
      //   this.formArr.push(obj);
      // }




      forminfo.append("osiResignationRequestAttachmentDto", new Blob([JSON.stringify({
        roleId: localStorage.getItem('userId'),
        role: this.role,
        attachmentRequestMap,
        osiResignationRequestDto: this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto
      })], {
        type: "application/json"
      }));

      this.employeeResignationService.saveAttachment(forminfo).subscribe((res: any) => {
        if (res) {
          this.toastrService.success("Attachment Uploaded Successfully");
        }
      });
    } else {
      this.toastrService.error("Please Upload a File");

    }

  }

  close(): void {
    const empty: any = []
    localStorage.setItem('files', empty)
    this.activemodel.close();
    this.passEntry.emit({ status: "cancel" });

  }
}