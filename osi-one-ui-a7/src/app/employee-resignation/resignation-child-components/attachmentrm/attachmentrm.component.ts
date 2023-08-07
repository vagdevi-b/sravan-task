
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import * as _ from 'underscore';
import { last } from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attachmentrm',
  templateUrl: './attachmentrm.component.html',
  styleUrls: ['../../../../../src/assets/css/resignation.css']
})
export class AttachmentrmComponent implements OnInit {
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
  filelist: FileList;
  maxFileSize5MB = 5242880;
  attachmentForm: FormGroup;




  constructor(public fb: FormBuilder, private employeeResignationService: EmployeeResignationService, private activemodel: NgbActiveModal, private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.attachmentForm = this.fb.group({
      title: ['']

    });
  }

  onUpdateDocument(e: any) {
    this.filelist = e.target.files;
    if (e.target.files.length >= 1) {
      const uploadedfiles = []
      for (let i = 0; i < e.target.files.length; i++) {
        let fileExists = false;
        if (e.target.files[i].size > this.maxFileSize5MB) {
          this.toastrService.error("File Size greater than 5MB");
        } else if (e.target.files.length > 1) {
          this.toastrService.error("Single File can be uploaded");
        } else if (!this.validateFile(e.target.files[i].name)) {
          this.toastrService.error("Invalid File Format");
        } else if (e.target.files[i].size < this.maxFileSize5MB && this.validateFile(e.target.files[i].name)) {
          for (let j = 0; j <= this.selectedfiles.length; j++) {
            if (this.selectedfiles[j] && (this.selectedfiles[j].originalFileName == e.target.files[i].name)) {
              fileExists = true;
            }
          }
          if (!fileExists) {
            this.selectedfiles = [];
            this.selectedfiles.push(e.target.files[i]);
            this.attachmentForm.controls['title'].patchValue(this.selectedfiles[i].name);
          }
        }
      }

    }
  }

  changeName(e: any) {

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


    let forminfo = new FormData;
    const fName = this.attachmentForm.get('title').value;
    this.passEntry.emit({ status: "success", files: this.selectedfiles, fileName: fName });

    for (let i = 0; i < this.selectedfiles.length; i++) {

      forminfo.append("files", this.selectedfiles[i]);
    }
    forminfo.append("osiResignationRequestAttachmentDto", new Blob([JSON.stringify({
      roleId: localStorage.getItem('userId'),
      osiResignationRequestDto: {
        createdDate: "2022-03-23T14:46:57.872",
        createdBy: 758,
        lastModifiedDate: "2022-03-23T14:46:57.873",
        lastModifiedBy: 7598,
        version: 0,
        id: 1,
        category: "EMP_RESIGNATION_REQUEST",
        employeeId: 1,
        requestPD: 0,
        requestRM: 4,
        requestHR: 0,
        hrDiscussionStatus: true,
        pdDiscussionStatus: true,
        status: "string"
      }
    })], {
      type: "application/json"
    }));
  }

  close(): void {
    const empty: any = []
    localStorage.setItem('files', empty)
    this.activemodel.close();
    this.passEntry.emit({ status: "cancel" });

  }
}