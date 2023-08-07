import { CreateExpenseService } from './../../shared/services/createexpense.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../../shared/utilities/expense.model';
import { EditExpensesService } from '../../shared/services/editexpense.service';
import { UploadFile } from '../../shared/utilities/uploadfile';
import { Flash } from '../../shared/utilities/flash';
import { saveAs } from 'file-saver/FileSaver';
import { AppConstants } from '../../shared/app-constants';
import { NavigateDataService } from '../../shared/services/navigateData.service';
import { ExpenseAttachmentComponent } from '../expense-attachment/expense-attachment.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

enum StatusValues {
  Approved = "O",
  Rejected = "R",
  Submitted = "S",
  Open = "N",
  Charged = "G",
  Invoiced = "I",
  Reversed = "U",
  Reimbursed = "P"
}

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css']
})
export class EditExpenseComponent implements OnInit {
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  @ViewChild('AlertPopupError') alertPopupError: ElementRef;
  @ViewChild('DatePickContainer') datePickContainer;
  @ViewChild('DatePickContainer2') datePickContainer2;
  @ViewChild('DatePickContainer3') datePickContainer3;
  @ViewChild('EditAttachFileInput') editAttachFileInput;
  @ViewChild('AddAttachFileInput') addAttachFileInput;
  @ViewChild(ExpenseAttachmentComponent) expenseAttachmentComponent;
  invalidFileError = false;

  allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword", "image/png", "image/jpeg", "image/bmp", "image/gif", "image/tiff"];

  public files = [];
  private rowData;
  public errorMessage: string;
  public fieldArray: Array<any> = [];
  public projectsData: Array<any> = [];
  public tasksData: Array<any> = [];
  public expenseTypesData: Array<any> = [];
  public currencyListData: Array<any> = [];
  public user: any = {};
  private expensesList: any;
  private downloadFiles: any;

  rowDeleteStatus: string;
  selectedRowId: Number;
  editExpense: Expense;
  selectedExpense: Expense;
  public reportid: any;
  public status: any;
  expenseStartDateField: { "year": number, "month": number, "day": number };
  expenseStartMaxDateField: { "year": number, "month": number, "day": number };
  expenseSelectedDateField: { "year": number, "month": number, "day": number };
  expenseSelectedMinDateField: { "year": number, "month": number, "day": number };
  expenseSelectedMaxDateField: { "year": number, "month": number, "day": number };
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
  tempExpenseId: Number;
  routeParamStatus;
  rejectReason: String;
  parentReportId = 0;
  isUploading: Boolean = false;
  itemsPerPageList = [5, 10, 20, 50, 100];
  currentPageItemCount = 5;
  pageCount = 5;
  addExpenseForm: FormGroup;
  isBillable: Boolean;
  expenseWeekStartDate: any;
  expenseWeekEndDate: any;
  public isInternalProject: boolean = false;
  public internalProjectsList: any = ['940', '950', '965', '967', '972', '2514'];
  modalId: String;
  getMileageRate: number;

  constructor(private toasterService: ToastrService,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private _editExpensesService: EditExpensesService,
    private _createExpenseService: CreateExpenseService, private _navigateDataService: NavigateDataService) {
    this.expenses = new Array<Expense>();
    this.addExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, false, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
    this.editExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, false, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
  }

