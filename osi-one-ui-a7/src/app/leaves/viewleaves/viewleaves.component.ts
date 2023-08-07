import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import * as $ from 'jquery';
import { HttpUtilities } from '../../shared/utilities';
import { AppConstants } from '../../shared/app-constants';
import { LeavesService } from '../../shared/services/leaves.service';
import { Injectable } from '@angular/core';
import {LoginService} from '../../page-layout/sidebar/login.service';

declare var $: any;

@Component({
  selector: 'app-leaves',
  templateUrl: './viewleaves.component.html',
  styleUrls: ['./viewleaves.component.css']
})
@Injectable()
export class ViewLeavesComponent implements OnInit {
  rowDatas: any;
  //reverse: boolean;
  loggedInUser: any;
  sortKey: any;
  totalBalance: any;
  @ViewChild('selectedOption') selectedOption: ElementRef;
  isSelectedRow: any = null;
  headerName: string = "My Leaves";
  rowSelection: string;
  getReportingEmployeeDetail: any;
  empType: string;
  empTypeId: number;
  total: number = 0;
  crntpage: number;
  balanceCrntpage: number = 0
  leaveId: any;
  selected: boolean;
  public columnDefs1: any[];
  public columnDefs: any[];
  leaveBalance: any;
  public rowData;
  public rowData1;
  editRepoteeLeave: boolean = true
  private noOfHours: any
  private appData = AppConstants;
  isManager: boolean;
  disableOnAccural: boolean = false;
  public user: any = {};
  isNotManager: boolean = true;
  responseData: any;
  isAnyRowSelected:boolean = false;
  userOrgId:any;

