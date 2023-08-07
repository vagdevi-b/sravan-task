import { Component, Injector, OnInit } from '@angular/core';
import { RequistionsService } from '../../../shared/services/requistions.service';
import { TableListComponent } from '../../../shared/component/table-list/table-list.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddprofileComponent } from '../../profile/addprofile/addprofile.component';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { ViewRequestComponent } from '../view-request/view-request.component';
declare var $: any;

@Component({
  selector: 'app-requesttable',
  templateUrl: '../../../shared/component/table-list/table-list.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class RequesttableComponent extends TableListComponent {

  constructor(protected requistionSvc: RequistionsService, protected modalService: NgbModal,
    protected injector: Injector) {
    super(requistionSvc, modalService, injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isDrillDownLevelOne = true;
    this.isDrillDownLevelTwo = true;
    this.tableHeaders = [
      'Request Number', 'Job Title', '# Positions', 'Billability', 'Priority', 'Request Type', 'Assigned To', 'Target Date', 'Submitted On'
    ];
    this.isProfileTable = false;

    //this.getTableData();
    //this.getProfileSourceType();
    this.getRecruitersList();
    this.getProfileStatuses();
  }

  getTableDataByRequistionId(reqId) {
    this.tableData = [];
    this.requistionSvc.getAllRequistionsById(reqId).subscribe(response => {
      this.setTableData(response);
    }, err => {
      console.log(err);
    })
  }

  getTableDataByStatus(status) {
    this.tableData = [];
    this.requistionSvc.getAllRequistionsByStatus(status).subscribe(response => {
      this.setTableData(response);
    }, err => {
      console.log(err);
    })
  }

  getTableDataByPriorityAndStatus(reqId, priority, status) {
    this.tableData = [];
    this.requistionSvc.getAllRequistionsByPriorityAndStatus(reqId, priority, status).subscribe(response => {
      this.setTableData(response);
    }, err => {
      console.log(err);
    })
  }
  sendDataToAddProfile(data: any) {
    //console.log(data);
    this.requistionSvc.requistionData = data;
    this.openModal('xl', 'add', data);
  }
  viewReqData(data) {
    this.requistionSvc.requistionData = data;
    this.viewReqModal('xl');
  }
  sendReqProfileData(data, profileData) {
    this.requistionSvc.requistionData = data;
    this.requistionSvc.profileData = profileData;
    this.openModal('xl', 'view', data);
  }
  public openModal(popupSize, type, data): void {

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


    modalRef.result.then(res => {
      if (res) {

      } else {
        console.log(data)
        this.getProfileSourceCountByRequistion(data.Id);
      }
    })
  }

  public viewReqModal(popupSize): void {

    const modalRef = this.modalService.open(ViewRequestComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: popupSize,
      windowClass: 'modalExtraLarge',
      injector: Injector.create([{
        provide: ModalOptions,
        useValue: {

        }
      }], this.injector)
    });

  }

}
