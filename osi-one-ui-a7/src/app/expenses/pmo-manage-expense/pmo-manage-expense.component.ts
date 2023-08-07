import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NavigateDataService } from './../../shared/services/navigateData.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CreateExpenseService } from '../../shared/services/createexpense.service';
import { EditExpensesService } from '../../shared/services/editexpense.service';
import { Expense } from '../../shared/utilities/expense.model';
import { saveAs } from 'file-saver/FileSaver';
import { UploadFile } from '../../shared/utilities/uploadfile';
import { AppConstants } from '../../shared/app-constants';
import { Flash } from '../../shared/utilities/flash';
import 'jspdf';
import 'jspdf-autotable';
import { ExpenseAttachmentComponent } from '../expense-attachment/expense-attachment.component';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
declare let jsPDF;

declare var $: any;

export enum StatusValues {
  Approved = "O",
  Rejected = "R",
  Submitted = "S",
  Open = "N",
  Charged = "G",
  Invoiced = "I",
  Reversed = "U",
  Reimbursed = "P"
}

export enum StatusCodes {
  O = "Approved",
  R = "Rejected",
  S = "Submitted",
  N = "Open",
  G = "Charged",
  I = "Invoiced",
  U = "Reversed",
  P = "Reimbursed"
}

@Component({
  selector: 'app-pmo-manage-expense',
  templateUrl: './pmo-manage-expense.component.html',
  styleUrls: ['./pmo-manage-expense.component.css']
})
export class PmoManageExpenseComponent implements OnInit, AfterViewInit {

  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  @ViewChild('AlertPopupError') alertPopupError: ElementRef;
  @ViewChild('DatePickContainer') datePickContainer;
  @ViewChild('DatePickContainer2') datePickContainer2;
  @ViewChild('DatePickContainer5') datePickContainer5;
  @ViewChild('EditAttachFileInput') editAttachFileInput;
  @ViewChild(ExpenseAttachmentComponent) expenseAttachmentComponent;
  invalidFileError = false;

  allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword", "image/png", "image/jpeg", "image/bmp", "image/gif", "image/tiff"];

  public errorMessage: string;
  public projectsData: Array<any> = [];
  public tasksData: Array<any> = [];
  public expenseTypesData: Array<any> = [];
  public currencyListData: Array<any> = [];
  public user: any = {};
  private downloadFiles: any;
  public fieldArray: Array<any> = [];

  rowDeleteStatus: string;
  selectedRowId: Number = 0;
  editExpense: Expense;
  public reportid: any;
  public status: any;
  expenseStartDateField: { "year": number, "month": number, "day": number };
  expenseSelectedDateField: { "year": number, "month": number, "day": number };
  expenseSelectedMinDateField: { "year": number, "month": number, "day": number };
  expenseSelectedMaxDateField: { "year": number, "month": number, "day": number };
  qbExpenseDate: { "year": number, "month": number, "day": number };
  expenseMileageCheckDate: any;
  usEmployeesMileageExpensePrice: any;
  inValidFields: any;
  validationError: any;
  selectedQuantity: Number;
  selectedReceiptPrice: Number;
  selectedReceiptCurrency: string;
  selectedExpenseDate: string;
  selectedProjectId: Number;
  currencyExchangeDetails: any;
  minMaxDatesDetails: any;
  expenses: any;
  addExpense: Expense;
  flash: Flash = new Flash();
  isTrascError: boolean = false;
  showRejectedField: boolean = false;
  maxFileSize5MB = 5242880;
  selectedFile: File = null;
  p: number;
  oldExpenseRow = [];
  currentRepId: any;
  currentRepStatus: any;
  invalidFileText: String;
  weekdate: String;
  employeeId;
  employeeFullName;
  employeeNumber;
  employeeDepartment;
  employeeLevel;
  exportLayoutType = "l";
  expenseStartDate;

  expenseEndDate;
  isModificationAllowed = true;
  public AuditInputDTO: any = {};
  waitingOn = [];
  routeParamStatus;
  parentReportId = 0;
  rejectionReason: String;
  totalAmount: number = 0;
  isUploading: Boolean = false;
  itemsPerPageList = [5, 10, 20, 50, 100];
  currentPageItemCount = 5;
  pageCount = 5;
  showEditIcon: boolean;
  qbReport: boolean;
  expenseWeekStartDate: any;
  expenseWeekEndDate: any;
  modalId: String;
  orgCodeMileage: any;
  getMileageRate: any;

  isSelectedExpensesDeletable: Boolean = false;
  isAllChecked: Boolean = false;
  private statusCodes = StatusCodes;
  //datePickContainer5: any;
  public isInternalProject: boolean = false;
  public internalProjectsList: any = ['940', '950', '965', '967', '972', '2514'];

  constructor(
    private toasterService: ToastrService,
    private route: ActivatedRoute, private router: Router, private _editExpensesService: EditExpensesService,
    private _createExpenseService: CreateExpenseService, private _navigateDataService: NavigateDataService,
    private cdRef: ChangeDetectorRef) {
    this.addExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, false, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
    this.editExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, false, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
  }

