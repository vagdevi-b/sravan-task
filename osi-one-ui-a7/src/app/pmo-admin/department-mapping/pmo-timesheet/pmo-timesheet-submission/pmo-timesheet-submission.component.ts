import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { PmoAdminService } from '../../../../shared/services/pmo-admin.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-pmo-timesheet-submission',
  templateUrl: './pmo-timesheet-submission.component.html',
  styleUrls: ['./pmo-timesheet-submission.component.css']
})
export class PmoTimesheetSubmissionComponent implements OnInit {
  timesheetDetails: any;
  nonBillable: any;
  calenderData: any;
  formattedDates: any = [];
  formattedDate: any;
  weekstartDate: any;
  weekendDate: any;
  projects: any;
  projectTasks: any = {};
  projectShifts: any = {};
  shifts: any;
  tsRows: any;
  totalHours: any = [];
  grandTotal: number;
  cumilativeTotal: {};
  taskList: any = [];
  shiftList: any = [];
  billTypes: any = [];
  statusValue: any = [];
  singleRow: boolean = false;
  leaveFlag: boolean;
  isValidHours: boolean = false;
  dayNoteId: number;
  notes: any;
  tseIndex: any;
  rejectTsComment: any;
  vaildTimesheets: boolean;
  isValidFlag: boolean;
  tsCapturedRows = { "timeSheetEntries": [] };
  deleteIndex: any;
  value: any;
  projectId: any;
  showToaster: Boolean = false;
  enablePMO: Boolean;
  overallStatus: any;
  constructor(
    private pmoService: PmoAdminService,private cd: ChangeDetectorRef,
    private router: Router, private modalService: NgbModal,
    private toasterService: ToastrService
  ) {
    this.timesheetDetails = this.pmoService.getSelectedTimesheetDetails();
    var searchparam = this.pmoService.getFilterParamDetails();
    this.pmoService.setFilterParamDetails(searchparam);
  }

  ngOnInit() {
    this.getLookupValue();
    this.getCalenderData();
    this.checkOrgId();
  }

  checkOrgId() {
   const { orgId } = this.timesheetDetails;
   if (orgId === 17 || orgId === 28) {
     this.enablePMO = false;
   } else {
    this.enablePMO = true;
   }
  }

  getLookupValue(): any {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getLookupValue('NON BILLABLE', 'TASK_TYPE').subscribe((response) => {
      this.nonBillable = response;
      $('#loadingEditSubmitModal').modal('hide');
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get lookup details!');
    });
  }

  showHistory() {
    this.router.navigate(['/pmotimesheethistory']);
  }

  getCalenderData(): any {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getCalender(this.timesheetDetails.weekStartDate, this.timesheetDetails.orgId).subscribe((response) => {
      this.calenderData = response;
      let startDate = new Date(response[0].weekStartDate.replace(/-/g, '\/'));
      let endDate = new Date(response[0].weekEndDate.replace(/-/g, '\/'));

      this.weekstartDate = moment(new Date(response[0].weekStartDate.replace(/-/g, '\/'))).format('YYYY-MM-DD');
      this.weekendDate = moment(new Date(response[0].weekEndDate.replace(/-/g, '\/'))).format('YYYY-MM-DD');
      this.formattedDates = [];
      while (startDate <= endDate) {
        this.formattedDate = moment(startDate).format('YYYY-MM-DD');
        this.formattedDates.push(this.formattedDate);
        var newDate = startDate.setDate(startDate.getDate() + 1);
        startDate = new Date(newDate);
      }
      this.getUserWklyProjectAndTasks();
      $('#loadingEditSubmitModal').modal('hide');
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get calender details!');
    });
  }

  getUserWklyProjectAndTasks() {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getUserWklyProjectAndTasks(this.timesheetDetails.employeeId, this.timesheetDetails.calId).subscribe((response) => {
      this.projects = response;
      this.getCommonProjectAndTasks();
      $('#loadingEditSubmitModal').modal('hide');
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get project details!');
    });
  }

