import { Component, Injector, OnInit } from '@angular/core';
import { RequistionsService } from '../../../shared/services/requistions.service';
import { TableListComponent } from '../../../shared/component/table-list/table-list.component';
import { any } from 'underscore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddprofileComponent } from '../addprofile/addprofile.component';
import { ModalOptions } from 'ngx-bootstrap/modal';
declare var $: any;
@Component({
  selector: 'app-profiletable',
  templateUrl: '../../../shared/component/table-list/table-list.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class ProfiletableComponent extends TableListComponent {
  profileObj: any;
  profileSourceData: any = [];
  constructor(protected requistionSvc: RequistionsService, protected modalService: NgbModal,
    protected injector: Injector) {
    super(requistionSvc,modalService,injector)
  }

  ngOnInit() {
    super.ngOnInit();
    this.tableHeaders = ['Request Number', 'Applicant Name', 'Exp',  'Mobile No','Email', 'Source', 'Sourced By', 'Status','Created By','Created On'];
    this.isDrillDownLevelOne = false;
    this.isDrillDownLevelTwo = false;
    this.isProfileTable = true;
    this.getProfileSourceTypesData();

  }
  getProfileSourceTypesData() {
    this.profileSourceData = [];
    this.requistionSvc.getProfileSourceType().subscribe(response => {
      for (let i = 0; i < response.osiLookupValueses.length; i++) {
        this.profileSourceData.push(response.osiLookupValueses[i]);
      }
      //this.getProfiles();
    }, err => {
      console.log(err);
    });
  }
  getProfiles() {
    $('#loadingEditSubmitModal').modal('show');
    this.requistionSvc.getAllProfiles().subscribe(response => {
      //console.log(response);
      if(response.length === 0 || response === null){
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');
      }else{
        this.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }
    }, err => {
      $('#loadingEditSubmitModal').modal('hide');
      console.log(err);
    })
  }

  setTableData(data) {
    this.tableData = [];
    
    for (let i = 0; i < data.length; i++) {
      let attachArray = [];
      let attachData = data[i].attachements;
      if (attachData === null) {
        attachArray = [];
      }else{
        for (let j = 0; j < attachData.length; j++) {

          let attachObj = {
            "ResumeLink": this.appData.profileDownloadUrl + attachData[j].filePath + '/' + attachData[j].fileName,
            "fileName": attachData[j].fileName
          }
          attachArray.push(attachObj);
        }
      }
      let experience;
      if (data[i].totalExpYears === null) {
        data[i].totalExpYears = 0;
      } if (data[i].totalExpMonths === null) {
        data[i].totalExpMonths = 0;
      }
      experience = data[i].totalExpYears + '+';


      this.profileObj = {
        'Request Number': data[i].externalRefId,
        'Applicant Name': data[i].fullName !== null ? data[i].fullName : data[i].firstName + ' ' + data[i].lastName,
        'Job Title': data[i].jobTitle === null ?data[i].position:data[i].jobTitle,
        'Exp': experience,
        'Status': data[i].status,
        'ProfileId': data[i].id,
        'reqId': data[i].requisitionId,
        'Mobile No': data[i].contactNumber1,
        'Sourced By': data[i].sourcedBy,
        'Created By': data[i].createdUser,
        'Created On': data[i].createdOn,
        'Email':data[i].emailId1,
        'Resume': attachArray
      }

      this.profileSourceData.filter(response => {
        if (data[i].sourceId === response.id) {
          this.profileObj['Source'] = response.lookupDesc;
        }
      })
      this.tableData.push(this.profileObj);
    }
    //console.log(this.tableData);
  }

  sendProfileData(data){
    this.requistionSvc.profileData = data;
    this.openModal('xl','view');
  }
  public openModal(popupSize,type): void {
    
    const modalRef = this.modalService.open(AddprofileComponent, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
        size: popupSize,
        windowClass: 'modalExtraLarge',
        injector: Injector.create([{
            provide: ModalOptions,
            useValue: {
                type
            }
        }], this.injector)
    });

    
    // modalRef.result.then(res => {
    //   if(res){

    //   }
    // })
}
}
