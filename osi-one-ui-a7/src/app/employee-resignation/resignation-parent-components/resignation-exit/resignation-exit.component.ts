import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../shared/app-constants';

@Component({
  selector: 'app-resignation-exit',
  templateUrl: './resignation-exit.component.html',
  styleUrls: ['./resignation-exit.component.css']
})
export class ResignationExitComponent implements OnInit {
  employeeResignationService: any;
  rowdata: any;
  flag: boolean;
  emprequestinfo: any;
  empresignationdetails: any;
  empresignationnotes: any;
  employeeDto: any;
  rmDetailsinfo: any[];
  hrDetailsInfo: any;
  pdDetailsInfo: any;
  emprequestinfo1: any;
  fileAttachments: any;
  sla_values: any = [];
  rmDiscussionData: any = [];
  hrDiscussionData: any = [];
  rmDiscussion1: any = [];
  hrDiscussion1: any = [];
  rmDiscussion: any = [];
  hrDiscussion: any = [];
  notesdata: any = [];
  downloadFileUrl = AppConstants.resignationDownloadFile;



  constructor(public router: Router,) {
    // this.rowdata = this.router.getCurrentNavigation().extras.state.data;

  }

  ngOnInit() {

    if (this.rowdata != "") {
      this.getrequestdatainfo();
    }
    this.getallresignationreason();
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
      this.employeeDto = res.employeeDto;
      if (res) {
        this.empresignationdetails.forEach(element => {
          if (element.createdBy == this.rowdata.createdBy) {
            this.rmDiscussion = element.reasonCodes.split(",");
          } else {
            this.hrDiscussion = element.reasonCodes.split(",");
          }
        });
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
        this.notesdata.push(element);
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

}
