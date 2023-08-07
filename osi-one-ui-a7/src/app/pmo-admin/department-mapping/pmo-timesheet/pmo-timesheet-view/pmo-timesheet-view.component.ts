import { Component, OnInit } from '@angular/core';
import { PmoAdminService } from '../../../../shared/services/pmo-admin.service';
import { ToastrService } from 'ngx-toastr';
// import * as jsPDF from 'jspdf';
// import 'jspdf-autotable';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var $: any;
declare var jsPDF: any;

@Component({
  selector: 'app-pmo-timesheet-view',
  templateUrl: './pmo-timesheet-view.component.html',
  styleUrls: ['./pmo-timesheet-view.component.css']
})
export class PmoTimesheetViewComponent implements OnInit {
  taskTypes: any = [];
  billTypes: any = [];
  timesheetDetails: any;
  tsRejectComment: any;
  empViewDTO: any;
  employeeName: any;
  employeeId: any;
  weekStartDate: any;
  weekEndDate: any;
  totalHours: number;
  AuditInputDTO = { "calendarId": "", "employeeId": "", "employeeName": "", "weekStartDate": "", "weekEndDate": "" };
  waitingOn: any = [];
  weekStatus: any = '';
  base64: any;
  rejectTsComment: any;
  projectId: any;
  deleteIndex: any;
  showToaster: Boolean = false;

  constructor(
    private pmoService: PmoAdminService,
    private toasterService: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
    this.timesheetDetails = this.pmoService.getSelectedTimesheetDetails();
    var searchparam = this.pmoService.getFilterParamDetails();
    this.pmoService.setFilterParamDetails(searchparam);
  }

  ngOnInit() {
    console.log("TIMESHEET_DETAILS", this.timesheetDetails);
    this.employeeViewTs();

  }