  waitingOn=[];
  leaveStatus = {
    currentStatus: "",
    employee: "",
    action: "",
  };

  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  successMessage: any;
  errorMessage: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpUtilities: HttpUtilities,
    private _leavesService: LeavesService,
    private loginService: LoginService
  ) { }

  ngOnInit() {

    this.rowData = this.createRowData();
    this.rowData1 = this.createRowData1();

    this.loginService.getMenus()
      .then(() => {
        this.userOrgId = localStorage.getItem('orgId');
      });

    this.loggedInUser = localStorage.getItem('userId');

    this.responseData = this.route.snapshot.params;
    this.user.employeeId  = this.loggedInUser;
    if (this.responseData) {
      this.successMessage = this.responseData.p2;
      if(this.responseData.p1){
        this.alertSuccess.nativeElement.classList.add("show");
      }
      let ref = this;
      setTimeout(function () {
        ref.alertSuccess.nativeElement.classList.remove("show");
      }, 5000);
    }

    this.getLeaveBalance();
    this.isManager = false;

    $(".modal-backdrop").hide();

    $('#loadingEditSubmitModal').modal('show');
    this._leavesService.getEmployeeType().subscribe(response => {
        if (response.employees != null) {
          response.employees.sort(function (a, b) {
            if (a.employeeName < b.employeeName) return -1;
            if (a.employeeName > b.employeeName) return 1;
            return 0;
          });
        }
        this.getReportingEmployeeDetail = response.employees;
        $('#loadingEditSubmitModal').modal('hide');
      },
      error => this.errorMessage = <any>error);
  }

  flag = false;

  sorting(key) {
    if (this.rowData != null) {

      if (this.flag) {

        if (key === 'submittedDate' || key === 'fromDate' || key === "toDate") {
          this.flag = false
          this.rowData.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return -(dateA.getTime() - dateB.getTime());
          });
        } else {
          this.flag = false
          this.rowData.sort((a, b) => {
            if (a[key] > b[key]) return -1;
            if (a[key] < b[key]) return 1;
            return 0;
          })

        }
      } else {

        if (key === 'submittedDate' || key === 'fromDate' || key === "toDate") {
          this.flag = true
          this.rowData.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return dateA.getTime() - dateB.getTime();
          });
        } else {
          this.flag = true
          this.rowData.sort((a, b) => {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            return 0;
          })
        }
      }
      // let key = 'leaveId'


      // this.rowData.sort((a,b)=>{
      //   if(a[key] > b[key]) return -1;
      //   if(a[key] < b[key]) return 1
      //   return 0;
      // })

    }
  }

  //to get leave Balance
  getLeaveBalance() {
    this._leavesService.getLeaveBalance().subscribe
    (res => {

      this.leaveBalance = res.reverse();
      this.totalBalance = this.leaveBalance.length;

    })
    $('#loadingEditSubmitModal').modal('hide');
  }

  createRowData(): any {

    const rowData: any[] = [];
    this.httpUtilities.get(this.appData.appUrl + 'leave/getAppliedLeaves').map((res: any) => res)
      .subscribe(res => {
        this.rowDatas = res
        this.rowData = this.rowDatas.reverse();
        this.total = this.rowData.length;

      });
    $('#loadingEditSubmitModal').modal('hide');
  }

  private createRowData1(): any {
    const rowData1: any[] = [];
    this.httpUtilities.get(this.appData.appUrl + 'leave/getLeaveAccural').map((res: any) => res).subscribe(res => this.rowData1 = res);
    $('#loadingEditSubmitModal').modal('hide');
    return rowData1;
  }


  onNavClick(params) {

    if (params === "accural") {

      this.headerName = "Leave Balance"
      this.balanceCrntpage = 0
      this.disableOnAccural = true;
    } else {

      this.headerName = "My Leaves"
      this.crntpage = 0;
      this.disableOnAccural = false;
    }
    // this.gridApi.sizeColumnsToFit();
  }


  createLeaveRequest() {
    this.router.navigate(['/leaves/leaverequest'], { relativeTo: this.route });
    this.headerName = 'New Leave Request';
    //$('#leaveModel').modal({ show: true, backdrop: 'static' });
  }

  /*onClickId(){
     this.router.navigate(['/leaves/editleaverequest'],{relativeTo:this.route});
  }*/
  selectedRow() {
    this.isSelectedRow = null;
  }

  isRowClicked(data) {
    this.isSelectedRow = data;
    this.isAnyRowSelected=true;
  }

  getCurrentStatus(){
    this.waitingOn=[];
    this.httpUtilities.get(this.appData.appUrl + 'leave/leave-current-status/'+this.isSelectedRow.leaveId).map((res: any) => res).subscribe(
      res =>
        this.leaveStatus = res);
    //this.waitingOn.push(this.isSelectedRow);
  }

  onRowSelected(leave) {
    this.isAnyRowSelected=true;
    if ((leave.statusCode === 'Open' || leave.statusCode === 'Rejected' || this.isSelectedRow.statusCode === 'Submitted' || leave.statusCode === 'Approved') && this.editRepoteeLeave)
      this.router.navigate(['/leaves/viewleaves/editleaverequest/' + leave.leaveId], { relativeTo: this.route });
  }

  isUpdatable = false
  edit() {
    if (this.isSelectedRow.statusCode === 'Open' || this.isSelectedRow.statusCode === 'Rejected' || this.isSelectedRow.statusCode === 'Submitted' || this.isSelectedRow.statusCode === 'Approved') {
      this.isUpdatable = true;
      this.router.navigate(['/leaves/viewleaves/editleaverequest/' + this.isSelectedRow.leaveId], { relativeTo: this.route });
    }
  }

  view() {
    if (this.isSelectedRow) {
      this.isUpdatable = false;
      this.router.navigate(['/leaves/approve-leave/editleave/' + this.isSelectedRow.leaveId], { relativeTo: this.route });
    }

  }

  onSelect(event, idx) {
    this.editRepoteeLeave = true;
    this._leavesService.getEmployeeLeavesById(event).subscribe(response => {
        this.rowData = [];
        this.total = 0;
        let data = response.reverse();
        // if (data.length > 0 && idx != 0) {
        if (data.length > 0 && event != this.loggedInUser) {
          this.editRepoteeLeave = false;
          for (let i = 0; i < data.length; i++) {
            if (data[i].statusCode === "Approved") {
              let approvedData = this.rowData.push(data[i]);
              this.total = approvedData.length
            }
          }
        }
        else {
          this.rowData = response;
          this.total = this.rowData.length;
        }
      },
      error => this.errorMessage = <any>error);

  }

  // clearSearch() {
  //   this.total = 0;
  //   this.crntpage = 0;
  //   this.rowData = [];
  //   this.selectedOption.nativeElement.value = "undefined";
  // }

  // searchLeave() {
  //   this.createRowData();
  // }

  closeModal() {
    $('#leaveModel').modal('hide');
  }
}
