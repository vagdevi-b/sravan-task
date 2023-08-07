import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap';
import { AddprofileComponent } from '../../../i-recruit/profile/addprofile/addprofile.component';
import { AppConstants } from '../../app-constants';
import { RequistionsService } from '../../services/requistions.service';
import { ToastrService } from "ngx-toastr";
declare var $: any;
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  protected appData = AppConstants;
  isDrillDownLevelOne: boolean = false;
  isDrillDownLevelTwo: boolean = false;
  tableHeaders: any = [];
  tableData: any = [];
  drillDownOneHeaders: any = [];
  drillDownlevelOneData: any = [];
  drillDownTwoHeaders: any = [];
  drillDownLevelTwoData: any = [];
  recruitmentGroupData: any = [];
  assignTo: any = '';
  profileStatusData: any = [];
  profileStatus: any;
  buttonClass287: string = 'btn c_btn';
  buttonClass288: string = 'btn c_btn';
  buttonClass289: string = 'btn c_btn';
  buttonClass290: string = 'btn c_btn';
  buttonClass291: string = 'btn c_btn';

  profileSourceCounts: any = [];
  profileTotal: any;
  assignedId: any;
  profileSourceTypes: any = [];
  candidateProfSourceData: any = [];
  isProfileTable: boolean = false;
  recruiterName: any = '';
  sortType: string;
  selectedHeaderTh: string;
  constructor(protected requistionSvc: RequistionsService, protected modalService: NgbModal,
    protected injector: Injector, protected toastr?: ToastrService) { }
  ngOnInit() {
    this.recruiterName = '';
    this.requistionSvc.requistionData = {};
    this.requistionSvc.profileData = {};
    this.drillDownTwoHeaders = ['Applicant Name', 'Job Title', 'Experience', 'Source', 'Resume', 'Status'];
  }

  sendDataToAddProfile(data: any) {
    //console.log(data);
    // this.requistionSvc.requistionData = data;
    // this.openModal(data);
  }

  viewReqData(data) {
    // console.log(data, profileData);
    // this.requistionSvc.requistionData = data;
    // this.requistionSvc.profileData = profileData;
  }
  sendReqProfileData(data, profileData) {
    // this.requistionSvc.profileData = data;
  }
  sendProfileData(data) {

  }
  getData() {
    //console.log('get data calling');
  }

  getTableData() {
    this.tableData = [];
    $('#loadingEditSubmitModal').modal('show');
    this.requistionSvc.getAllRequistions().subscribe(response => {
      if (response.length === 0 || response === null) {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');
      } else {
        this.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }


    }, err => {
      console.log(err);
      $('#loadingEditSubmitModal').modal('hide');
    })
  }

  setTableData(data) {
    let isAssigned = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i].assignTo === null) {
        isAssigned = false;
      } else {
        isAssigned = true;
      }
      //total =  data[i].vendors + data[i].partners + data[i].teamHrSource + data[i].empReferal + data[i].walkins;
      let obj = {
        'Id': data[i].id,
        'Request Number': data[i].externalRefId,
        'Job Title': data[i].jobTitle === null ? data[i].position : data[i].jobTitle + ' - ' + data[i].level + data[i].grade,
        '# Positions': data[i].noofPositions,
        'Job Details': data[i].jobDescription,
        'Submitted On': data[i].requesitionDate,
        'Status': data[i].Status,
        'Assigned To': data[i].assignTo,
        'Location': data[i].location,
        'Target Date': data[i].targetDate,
        'Priority': data[i].priority,
        'Request Type': data[i].requisitionType === null ? 'New Position' : data[i].requisitionType,
        'Billability': data[i].billability,
        'Level': data[i].level + data[i].grade,
        'BU & Functional': data[i].bu + ' / ' + data[i].externalRefSubpractice,
        'jobType': data[i].jobTypes === null ? "Full Time" : data[i].jobTypes,
        'isAssigned': isAssigned,
        'profileSourceCount': [],
        'Action': ''
      }
      this.tableData.push(obj);
    }
    //console.log(this.tableData);
  }

  getProfileSourceCountByRequistion(reqid) {
    this.isDrillDownLevelOne = true;
    this.profileSourceCounts = [];
    let total = 0;
    this.requistionSvc.getProfileSourceCountByRequistion(reqid).subscribe(response => {
      //console.log(response);
      this.profileSourceCounts = [];
      for (let i = 0; i < response.length; i++) {
        total = total + response[i].count;
        this.profileSourceCounts.push(response[i]);
      }
      let totalObj =
        { requisitionId: '', sourceId: null, sourceName: 'Total', Totalcount: total }
      this.profileSourceCounts.push(totalObj);

      //this.profileTotal = total;

      this.tableData.filter(data => {
        if (data.Id === reqid) {
          data.profileSourceCount = [];
          data.profileSourceCount = this.profileSourceCounts;
        }
      })

    }, err => {
      console.log(err);
    })
    this.profileSourceCounts = [];

  }
  updateTableData(id, data) {
    //console.log(id, data);
    for (let i = 0; i < this.tableData.length; i++) {
      if (id === this.tableData[i].Id) {
        this.tableData[i]['Assigned To'] = data.assignTo;
        this.tableData[i]['isAssigned'] = data.isAssigned;
      }
    }
    //console.log(this.tableData);
  }

  getRecruitersList() {
    this.requistionSvc.getAssigneesList().subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        this.recruitmentGroupData.push(response[i]);
      }
    }, err => {
      console.log(err);
    })
  }

  // getRecruitmentGroup() {
  //   this.requistionSvc.getAllRecruitmentGroup().subscribe(response => {
  //     //console.log(response);
  //     for (let i = 0; i < response.osiLookupValueses.length; i++) {
  //       this.recruitmentGroupData.push(response.osiLookupValueses[i]);
  //     }
  //   }, err => {
  //     console.log(err);
  //   })
  // }

  getProfileStatuses() {
    this.requistionSvc.getProfileStatus().subscribe(response => {
      //console.log(response);
      for (let i = 0; i < response.osiLookupValueses.length; i++) {
        this.profileStatusData.push(response.osiLookupValueses[i]);
      }
    }, err => {
      console.log(err);
    })
    //console.log(this.profileStatusData);
  }

  getProfileStatus(event: any) {
    //console.log(event.target.value);
    this.profileStatus = event.target.value;
  }

  updateProfileStatus(id, profileId) {
    $('#loadingEditSubmitModal').modal('show');
    //console.log(id, profileId);
    this.requistionSvc.updateProfileStatus(id, profileId, this.profileStatus).subscribe(response => {
      this.updateValueOfProfileStatus(response);
      $('#loadingEditSubmitModal').modal('hide');
    }, err => {
      console.log(err);
      $('#loadingEditSubmitModal').modal('hide');
    })
  }

  updateValueOfProfileStatus(response) {
    for (let i = 0; i < this.drillDownLevelTwoData.length; i++) {
      if (response.profileId === this.drillDownLevelTwoData[i].ProfileId) {
        this.drillDownLevelTwoData[i].Status = response.status;
      }
    }
  }

  getProfileSourceType() {
    this.profileSourceTypes = [];
    this.requistionSvc.getProfileSourceType().subscribe(response => {
      for (let i = 0; i < response.osiLookupValueses.length; i++) {
        this.profileSourceTypes.push(response.osiLookupValueses[i]);
      }
    }, err => {
      console.log(err);
    });
    return this.profileSourceTypes;
  }


  assignRecruiter(event: any) {
    //console.log(event.target.value);
    this.assignTo = event.target.value;
    for (let i = 0; i < this.recruitmentGroupData.length; i++) {
      if (this.recruitmentGroupData[i].employeeFullName === this.assignTo.toString()) {
        this.assignedId = this.recruitmentGroupData[i].employeeId;
        //console.log(this.assignedId);
      }

    }
  }


  updateRequistion(reqId) {
    $('#loadingEditSubmitModal').modal('show');
    this.requistionSvc.updateRequistion(reqId, this.assignTo, this.assignedId).subscribe(response => {
      response['isAssigned'] = true;
      this.updateTableData(reqId, response);
      this.recruiterName = '';
      $('#loadingEditSubmitModal').modal('hide');
    }, err => {
      console.log(err);
      $('#loadingEditSubmitModal').modal('hide');
    })
  }

  reAssignRecruiter(data, data2) {
    data.isAssigned = false;
    data.assignTo = data2;
    this.recruiterName = data2;
    //console.log(data,data2);
    this.updateTableData(data.Id, data);
  }

  getProfilesByReqIdAndSourceId(reqId, profileSourceId) {
    // switch (profileSourceId) {
    //   case 287:
    //     this.buttonClass287 = 'btn c_btn active';
    //   case 288:
    //     this.buttonClass288 = 'btn c_btn active';
    //   case 289:
    //     this.buttonClass289 = 'btn c_btn active';
    //   case 290:
    //     this.buttonClass290 = 'btn c_btn active';
    //   case 291:
    //     this.buttonClass291 = 'btn c_btn active';
    // }
    
    this.requistionSvc.getProfilesByReqIdAndSourceId(reqId, profileSourceId).subscribe(response => {
      this.setProfileData(reqId, response);
    }, err => {
      console.log(err);
    })
  }

  setProfileData(reqId, data) {
    //console.log(data);
    this.drillDownLevelTwoData = [];
    for (let i = 0; i < data.length; i++) {
      let attachArray = [];
      let attachData = data[i].attachements;
      if (attachData === null) {
        attachArray = [];

        let experience;
        if (data[i].totalExpYears === null) {
          data[i].totalExpYears = 0;
        } if (data[i].totalExpMonths === null) {
          data[i].totalExpMonths = 0;
        }
        experience = data[i].totalExpYears + ' Yrs ' + data[i].totalExpMonths + ' Months';
        let obj = {
          'Applicant Name': data[i].firstName,
          'Job Title': data[i].jobTitle === null ? data[i].position : data[i].jobTitle,
          'Experience': experience,
          'Created On': data[i].createdOn,
          //'ScheduledDateTime': data[i].expectedDoj,
          //'Interview Mode': null,
          //'Profile Matches': null,
          'Resume': attachArray,
          'ProfileId': data[i].id,
          'Status': data[i].status,
          'Request Number': data[i].externalRefId
        }
        this.profileSourceTypes.filter(response => {
          if (data[i].sourceId === response.id) {
            obj['Source'] = response.lookupDesc;
          }
        })
        this.drillDownLevelTwoData.push(obj);
      } else {
        for (let j = 0; j < attachData.length; j++) {

          let attachObj = {
            "ResumeLink": this.appData.profileDownloadUrl + attachData[j].filePath + '/' + attachData[j].fileName,
            "fileName": attachData[j].displayName
          }
          attachArray.push(attachObj);
        }
        let experience;
        if (data[i].totalExpYears === null) {
          data[i].totalExpYears = 0;
        } if (data[i].totalExpMonths === null) {
          data[i].totalExpMonths = 0;
        }
        experience = data[i].totalExpYears + ' Yrs ' + data[i].totalExpMonths + ' Months';
        let obj = {
          'Applicant Name': data[i].firstName,
          'Job Title': data[i].jobTitle === null ? data[i].position : data[i].jobTitle,
          'Experience': experience,
          'Created On': data[i].createdOn,
          //'ScheduledDateTime': data[i].expectedDoj,
          //'Interview Mode': null,
          //'Profile Matches': null,
          'Resume': attachArray,
          'ProfileId': data[i].id,
          'Status': data[i].status,
          'Request Number': data[i].externalRefId
        }
        this.profileSourceTypes.filter(response => {
          if (data[i].sourceId === response.id) {
            obj['Source'] = response.lookupDesc;
          }
        })
        this.drillDownLevelTwoData.push(obj);
      }

    }
    this.tableData.filter(data => {
      if (data.Id === reqId) {
        data['profilesData'] = this.drillDownLevelTwoData;
      }
    })

    //console.log(this.tableData);
  }
  // getButtonClass(sourceId) {
  //   switch (sourceId) {
  //     case 287:
  //       return this.buttonClass287;
  //     case 288:
  //       return this.buttonClass288;
  //     case 289:
  //       return this.buttonClass289;
  //     case 290:
  //       return this.buttonClass290;
  //     case 291:
  //       return this.buttonClass291;
  //   }
  // }
  //sorting

  getClass(field): any {
    return this.requistionSvc.getClass(
      field,
      this.sortType,
      this.selectedHeaderTh
    );
  }

  sort(sortKey: any): void {
    $('#loadingEditSubmitModal').modal('show');
    let sortResult: any;
    this.selectedHeaderTh = sortKey;
    sortResult = this.requistionSvc.sort(sortKey, this.tableData, this.sortType);
    this.tableData = sortResult['result'];
    this.sortType = sortResult['sortType'];
    $('#loadingEditSubmitModal').modal('hide');
    // if (this.pagination) {
    //   this.pagination.setPage(1);
    // }
  }
}