  getCommonProjectAndTasks() {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getCommonProjectAndTasksForPmoTimesheets(this.timesheetDetails.calId, this.timesheetDetails.employeeId, this.timesheetDetails.orgId).subscribe((commonProjectsList) => {
      $('#loadingEditSubmitModal').modal('hide');

      // Adding user projects to common projects list
      // only if that user project is not already in common projects
      for (const eachUserProject of this.projects) {
        if (
          commonProjectsList.find(
            commonProject => commonProject.projectId === eachUserProject.projectId
          ) === undefined
        ) {
          commonProjectsList.push(eachUserProject);
        }
      }

      // now common projects list contains both common and user projects
      this.projects = commonProjectsList;

      for (var i = 0; i < this.projects.length; i++) {
        var projectId = this.projects[i].projectId;
        var taskList = this.projects[i].taskList;
       var shiftsList = this.projects[i].shifts;
        this.projectTasks[projectId] = taskList;
        this.projectShifts[projectId] = shiftsList;
      }
      this.getShifts();
      this.getUserWklyTimesheetEntry();
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get common project details!');
    });
  }

  getShifts(): any {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getShifts(this.timesheetDetails.orgId).subscribe((response) => {
      this.shifts = response;
     // this.cd.detectChanges();
      $('#loadingEditSubmitModal').modal('hide');
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get shifts details!');
    });
   // this.cd.detectChanges();
  }

