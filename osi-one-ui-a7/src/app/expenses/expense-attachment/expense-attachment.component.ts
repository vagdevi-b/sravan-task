import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { CreateExpenseService } from '../../shared/services/createexpense.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AppConstants } from '../../shared/app-constants';
import { Flash } from '../../shared/utilities/flash';

declare var $: any;

@Component({
  selector: 'app-expense-attachment',
  templateUrl: './expense-attachment.component.html',
  styleUrls: ['./expense-attachment.component.css']
})
export class ExpenseAttachmentComponent implements OnInit {

  allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword", "image/png", "image/jpeg", "image/bmp", "image/gif", "image/tiff"];

  @ViewChild('EditAttachFileInput') editAttachFileInput;
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  @Output() uploadEvent = new EventEmitter<string>();

  postFileArray = [];
  flash: Flash = new Flash();
  isUploading: Boolean = false;
  uploadedPercentage = 0;
  maxFileSize5MB = 5242880;
  errorMessage : string;
  reportId = 0;
  showPreviewModal;
  hideDelete: Boolean = false;
  uiURL = AppConstants.expenseAttachmentURL;

  constructor(private _createExpenseService: CreateExpenseService) { }

  ngOnInit() {
  }

  setHideDelete(hideDelete) {
    this.hideDelete = hideDelete;
  }

  setAttachments(attachments) {
    this.postFileArray = attachments
  }

  setReportId(reportId) {
    this.reportId = reportId;
  }

  getAttachmentsToSubmit() {
    return this.postFileArray;
  }

  uploadModalOpen() {
    $('#uploadAttachmentsModal').modal('show');
  }

  sendUploadEventNotif(value) {
    this.uploadEvent.emit(value);
  }

  previewModalOpen() {
    this.showPreviewModal = true;
    $('#previewAttachmentsModal').modal('show');
  }

  showPreview(data) {
    window.open(this.uiURL + data.attachmentURL, '_blank');
  }

  previewClosed() {
    this.showPreviewModal = false;
  }

  validateFile(name: string) {
    let ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    if ((ext === 'pdf') || (ext === 'jpg') || (ext === 'png') || (ext === 'doc') || (ext === 'txt') || (ext === 'jpeg') || (ext === 'docx') || (ext === 'xlsx')|| (ext === 'xls') || (ext === 'ppt') || (ext === 'pptx') || (ext === 'vsd') || (ext === 'vsdx') || (ext === 'zip') || (ext === 'rar') || (ext === 'rtf') || (ext === 'mpp') || (ext === 'eml'))  {
      return true;
    }
    else {
      return false;
    }
  }

  detectFiles(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      let fileExists = false;
      if (event.target.files[i].size > this.maxFileSize5MB) {
        this.errorMessage = 'File Size greater than 5MB';
        this.alertError.nativeElement.classList.add("show");
        this.editAttachFileInput.nativeElement.value = "";
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
        }, 1500);
      } else if (!this.validateFile(event.target.files[i].name)) {
        this.errorMessage = 'Invalid File Format';
        this.alertError.nativeElement.classList.add("show");
        this.editAttachFileInput.nativeElement.value = "";
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
        }, 1500);
      } else if (event.target.files[i].size < this.maxFileSize5MB && this.validateFile(event.target.files[i].name)) {
        for (let j = 0; j <= this.postFileArray.length; j++) {
          if (this.postFileArray[j] && (this.postFileArray[j].originalFileName == event.target.files[i].name)) {
            fileExists = true;
          }
        }
        if (!fileExists) {
          this.postFileArray.push(event.target.files[i])
        }
      } else {
        this.errorMessage = 'Invalid File';
        this.alertError.nativeElement.classList.add("show");
        this.editAttachFileInput.nativeElement.value = "";
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
        }, 1500);
      }
    }
  }

  removeFile(index) {
    if (this.postFileArray[index].attachmentId) {
      this._createExpenseService.deleteAttachment(this.postFileArray[index].attachmentId).subscribe(response => {
        this.postFileArray.splice(index, 1);
      },
        error => {
          this.errorMessage = "Could not Remove Attachment";
          this.alertError.nativeElement.classList.add("show");
          let ref = this;
          setTimeout(() => {
            ref.alertError.nativeElement.classList.remove("show");
          }, 1500);
        });
    } else {
      this.postFileArray.splice(index, 1);
    }
  }

  uploadModalClose() {
    this.postFileArray = this.postFileArray.filter(x => x["attachmentId"] !== undefined);
    this.editAttachFileInput.nativeElement.value = "";
  }

  saveAttachments() {
    let formData = new FormData();
    let attachmentData = this.postFileArray.filter(x => x["attachmentId"] == undefined);
    if (attachmentData.length > 0) {
      this.isUploading = true;
      for (let i = 0; i < attachmentData.length; i++) {
        formData.append("receipts", attachmentData[i]);
      }
      this.sendUploadEventNotif(true);
      this._createExpenseService.uploadExpense(this.reportId, formData).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.Response:
            this.postFileArray = event.body;
            this.isUploading = false;
            this.sendUploadEventNotif(false);
            break;
          case 1: {
            this.uploadedPercentage = Math.round(event['loaded'] / event['total'] * 100);
            break;
          }
        }

      },
        error => {
          console.log(error);
          this.isUploading = false;
          this.sendUploadEventNotif(false);
        })
    }
    this.editAttachFileInput.nativeElement.value = "";
  }

}