  employeeViewTs() {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getLookupbyName('TASK_TYPE').subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.taskTypes = response.osiLookupValueses;
      this.taskTypes.forEach((item) => {
        this.billTypes[item.id] = item.lookupValue;
      });
      this.getApprovalTimesheets();
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get lookup details!');
    });
  }

  getApprovalTimesheets() {
    var projectResourceDTO = {
      "projectName": "",
      "noOfEmployees": "",
      "employeeList": [this.timesheetDetails.employeeId],
      "calendarId": this.timesheetDetails.calId,
      "weekStartDate": moment(this.timesheetDetails.weekStartDate).format('YYYY-MM-DD'),
      "periodEndDate": ""
    };
    this.weekStatus = this.timesheetDetails.status;

    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getApprovalTimesheets(projectResourceDTO).subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.tsRejectComment = response[0].approvalDTO[this.timesheetDetails.employeeId][0].comments;
      this.empViewDTO = response[0].approvalDTO[this.timesheetDetails.employeeId];
      this.employeeName = this.empViewDTO[0].employeeFullName;
      this.employeeId = this.empViewDTO[0].employeeId;
      this.weekStartDate = this.empViewDTO[0].weekStartDate;
      this.weekEndDate = this.empViewDTO[0].weekEndDate;
      this.totalHours = 0;

      this.empViewDTO.forEach((item) => {
        this.totalHours += item.hours;
          let totalHrsString: string = this.totalHours.toFixed(2);
          this.totalHours = parseFloat(totalHrsString);
        /*	var obj = $filter('filter')(this.taskTypes, function (d) {return d.id == value.isBillable;})[0];
          if(obj){
            value.isBillable = obj.lookupValue == "BILLABLE" ? 'Yes' : 'No'; // if Billable - Yes, for Non-Billable and Internal - No.
          } */
      });
      this.watingForApproval();
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Error Occured While Getting Project Resources!');
    });
  }

  deleteEntry() {

    this.pmoService.deleteTimesheetEntry(this.deleteIndex).subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      if (!this.showToaster) {
        this.showToaster = true;
        this.toasterService.success('Successfully Deleted timesheet record.');
      }
      this.getApprovalTimesheets();
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Error Occurred While Deleting timesheet record.');
    });
    // for (let i = 0; i < this.formattedDates.length; i++) {
    //   if (this.tsRows[this.deleteIndex].timeSheetId[this.formattedDates[i]] !== undefined) {
       
    //   }
    // }
  }

  deleteTimesheetEntry(tseIndex: any) {
    this.deleteIndex = tseIndex;
    $("#deleteNotification").modal("show");
  }


  rejectModalTimeSheetsByProject(projectId) {
    this.rejectTsComment = undefined;
    this.projectId = projectId;
    $('#pmoTimeSheetByProjectRejectModel').modal('show');
  }

  rejectTimeSheetByProject() {
    console.log('projectID', this.projectId);
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
      $('#loadingEditSubmitModal').modal('show');
      console.log('rejectTimeSheetByProject payload----', approvalTimeSheetDTO);
      this.pmoService.rejectTimeSheetByProject(approvalTimeSheetDTO).subscribe((result) => {
        $('#loadingEditSubmitModal').modal('hide');
        $('#pmoTimeSheetByProjectRejectModel').modal('hide');
        this.toasterService.success('Successfully Rejected timesheet.');
       // this.router.navigate(['/pmoTimeSheetEntry']);
      //  $('#pmoTimeSheetByProjectRejectModel').modal('hide');
      //  this.getUserWklyTimesheetEntry();
      this.getApprovalTimesheets();
      }, (errorResponse) => {
        $('#loadingEditSubmitModal').modal('hide');
        this.toasterService.error('Error occured while reject timesheet.');
      });
    }
  }

  watingForApproval() {
    this.AuditInputDTO.employeeId = this.employeeId;
    this.AuditInputDTO.weekStartDate = this.weekStartDate;
    this.AuditInputDTO.weekEndDate = this.weekEndDate;
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getTimeSheetForApproval(this.AuditInputDTO).subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.waitingOn = response;
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Error Occured While Getting Timesheet details!');
    });
  }

  showWaitingPopUp = function () {
    $('#waitingForApproval').modal({ backdrop: 'static', keyboard: false });
  }

  showHistory() {
    this.router.navigate(['/pmotimesheethistory']);
  }

  previousPge() {
    this.router.navigate(['/pmoTimeSheetEntry']);
  }

  exportToPDF() {
    this.getBase64Image('assets/images/osi_digital.png');
    // this.generatePDF();
  }

  getBase64Image(url: any) {
    this.http.get(url, { responseType: 'blob' })
      .subscribe(blob => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
          this.base64 = event.target.result;
          this.generatePDF();
        };
        reader.onerror = (event: any) => {
          this.toasterService.error(event.target.error.code)
        };

      });
  }

  // convertFileToDataURLviaFileReader(url, callback: (any) => void) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.onload = function () {
  //     var reader = new FileReader();
  //     reader.onloadend = function () {
  //       callback(reader.result);
  //     }
  //     reader.readAsDataURL(xhr.response);
  //   };
  //   xhr.open('GET', url);
  //   xhr.responseType = 'blob';
  //   xhr.send();
  // }

  getRowDataForPdf(dataObj) {
    let rowData = [];
    dataObj.forEach(x => {
      let rows = [];
      rows.push(x.spentDate);
      rows.push(x.projectName);
      rows.push(x.customerName);
      // rows.push(x.departmentName);
      rows.push(x.taskName);
      // rows.push(x.shiftName);
      // rows.push(this.billTypes[x.isBillable]);
      rows.push(x.notes);
      rows.push(x.hours);
      rowData.push(rows);
    });
    return rowData;
  }

  generatePDF() {
    const colNames = [{ header: 'Date', dataKey: 'Date' }, { header: 'Project', dataKey: 'Project' }, { header: 'Customer', dataKey: 'Customer' }, { header: 'Task', dataKey: 'Task' }, { header: 'Notes', dataKey: 'Notes' }, { header: 'Hours', dataKey: 'Hours' }];
    let billableData = this.empViewDTO.filter(x => this.billTypes[x.isBillable].toUpperCase() == "BILLABLE");
    let nonBillableData = this.empViewDTO.filter(x => this.billTypes[x.isBillable].toUpperCase() == "NON BILLABLE");
    let internalData = this.empViewDTO.filter(x => this.billTypes[x.isBillable].toUpperCase() == "INTERNAL");

    let billbleSubTotal = 0;
    let nonBillbleSubTotal = 0;
    let internalSubTotal = 0;

    billableData.forEach(x => {
      billbleSubTotal += Number(x.hours);
    });

    nonBillableData.forEach(x => {
      nonBillbleSubTotal += Number(x.hours);
    });

    internalData.forEach(x => {
      internalSubTotal += Number(x.hours);
    });

    let billableRowData = this.getRowDataForPdf(billableData);

    let nonBillableRowData = this.getRowDataForPdf(nonBillableData);

    let internalRowData = this.getRowDataForPdf(internalData);

    var pdf = new jsPDF('p', 'pt', 'a4');
    // pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
    var yCoordinate = 30;
    pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
    //   var res = pdf.autoTableHtmlToJson(document.getElementById("tsApprTbl"));
    var source = $('#empDetailsContainer')[0];
    pdf.addImage(this.base64, 'PNG', 45, yCoordinate, 190, 30);
    yCoordinate += 50;
    pdf.setLineWidth(1);
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    yCoordinate += 10;
    pdf.fromHTML('<b>Name:</b> ' + this.employeeName, 35, yCoordinate);
    yCoordinate += 20;
    pdf.fromHTML('<b>Week:</b> ' + this.weekStartDate + ' To ' + this.weekEndDate, 35, yCoordinate);
    yCoordinate += 20;
    pdf.fromHTML('<b>Total Week Hours:</b> ' + this.totalHours, 35, yCoordinate);
    yCoordinate += 20;
    pdf.fromHTML('<b>Status:</b> ' + (this.timesheetStauts(this.weekStatus)), 35, yCoordinate);
    yCoordinate += 25;

    let firstTable;
    let secondTable;
    let thirdTable;
    if (billableRowData.length != 0) {

      // pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      pdf.fromHTML('<b>Billable</b>', 35, yCoordinate);
      yCoordinate += 25;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 5;
      pdf.autoTable(colNames, billableRowData, {
        startY: yCoordinate,
        startX: 35,
        styles: {
          overflow: 'linebreak',
          fontSize: 10,
          verticalCellPadding: 15,
          halign: 'left'
          //cellWidth: 'auto'
        },
        columnStyles: {
          0: { cellWidth: 65 },
          1: { cellWidth: 108 },
          2: { cellWidth: 100 },
          3: { cellWidth: 88 },
          4: { cellWidth: 100 },
          5: { cellWidth: 50 }
        },
        didDrawPage: function (data) {
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
        }
      });
      firstTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
      if (firstTable) {
        pdf.setLineWidth(1);
        pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
        yCoordinate = firstTable.finalY + 5; //changing the y coordinate to end of table if present
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
        pdf.fromHTML('<b>Sub-Total:</b> ' + billbleSubTotal, pdf.internal.pageSize.getWidth() - 153, yCoordinate);
        yCoordinate += 25;
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
        yCoordinate += 20;
      }
    }



    if (nonBillableRowData.length != 0) {
      // pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      pdf.fromHTML('<b>Non-Billable</b>', 35, yCoordinate);
      yCoordinate += 25;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 5;
      pdf.autoTable(colNames, nonBillableRowData, {
        startY: yCoordinate,
        styles: {
          overflow: 'linebreak',
          fontSize: 10,
          verticalCellPadding: 15,
          halign: 'left'
          //cellWidth: 'auto'
        },
        columnStyles: {
          0: { cellWidth: 65 },
          1: { cellWidth: 108 },
          2: { cellWidth: 100 },
          3: { cellWidth: 88 },
          4: { cellWidth: 100 },
          5: { cellWidth: 50 }
        },
        didDrawPage: function (data) {
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
        },
      });
      secondTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
      if (secondTable) {
        pdf.setLineWidth(1);
        pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
        yCoordinate = secondTable.finalY + 5; //changing the y coordinate to end of table if present
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
        pdf.fromHTML('<b>Sub-Total:</b> ' + nonBillbleSubTotal, pdf.internal.pageSize.getWidth() - 153, yCoordinate);
        yCoordinate += 25;
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
        yCoordinate += 20;
      }
    }



    if (internalRowData.length != 0) {
      // pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      pdf.fromHTML('<b>Internal</b>', 35, yCoordinate);
      yCoordinate += 25;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 5;
      pdf.autoTable(colNames, internalRowData, {
        startY: yCoordinate,
        styles: {
          overflow: 'linebreak',
          fontSize: 10,
          verticalCellPadding: 15,
          halign: 'left'
          //cellWidth: 'auto'
        },
        columnStyles: {
          0: { cellWidth: 65 },
          1: { cellWidth: 108 },
          2: { cellWidth: 100 },
          3: { cellWidth: 88 },
          4: { cellWidth: 100 },
          5: { cellWidth: 50 }
        },
        didDrawPage: function (data) {
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
        },
      });
      thirdTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
      if (thirdTable) {
        pdf.setLineWidth(1);
        pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
        yCoordinate = thirdTable.finalY + 5; //changing the y coordinate to end of table if present
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
        pdf.fromHTML('<b>Sub-Total:</b> ' + internalSubTotal, pdf.internal.pageSize.getWidth() - 153, yCoordinate);
        yCoordinate += 25;
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
        yCoordinate += 20;
      }
    }

    pdf.setDrawColor(0, 0, 0);
    pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
    pdf.setDrawColor(128, 128, 128);
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.fromHTML('<b>Total Hours:</b> ' + this.totalHours, pdf.internal.pageSize.getWidth() - 163, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.save("TS_" + this.employeeName + "_" + this.weekStartDate + "_" + this.weekEndDate + ".pdf");
  }

  timesheetStauts(status) {
    let x = status;

    if (x == 'S')
      return 'Submitted';
    else if (x == 'O')
      return 'Approved';
    else if (x == 'R')
      return 'Rejected';
    else if (x == 'N')
      return 'Saved';
    else if (x == 'V')
      return 'Over Due';
    else if (x == 'U')
      return 'Adjusted';
    else if (x == 'I')
      return 'Invoiced';
    else if (x == 'G')
      return 'Charged';
    else if (x == 'F')
      return 'FIXED';

    /*	As per disucussion everything else showing as approved
      else if(x == 'I')
        return 'Invoiced';
      else if(x == 'G')
        return 'Charged';  */

  }

}
