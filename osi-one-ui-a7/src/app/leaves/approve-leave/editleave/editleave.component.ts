import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditLeaveService } from '../../../shared/services/editleave.service';
import { Leaves } from '../../../shared/utilities/leaves.model';
import { saveAs } from 'file-saver/FileSaver';
import { LeaveRequestService } from './../../../shared/services/leaveRequest.service';

@Component({
  selector: 'app-editleave',
  templateUrl: './editleave.component.html',
  styleUrls: ['./editleave.component.css']
})
export class EditleaveComponent implements OnInit {

  leaves: any;
  downloadFiles: any;
  errorMessage: string;
  leaveAttachments=[];
  employeeName='';
  constructor(private router: Router, private route: ActivatedRoute,
    private editLeaveService: EditLeaveService,
    private _leaveRequestService: LeaveRequestService,) {
    this.leaves = new Array<Leaves>();
  }

  ngOnInit() {
    let leaveId = this.route.params["_value"].leaveId;

    this.editLeaveService.getEmployeeLeaveByLeaveId(leaveId).subscribe(listofleaves => {
      this.leaves = listofleaves;
      this.employeeName=this.leaves['employeeName'].toLowerCase()

      let attachment = this.leaves['leaveAttachments'];
      for (let i = 0; i < attachment.length; i++) {
        this.leaveAttachments.push(attachment[i]);
      }
     
      console.log(this.leaveAttachments);
      console.log(this.leaves);
      if (this.leaves.statusCode == "Reversed") {

        this.leaves.statusCode = "Submitted for Cancel";
      }
    },
      error => this.errorMessage = <any>error);



  }


  // to download the attachment
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

  onCancel() {
    this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route })
  }
  onEditLeave(leaveId: string) {
    this.router.navigate(['/leaves/viewleaves/editleaverequest', leaveId], { relativeTo: this.route })
  }
  onCancelLeave(leaveId) {
    this.editLeaveService.cancelLeaveRequest(leaveId).subscribe(response => {
      this.leaves = response;

    },
      error => this.errorMessage = <any>error);

    // this.editLeaveService.cancelLeaveRequest(leaveId);
    this.router.navigate(['/leaves/viewleaves'], { relativeTo: this.route })
  }

}