  ngOnInit() {
    this.getCurrenciesData();

    this.reportid = this.route.params['_value'].reportid;
    this.status = this.route.params['_value'].status;
    this.routeParamStatus = this.route.params['_value'].status;
    let searchedUser = this._navigateDataService.reportEmployeeId;

    if (this.status == "Reimbursed" || this.status == "Open") {
      this.isModificationAllowed = false;
    }

    this._navigateDataService.currentReportId.subscribe(repId => this.currentRepId = repId);
    this._navigateDataService.currentReportStatus.subscribe(repStatus => this.currentRepStatus = repStatus);

    if (this.status == "Reimbursed") { // Hitting a separate service to get reimbursed expense details
      this._editExpensesService.getAllReimbursedExpenses(this.reportid, this.status).subscribe(response => {
        this.expenses = response;
        if (this.expenses.status === 'O') {
          this.qbReport = true;
        }
        else {
          this.qbReport = false;
        }

        this.fieldArray = this.expenses.field;
        this.totalAmount = 0;
        if (this.fieldArray != undefined || this.fieldArray != null) {
          this.fieldArray.forEach(x => {
            this.totalAmount += Number(x.baseExchangeAmt.split(" ")[1]);
          });
        }
        this.parentReportId = response.parentId;
        if (response.expenseStartDate.length != null) {
          var date: string[] = response.expenseStartDate.split('-');
          this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
          this.getExpenseEndDateField();
        }
        this.user.description = response.description;
        if (response.status === 'R')
          this.showRejectedField = true;
        else
          this.showRejectedField = false;

        this.expenseStartDate = response.expenseStartDate;
        this.expenseEndDate = response.expenseEndDate;

        if (this.expenses.qbExpenseDate == undefined) {
          this.qbExpenseDate = this.expenseStartDate;
        }
        else {
          this.qbExpenseDate = this.expenses.qbExpenseDate;
        }
        this._createExpenseService.getEmployeeDetails(this.expenses.field[0].employeeId).subscribe(data => {
          this.employeeFullName = data.fullName;
          this.employeeNumber = data.employeeNumber;
          this.employeeDepartment = data.departmentName;
          this.employeeLevel = data.gradeName;
          this.employeeId = data.employeeId;
        },
          error => this.errorMessage = <any>error);
      });
    } else if (this.status == "Approved" || this.status == "Rejected") { // Service to get non reimbursed expenses
      this._editExpensesService.getAllNonReimbursedExpensesForReportId(this.reportid).subscribe(response => {
        this.expenses = response;
        this.orgCodeMileage = response.orgCode;
        if (this.expenses.status === 'O') {
          this.qbReport = true;
        }
        else {
          this.qbReport = false;
        }
        this.fieldArray = this.expenses.field;
        this.totalAmount = 0;
        if (this.fieldArray != undefined || this.fieldArray != null) {
          this.fieldArray.forEach(x => {
            this.totalAmount += Number(x.baseExchangeAmt.split(" ")[1]);
          });
        }
        this.expenses.field.forEach(x => {
          if (x.status == "R") {
            this.rejectionReason = x.reasonForReject
          }
        });

        this.parentReportId = response.parentId;
        if (response.expenseStartDate.length != null) {
          var date: string[] = response.expenseStartDate.split('-');
          this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
          this.getExpenseEndDateField();
        }
        this.user.description = response.description;
        if (response.status === 'R')
          this.showRejectedField = true;
        else
          this.showRejectedField = false;

        this.expenseStartDate = response.expenseStartDate;
        this.expenseEndDate = response.expenseEndDate;
        if (this.expenses.qbExpenseDate == undefined) {
          this.qbExpenseDate = this.expenseStartDate;
        }
        else {
          this.qbExpenseDate = this.expenses.qbExpenseDate;
        }

        this._createExpenseService.getEmployeeDetails(this.expenses.employeeId).subscribe(data => {
          this.employeeFullName = data.fullName;
          this.employeeNumber = data.employeeNumber;
          this.employeeDepartment = data.departmentName;
          this.employeeLevel = data.gradeName;
          this.employeeId = data.employeeId;
        });
      },
        error => this.errorMessage = <any>error);

    } else {
      this._editExpensesService.getAllExpensesForPmoReportId(this.reportid, this.status, searchedUser).subscribe(response => {
        this.expenses = response;
        if (this.expenses.status === 'O') {
          this.qbReport = true;
        }
        else {
          this.qbReport = false;
        }
        this.fieldArray = this.expenses.field;
        this.totalAmount = 0;
        if (this.fieldArray != undefined || this.fieldArray != null) {
          this.fieldArray.forEach(x => {
            this.totalAmount += Number(x.baseExchangeAmt.split(" ")[1]);
          });
        }
        this.parentReportId = response.parentId;
        if (response.expenseStartDate.length != null) {
          var date: string[] = response.expenseStartDate.split('-');
          this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
          this.getExpenseEndDateField();
        }
        this.user.description = response.description;
        if (response.status === 'R')
          this.showRejectedField = true;
        else
          this.showRejectedField = false;

        this.expenseStartDate = response.expenseStartDate;
        this.expenseEndDate = response.expenseEndDate;

        this._createExpenseService.getEmployeeDetails(this.expenses.employeeId).subscribe(data => {
          this.employeeFullName = data.fullName;
          this.employeeNumber = data.employeeNumber;
          this.employeeDepartment = data.departmentName;
          this.employeeLevel = data.gradeName;
          this.employeeId = data.employeeId;
        });
      },
        error => this.errorMessage = <any>error);
    }


    this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
    this.inValidFields = ["exstartdate", "addProjectId", "addProjectTask", "addExpenseDate", "addExpenseTypeId", "addQuantity", "addReceiptPrice", "addCurrencyCode"];
    this.validationError = {
      exstartdate: false, addProjectId: false, addProjectTask: false, addExpenseDate: false, addExpenseTypeId: false, addQuantity: false,
      addReceiptPrice: false, addCurrencyCode: false
    };

    // this.getExpenseAttachments();
  }