  ngOnInit() {
    //this.getProjectsData();
    this.getCurrenciesData();
    this.addExpenseBuildForm();

    this.reportid = this.route.params['_value'].reportid;
    this.status = this.route.params['_value'].status;
    this.routeParamStatus = this.route.params['_value'].status;

    this._navigateDataService.currentReportId.subscribe(repId => this.currentRepId = repId);
    this._navigateDataService.currentReportStatus.subscribe(repStatus => this.currentRepStatus = repStatus);

    this._editExpensesService.getAllExpensesForReportId(this.reportid, this.status).subscribe(response => {
      // console.log("Edit Response --> :: " + JSON.stringify(response));
      this.fieldArray = response.field;
      this.parentReportId = response.parentId;

      this.fieldArray.forEach(x => {
        if (x.status == "R") {
          this.rejectReason = x.reasonForReject
        }
      })

      if (response.expenseStartDate.length != null) {
        var date: string[] = response.expenseStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      }
      this.getExpenseStartDateField();
      this.user.description = response.description;
      if (response.status === 'R')
        this.showRejectedField = true;
      else
        this.showRejectedField = false;

    },
      error => this.errorMessage = <any>error);

    this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
    this.inValidFields = ["exstartdate", "addProjectId", "addProjectTask", "addExpenseDate", "addExpenseTypeId", "addQuantity", "addReceiptPrice", "addCurrencyCode"];
    this.validationError = {
      exstartdate: false, addProjectId: false, addProjectTask: false, addExpenseDate: false, addExpenseTypeId: false, addQuantity: false,
      addReceiptPrice: false, addCurrencyCode: false
    };

    this._editExpensesService.getExpenseAttachmentsByReport(this.reportid).subscribe(response => {
      this.expenseAttachmentComponent.setReportId(this.reportid);
      this.expenseAttachmentComponent.setAttachments(response);
    })
  }

  addExpenseBuildForm() {
    this.addExpenseForm = this.formBuilder.group({
      projectId: [],
      projectTaskId: [],
      expenseDate: [],
      expenseTypeId: [],
      quantity: [],
      currencyCode: [],
      receiptPrice: [],
      billable: [],
      reimbursible: [],
      missingReceipts: [],
      notes: []
    });
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

      this.addExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, true, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
      this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
      this.files = [];
    } else if (id == 'edit_expense') {
      this.oldExpenseRow = [];
      this.files = [];
      this.editExpense = this.fieldArray.find(x => x.id == this.selectedRowId);

      for (let i = 0; i < this.editExpense.expenseAttachments.length; i++) {
        this.files.push(this.editExpense.expenseAttachments[i]);
        this.oldExpenseRow.push(this.editExpense.expenseAttachments[i]);
      }
      this.onSelectProject(this.editExpense.projectId);
      var date: string[] = this.editExpense.expenseDate.split('-');
      this.expenseSelectedDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      this.populateExchangeDetailsOnEdit(this.editExpense);

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


  addExpenseToList() {
    // this.addFilesToExpense();
    var maxId: 0;
    this.populateNamesForSelectFields(this.addExpense);
    this.addExpense.status = "N";
    this.addExpense.id = "_" + new Date().getTime().toString();
    this.selectedRowId = 0;
    this.addExpense.expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;

    const addExpenseValues = this.addExpenseForm.value;

    addExpenseValues.attachments = this.addExpense.attachments;
    addExpenseValues.baseExchangeAmt = this.addExpense.baseExchangeAmt;
    addExpenseValues.expenseDate = this.addExpense.expenseDate;
    addExpenseValues.exchangeRate = this.addExpense.exchangeRate;
    addExpenseValues.exchangeRateWithDesc = this.addExpense.exchangeRateWithDesc;
    addExpenseValues.expenseAttachment = this.addExpense.expenseAttachment;
    addExpenseValues.expenseAttachments = this.addExpense.expenseAttachments;
    addExpenseValues.expenseTypeName = this.addExpense.expenseTypeName;
    addExpenseValues.id = this.addExpense.id;
    addExpenseValues.missingReceipts = this.addExpense.missingReceipts;
    addExpenseValues.projectName = this.addExpense.projectName;
    addExpenseValues.projectTaskName = this.addExpense.projectTaskName;
    addExpenseValues.status = this.addExpense.status;

    this.fieldArray.push(addExpenseValues);
    $('#add_expense').modal('hide');
  }
  addmoreExpenseToList() {
    // this.addFilesToExpense();
    var maxId: 0;
    this.populateNamesForSelectFields(this.addExpense);
    this.addExpense.status = "N";
    this.addExpense.id = "_" + new Date().getTime().toString();
    this.selectedRowId = 0;
    this.addExpense.expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;

    const addExpenseValues = this.addExpenseForm.value;

    addExpenseValues.attachments = this.addExpense.attachments;
    addExpenseValues.baseExchangeAmt = this.addExpense.baseExchangeAmt;
    addExpenseValues.expenseDate = this.addExpense.expenseDate;
    addExpenseValues.exchangeRate = this.addExpense.exchangeRate;
    addExpenseValues.exchangeRateWithDesc = this.addExpense.exchangeRateWithDesc;
    addExpenseValues.expenseAttachment = this.addExpense.expenseAttachment;
    addExpenseValues.expenseAttachments = this.addExpense.expenseAttachments;
    addExpenseValues.expenseTypeName = this.addExpense.expenseTypeName;
    addExpenseValues.id = this.addExpense.id;
    addExpenseValues.missingReceipts = this.addExpense.missingReceipts;
    addExpenseValues.projectName = this.addExpense.projectName;
    addExpenseValues.projectTaskName = this.addExpense.projectTaskName;
    addExpenseValues.status = this.addExpense.status;

    this.fieldArray.push(addExpenseValues);
    this.clearTextFieldsAddExpense();
  }

  clearTextFieldsAddExpense() {

    this.addExpenseForm.controls['expenseTypeId'].reset();
    this.addExpenseForm.controls['quantity'].reset();
    this.addExpenseForm.controls['currencyCode'].reset();
    this.addExpenseForm.controls['receiptPrice'].reset();
    this.addExpenseForm.controls['notes'].reset();

    this.addExpense.baseExchangeAmt = 0;
    this.addExpense.exchangeRateWithDesc = 0;

  }

  onEditChecked(event) {
    if (event.target.checked) {
      this.selectedRowId = event.target.value;
    } else {
      let count = 0;
      this.fieldArray.forEach(x => {
        if (x.selected) {
          count++;
        }
      });
      if (count == 0) {
        this.selectedRowId = 0;
      } else if (count == 1) {
        this.fieldArray.forEach(x => {
          if (x.selected) {
            this.selectedRowId = x.id;
          }
        });
      }
    }
  }

  getProjectsData(): void {
    this.weekdate = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this._createExpenseService.getProjectsData(this.weekdate).subscribe(projects => {
      this.projectsData = projects;
    },
      error => this.errorMessage = <any>error);
  }

  onSelectProject(event): void {
    console.log('project Id = ', event)
    this._createExpenseService.getTasksData(event, this.expenseWeekStartDate, this.expenseWeekEndDate).subscribe(tasks => {
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
        this.addExpenseForm.controls['billable'].disable();
        this.isBillable = true;
      } else {
        this.addExpenseForm.controls['billable'].enable();
        this.isBillable = false;
      }
    },
      error => this.errorMessage = <any>error);
    this.getExpensesTypes(event);
  }