  getUserWklyTimesheetEntry(): any {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getUserWklyTimesheetEntry(this.timesheetDetails.employeeId, this.timesheetDetails.calId).subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.tsRows = response.timeSheetEntries;
      
      this.taskList = [];
      this.shiftList = [];

      for (var i = 0; i < this.tsRows.length; i++) {
        this.tasks(i, this.tsRows[i].projectId);
        this.shift(i, this.tsRows[i].projectId);
        this.overallStatus = this.tsRows[i].overallStatus;
        this.getBillTypeByTask(i);
        // $scope.disableRejectButton = isAnyChanrgedTs;
      }

      setTimeout(() => {
        /* This code is put in settimeout because it should be executed
         * only once after view is completely initialized
         * */
        if(this.tsRows){
          this.tsRows.forEach((element, index) => {
            this.checkTaskExist(index, 'taskId', element.projectId);
          });
        }
      }, 0);

      this.getTotal();
      this.addNewRow(0, this.tsRows[0].projectId);
      

    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get shifts details!');
    });
  }

  addNewRow(index: any, projectId: any) {

    this.tasks(index, projectId);
    this.shift(index, projectId);
    var lastRow = this.tsRows.length - 1;
    if (this.tsRows.length !== 0) {
      if (this.tsRows.length !== undefined && index !== undefined) {
        //  this.tsRows[index].isBillable = undefined;
      }
      if (this.tsRows[lastRow].projectId == '' && this.tsRows[lastRow].taskId == '' && this.tsRows[lastRow].shiftId == ''
        && this.tsRows[lastRow].isBillable == '' && (this.tsRows[lastRow].spenthours.length == undefined) && this.tsRows[lastRow].notes.length == undefined) {
        return true;
      }
    }
    this.tsRows.push({ "projectId": '', "taskId": '', 'leaveId': null, "shiftId": '', "isBillable": '', "spenthours": {}, "timeSheetId": {}, "notes": {} });
    this.isSingleRow(this.tsRows.length);

  }

  isSingleRow(rowLength) {
    if (rowLength == 1) {
      this.singleRow = true;
    } else {
      this.singleRow = false;
    }
  }

  tasks(index: any, projectId: any) {
    if (projectId === undefined) {
      this.taskList[index] = [];
      return;
    }

    const taskObj = this.projectTasks[projectId];
    if (taskObj !== undefined) {
      this.taskList[index] = taskObj;
      // this.tsRows[index].taskId = '';
    } else {
      this.taskList[index] = [];
    }

    if (this.tsRows[index].taskId && this.tsRows[index].projectId) {
      if (
        this.projectTasks[this.tsRows[index].projectId]
          .find(each => each.taskId === this.tsRows[index].taskId) === undefined
      ) {
        this.tsRows[index].taskId = '';
      }
    }

    this.taskList.forEach(tsk => {
      for (var i = tsk.length - 1; i >= 0; i--) {
        if (tsk[i].isTaskCompleted === 1 && tsk[i].lastUpdatedDate < moment(new Date(this.timesheetDetails.weekStartDate.replace(/-/g, '\/'))).format('YYYY-MM-DD'))
          tsk.splice(i, 1);
      }
    });

  }
  shift(index: any, projectId: any) {
    if (!projectId) {
      this.shiftList[index] = [];
    }
    var shiftObj = this.projectShifts[projectId];
    if (shiftObj) {
      this.shiftList[index] = shiftObj;
    } else {
      this.shiftList[index] = [];
    }
  }

  getBillTypeByTask(index: any) {
    // Selecting the Bill type based on task
    this.billTypes[index] = [];
    var selectedTaskId = this.tsRows[index].taskId;
    var task = this.taskList[index].filter((item) => { return item.taskId == selectedTaskId; });
    if (task !== undefined && task.length > 0) {
      var billType = { id: task[0].taskType, value: task[0].lookupValue };
      this.billTypes[index].push(billType);
      //this.tsRows[index].isBillable =task.taskType;
      if (task[0].lookupValue == "BILLABLE") {
        this.billTypes[index].push({ id: this.nonBillable.id, value: this.nonBillable.lookupValue });
      }
      if (this.tsRows[index].isBillable == null) {
        this.tsRows[index].isBillable = task.taskType;
      }

      const currentBillType = this.tsRows[index].isBillable;
      if (
        currentBillType &&
        this.billTypes[index].find(each => each.id === currentBillType) === undefined
      ) {
        this.tsRows[index].isBillable = '';
      }
    //  this.cd.detectChanges();
    } else {
      this.billTypes[index] = [];
    }
  }

  getTotal(): any {
    this.totalHours = [];
    for (var i = 0; i <= this.tsRows.length - 1; i++) {
      var total = 0;
      for (var j = 0; j < this.formattedDates.length; j++) {
        if (this.tsRows[i].spenthours[this.formattedDates[j]] != undefined && this.tsRows[i].spenthours[this.formattedDates[j]] != "") {
          total = total + (this.tsRows[i].spenthours[this.formattedDates[j]]);
        }
      }
      this.totalHours[i] = parseFloat(total.toFixed(2));
    }
    this.getWeeklyDayTotalhours();
  }

  getWeeklyDayTotalhours(): any {
    this.grandTotal = 0;
    this.cumilativeTotal = {};
    let cumilativeTotalDummy = {};
    for (var i = 0; i < this.formattedDates.length; i++) {
      this.cumilativeTotal[this.formattedDates[i]] = 0;
      cumilativeTotalDummy[this.formattedDates[i]] = 0;
    }

    for (var i = 0; i < this.tsRows.length; i++) {
      Object.entries(this.tsRows[i].spenthours).forEach(([key, value]) => {
        if (value != undefined && value != null && value != '') {
          // this.cumilativeTotal[key] = this.cumilativeTotal[key] + value;
          cumilativeTotalDummy[key] = cumilativeTotalDummy[key] + value;
          this.cumilativeTotal[key] = parseFloat(cumilativeTotalDummy[key].toFixed(2));
          console.log(cumilativeTotalDummy[key].toFixed(2));
        }
      });
      
      
    }
    for (var i = 0; i <= this.tsRows.length - 1; i++) {
      this.grandTotal = this.grandTotal + this.totalHours[i];
    }
  }

  isValidMaxDayHours(dayHours) {
    if (dayHours > 24) {
      this.isValidHours = true;
      this.toasterService.error("Invalid data - Timesheet daily hours should be between 0 to 24");
    } else {
      this.isValidHours = false;
    }
  }

  istimeSheetKeyExists(timeSheetId: any) {
    for (var i = 0; i < this.formattedDates.length; i++) {
      if (timeSheetId[this.formattedDates[i]] !== undefined) {
        return true;
      }
    }
  }

  deleteTimesheetEntry(tseIndex: any) {
    this.deleteIndex = tseIndex;
    if (!this.istimeSheetKeyExists(this.tsRows[tseIndex].timeSheetId)) {
      if (tseIndex != this.tsRows.length - 1) {
        var deleteRow = this.tsRows.splice(tseIndex, 1); // deleting the row
        this.billTypes.splice(tseIndex, 1); // remove the bill type details of deleted row
        this.taskList.splice(tseIndex, 1); // remove the task details of deleted row
         this.shiftList.splice(tseIndex, 1); // remove the shift details of deleted row
        this.getTotal();
        $("span[id*='Note_']").css("color", "#666");
      }
    } else {
      $("#deleteNotification").modal("show");
    }
  }

  deleteEntry() {
    for (let i = 0; i < this.formattedDates.length; i++) {
      if (this.tsRows[this.deleteIndex].timeSheetId[this.formattedDates[i]] !== undefined) {
        this.pmoService.deleteTimesheetEntry(this.tsRows[this.deleteIndex].timeSheetId[this.formattedDates[i]]).subscribe((response) => {
          $('#loadingEditSubmitModal').modal('hide');
          if (!this.showToaster) {
            this.showToaster = true;
            this.toasterService.success('Successfully Deleted timesheet record.');
          }
          this.getUserWklyTimesheetEntry();
        }, (errorResponse) => {
          $('#loadingEditSubmitModal').modal('hide');
          this.toasterService.error('Error Occurred While Deleting timesheet record.');
        });
      }
    }
  }

  rejectModalTimeSheets() {
    if (this.overallStatus === 'G'){
      this.toasterService.warning('Can not reject as charges are generated');
      return ;
    }else {
      this.rejectTsComment = undefined;
      $('#pmoTimeSheetRejectModel').modal('show');
    }
  }

  rejectModalTimeSheetsByProject(projectId) {
    this.rejectTsComment = undefined;
    this.projectId = projectId;
    $('#pmoTimeSheetByProjectRejectModel').modal('show');
  }

  rejectTimeSheetByProject() {
    // tslint:disable-next-line: max-line-length
    if (typeof (this.rejectTsComment) === 'undefined' || (typeof (this.rejectTsComment) !== 'undefined' && this.rejectTsComment.trim() === '')) {
      this.toasterService.error('Please add comments.');
      return false;
    } else {
      let approvalTimeSheetDTO = { 'calendarId': '', 'employeeId': '', 'comments': '', 'projectId': '' };
      approvalTimeSheetDTO.calendarId = this.timesheetDetails.calId;
      approvalTimeSheetDTO.employeeId = this.timesheetDetails.employeeId;
      approvalTimeSheetDTO.comments = this.rejectTsComment;
      approvalTimeSheetDTO.projectId = this.projectId;
      $('#pmoTimeSheetByProjectRejectModel').modal('hide');
      $('#loadingEditSubmitModal').modal('show');
      this.pmoService.rejectTimeSheetByProject(approvalTimeSheetDTO).subscribe((result) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.success('Successfully rejected the timesheet.');
        this.router.navigate(['/pmoTimeSheetEntry']);
      }, (errorResponse) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.error('Error occurred while rejecting timesheet.');
      });
    }
  }

  rejectTimeSheet() {
    if (typeof (this.rejectTsComment) == 'undefined' || (typeof (this.rejectTsComment) != "undefined" && this.rejectTsComment.trim() == '')) {
      this.toasterService.error("Please add comments.");
      return false;
    } else {
      let approvalTimeSheetDTO = { "calendarId": '', "employeeId": '', "comments": '' };
      approvalTimeSheetDTO.calendarId = this.timesheetDetails.calId;
      approvalTimeSheetDTO.employeeId = this.timesheetDetails.employeeId;
      approvalTimeSheetDTO.comments = this.rejectTsComment;
    //  $('#loadingEditSubmitModal').modal('show');
      this.pmoService.rejectPmoTimesheets(approvalTimeSheetDTO).subscribe((result) => {
        $('#pmoTimeSheetByProjectRejectModel').modal('hide');
     //   $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.success('Successfully rejected the timesheet.');
        this.router.navigate(['/pmoTimeSheetEntry']);
      }, (errorResponse) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.error('Error occurred while rejecting timesheet.');
      });
    }
  }

  validateTS() {
    this.vaildTimesheets = true;
    for (let i = 0; i < this.tsRows.length - 1; i++) {
      if (!this.isValid(this.tsRows[i].projectId)) {
        this.toasterService.error('Mandatory field data is missing-Project.');
        this.vaildTimesheets = false;
      } else if (!this.isProjectValid(this.tsRows[i].projectId)) {
        this.toasterService.error('Mandatory field data is missing-Project.');
        this.vaildTimesheets = false;
      } else if (!this.isValid(this.tsRows[i].taskId)) {
        this.toasterService.error('Mandatory field data is missing-Task.');
        this.vaildTimesheets = false;
      } else if (!this.isValid(this.tsRows[i].shiftId)) {
        this.toasterService.error('Mandatory field data is missing-Shift.');
        this.vaildTimesheets = false;
      } else if (!this.isValid(this.tsRows[i].isBillable)) {
        this.toasterService.error('Mandatory field data is missing-BillType.');
        this.vaildTimesheets = false;
      } else if (!this.isValidSpentHours(this.tsRows[i].spenthours)) {
        this.toasterService.error('Invalid data - Timesheet daily hours should be between 0 to 24.');
        this.vaildTimesheets = false;
      } else if (!this.isValidNotes(this.tsRows[i].spenthours, this.tsRows[i].notes)) {
        this.toasterService.error('Mandatory field data is missing-Hours/notes.');
        this.vaildTimesheets = false;
      }
    }
  }

  isValid(fieldValue) {
    return fieldValue !== '' && fieldValue !== undefined && fieldValue !== null;
  }

  isProjectValid(projectId: string): boolean {
    return projectId in this.projectTasks;
  }

  isValidSpentHours(hours) {
    for (var i = 0; i < this.formattedDates.length; i++) {
      if (hours[this.formattedDates[i]] != undefined && hours[this.formattedDates[i]] !== '') {
        return true;
      }
    }
  }

  isValidNotes(hours, notes) {
    let isValidNote = true;
    for (let i = 0; i < this.formattedDates.length; i++) {
      if (
        (
          (hours[this.formattedDates[i]] === undefined || hours[this.formattedDates[i]] === '' || hours[this.formattedDates[i]] === null) &&
          (notes[this.formattedDates[i]] !== undefined && notes[this.formattedDates[i]] !== '' && notes[this.formattedDates[i]] !== null)
        ) ||
        (
          (notes[this.formattedDates[i]] === undefined || notes[this.formattedDates[i]] === '' || notes[this.formattedDates[i]] === null) &&
          (hours[this.formattedDates[i]] !== undefined && hours[this.formattedDates[i]] !== '' && hours[this.formattedDates[i]] !== null)
        )
      ) {
        isValidNote = false;
      }
    }
    return isValidNote;
  }

  submitTimeSheet() {
    this.validateTS();
    if (this.vaildTimesheets) {
      this.tsRows.pop();
      this.tsCapturedRows.timeSheetEntries = this.tsRows;

      $('#loadingEditSubmitModal').modal('show');
      this.pmoService.submitTimeSheet(this.tsCapturedRows, this.timesheetDetails.calId, this.timesheetDetails.orgId, this.timesheetDetails.employeeId).subscribe((response) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.success("Timesheet entry submitted successfully.");
        this.router.navigate(['/pmoTimeSheetEntry']);
      }, (errorResponse) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.error("Error Occurred while Submitting timesheet.");
      });
    }
  }

  checkTaskExist(index: any, columnName: any, oldValue: any) {
    let val = parseInt(oldValue);
    if (columnName == "taskId") {
      if(!isNaN(val)){
      this.getBillTypeByTask(index);
      // Disabling the day entries based on the task end date and task completion. 
      var weeksdate: any = new Date(this.weekstartDate.replace(/-/g, '\/'));
      var weekedate: any = new Date(this.weekendDate.replace(/-/g, '\/'));
      this.taskList[index].forEach(tskLst => {
        if (tskLst.isTaskCompleted == 1 && tskLst.taskId == this.tsRows[index].taskId) {
          var tskCmplDate: any = new Date(tskLst.lastUpdatedDate.replace(/-/g, '\/'));
          tskCmplDate.setDate(tskCmplDate.getDate() + 1);
          var tskComplIndex = Math.round((tskCmplDate - weeksdate) / (1000 * 60 * 60 * 24));
          for (var i = (tskComplIndex + 1); i <= 7; i++) {
            $('#day' + i + 'Note_' + index).attr("disabled", "disabled");
            var x = '#day' + i + 'Note_' + index;
            $(x + ':nth-child(2)').css("pointer-events", "none");
          }
          //	f = true;
        } else if (tskLst.taskId == this.tsRows[index].taskId && (this.weekstartDate <= tskLst.taskStartDate && tskLst.taskStartDate <= this.weekendDate)) {
          var tskStrtDate: any = new Date(tskLst.taskStartDate.replace(/-/g, '\/'));
          tskStrtDate.setDate(tskStrtDate.getDate() + 1);
          var tskStrtIndex = Math.round((tskStrtDate - weeksdate) / (1000 * 60 * 60 * 24));
          for (var i = (tskStrtIndex - 1); i >= 0; i--) {
           
            $('#day' + i + 'Note_' + index).attr("disabled", "disabled");
            var x = '#day' + i + 'Note_' + index;
            $(x + ':nth-child(2)').css("pointer-events", "none");
          }

          if ((this.weekstartDate <= tskLst.taskEndDate && tskLst.taskEndDate <= this.weekendDate)) {
            var tskEndDate: any = new Date(tskLst.taskEndDate.replace(/-/g, '\/'));
            tskEndDate.setDate(tskEndDate.getDate() + 1);
            var tskEndIndex = Math.round((tskEndDate - weeksdate) / (1000 * 60 * 60 * 24));
            for (var i = (tskEndIndex + 1); i <= 7; i++) {
              $('#day' + i + 'Note_' + index).attr("disabled", "disabled");
              var x = '#day' + i + 'Note_' + index;
              $(x + ':nth-child(2)').css("pointer-events", "none");
            }
          }
          //	f = true;
        } else if (tskLst.taskId == this.tsRows[index].taskId && (this.weekstartDate <= tskLst.taskEndDate && tskLst.taskEndDate <= this.weekendDate)) {
          var tskEndDate: any = new Date(tskLst.taskEndDate.replace(/-/g, '\/'));
          tskEndDate.setDate(tskEndDate.getDate() + 1);
          var tskEndIndex = Math.round((tskEndDate - weeksdate) / (1000 * 60 * 60 * 24));
          for (var i = (tskEndIndex + 1); i <= 7; i++) {
            $('#day' + i + 'Note_' + index).attr("disabled", "disabled");
            var x = '#day' + i + 'Note_' + index;
            $(x + ':nth-child(2)').css("pointer-events", "none");
          }

          if (this.weekstartDate <= tskLst.taskStartDate && tskLst.taskStartDate <= this.weekendDate) {
            var tskStrtDate: any = new Date(tskLst.taskStartDate.replace(/-/g, '\/'));
            tskStrtDate.setDate(tskStrtDate.getDate() + 1);
            var tskStrtIndex = Math.round((tskStrtDate - weeksdate) / (1000 * 60 * 60 * 24));
            for (var i = (tskStrtIndex - 1); i >= 0; i--) {
              $('#day' + i + 'Note_' + index).attr("disabled", "disabled");
              var x = '#day' + i + 'Note_' + index;
              $(x + ':nth-child(2)').css("pointer-events", "none");
            }
          }
          //f = true;
        }
      });
    }
     }
    for (var i = 0; i < this.tsRows.length - 1; i++) {
      if (i != index) {
        if (this.tsRows[index].projectId === this.tsRows[i].projectId && this.tsRows[index].taskId === this.tsRows[i].taskId &&
          this.tsRows[index].shiftId === this.tsRows[i].shiftId && this.tsRows[index].isBillable === this.tsRows[i].isBillable) {
          if (columnName === "projectId") {
            this.tsRows[index].projectId = val;
          }
          if (columnName === "taskId") {
            this.tsRows[index].taskId = val;
          }
          if (columnName === "shiftId") {
            this.tsRows[index].shiftId = val;
          }
          if (columnName === "billTypeId") {
            this.tsRows[index].isBillable = val;
          }
          this.toasterService.error("Project, Task, Shift, Billable Combination should be unique");
        }
      }
    }

  }

  note(event: any, index: any) {

    if (event.target.id === 'day1Note_' + index) {
      this.dayNoteId = 1;
      this.notes = this.tsRows[index].notes[this.formattedDates[0]];
    }
    if (event.target.id === 'day2Note_' + index) {
      this.dayNoteId = 2;
      this.notes = this.tsRows[index].notes[this.formattedDates[1]];
    }
    if (event.target.id === 'day3Note_' + index) {
      this.dayNoteId = 3;
      this.notes = this.tsRows[index].notes[this.formattedDates[2]];
    }
    if (event.target.id === 'day4Note_' + index) {
      this.dayNoteId = 4;
      this.notes = this.tsRows[index].notes[this.formattedDates[3]];
    }
    if (event.target.id === 'day5Note_' + index) {
      this.dayNoteId = 5;
      this.notes = this.tsRows[index].notes[this.formattedDates[4]];
    }
    if (event.target.id === 'day6Note_' + index) {
      this.dayNoteId = 6;
      this.notes = this.tsRows[index].notes[this.formattedDates[5]];
    }
    if (event.target.id === 'day7Note_' + index) {
      this.dayNoteId = 7;
      this.notes = this.tsRows[index].notes[this.formattedDates[6]];
    }
    var x = '#day' + this.dayNoteId + 'Note_' + index;
    if (this.tsRows[index].status != undefined) {
      if (this.tsRows[index].status[this.formattedDates[this.dayNoteId - 1]] == 'O' || this.tsRows[index].status[this.formattedDates[this.dayNoteId - 1]] == 'F' || this.tsRows[index].status[this.formattedDates[this.dayNoteId - 1]] == undefined) {
        if (this.tsRows[index].spenthours[this.formattedDates[this.dayNoteId - 1]] !== '' || this.tsRows[index].spenthours[this.formattedDates[this.dayNoteId - 1]] != undefined) {
          $('#day' + this.dayNoteId + 'Note_' + index).removeAttr("disabled", "disabled");
          $(x + ':nth-child(2)').css("pointer-events", "auto");
          this.leaveFlag = false;
        } else {
          $('#day' + this.dayNoteId + 'Note_' + index).attr("disabled", "disabled");
          $(x + ':nth-child(2)').css("pointer-events", "none");
          this.leaveFlag = true;
        }
      } else {
        if (this.tsRows[index].spenthours[this.formattedDates[this.dayNoteId - 1]] === '' || this.tsRows[index].spenthours[this.formattedDates[this.dayNoteId - 1]] == undefined) {
          $('#day' + this.dayNoteId + 'Note_' + index).removeAttr("disabled", "disabled");
          $(x + ':nth-child(2)').css("pointer-events", "auto");
          this.leaveFlag = false;
        } else {
          $('#day' + this.dayNoteId + 'Note_' + index).attr("disabled", "disabled");
          $(x + ':nth-child(2)').css("pointer-events", "none");
          this.leaveFlag = true;
        }
      }
    } else {
      this.leaveFlag = false;
    }

    this.tseIndex = index;
    $('#myModal').modal('show');
    $("#myModal").on('shown.bs.modal', function () {
      $(this).find('textarea').focus();
    });
  }
  // this.leaveFlag = false;

  submitNotes() {
    if (this.notes !== "" && this.notes !== undefined) {
      var notesData = this.notes;
      var strReplace = notesData.replace(/[\/\\#~'"]/g, ' ');
      this.notes = strReplace.trim();
      if(this.notes !== "" && this.notes !== undefined){
        $("#day" + this.dayNoteId + "Note_" + this.tseIndex).css("color", "#0069d9");
      }else{
        this.notes = undefined;
        $("#day" + this.dayNoteId + "Note_" + this.tseIndex).css("color", "#666");
      }
    }
    else
      $("#day" + this.dayNoteId + "Note_" + this.tseIndex).css("color", "#666");

    if (this.dayNoteId === 1) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[0]] = this.notes;
      this.notes = '';
    }
    if (this.dayNoteId === 2) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[1]] = this.notes;
      this.notes = '';
    }
    if (this.dayNoteId === 3) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[2]] = this.notes;
      this.notes = '';
    }
    if (this.dayNoteId === 4) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[3]] = this.notes;
      this.notes = '';
    }
    if (this.dayNoteId === 5) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[4]] = this.notes;
      this.notes = '';
    }
    if (this.dayNoteId === 6) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[5]] = this.notes;
      this.notes = '';
    }
    if (this.dayNoteId === 7) {
      this.tsRows[this.tseIndex].notes[this.formattedDates[6]] = this.notes;
      this.notes = '';
    }
  }

  previousPge() {
    this.router.navigate(['/pmoTimeSheetEntry']);
  }

}