  /**
   * Method to get fresh data after executing an update
   */
  getUpdatedExpenseData() {
    this._editExpensesService.getAllExpensesForPmoReportId(this.reportid, this.status, this.employeeId).subscribe(response => {
      this.expenses = response;
      if (this.expenses.status === 'O') {
        this.qbReport = true;
      }
      else {
        this.qbReport = false;
      }
      this.totalAmount = 0;
      this.fieldArray = this.expenses.field;
      if (this.fieldArray != undefined || this.fieldArray != null) {
        this.fieldArray.forEach(x => {
          this.totalAmount += Number(x.baseExchangeAmt.split(" ")[1]);
        });
      }
      this.parentReportId = response.parentId;
      $('#loadingEditSubmitModal').modal('hide');
      this.isTrascError = true;
      this.flash.message = 'Expense Report Updated Successfully';
      this.flash.type = 'success';
      this.alertSuccess.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.isTrascError = false;
        ref.alertSuccess.nativeElement.classList.remove("show");
      }, 3000);

      if (response.expenseStartDate.length != null) {
        var date: string[] = response.expenseStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      }
      this.user.description = response.description;
      if (response.status === 'R')
        this.showRejectedField = true;
      else
        this.showRejectedField = false;

      this.cdRef.detectChanges();
    },
      error => this.errorMessage = <any>error);

    this.getExpenseAttachments();
  }

  getUpdatedApprovedExpenses() {
    this._editExpensesService.getAllNonReimbursedExpensesForReportId(this.reportid).subscribe(response => {
      this.expenses = response;
      this.orgCodeMileage = response.orgCode;
      if (this.expenses.status === 'O') {
        this.qbReport = true;
      }
      else {
        this.qbReport = false;
      }
      this.totalAmount = 0;
      this.fieldArray = this.expenses.field;
      if (this.fieldArray != undefined || this.fieldArray != null) {
        this.fieldArray.forEach(x => {
          this.totalAmount += Number(x.baseExchangeAmt.split(" ")[1]);
        });
      }
      this.parentReportId = response.parentId;
      $('#loadingEditSubmitModal').modal('hide');
      this.isTrascError = true;
      this.flash.message = 'Expense Report Updated Successfully';
      this.flash.type = 'success';
      this.alertSuccess.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.isTrascError = false;
        ref.alertSuccess.nativeElement.classList.remove("show");
      }, 3000);

      if (response.expenseStartDate.length != null) {
        var date: string[] = response.expenseStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      }
      this.user.description = response.description;
      if (response.status === 'R')
        this.showRejectedField = true;
      else
        this.showRejectedField = false;

      this.cdRef.detectChanges();
    },
      error => this.errorMessage = <any>error);

    this.getExpenseAttachments();
  }

  ngAfterViewInit(): void {
    this.getExpenseAttachments();
  }

  /**
   *  Method to get Expense Attachments associated with the expense report
   * */
  getExpenseAttachments() {
    this._editExpensesService.getExpenseAttachmentsByReport(this.reportid).subscribe(response => {
      this.expenseAttachmentComponent.setReportId(this.reportid);
      this.expenseAttachmentComponent.setAttachments(response);
      if (this.status == "Reimbursed" || this.status == "Open") {
        this.expenseAttachmentComponent.setHideDelete(true);
      }
    })
  }

  openModal(id: string) {
    this.modalId = id;
    this.invalidFileError = false;
    var startDt = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this._createExpenseService.getMinMaxDatesByStartDt(startDt).subscribe(response => {
      this.minMaxDatesDetails = response;
      this.expenseWeekStartDate = response.reportMinDate;
      this.expenseWeekEndDate = response.reportMaxDate;
      var startDtString: string[] = this.minMaxDatesDetails.reportMinDate.split('-');
      this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };

      var endDtString: string[] = this.minMaxDatesDetails.reportMaxDate.split('-');
      this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
    },
      error => this.errorMessage = <any>error);
    this.getProjectsData();
    if (id == 'add_expense') {
      this.addExpense.baseExchangeAmt = "";

      this.addExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, true, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
      this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
    } else if (id == 'edit_expense') {

      this.oldExpenseRow = [];
      this.editExpense = this.expenses.field.find(x => x.id == this.selectedRowId);

      if (this.editExpense.status == "G" || this.editExpense.status == "I" || this.editExpense.status == "U") {
        this.errorMessage = "Cannot perform operation on charged expense";
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
        }, 1500);
      } else {
        for (let i = 0; i < this.editExpense.expenseAttachments.length; i++) {
          this.oldExpenseRow.push(this.editExpense.expenseAttachments[i]);
        }
        this.onSelectProject(this.editExpense.projectId);
        var date: string[] = this.editExpense.expenseDate.split('-');
        this.expenseSelectedDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
        this.populateExchangeDetailsOnEdit(this.editExpense);
        $('#edit_expense').modal('show');
      }
    }
  }


  editExpenseClose() {
    this.editExpense.expenseAttachments = [];
    this.oldExpenseRow.forEach(x => {
      if (x.attachmentId) {
        x.isDeleted = false;
      }
    });
    for (let i = 0; i < this.oldExpenseRow.length; i++) {
      this.editExpense.expenseAttachments.push(this.oldExpenseRow[i]);
    }
  }

  onEditChecked(event) {
    if (event.target.checked) {
      this.selectedRowId = event.target.value;
    } else {
      let count = 0;
      this.expenses.field.forEach(x => {
        if (x.selected) {
          count++;
        }
      });
      if (count == 0) {
        this.selectedRowId = 0;
      } else if (count == 1) {
        this.expenses.field.forEach(x => {
          if (x.selected) {
            this.selectedRowId = x.id;
          }
        });
      }
    }

    // to check the SelectAll option when all the expenses are selected
    if (this.expenses && this.expenses.field) {
      this.isAllChecked = this.expenses.field.every(_ => _.selected);
    }

    // to check whether expenses are deletable are not
    this.checkForDeletableExpenses();
  }

  checkForDeletableExpenses(): void {
    let deletableExpenses;
    if (this.expenses && this.expenses.field) {
      deletableExpenses = this.expenses.field.filter(field => field.selected == true);

      this.isSelectedExpensesDeletable = deletableExpenses.length > 0; // if there are selected expenses, enable delete button
      deletableExpenses = deletableExpenses.filter(field => field.status == 'G' || field.status == 'I' || field.status == 'U');

      if (deletableExpenses.length > 0) { // if there are Charged or Invoiced or Reversed expenses in the selected, disable delete button
        this.isSelectedExpensesDeletable = false;
      }
    }
  }

  getProjectsData(): void {
    this.weekdate = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this._editExpensesService.getProjectsDataByEmployeeId(this.weekdate, this.employeeId).subscribe(projects => {
      this.projectsData = projects;
    },
      error => this.errorMessage = <any>error);
  }

  onSelectProject(event): void {

    this._editExpensesService.getTasksData(event, this.employeeId, this.expenseWeekStartDate, this.expenseWeekEndDate).subscribe(tasks => {
      this.tasksData = tasks;
      if (this.modalId == 'edit_expense') {
        var object = this.tasksData.find(x => x.projectTaskId == this.editExpense.projectTaskId);
        if (object.earliestDate != null) {
          if (object.earliestDate <= this.minMaxDatesDetails.reportMaxDate &&
            object.earliestDate >= this.minMaxDatesDetails.reportMinDate) {
            var endDtString: string[] = object.earliestDate.split('-');
            this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
          }
        }
        if (object.taskResStartDate >= this.minMaxDatesDetails.reportMinDate &&
          object.taskResStartDate <= this.minMaxDatesDetails.reportMaxDate) {
          var startDtString: string[] = object.taskResStartDate.split('-');
          this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };
        }
      }
      if (this.tasksData.length > 0 && this.tasksData[0].isInternal) {
        this.addExpense.billable = false;
        this.isInternalProject = true;
      } else {
        this.isInternalProject = false;
      }
    },
      error => this.errorMessage = <any>error);
    this.getExpensesTypes(event);
  }

  onChangeProject(event): void {
    this.editExpense.projectTaskId = null;
    this._editExpensesService.getTasksData(event, this.employeeId, this.expenseWeekStartDate, this.expenseWeekEndDate).subscribe(tasks => {
      this.tasksData = tasks;
    },
      error => this.errorMessage = <any>error);
  }

  getExpensesTypes(projectId): void {
    this._editExpensesService.getExpensesTypes(projectId, this.employeeId).subscribe(expensestypes => {
      this.expenseTypesData = expensestypes;
    },
      error => this.errorMessage = <any>error);
  }

  getCurrenciesData(): void {
    this._createExpenseService.getCurrenciesData().subscribe(currencies => {
      this.currencyListData = currencies;
    },
      error => this.errorMessage = <any>error);
  }

  onSelect(event) {
    let isMileage = false;
    this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
    var endDtString: string[] = this.minMaxDatesDetails.reportMaxDate.split('-');
    this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
    var startDtString: string[] = this.minMaxDatesDetails.reportMinDate.split('-');
    this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };
    var object = this.tasksData.find(x => x.projectTaskId == event);
    if (object.earliestDate != null) {
      if (object.earliestDate <= this.minMaxDatesDetails.reportMaxDate &&
        object.earliestDate >= this.minMaxDatesDetails.reportMinDate) {
        var endDtString: string[] = object.earliestDate.split('-');
        this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
      }
    }
    if (object.taskResStartDate >= this.minMaxDatesDetails.reportMinDate &&
      object.taskResStartDate <= this.minMaxDatesDetails.reportMaxDate) {
      var startDtString: string[] = object.taskResStartDate.split('-');
      this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };
    }
    for (let i = 0; i < this.expenseTypesData.length; i++) {
      if (!isMileage && this.expenseTypesData[i].expenseTypeId == event && this.expenseTypesData[i].expenseTypeName == 'Mileage') {
        if (localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS')
          this.addExpense.receiptPrice = String(AppConstants.usMileageExpensePrice);
        else
          this.addExpense.receiptPrice = String(0);
        isMileage = true;
      }
    }
  }

  onSelectExpenseType(event) {
    let isMileage = false;
    // this.expenseMileageCheckDate = moment(this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day).format('YYYY-MM-DD');
    // this.usEmployeesMileageExpensePrice = (this.expenseMileageCheckDate >= AppConstants.usMileageExpensePrice_wef) ? AppConstants.usMileageExpensePrice : AppConstants.usMileageExpensePrice_old;
    for (let i = 0; i < this.expenseTypesData.length; i++) {
      if (this.expenseTypesData[i].expenseTypeId == event) {
        this.addExpense.expenseTypeName = this.expenseTypesData[i].expenseTypeName;
      }
      if (!isMileage && this.expenseTypesData[i].expenseTypeId == event && this.expenseTypesData[i].expenseTypeName == 'Mileage') {
        if (this.orgCodeMileage == 'OSIUS') {
          const ExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
          // this.addExpense.receiptPrice = String(this.usEmployeesMileageExpensePrice);
          if (this.expenseSelectedDateField.year != 0 && this.expenseSelectedDateField.month != 0 && this.expenseSelectedDateField.day != 0) {
            this._createExpenseService.getMileageRate(this.expenses.orgId, ExpenseDate, parseInt(event)).subscribe(response => {
              if (response.message == null) {
                this.getMileageRate = 0;
              } else {
                this.getMileageRate = response.message;
                this.addExpense.receiptPrice = String(this.getMileageRate);
                this.editExpense.receiptPrice = String(this.getMileageRate);
              }
            });
          } else {
            // this.addExpenseForm.controls['expenseTypeId'].reset();
            this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
            this.toasterService.error("Please Select Expense Date");

          }
        }
        else {
          this.addExpense.receiptPrice = String(0);
        }
        isMileage = true;
      }
    }
  }

  onSelectEdit(event) {
    let isMileage = false;
    this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
    var endDtString: string[] = this.minMaxDatesDetails.reportMaxDate.split('-');
    this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
    var startDtString: string[] = this.minMaxDatesDetails.reportMinDate.split('-');
    this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };
    var object = this.tasksData.find(x => x.projectTaskId == event);
    if (object.earliestDate != null) {
      if (object.earliestDate <= this.minMaxDatesDetails.reportMaxDate &&
        object.earliestDate >= this.minMaxDatesDetails.reportMinDate) {
        var endDtString: string[] = object.earliestDate.split('-');
        this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
      }
    }
    if (object.taskResStartDate >= this.minMaxDatesDetails.reportMinDate &&
      object.taskResStartDate <= this.minMaxDatesDetails.reportMaxDate) {
      var startDtString: string[] = object.taskResStartDate.split('-');
      this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };
    }
    for (let i = 0; i < this.expenseTypesData.length; i++) {
      if (!isMileage && this.expenseTypesData[i].expenseTypeId == event && this.expenseTypesData[i].expenseTypeName == 'Mileage') {
        if (localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS')
          this.editExpense.receiptPrice = String(AppConstants.usMileageExpensePrice);
        else
          this.editExpense.receiptPrice = String(0);
        isMileage = true;
      }
    }
  }


  checkAll(event) {
    if (this.expenses.field.length == 1) {
      this.selectedRowId = this.expenses.field[0].id;
    }
    this.expenses.field.forEach(x => x.selected = event.target.checked)
    // to check whether expenses are deletable are not
    this.checkForDeletableExpenses();
  }

  checkMultiSelect() {
    let count = 0;
    if (this.expenses.field) {
      this.expenses.field.forEach(x => {
        if (x.selected) {
          count++;
        }
      });
      if (count == 0) {
        this.selectedRowId = 0;
      }
      if (count > 1) {
        this.selectedRowId = 0;
        return true;
      }
      else {
        return false;
      }
    }
  }

  populateExchangeDetailsOnEdit(selectedExpense) {
    this.selectedQuantity = +(selectedExpense.quantity);
    this.selectedReceiptPrice = +(selectedExpense.receiptPrice);
    this.selectedReceiptCurrency = selectedExpense.currencyCode;
    this.selectedProjectId = +(selectedExpense.projectId);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;

    this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);

  }

  populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId) {
    this._editExpensesService.populatePmoCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId, this.employeeId)
      .subscribe(currExchangeDetails => {
        this.currencyExchangeDetails = currExchangeDetails;

        this.editExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
        this.editExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + "  " + this.currencyExchangeDetails.exchangeRatePattern;
        this.editExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
      },
        error => this.errorMessage = <any>error);
  }

  populateCurrencyExchangeDetailsAddExpense(receiptCurrCode, qty, receiptPrice, expenseDate, projectId) {
    this._editExpensesService.populatePmoCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId, this.employeeId)
      .subscribe(currExchangeDetails => {
        this.currencyExchangeDetails = currExchangeDetails;

        this.addExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
        this.addExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + "  " + this.currencyExchangeDetails.exchangeRatePattern;
        this.addExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
      },
        error => this.errorMessage = <any>error);
  }

  validateField(field, value) {
    if (!value || value === '-- Select --' || value === -1 || value === '') {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
  }

  validateDate(field, date: { "year": number, "month": number, "day": number }) {
    if (!date.year) {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
    if ((this.editExpense.expenseTypeId != "" || this.addExpense.expenseTypeId != "") && this.orgCodeMileage == 'OSIUS') {
      // for (let i = 0; i < this.expenseTypesData.length; i++){this.expenses
      if (this.editExpense.expenseTypeName == 'Mileage' || this.addExpense.expenseTypeName == 'Mileage') {
        let expenseDate = moment(this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day).format('YYYY-MM-DD');
        // this.expenseMileageCheckDate = moment(this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day).format('YYYY-MM-DD');
        // this.usEmployeesMileageExpensePrice = (this.expenseMileageCheckDate < AppConstants.usMileageExpensePrice_wef) ? AppConstants.usMileageExpensePrice_old : AppConstants.usMileageExpensePrice;
        let expTypeId = this.addExpense.expenseTypeId ? this.addExpense.expenseTypeId : this.editExpense.expenseTypeId;
        this._createExpenseService.getMileageRate(this.expenses.orgId, expenseDate, expTypeId).subscribe(response => {
          if (response.message == null) {
            this.getMileageRate = 0;
          } else {
            this.getMileageRate = response.message;
            this.addExpense.receiptPrice = String(this.getMileageRate);
            this.editExpense.receiptPrice = String(this.getMileageRate);
          }
        });

      }
      /* As it is PMO Expenses the submitted receipt price is not modified */
      // else {
      //   this.addExpense.receiptPrice = String(0);
      //   this.editExpense.receiptPrice = String(0);
      // }
      // }
    }
  }

  validateNotBeforeToday(field, date: { "year": number, "month": number, "day": number }) {
    var now = new Date();//this gets the current date and time
    if (date.year == now.getFullYear() && date.month == (now.getMonth() + 1) && date.day > now.getDate()) {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else if (date.year >= now.getFullYear() && date.month > (now.getMonth() + 1)) {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else if (date.year > now.getFullYear()) {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
  }

  deleteExpenseRow() {
    let isUnallowedExpensePresent = false;
    for (let element of this.expenses.field) {
      if (element.selected) {
        if (element.status == "G" || element.status == "I" || element.status == "U") {
          isUnallowedExpensePresent = true;
          break;
        }
      }
    };
    if (isUnallowedExpensePresent) {
      this.errorMessage = "Cannot perform operation on charged expense";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
    } else {
      $('#delete_expense').modal('show');
    }
  }
  /**
   * Method to delete one or more selected expenses
   */
  onSelectedRowDelete(): void {
    $('#loadingEditSubmitModal').modal('show');
    this.user.field = [];
    this.user.field = this.expenses.field.filter(field => field.selected == true);
    this.user.exstartdate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.user.expenseReportId = this.reportid;
    this.user.status = StatusValues[this.routeParamStatus];
    if (this.expenses.field.length >= 1) {
      this._editExpensesService.pmoRemoveExpenseLine(this.user).subscribe(response => {
        this.rowDeleteStatus = JSON.stringify(response);
        if (this.rowDeleteStatus === 'true') {

          this.isTrascError = true;
          this.flash.message = 'Expense Deleted. Report Status Changed';
          this.flash.type = 'success';
          this.alertSuccess.nativeElement.classList.add("show");
          let ref = this;
          if (this.status == "Approved" || this.status == "Rejected") {
            this.getUpdatedApprovedExpenses()
          } else {
            this.getUpdatedExpenseData();
          }
          setTimeout(() => {
            ref.isTrascError = false;
            ref.alertSuccess.nativeElement.classList.remove("show");
            // this.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });

          }, 1500);

          // let rejectedRecordCount = 0;
          // this.user.field.forEach(element => {
          //   if (!element.selected && element.status == "R") {
          //     rejectedRecordCount++;
          //   }
          // });

          // if (this.user.status == "R" && rejectedRecordCount == 0) {
          //   $('#loadingEditSubmitModal').modal('hide');
          //   this.isTrascError = true;
          //   this.flash.message = 'Expense Deleted. Report Status Changed';
          //   this.flash.type = 'success';
          //   this.alertSuccess.nativeElement.classList.add("show");
          //   let ref = this;
          //   setTimeout(() => {
          //     ref.isTrascError = false;
          //     ref.alertSuccess.nativeElement.classList.remove("show");
          //     this.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });

          //   }, 1500);
          // } else {
          //   if (this.status == "Approved" || this.status == "Rejected") {
          //     this.getUpdatedApprovedExpenses()
          //   } else {
          //     this.getUpdatedExpenseData();
          //   }
          // }
        }
      },
        error => {
          this.errorMessage = <any>error;
          this.alertError.nativeElement.classList.add("show");
          let ref = this;
          setTimeout(() => {
            ref.alertError.nativeElement.classList.remove("show");
          }, 900);
        });
    }
  }

  /**
   * Method to submit a new line item for expense
   * Calls common submitExpense Method
   */
  submitAddExpense(form: NgForm) {
    this.populateNamesForSelectFields(this.addExpense);
    this.addExpense.status = StatusValues["Approved"];
    this.selectedRowId = 0;
    this.addExpense.expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.submitExpense("add", form);
  }

  /**
   * Method to submit an updated line item of expense
   * Calls common submitExpense Method
   */
  submitEditExpense(form: NgForm) {
    this.populateNamesForSelectFields(this.editExpense);
    this.editExpense.expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.populateExchangeDetailsOnEdit(this.editExpense);
    this.submitExpense("edit", form);
  }

  /**
   * Common Method to submit expenses.
   * Sends only one updated expense object as array item instead of all expenses
   * @param expenseType string to differentiate between add or edit expense type submit
   */
  submitExpense(expenseType, form) {
    $('#loadingEditSubmitModal').modal('show');
    let totalReportExpenseAmount = 0.0;
    let totalReportReimbursibleAmount = 0.0;
    this.expenses.field.forEach(x => {
      totalReportExpenseAmount += Number(x.baseExchangeAmt.split(" ")[1]);
      if (x.reimbursible) {
        totalReportReimbursibleAmount += Number(x.baseExchangeAmt.split(" ")[1]);
      }
    });
    this.user.field = [];
    if (expenseType == "add") {
      this.addExpense["isNew"] = true;
      this.user["employeeId"] = this.employeeId;
      this.user.field.push(this.addExpense);
      totalReportExpenseAmount += Number(this.addExpense.baseExchangeAmt.split(" ")[1]);
      if (this.addExpense.reimbursible) {
        totalReportReimbursibleAmount += Number(this.addExpense.baseExchangeAmt.split(" ")[1]);
      }
    } else if (expenseType == "edit") {
      this.addExpense["isNew"] = false;
      this.user.field.push(this.editExpense);
    }
    this.user.exstartdate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.user.expenseReportId = this.reportid;
    this.user.status = StatusValues[this.status];
    this.user.totalReportExpenseAmount = totalReportExpenseAmount;
    this.user.totalReportReimbursibleAmount = totalReportReimbursibleAmount;
    this._editExpensesService.updatePmoExpense(this.user).subscribe(expensesLst => {
      if (expensesLst !== null) {
        if (this.status == "Approved" || this.status == "Rejected") {
          this.getUpdatedApprovedExpenses()
        } else {
          this.getUpdatedExpenseData();
        }
        form.resetForm();
        this.addExpense.baseExchangeAmt = 0;
        this.addExpense.exchangeRateWithDesc = 0;
      }
    },
      error => {
        $('#loadingEditSubmitModal').modal('hide');
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
          ref.getUpdatedExpenseData();
        }, 1000);
      });

  }

  populateNamesForSelectFields(changedExpense) {
    if (changedExpense.projectId != '-- Select --' || changedExpense.projectId != -1 || changedExpense.projectId != '') {
      changedExpense.projectName = (this.projectsData.find(element => element.projectId == changedExpense.projectId)).projectName;
    }
    if (changedExpense.projectTaskId != '-- Select --' || changedExpense.projectTaskId != -1 || changedExpense.projectTaskId != '') {
      changedExpense.projectTaskName = (this.tasksData.find(element => element.projectTaskId == changedExpense.projectTaskId)).projectTaskName;
    }
    if (changedExpense.expenseTypeId != '-- Select --' || changedExpense.expenseTypeId != -1 || changedExpense.expenseTypeId != '') {
      changedExpense.expenseTypeName = (this.expenseTypesData.find(element => element.expenseTypeId == changedExpense.expenseTypeId)).expenseTypeName;
    }
  }

  onSelectCurrency(event): void {
    if (this.selectedRowId > 0) {
      this.selectedQuantity = +(this.editExpense.quantity);
      this.selectedReceiptPrice = +(this.editExpense.receiptPrice);
      this.selectedProjectId = +(this.editExpense.projectId)
      this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    }
    if (this.selectedExpenseDate == '0-0-0') {
      this.errorMessage = 'Please select Expense Date';
      this.alertPopupError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertPopupError.nativeElement.classList.remove("show");
      }, 900);
    } else
      this.populateCurrencyExchangeDetails(event, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onSelectCurrencyAddExpense(event): void {
    this.selectedQuantity = +(this.addExpense.quantity);
    this.selectedReceiptPrice = +(this.addExpense.receiptPrice);
    this.selectedProjectId = +(this.addExpense.projectId)
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    if (this.selectedExpenseDate == '0-0-0') {
      this.errorMessage = 'Please select Expense Date';
      this.alertPopupError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertPopupError.nativeElement.classList.remove("show");
      }, 900);
    } else
      this.populateCurrencyExchangeDetailsAddExpense(event, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onChangeQty(event): void {
    if (this.selectedRowId > 0) {
      this.selectedReceiptCurrency = this.editExpense.currencyCode;
      this.selectedReceiptPrice = +(this.editExpense.receiptPrice);
      this.selectedProjectId = +(this.editExpense.projectId);
      this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    }
    if (this.selectedExpenseDate == '0-0-0') {
      this.errorMessage = 'Please select Expense Date';
      this.alertPopupError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertPopupError.nativeElement.classList.remove("show");
      }, 900);
    } else
      this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, event, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onChangeQtyAddExpense(event): void {
    this.selectedReceiptCurrency = this.addExpense.currencyCode;
    this.selectedReceiptPrice = +(this.addExpense.receiptPrice);
    this.selectedProjectId = +(this.addExpense.projectId);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    if (this.selectedExpenseDate == '0-0-0') {
      this.errorMessage = 'Please select Expense Date';
      this.alertPopupError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertPopupError.nativeElement.classList.remove("show");
      }, 900);
    } else
      this.populateCurrencyExchangeDetailsAddExpense(this.selectedReceiptCurrency, event, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onChangeReceiptPrice(event): void {
    if (this.selectedRowId > 0) {
      this.selectedQuantity = +(this.editExpense.quantity);
      this.selectedReceiptCurrency = this.editExpense.currencyCode;
      this.selectedProjectId = +(this.editExpense.projectId);
      this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    }
    if (this.selectedExpenseDate == '0-0-0') {
      this.errorMessage = 'Please select Expense Date';
      this.alertPopupError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertPopupError.nativeElement.classList.remove("show");
      }, 900);
    } else
      this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, event, this.selectedExpenseDate, this.selectedProjectId);
  }
  onChangeExpenseDateAddExpense(): void {
    this.selectedQuantity = +(this.addExpense.quantity);
    this.selectedReceiptCurrency = this.addExpense.currencyCode;
    this.selectedProjectId = +(this.addExpense.projectId);
    this.selectedReceiptPrice = +(this.addExpense.receiptPrice);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    if (this.selectedQuantity != 0 && this.selectedProjectId != 0 && this.selectedReceiptCurrency != '' && this.selectedReceiptPrice != 0) {
      this.populateCurrencyExchangeDetailsAddExpense(this.selectedReceiptCurrency, this.selectedQuantity, this.addExpense.receiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    } else if (this.selectedQuantity != 0) {
      this.populateCurrencyExchangeDetailsAddExpense(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    } else if (this.selectedReceiptCurrency != '') {
      this.populateCurrencyExchangeDetailsAddExpense(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    }
  }
  onChangeReceiptPriceAddExpense(event): void {
    this.selectedQuantity = +(this.addExpense.quantity);
    this.selectedReceiptCurrency = this.addExpense.currencyCode;
    this.selectedProjectId = +(this.addExpense.projectId);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    if (this.selectedExpenseDate == '0-0-0') {
      this.errorMessage = 'Please select Expense Date';
      this.alertPopupError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertPopupError.nativeElement.classList.remove("show");
      }, 900);
    } else
      this.populateCurrencyExchangeDetailsAddExpense(this.selectedReceiptCurrency, this.selectedQuantity, event, this.selectedExpenseDate, this.selectedProjectId);
  }

  onChangeEditExpenseDateAddExpense(): void {
    this.selectedQuantity = +(this.editExpense.quantity);
    this.selectedReceiptCurrency = this.editExpense.currencyCode;
    this.selectedProjectId = +(this.editExpense.projectId);
    this.selectedReceiptPrice = +(this.editExpense.receiptPrice);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    if (this.selectedQuantity != 0 && this.selectedProjectId != 0 && this.selectedReceiptCurrency != '' && this.selectedReceiptPrice != 0) {
      this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, this.editExpense.receiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    } else if (this.selectedQuantity != 0) {
      this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    } else if (this.selectedReceiptCurrency != '') {
      this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    }
  }

  cancel() {
    this.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });
  }

  downloadFile(duplicateFileName: string, fileType: string, expenseId: string) {

    if (duplicateFileName) {
      $('#loadingEditSubmitModal').modal('show');
      this._createExpenseService.downloadFile(duplicateFileName, expenseId).subscribe(
        downloadObj => {
          this.downloadFiles = downloadObj;

          var byteCharacters = atob(this.downloadFiles.fileContent);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: this.downloadFiles.fileType });

          saveAs(blob, this.downloadFiles.fileName)
          $('#loadingEditSubmitModal').modal('hide');
        },
        error => {
          $('#loadingEditSubmitModal').modal('hide');
          this.errorMessage = <any>error
        });
    }
  }

  closeFix(event, datePicker) {
    if (!this.datePickContainer.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  closeFix2(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  closeFix5(event, datePicker) {
    if (!this.datePickContainer5.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }
  checkIfAnySelected() {
    if (this.expenses.field !== null && this.expenses.field.length > 0) {
      return this.expenses.field.some(field => field.selected == true);
    } else {
      return false;
    }
  }
  checkAnySelected(popupname) {
    let f = this.checkIfAnySelected();
    if (f) {
      $('#' + popupname).modal('show');
    } else {
      this.errorMessage = 'Please select atleast one expense';
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
    }
  }

  /**
   * Method to approve selected expenses. Sends entire expense to the service
   */
  approveExpense() {
    let tmpExpenseItemList = this.expenses.field.filter(x => x.selected);
    let isAllApproved = tmpExpenseItemList.every(x => x.status == "O");
    let isChargedChecked = tmpExpenseItemList.some(x => x.status == "G" || x.status == "I" || x.status == "U");
    if (isChargedChecked) {
      this.errorMessage = "Cannot perform operation on charged expense";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
      this.expenses.field.forEach(element => {
        if (element.status == "G" || element.status == "I" || element.status == "U") {
          element.selected = false;
        }
      });
    }
    else if (isAllApproved) {
      this.errorMessage = "All Selected Expenses Already Approved";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
    } else {
      this._editExpensesService.approvePmoExpense(this.expenses).subscribe(response => {
        $('#approveRejectModal').modal('hide');
        // this.expenses = response;
        this.isTrascError = true;
        this.flash.message = 'Expense Approved Successfully';
        this.flash.type = 'success';
        this.alertSuccess.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });
        }, 1500);
      },
        error => {
          $('#approveRejectModal').modal('hide');
          this.errorMessage = <any>error;
          this.alertError.nativeElement.classList.add("show");
          let ref = this;
          setTimeout(() => {
            ref.alertError.nativeElement.classList.remove("show");
            ref.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });
          }, 1500);
        });
    }

  }

  /**
   * Method to reject selected expenses. Sets the reject reason for selected expenses then 
   * Sends entire expense to the service
   */
  rejectExpense() {
    let tmpExpenseItemList = this.expenses.field.filter(x => x.selected);
    let isAllRejected = tmpExpenseItemList.every(x => x.status == "R");
    let isChargedChecked = tmpExpenseItemList.some(x => x.status == "G" || x.status == "I" || x.status == "U");
    if (isChargedChecked) {
      this.errorMessage = "Cannot perform operation on charged expense";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
      this.expenses.field.forEach(element => {
        if (element.status == "G" || element.status == "I" || element.status == "U") {
          element.selected = false;
        }
      });
    }
    else if (isAllRejected) {
      this.errorMessage = "All Selected Expenses Already Rejected";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
    } else {
      this.expenses['field'].forEach(item => {
        if (item.selected) {
          item.reasonForReject = this.user.rejectReason;
        }
      });

      this._editExpensesService.rejectPmoExpense(this.expenses).subscribe(response => {
        $('#approveRejectModal').modal('hide');
        // this.expenses = response;
        this.flash.message = 'Expense Rejected Successfully';
        this.flash.type = 'success';
        this.alertSuccess.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });
        }, 1500);
      },
        error => {
          $('#approveRejectModal').modal('hide');
          this.errorMessage = <any>error;
          this.alertError.nativeElement.classList.add("show");
          let ref = this;
          setTimeout(() => {
            ref.alertError.nativeElement.classList.remove("show");
            ref.router.navigate(['../../../pmo-expenses/'], { relativeTo: this.route });
          }, 1500);
        });
    }
  }

  /**
   * Method to show history for the selected expense
   * @param id Expense id for the selected row
   */
  showHistory(id) {
    this._navigateDataService.resetReportIdAndStatus(this.reportid, this.status);
    this.selectedRowId = id;
    this._navigateDataService.isRouteFromPmoPage = true;
    this.router.navigate(['../../../viewhistory-expense/', this.selectedRowId], { relativeTo: this.route });
  }

  /**
   * Method to download all associated attachements for the current expense report in a zip file 
   */
  downloadAllAttachments() {
    let fileName = this.employeeFullName + "_attachments";
    let expenseReportIdList = [];

    let attachmentCount = this.expenseAttachmentComponent.getAttachmentsToSubmit().length;
    expenseReportIdList.push(this.reportid);

    if (attachmentCount > 0) {
      $('#loadingEditSubmitModal').modal('show');
      this._createExpenseService.downloadAllAttachments(expenseReportIdList).subscribe(response => {
        var byteCharacters = atob(response.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: response.fileType });

        saveAs(blob, fileName);
        $('#loadingEditSubmitModal').modal('hide');
      },
        error => {
          $('#loadingEditSubmitModal').modal('hide');
          this.errorMessage = "Error getting attachmetns";
          this.alertError.nativeElement.classList.add("show");
          let ref = this;
          setTimeout(() => {
            ref.alertError.nativeElement.classList.remove("show");
          }, 1500);
        });
    } else {
      this.errorMessage = 'No attachments to download';
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 2000);
    }

  }

  getExpenseForApproval() {
    let count = 0;
    let isRowSelected = true;
    let isMultipleSelected = false;
    this.expenses.field.forEach(x => {
      if (x.selected) {
        count++
      }
    });

    if (count == 0) {
      isRowSelected = false;
    } else if (count > 1) {
      isMultipleSelected = true;
    } else {
      isRowSelected = true;
      isMultipleSelected = false;
    }

    if (isRowSelected && !isMultipleSelected) {
      this.AuditInputDTO.employeeId = this.selectedRowId;
      this._editExpensesService.getExpenseForApproval(this.AuditInputDTO)
        .subscribe(waitingOn => {
          $("#waitingForApproval").modal('show');
          this.waitingOn = waitingOn;
        },
          error => this.errorMessage = <any>error);
    } else {
      if (isRowSelected == false) {
        this.errorMessage = "Please Select an Expense Item";
      } else if (isMultipleSelected == true) {
        this.errorMessage = "Multiple Expense Items Selected"
      }

      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
    }
  }

  showIconForEdit(val) {

    this.showEditIcon = val;
    if (!val) {
      this.expenses.qbExpenseDate = this.qbExpenseDate.year + "-" + this.qbExpenseDate.month + "-" + this.qbExpenseDate.day;
      this._editExpensesService.saveQbExpense(this.reportid, this.expenses.qbExpenseDate).subscribe(res => {
        this.qbExpenseDate = res.qbReportDate;
      })
    }
    //this.expenses.qbExpenseDate = this.qbExpenseDate;

  }

  changeDate() {
    this.expenses.qbExpenseDate = this.qbExpenseDate;
  }

  //Function to get rows of data in sequential array format as per the column name sequence
  getRowDataForPdf(dataObj) {
    let rowData = [];
    dataObj.forEach(x => {
      let rows = [];
      rows.push(x.expenseDate);
      rows.push(x.projectName);
      rows.push(x.expenseTypeName);
      rows.push(x.notes);
      rows.push(x.reimbursible == true ? 'Yes' : 'No');
      rows.push(x.billable == true ? 'Yes' : 'No');
      rows.push(x.currencyCode);
      rows.push(Number(x.receiptPrice).toFixed(2));
      rows.push(x.quantity);
      rows.push(x.exchangeRateWithDesc);
      rows.push(x.baseExchangeAmt);

      rowData.push(rows);
    });
    return rowData;
  }

  getPdfData() {
    this._createExpenseService.getLogoImage().subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      this.exportToPdf(null);
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.exportToPdf(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  exportToPdf(base64Image) {
    let anySelected = this.expenses['field'].some(item => {
      return item.selected;
    });
    //Column names for the table
    const colNames = ["Date", "Project", "Expense Item", "Notes", "Reimb", "Bill", "Cur", "Price", "QTY", "XE Rate", "Total"];
    //Separating the reimbursible and non reimbursible data
    let reimbursibleData;
    let nonReimbursibleData;
    if (anySelected == true) {
      reimbursibleData = this.expenses.field.filter(x => {
        if (x.reimbursible == true && x.selected == true) {
          return x;
        }
      });
      nonReimbursibleData = this.expenses.field.filter(x => {
        if (x.reimbursible == false && x.selected == true) {
          return x;
        }
      });
    } else {
      reimbursibleData = this.expenses.field.filter(x => x.reimbursible == true);
      nonReimbursibleData = this.expenses.field.filter(x => x.reimbursible == false);
    }

    let totalReimbursibleAmount = 0;
    let totalNonReimbursibleAmount = 0;
    let baseExchangeCurrency = "";
    //Calculating the total reimbursible amount and totalNonReimbursibleAmount
    reimbursibleData.forEach(x => {
      baseExchangeCurrency = x.baseExchangeAmt.split(" ")[0];
      totalReimbursibleAmount += Number(x.baseExchangeAmt.split(" ")[1]);
    });

    nonReimbursibleData.forEach(x => {
      totalNonReimbursibleAmount += Number(x.baseExchangeAmt.split(" ")[1]);
    });

    let totalAmount = Number(totalReimbursibleAmount) + Number(totalNonReimbursibleAmount);

    //Getting the rows of data in sequential array format from function as per column name sequence
    let reimbursedRowData = this.getRowDataForPdf(reimbursibleData);

    let nonReimbursedRowData = this.getRowDataForPdf(nonReimbursibleData);

    //Creation of pdf begins
    var pdf = new jsPDF(this.exportLayoutType, 'pt', 'A4');

    pdf.setFontSize(8);
    var yCoordinate = 30;
    //Adding the logo image
    if (base64Image) {
      pdf.addImage(base64Image, 'PNG', 45, yCoordinate, 190, 30);
    }

    yCoordinate += 50;
    pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Header Creation begin
    pdf.fromHTML('<b style="font-size:18px;">Expense Report</b>', 35, yCoordinate);
    yCoordinate += 17;
    pdf.fromHTML('Tracking Number: ' + this.reportid, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Date: ' + this.expenseStartDate, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Name: ' + this.expenseStartDate + ' to ' + this.expenseEndDate, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Status: ' + this.status, 35, yCoordinate);
    yCoordinate += 23;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.fromHTML('<b style="font-size:18px">From</b>', 35, yCoordinate);
    yCoordinate += 17;
    pdf.fromHTML(this.employeeFullName, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Department: ' + (this.employeeDepartment == null ? "" : this.employeeDepartment), 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Employee Number: ' + (this.employeeNumber == null ? "" : this.employeeNumber), 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Position Level: ' + (this.employeeLevel == null ? "" : this.employeeLevel), 35, yCoordinate);
    yCoordinate += 23;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Header Creation End


    let tableColStyles = {};
    if (this.exportLayoutType == "p") {
      tableColStyles = { 1: { cellWidth: 75 }, 3: { cellWidth: 55 } };
    } else {
      tableColStyles = { 3: { cellWidth: 85 } };
    }

    //Reimbursible Expenses table
    let firstTable;
    //If data is there then only create grid
    if (reimbursedRowData.length != 0) {
      pdf.fromHTML('<b>Reimbursible Expenses</b>', 35, yCoordinate);
      yCoordinate += 30;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 10;
      pdf.autoTable({
        head: [colNames], body: reimbursedRowData, theme: 'striped',
        didDrawPage: function (data) { // Gets called everytime a page is added
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
        },
        startY: yCoordinate, styles:
          { cellPadding: 1.5, fontSize: 10 }, columnStyles: tableColStyles
      });
      firstTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
    }
    if (firstTable) {
      yCoordinate = firstTable.finalY + 30; //changing the y coordinate to end of table if present
    }


    let secondTable;
    //If data is there then only create grid
    if (nonReimbursedRowData.length != 0) {
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      //Non Reimbursible Expenses table
      pdf.fromHTML('<b>Non Reimbursible Expenses</b>', 35, yCoordinate);
      yCoordinate += 30;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 10;
      pdf.autoTable({
        head: [colNames], body: nonReimbursedRowData, theme: 'striped',
        didDrawPage: function (data) { // Gets called everytime a page is added
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
        },
        startY: yCoordinate, styles:
          { cellPadding: 1.5, fontSize: 10 }, columnStyles: tableColStyles
      });
      secondTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
    }

    if (secondTable) {
      yCoordinate = secondTable.finalY + 30; //changing the y coordinate to end of table if present
    } else {
      yCoordinate += 30; //Else only increase y coordinate by 30
    }

    //Chcking if the y coordinate has reached almost the end then draw the footer html in new page
    if (this.exportLayoutType == "p") {
      if (yCoordinate > 1100) {
        pdf.addPage();
        pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
        yCoordinate = 30;
        pdf.setDrawColor(128, 128, 128);
      }
    } else {
      if (yCoordinate > 500) {
        pdf.addPage();
        pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
        yCoordinate = 30;
        pdf.setDrawColor(128, 128, 128);
      }
    }
    //Total expenses footer
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.fromHTML('<b>Total of All Expenses</b>', 35, yCoordinate);
    //Adding the amount vlaue at the end of the same row
    pdf.fromHTML('<b>' + baseExchangeCurrency + ' ' + Number(totalAmount).toFixed(2) + '</b>', pdf.internal.pageSize.getWidth() - 150, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Non Reimbursible expenses footer
    pdf.fromHTML('<b>Non Reimbursible Expenses</b>', 35, yCoordinate);
    pdf.fromHTML('<b>' + baseExchangeCurrency + ' ' + Number(totalNonReimbursibleAmount).toFixed(2) + '</b>', pdf.internal.pageSize.getWidth() - 150, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Total Due footer
    pdf.fromHTML('<b>Total Due</b>', 35, yCoordinate);
    pdf.fromHTML('<b>' + baseExchangeCurrency + ' ' + Number(totalAmount - totalNonReimbursibleAmount).toFixed(2) + '</b>', pdf.internal.pageSize.getWidth() - 150, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //creating file name
    let fileName = this.employeeFullName + "_" + this.expenseStartDate + "_" + this.expenseEndDate;
    //Save the pdf    
    pdf.save(fileName + '.pdf');
  }

  getCurr(val) {
    if (val != undefined && val != "")
      return val.split(" ")[0];
  }

  getVal(val) {
    if (val != undefined && val != "")
      return val.split(" ")[1];
  }

  getExRateVal(val) {

    if (val != undefined && val != "") {
      return (val.split(" ")[1] + ' ' + val.split(" ")[2] + ' ' + val.split(" ")[3]);
    }
  }

  getExRatePopupVal(val) {

    if (val != undefined && val != "") {
      return (val.split(" ")[2] + ' ' + val.split(" ")[3] + ' ' + val.split(" ")[4]);
    }
  }

  getExRateCurr(val) {
    if (val != undefined && val != "")
      return val.split(" ")[0];
  }

  rejectReasonClose() {
    this.user.rejectReason = "";
  }

  previewCalled() {
    this.expenseAttachmentComponent.previewModalOpen();
  }

  uploadReceiptCalled() {
    this.expenseAttachmentComponent.uploadModalOpen();
  }

  getUploadEvent($event) {
    this.isUploading = $event;
  }

  chengePageSize(itemCount) {
    this.pageCount = itemCount;
    if (itemCount == 0) {
      this.currentPageItemCount = Number(this.fieldArray.length);
    } else {
      this.currentPageItemCount = Number(itemCount);
    }
  }

  getExpenseEndDateField() {
    var startDt = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this._createExpenseService.getMinMaxDatesByStartDt(startDt).subscribe(response => {
      this.expenseWeekStartDate = response.reportMinDate;
      this.expenseWeekEndDate = response.reportMaxDate;
    },
      error => this.errorMessage = <any>error);
  }

}
