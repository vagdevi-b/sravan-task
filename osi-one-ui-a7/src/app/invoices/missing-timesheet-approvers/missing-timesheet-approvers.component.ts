import { Component, OnInit } from '@angular/core';
import { UndeliveredInvoicesService } from '../../shared/services/undelivered-invoices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-missing-timesheet-approvers',
  templateUrl: './missing-timesheet-approvers.component.html',
  styleUrls: ['./missing-timesheet-approvers.component.css']
})
export class MissingTimesheetApproversComponent implements OnInit {

  timeSheets: any;
  public crntPage: number;
  errorMessage: any;

  constructor(private _undeliveredInvoices: UndeliveredInvoicesService,
    private toasterService: ToastrService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.getUndeliveredInvoices();
  }


  getUndeliveredInvoices() {
    this._undeliveredInvoices.getMissingTimeSheets().subscribe(response => {
      this.timeSheets = response;
      console.log('this.timeSheets,', this.timeSheets);
    },
    error => this.errorMessage = <any>error);
  }

  generateApprover(employee) {
    console.log('employee', employee);
    this._undeliveredInvoices.addMissingTSToApprovers(employee.employeeId, employee.calendarId).subscribe(response => {
      console.log('response,', response);
      this.toasterService.success('Approver generated', 'Success !');
    },
    error => this.errorMessage = <any>error);
  }

}