  onChangeProject(event): void {
    this.editExpense.projectTaskId = null;
    // this.editExpense.expenseTypeId = null;
    this._createExpenseService.getTasksData(event, this.expenseWeekStartDate, this.expenseWeekEndDate).subscribe(tasks => {
      this.tasksData = tasks;
      if (this.tasksData.length > 0 && this.tasksData[0].isInternal) {
        this.editExpense.billable = false;
        this.addExpenseForm.controls['billable'].disable();
        this.isBillable = true;
      } else {
        this.addExpenseForm.controls['billable'].enable();
        this.isBillable = false;
      }
    },
      error => this.errorMessage = <any>error);
    // this.getExpensesTypes(event);
  }

  getExpensesTypes(projectId): void {
    this._createExpenseService.getExpensesTypes(projectId).subscribe(expensestypes => {
      this.expenseTypesData = expensestypes;
      if (localStorage.getItem("orgCode") === AppConstants.OsiUsOrgCode || localStorage.getItem('orgCode') == AppConstants.OsiCanOrgCode) {
        this.expenseTypesData = this.expenseTypesData.filter(x => x.externalRefId !== null)
      }
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
    // this.addExpense.receiptPrice = "";
    // this.addExpense.currencyCode = "";
    // this.addExpense.quantity = "";
    // this.addExpense.baseExchangeAmt="";
    // this.addExpense.exchangeRateWithDesc = "";
    // for (let i = 0; i < this.expenseTypesData.length; i++) {
    //   if (!isMileage && this.expenseTypesData[i].expenseTypeId == event && this.expenseTypesData[i].expenseTypeName == 'Mileage') {
    //     if (localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS')
    //       this.addExpense.receiptPrice = String(AppConstants.usMileageExpensePrice);
    //     else
    //       this.addExpense.receiptPrice = String(0);
    //     isMileage = true;
    //   }
    // }
  }

  onSelectExpenseType(event) {
    let isMileage = false;
    this.expenseMileageCheckDate = moment(this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day).format('YYYY-MM-DD');
    this.usEmployeesMileageExpensePrice = (this.expenseMileageCheckDate >= AppConstants.usMileageExpensePrice_wef) ? AppConstants.usMileageExpensePrice : AppConstants.usMileageExpensePrice_old;
    for (let i = 0; i < this.expenseTypesData.length; i++) {
      if (this.expenseTypesData[i].expenseTypeId == event) {
        this.addExpense.expenseTypeName = this.expenseTypesData[i].expenseTypeName;
      }
      if (!isMileage && this.expenseTypesData[i].expenseTypeId == event && this.expenseTypesData[i].expenseTypeName == 'Mileage') {
        if (localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS') {
          const ordId = localStorage.getItem('orgId');
          const ExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
          if (this.expenseSelectedDateField.year != 0 && this.expenseSelectedDateField.month != 0 && this.expenseSelectedDateField.day != 0) {
            this._createExpenseService.getMileageRate(ordId, ExpenseDate, parseInt(event)).subscribe(response => {
              if (response.message == null) {
                this.getMileageRate = 0;
              } else {
                this.getMileageRate = response.message;
                this.addExpense.receiptPrice = String(this.getMileageRate);
                this.editExpense.receiptPrice = String(this.getMileageRate);
              }
            });
          } else {
            this.addExpenseForm.controls['expenseTypeId'].reset();
            this.toasterService.error("Please Select Expense Date");
          }
          // this.addExpense.receiptPrice = String(this.usEmployeesMileageExpensePrice);
          // this.editExpense.receiptPrice = String(this.usEmployeesMileageExpensePrice);

        }
        else {
          this.addExpense.receiptPrice = String(0);
          this.editExpense.receiptPrice = String(0);
        }
        isMileage = true;
      } else {
        this.editExpense.receiptPrice = String(0);
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
    // this.editExpense.receiptPrice = "";
    // this.editExpense.currencyCode = "";
    // this.editExpense.quantity = "";
    // this.editExpense.baseExchangeAmt="";
    // this.editExpense.exchangeRateWithDesc = "";
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
    if (this.fieldArray.length == 1) {
      this.selectedRowId = this.fieldArray[0].id;
    }
    this.fieldArray.forEach(x => x.selected = event.target.checked)
  }

  checkDeleteStatus() {
    return this.fieldArray.some(field => field.selected == true);
  }

  checkMultiSelect() {
    let count = 0;
    this.fieldArray.forEach(x => {
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

  isAllChecked() {
    return this.fieldArray.every(_ => _.selected);
  }

  populateExchangeDetailsOnEdit(selectedExpense) {
    this.selectedQuantity = +(selectedExpense.quantity);
    this.selectedReceiptPrice = +(selectedExpense.receiptPrice);
    this.selectedReceiptCurrency = selectedExpense.currencyCode;
    this.selectedProjectId = +(selectedExpense.projectId);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;

    this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);

    if (this.tasksData.length > 0 && this.tasksData[0].isInternal) {
      this.isBillable = true;
    } else {
      this.isBillable = false;
    }
    // selectedExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate) + "  " + this.currencyExchangeDetails.exchangeRatePattern;
    // selectedExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
  }

  populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId) {
    this._createExpenseService.populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId)
      .subscribe(currExchangeDetails => {
        this.currencyExchangeDetails = currExchangeDetails;

        this.editExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
        this.editExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + " " + this.currencyExchangeDetails.exchangeRatePattern;
        this.editExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
      },
        error => this.errorMessage = <any>error);
  }

  populateCurrencyExchangeDetailsAddExpense(receiptCurrCode, qty, receiptPrice, expenseDate, projectId) {
    this._createExpenseService.populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId)
      .subscribe(currExchangeDetails => {
        this.currencyExchangeDetails = currExchangeDetails;

        this.addExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
        this.addExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + " " + this.currencyExchangeDetails.exchangeRatePattern;
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
    if (this.editExpense.expenseTypeId != "" && localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS') {
      // for (let i = 0; i < this.expenseTypesData.length; i++){
      if (this.editExpense.expenseTypeName == 'Mileage') {
        let expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
        this._createExpenseService.getMileageRate(localStorage.getItem('orgId'), expenseDate, this.editExpense.expenseTypeId).subscribe(response => {
          if (response.message == null) {
            this.getMileageRate = 0;
          } else {
            this.getMileageRate = response.message;
              this.addExpense.receiptPrice = String(this.getMileageRate);
              this.editExpense.receiptPrice = String(this.getMileageRate);
          }
        });
      
      } else {
        this.addExpense.receiptPrice = String(0);
        this.editExpense.receiptPrice = String(0);
      }
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

  onSelectedRowDelete(): void {
    this.fieldArray.forEach((x, i) => {
      if (x.selected) {
        if (x.id.toString().indexOf("_") == 0) {
          this.fieldArray.splice(i, 1);
        }
      }
    });
    let isUnsavedPresent = false;
    this.fieldArray.forEach((x, i) => {
      if (x.id.toString().indexOf("_") == 0) {
        isUnsavedPresent = true;
      }
    });

    if (isUnsavedPresent) {
      this.errorMessage = "Please save newly added expense first";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(() => {
        ref.alertError.nativeElement.classList.remove("show");
      }, 3000);
    } else {
      $('#loadingEditSubmitModal').modal('show');
      this.user.field = [];
      this.user.field = this.fieldArray;
      this.user.exstartdate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
      this.user.expenseReportId = this.reportid;
      this.user.status = StatusValues[this.routeParamStatus];
      if (this.fieldArray.length >= 1) {
        this._editExpensesService.removeExpense(this.user).subscribe(response => {
          this.rowDeleteStatus = JSON.stringify(response);
          $('#loadingEditSubmitModal').modal('hide');
          if (this.rowDeleteStatus === 'true') {
            let rejectedRecordCount = 0;
            this.user.field.forEach(element => {
              if (!element.selected && element.status == "R") {
                rejectedRecordCount++;
              }
            });

            if (this.user.status == "R" && rejectedRecordCount == 0) {
              $('#loadingEditSubmitModal').modal('hide');
              this.isTrascError = true;
              this.flash.message = 'Expense Deleted. Report Status Changed';
              this.flash.type = 'success';
              this.alertSuccess.nativeElement.classList.add("show");
              let ref = this;
              setTimeout(() => {
                ref.isTrascError = false;
                ref.alertSuccess.nativeElement.classList.remove("show");
                this.router.navigate(['../../../view-expenses/'], { relativeTo: this.route });
              }, 1500);
            } else {
              this.flash.message = 'Expense Item Deleted Successfully';
              this.alertSuccess.nativeElement.classList.add("show");
              let ref = this;
              setTimeout(() => {
                ref.isTrascError = false;
                ref.alertSuccess.nativeElement.classList.remove("show");
              }, 900);
              //this.fieldArray = this.fieldArray.filter(field => field.id !== this.selectedRowId);
              this._editExpensesService.getAllExpensesForReportId(this.reportid, this.status).subscribe(response => {
                this.fieldArray = response.field;
                if (this.fieldArray.length < 1) {
                  this.flash.message = 'Expense Item Deleted Successfully';
                  this.alertSuccess.nativeElement.classList.add("show");
                  let ref = this;
                  setTimeout(() => {
                    ref.isTrascError = false;
                    ref.alertSuccess.nativeElement.classList.remove("show");
                    this.router.navigate(['../../../view-expenses/'], { relativeTo: this.route });
                  }, 900);

                }
              },
                error => this.errorMessage = <any>error);
            }
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
  }

  editExpenseInList() {
    // this.addFilesToExpense();
    this.populateNamesForSelectFields(this.editExpense);
    this.editExpense.expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.populateExchangeDetailsOnEdit(this.editExpense);
    var itemToUpdate = this.fieldArray.find(this.findIndexToUpdate, this.editExpense.id);
    var updateIndex = this.fieldArray.indexOf(itemToUpdate);
    // this.editExpense.expenseAttachments = this.files;
    this.fieldArray[updateIndex] = this.editExpense;
  }

  submitExpense() {
    let tmpDataArray = this.fieldArray.map(x => Object.assign({}, x));

    tmpDataArray.forEach(data => {
      if (data.id.toString().indexOf("_") == 0) {
        delete data.id;
      }
    });

    this.user.field = [];
    this.user.field = tmpDataArray.filter(x => x.status == "R" || x.status == "N");

    this.user.exstartdate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.user.expenseReportId = this.reportid;

    this._editExpensesService.updateExpense(this.user).subscribe(expensesLst => {
      $('#loadingEditSubmitModal').modal('hide');
      this.expensesList = expensesLst;
      if (expensesLst !== null) {
        this.isTrascError = true;
        this.flash.message = 'Expense Report Submitted Successfully';
        this.flash.type = 'success';
        this.alertSuccess.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['../../../view-expenses/'], { relativeTo: ref.route });
        }, 1000);
      }
    },
      error => {
        $('#loadingEditSubmitModal').modal('hide');
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
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

  findIndexToUpdate(editExpense) {
    return editExpense.id === this;
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
    //this.expenses.pop();
    this.selectedExpense = null;
    this.router.navigate(['../../../view-expenses/'], { relativeTo: this.route });
  }

  downloadFile(duplicateFileName: string, fileType: string, expenseId: string) {

    if (duplicateFileName) {
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
          //var url= window.URL.createObjectURL(blob);
          //window.open(url, "download,status=1");

          saveAs(blob, this.downloadFiles.fileName)

          //window.open("data:image/png;base64,"+this.downloadFiles.fileContent,"_blank");
        },
        error => this.errorMessage = <any>error);
    }
  }

  saveExpense() {
    let tmpDataArray = this.fieldArray.map(x => Object.assign({}, x));

    tmpDataArray.forEach(data => {
      if (data.id.toString().indexOf("_") == 0) {
        delete data.id;
      }
    })

    this.user.field = [];
    this.user.field = tmpDataArray;
    this.user.exstartdate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.user.expenseReportId = this.reportid;
    this.user.description = this.user.description;
    this._editExpensesService.saveExpense(this.user).subscribe(expensesLst => {
      $('#loadingEditSubmitModal').modal('hide');
      this.expensesList = expensesLst;
      if (expensesLst !== null) {
        this.isTrascError = true;
        this.flash.message = 'Expense Report Updated Successfully';
        this.flash.type = 'success';
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(() => {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");
          this.router.navigate(['../../../view-expenses/'], { relativeTo: this.route });
        }, 900);
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

  closeFix(event, datePicker) {
    if (!this.datePickContainer.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }
  closeFix3(event, datePicker) {
    if (!this.datePickContainer3.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  closeFix2(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  showHistory(id) {
    this._navigateDataService.resetReportIdAndStatus(this.reportid, this.status);
    this.selectedRowId = id;
    this.router.navigate(['../../../viewhistory-expense/', this.selectedRowId], { relativeTo: this.route });
  }

  getNextExpense(reportid) {
    this.getCurrenciesData();
    this.reportid = reportid;

    this._editExpensesService.getAllExpensesForReportId(this.reportid, this.status).subscribe(response => {
      this.fieldArray = response.field;
      this.parentReportId = response.parentId;
      if (response.expenseStartDate.length != null) {
        var date: string[] = response.expenseStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      }
      this.user.description = response.description;
      if (response.status === 'R')
        this.showRejectedField = true;
      else
        this.showRejectedField = false;

    },
      error => this.errorMessage = <any>error);

    this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
    this.inValidFields = ["exstartdate", "addProjectId", "addProjectTask", "addExpenseDate", "addExpenseTypeId", "addQuantity", "addReceiptPrice", "addCurrencyCode"];
    this.validationError = {
      exstartdate: false, addProjectId: false, addProjectTask: false, addExpenseDate: false, addExpenseTypeId: false, addQuantity: false,
      addReceiptPrice: false, addCurrencyCode: false
    };
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

  getExpenseStartDateField() {
    var startDt = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this._createExpenseService.getMinMaxDatesByStartDt(startDt).subscribe(response => {
      this.expenseWeekStartDate = response.reportMinDate;
      this.expenseWeekEndDate = response.reportMaxDate;
    },
      error => this.errorMessage = <any>error);
  }
}
