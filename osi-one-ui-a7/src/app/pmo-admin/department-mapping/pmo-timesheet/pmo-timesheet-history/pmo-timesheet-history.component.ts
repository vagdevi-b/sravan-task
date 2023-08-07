import { Component, OnInit } from '@angular/core';
import { PmoAdminService } from '../../../../shared/services/pmo-admin.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-pmo-timesheet-history',
  templateUrl: './pmo-timesheet-history.component.html',
  styleUrls: ['./pmo-timesheet-history.component.css']
})
export class PmoTimesheetHistoryComponent implements OnInit {
  timesheetDetails: any;
  AuditInputDTO = { "calendarId": "", "employeeId": "", "employeeName": "", "weekStartDate": "", "weekEndDate": "" };
  auditLogs: any = [];
  empName: any;
  weekStart: any;
  weekEnd: any;
  entityName: string;
  entityNameLink: string;
  myEntityName: any;
  myEntityNameLink: string;
  history: string;
  uniqueName: string;
  uniqueValue: any;
  uniqueDate: string;
  uniqueDateValue: any;

  constructor(
    private pmoService: PmoAdminService,
    private toasterService: ToastrService
  ) {
    this.timesheetDetails = this.pmoService.getSelectedTimesheetDetails(); 
  }

  ngOnInit() {
    console.log("TIMESHEET_DETAILS", this.timesheetDetails);
    this.myEntityName = this.timesheetDetails.employeeName;
    this.getTimesheetHistory();
  }

  getTimesheetHistory() {
    this.AuditInputDTO.calendarId = this.timesheetDetails.calId;
    this.AuditInputDTO.employeeId = this.timesheetDetails.employeeId;
    this.AuditInputDTO.employeeName = this.timesheetDetails.employeeName;
    this.AuditInputDTO.weekStartDate = this.timesheetDetails.weekStartDate;
    this.AuditInputDTO.weekEndDate = this.timesheetDetails.weekEndDate;
    
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getAuditLogs(this.AuditInputDTO).subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      
					 this.auditLogs = response;
					 this.empName= this.timesheetDetails.employeeName;
					 this.weekStart = this.timesheetDetails.weekStartDate;
					 this.weekEnd = this.timesheetDetails.weekEndDate;
					 this.entityName = "My TimeSheets";
					 this.entityNameLink = "#/pmoTimeSheetEntry";
					 this.myEntityName = this.empName;
					 this.myEntityNameLink = "#//pmotimesheetview";
					 this.history = "TimeSheet History";
					 this.uniqueName = "Employee Name";
					 this.uniqueValue = this.empName;
					 this.uniqueDate = "week";
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get timesheet history!');
    });
  }

}
