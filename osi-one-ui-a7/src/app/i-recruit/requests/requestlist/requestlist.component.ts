import { Component, OnInit, ViewChild } from '@angular/core';
import { RequistionsService } from '../../../shared/services/requistions.service';
import { RequesttableComponent } from '../requesttable/requesttable.component';
import { ToastrService } from "ngx-toastr";
declare var $: any;
@Component({
  selector: 'app-requestlist',
  templateUrl: './requestlist.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class RequestlistComponent implements OnInit {
  searchType: any;
  searchItem: any;
  Requests: any = '';
  userId: any;
  selectedType: any = '';
  allButtonClass = 'btn btn-primary';
  unAssignedButtonClass = 'btn btn-primary';
  myButtonClass = 'btn btn-primary';
  @ViewChild(RequesttableComponent) requestTableComponent: RequesttableComponent;
  constructor(private reqSvc: RequistionsService, private toastr: ToastrService) { }
  tempTableData: any = [];
  ngOnInit() {
    //this.getUnAssigned();
    this.requestTableComponent.getProfileSourceType();
  }

  getApproved() {
    this.requestTableComponent.getTableDataByStatus('Approved');
  }

  getAll() {
    this.allButtonClass = 'btn btn-primary c-btn--active';
    this.unAssignedButtonClass = 'btn btn-primary';
    this.myButtonClass = 'btn btn-primary';
    this.Requests = 'All Requests';
    this.selectedType = '';
    this.searchItem = '';
    this.searchType = '';
    this.requestTableComponent.getTableData();
  }

  getInProcess() {
    this.requestTableComponent.getTableDataByStatus('InProcess');
  }

  getRejected() {
    this.requestTableComponent.getTableDataByStatus('Rejected');
  }

  getSearchType($event) {
    //console.log($event.target.value);
    let searchType = $event.target.value;
    if (searchType === 'Request No') {
      this.searchType = searchType;
    } else if (searchType === 'Assigned To') {
      this.searchType = searchType;
    } else if (searchType === 'Status') {
      this.searchType = searchType;
    } else if (searchType === 'Priority') {
      this.searchType = searchType;
    } else if (searchType === 'CreatedBy') {
      this.searchType = searchType;
    }
  }

  getRequistionsBySearch() {

    $('#loadingEditSubmitModal').modal('show');
    if (this.searchType === 'unAssigned') {
      this.Requests = 'Unassigned Requests';
    } else {
      this.Requests = `Requests based on search criteria ${this.searchType} - ${this.searchItem}`;
    }

    this.requestTableComponent.tableData = [];
    //console.log(this.searchType, this.searchItem);
    this.reqSvc.getRequistionsBySearch(this.searchType, this.searchItem.trim()).subscribe(response => {
      if (response.length === 0 || response === null) {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');

      } else {
        this.requestTableComponent.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }
      this.allButtonClass = 'btn btn-primary c-btn--active';
      this.unAssignedButtonClass = 'btn btn-primary';
      this.myButtonClass = 'btn btn-primary';

    }, err => {
      $('#loadingEditSubmitModal').modal('hide');
      console.log(err);
    })
  }

  getUnAssignedRequistions() {

    $('#loadingEditSubmitModal').modal('show');
    if (this.searchType === 'unAssigned') {
      this.Requests = 'Unassigned Requests';
    } else {
      this.Requests = `Requests based on search criteria ${this.searchType} - ${this.searchItem}`;
    }

    this.requestTableComponent.tableData = [];
    //console.log(this.searchType, this.searchItem);
    this.reqSvc.getRequistionsBySearch(this.searchType, this.searchItem.trim()).subscribe(response => {
      if (response.length === 0 || response === null) {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');

      } else {
        this.requestTableComponent.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }

    }, err => {
      $('#loadingEditSubmitModal').modal('hide');
      console.log(err);
    })
  }
  getUnAssigned() {
    this.allButtonClass = 'btn btn-primary';
    this.unAssignedButtonClass = 'btn btn-primary c-btn--active';
    this.myButtonClass = 'btn btn-primary';
    this.requestTableComponent.recruiterName = '';
    this.selectedType = '';
    this.searchType = 'unAssigned';
    this.searchItem = '';
    this.getUnAssignedRequistions();
  }

  getLoggedInUserReq() {
    this.allButtonClass = 'btn btn-primary';
    this.unAssignedButtonClass = 'btn btn-primary';
    this.myButtonClass = 'btn btn-primary c-btn--active';
    this.searchItem = '';
    this.Requests = 'My Requests'
    let user = localStorage.getItem('userId');
    //console.log(user);
    this.userId = user;
    this.searchType = 'AssignedId';
    $('#loadingEditSubmitModal').modal('show');
    this.requestTableComponent.tableData = [];
    //console.log(this.searchType, this.searchItem);
    this.reqSvc.getRequistionsBySearch(this.searchType, this.userId).subscribe(response => {
      if (response.length === 0 || response === null) {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');

      } else {
        this.requestTableComponent.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }
    }, err => {
      $('#loadingEditSubmitModal').modal('hide');
      console.log(err);
    })
  }

  getAssigneesList() {
    this.reqSvc.getAssigneesList().subscribe(response => {
      //console.log(response);
    }, err => {
      console.log(err);
    })
  }
}
