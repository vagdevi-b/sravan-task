import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from '../../../shared/services/leaveRequest.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-leavehistory',
  templateUrl: './leavehistory.component.html',
  styleUrls: ['./leavehistory.component.css']
})
export class LeavehistoryComponent implements OnInit {


  constructor(private _leaveRequestService: LeaveRequestService, ) { }


  form = new FormGroup({
    noOfHours: new FormControl('', Validators.required),
    leaveReason: new FormControl('', Validators.required),

  });
  runningBalance: any;
  empName: any;
  leaveHistory = [];
  leaveBalance = [];
  employeeNumber = '';
  firstName = '';
  lastName = '';
  noOfHours = null;
  leaveReason = null;
  total = 0;
  totalBalance = 0;
  crntpage = 0;
  crntBalancepage = 0;
  selectedRow = null;
  selectedEmployeeName = '';
  selectedNoOfHours = '';
  selectedEmpId = '';
  selectedEmployeeNumber = '';
  message = "";
  statusAlert = false;


  ngOnInit() {
  }


  searchLeaveHistory(value) {
    this.selectedRow = null;
    let fname = value.firstName;
    let lname = value.lastName;
    let empNumber = value.employeeNumber;
    this._leaveRequestService.searchLeaveHistory(fname, lname, empNumber).
      subscribe(response => {
        this.leaveHistory = response;
        this.total = this.leaveHistory.length;
      })

  }

  clearSearch() {
    this.employeeNumber = '';
    this.firstName = '';
    this.lastName = '';
    this.total = 0
    this.leaveHistory = [];
    this.selectedRow = null;
  }

  updateBalance(data) {
    data.empId = this.selectedEmpId;
    this._leaveRequestService.adjustEmpLeaveHoursDetails(data).subscribe(requestService => {
    },
      () => {
        this.message = "Failed to Adjust Leave Balance"
        $('#leaveHistory').modal('hide')
        this.statusAlert = true;
        setTimeout(() => {
          this.statusAlert = false;
        }, 3000);
      },
      () => {
        this._leaveRequestService.searchLeaveHistory('', '', this.selectedEmployeeNumber).
          subscribe(response => {
            this.leaveHistory = response;
            this.total = this.leaveHistory.length;

          },
            () => {
              this.message = "Failed to Adjust Leave Balance"
              $('#leaveHistory').modal('hide')
              this.statusAlert = true;
              setTimeout(() => {
                this.statusAlert = false;

              }, 3000);

            },
            () => {
              this.employeeNumber = '';
              this.firstName = '';
              this.lastName = '';
              $('#leaveHistory').modal('hide')
              this.message = "Leave Balance Adjusted Successfully";
              this.statusAlert = true;
              setTimeout(() => {
                this.statusAlert = false;

              }, 3000);
            })
      }
    )
  }


  isRowClicked(row) {
    this.selectedRow = row;
    this.selectedEmployeeName = this.selectedRow.employeeName
    this.selectedNoOfHours = this.selectedRow.noOfHours
    this.selectedEmpId = this.selectedRow.empId;
    this.selectedEmployeeNumber = this.selectedRow.employeeNumber;
  }

  openEditBalance() {
    if (this.selectedRow != null) {
      $('#leaveHistory').modal({ show: true, backdrop: 'static' });
    }
  }

  leaveBalanceHistory() {
    if (this.selectedRow != null) {
      this._leaveRequestService.leaveBalanceHistory(this.selectedEmpId).
        subscribe(response => {
          this.leaveBalance = response.reverse();
          this.totalBalance = this.leaveBalance.length;
        })
      $('#leaveBalanceHistory').modal({ show: true, backdrop: 'static' });
    }
  }


  closeModel() {
    $('#leaveHistory').modal('hide')
    this.selectedEmployeeName = '';
    this.selectedNoOfHours = '';
    this.selectedEmpId = '';
    this.selectedRow = null;
    this.leaveBalance = [];
    this.crntpage = 0;
    this.crntBalancepage = 0;

  }

  deselectedRow() {
    this.selectedRow = null;
  }
}
