import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ExpenseType } from '../../shared/utilities/ExpenseType';
import { Expense } from '../../shared/utilities/expense.model';
import { CreateExpenseService } from '../../shared/services/createexpense.service';
import { AppConstants } from '../../shared/app-constants';
import { UploadFile } from '../../shared/utilities/uploadfile';
import { Flash } from '../../shared/utilities/flash';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ExpenseAttachmentComponent } from '../expense-attachment/expense-attachment.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";


declare var $: any;

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.css']
})
export class CreateExpenseComponent implements OnInit {
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  @ViewChild('AlertPopupError') alertPopupError: ElementRef;
  @ViewChild('DatePickContainer') datePickContainer;
  @ViewChild('DatePickContainer2') datePickContainer2;
  @ViewChild('DatePickContainer3') datePickContainer3;
  @ViewChild('AddAttachFileInput') addAttachFileInput;
  @ViewChild('EditAttachFileInput') editAttachFileInput;
  @ViewChild(ExpenseAttachmentComponent) expenseAttachmentComponent;

  invalidFileError = false;

  allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword", "image/png", "image/jpeg", "image/bmp", "image/gif", "image/tiff"];

  public files = [];
  oldExpenseRow = [];
  public user: any = {};
  public errorMessage: string;
  public crntPage: number;
  data: any;
  expense: Expense;
  addExpense: Expense;
  editExpense: Expense;
  expenses: any;
  selectedExpense: Expense;
  isNewRecord: boolean;
  taxList: any;
  nameId: Number;
  selectedRowId: Number;
  selectedQuantity: Number;
  selectedReceiptPrice: Number;
  selectedReceiptCurrency: string;
  selectedExpenseDate: string;
  selectedProjectId: Number;
  currencyExchangeDetails: any;
  startdate: string;
  expenseStartDateField: { "year": number, "month": number, "day": number };
  expenseSelectedDateField: { "year": number, "month": number, "day": number };
  expenseStartMaxDateField: { "year": number, "month": number, "day": number };
  expenseSelectedMinDateField: { "year": number, "month": number, "day": number };
  expenseSelectedMaxDateField: { "year": number, "month": number, "day": number };
  expenseMileageCheckDate: any;
  usEmployeesMileageExpensePrice: any;
  validationError: any;
  inValidFields: any;
  flash: Flash = new Flash();
  isTrascError: boolean = false;
  defaultCurrStartDate: string;
  existReportCount: Number;
  minMaxDatesDetails: any;
  p: number;
  isInternalProject: Boolean;
  expenseWeekStartDate: any;
  expenseWeekEndDate: any;
  modalId: String;

  public fieldArray: Array<any> = [];
  public expenseTypesData: Array<any> = [];
  public projectsData: Array<any> = [];
  public tasksData: Array<any> = [];
  public currencyListData: Array<any> = [];
  private newAttribute: any = {};
  private expensesList: any;
  private appData = AppConstants;
  selectedFile: File = null;
  invalidImage: boolean;
  url: string;
  attachmentUrl: string;
  maxFileSize5MB = 5242880;
  public uploadFile: UploadFile;
  isExistReport = false;
  invalidFileText: String;
  weekdate: String;
  isUploading: Boolean = false;
  addExpenseForm: FormGroup;
  isBillable: Boolean;
  getMileageRate: any;


  constructor(private toasterService: ToastrService, private _createExpenseService: CreateExpenseService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, public sanitizer: DomSanitizer) {
    // this.getExpensesTypes();
    this.expenses = new Array<Expense>();
    this.addExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', true, false, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
    this.editExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', true, false, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
  }

  ngOnInit() {
    var datePipe = new DatePipe('en-US');
    let dateString: string[] = datePipe.transform(new Date(), 'yyyy-MM-dd').split('-');
    this.expenseStartMaxDateField = { year: Number(dateString[0]), month: Number(dateString[1]), day: Number(dateString[2]) };
    this.inValidFields = ["exstartdate", "addProjectId", "addProjectTask", "addExpenseDate", "addExpenseTypeId", "addQuantity", "addReceiptPrice", "addCurrencyCode"];

    this.validationError = {
      exstartdate: false, addProjectId: false, addProjectTask: false, addExpenseDate: false, addExpenseTypeId: false, addQuantity: false,
      addReceiptPrice: false, addCurrencyCode: false
    };

    //this.getProjectsData();
    this.getCurrenciesData();

    this.getDefaultCurrentWeekStart();
    this.addExpenseBuildForm();
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

  getDefaultCurrentWeekStart(): void {
    this._createExpenseService.getDefaultCurrentWeekStart().subscribe(response => {
      this.defaultCurrStartDate = response.defaultCurrentWeekStart;
      if (this.defaultCurrStartDate.length != null) {
        var date: string[] = this.defaultCurrStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
        this.checkReportExistOrNot('exstartdate', this.expenseStartDateField);
        this.getExpenseStartDateField();
      }
    },
      error => this.errorMessage = <any>error);
  }

  getExpensesTypes(projectId): void {
    this._createExpenseService.getExpensesTypes(projectId).subscribe(expensestypes => {
      this.expenseTypesData = expensestypes;
      if (localStorage.getItem("orgCode") == AppConstants.OsiUsOrgCode || localStorage.getItem("orgCode") == AppConstants.OsiCanOrgCode) {
        this.expenseTypesData = this.expenseTypesData.filter(x => x.externalRefId != null)
      }
    },
      error => this.errorMessage = <any>error);
  }

  onSelectProject(event): void {
    //  make it false here
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
      // this.cd.detectChanges();
    },
      error => this.errorMessage = <any>error);
    this.getExpensesTypes(event);
  }

  onChangeProject(event): void {
    console.log('project Id = ', this.addExpense.billable)

    this.editExpense.projectTaskId = null;
    // this.editExpense.expenseTypeId = null;
    this._createExpenseService.getTasksData(event, this.expenseWeekStartDate, this.expenseWeekEndDate).subscribe(tasks => {
      this.tasksData = tasks;

      if (this.tasksData.length > 0 && this.tasksData[0].isInternal) {
        this.editExpense.billable = false;
        this.isBillable = true;
        this.addExpenseForm.controls['billable'].disable();
      } else {
        this.addExpenseForm.controls['billable'].enable();
        this.isBillable = false;
      }
    },
      error => this.errorMessage = <any>error);
    // this.getExpensesTypes(event);
  }

  getProjectsData(): void {
    this.weekdate = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this._createExpenseService.getProjectsData(this.weekdate).subscribe(projects => {
      this.projectsData = projects;
    },
      error => this.errorMessage = <any>error);
  }

  getCurrenciesData(): void {
    this._createExpenseService.getCurrenciesData().subscribe(currencies => {
      this.currencyListData = currencies;
    },
      error => this.errorMessage = <any>error);
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

    // var startDtString: string[] = this.minMaxDatesDetails.reportMinDate.split('-');
    // console.log(" Value for Current Date : dateString : ", JSON.stringify(startDtString));
    // this.expenseSelectedMinDateField = { year: Number(startDtString[0]), month: Number(startDtString[1]), day: Number(startDtString[2]) };

    // var endDtString: string[] = this.minMaxDatesDetails.reportMaxDate.split('-');
    // console.log(" Value for Current Date : dateString : ", JSON.stringify(endDtString));
    // this.expenseSelectedMaxDateField = { year: Number(endDtString[0]), month: Number(endDtString[1]), day: Number(endDtString[2]) };
    this.getProjectsData();
    if (id == 'add_expense') {
      //this.addExpense.exchangeRate = "";
      //this.addExpense.exchangeRateWithDesc = "";
      //this.addExpense.baseExchangeAmt = "";

      this.addExpense = new Expense('', '', '', '', '', '', '', '', '', '', '', '', false, true, '', false, '', '', '', '', new Array<UploadFile>(), new UploadFile());
      this.expenseSelectedDateField = { year: Number(), month: Number(), day: Number() };
      this.files = [];
      this.invalidFileError = false;
    } else if (id == 'edit_expense') {
      this.files = [];
      this.oldExpenseRow = [];
      this.editExpense = this.fieldArray.find(x => x.id == this.selectedRowId);
      for (let i = 0; i < this.editExpense.expenseAttachments.length; i++) {
        this.files.push(this.editExpense.expenseAttachments[i]);
        this.oldExpenseRow.push(this.editExpense.expenseAttachments[i]);
      }
      this.onSelectProject(this.editExpense.projectId);
      let date: string[] = this.editExpense.expenseDate.split('-');
      this.expenseSelectedDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      this.populateExchangeDetailsOnEdit(this.editExpense);
    }
  }

  editExpenseClose() {
    this.editExpense.expenseAttachments = [];
    for (let i = 0; i < this.oldExpenseRow.length; i++) {
      this.editExpense.expenseAttachments.push(this.oldExpenseRow[i]);
    }
  }

  addExpenseToList() {
    // this.addFilesToExpense();
    var maxId: 0;

    if (this.fieldArray.length == 0) {
      this.addExpense.id = '1';
    } else {
      maxId = Math.max.apply(Math, this.fieldArray.map(function (o) { return o.id; }));
      this.addExpense.id = String(maxId + 1);
    }
    this.populateNamesForSelectFields(this.addExpense);
    console.log('this.addexpemse', this.addExpense);
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

    if (this.fieldArray.length == 0) {
      this.addExpense.id = '1';
    } else {
      maxId = Math.max.apply(Math, this.fieldArray.map(function (o) { return o.id; }));
      this.addExpense.id = String(maxId + 1);
    }
    this.populateNamesForSelectFields(this.addExpense);
    console.log('this.addexpemse', this.addExpense);
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
    console.log(this.fieldArray);
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

  editExpenseInList() {
    // this.addFilesToExpense();
    this.populateNamesForSelectFields(this.editExpense);
    this.editExpense.expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    this.populateExchangeDetailsOnEdit(this.editExpense);
    let itemToUpdate = this.fieldArray.find(this.findIndexToUpdate, this.editExpense.id);
    let updateIndex = this.fieldArray.indexOf(itemToUpdate);
    this.fieldArray[updateIndex] = this.editExpense;
  }

  findIndexToUpdate(editExpense) {
    return editExpense.id === this;
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

  cancel() {
    //this.expenses.pop();
    this.selectedExpense = null;
    this.router.navigate(['../view-expenses/'], { relativeTo: this.route });
  }

  saveExpense() {

    let tmpDataArray = this.fieldArray.map(x => Object.assign({}, x));

    tmpDataArray.forEach(data => {
      delete data.id;
    })

    let attachmentData = [];
    let postFileArray = this.expenseAttachmentComponent.getAttachmentsToSubmit();
    postFileArray.forEach(x => {
      if (x["attachmentId"]) {
        attachmentData.push(x["attachmentId"]);
      }
    });
    this.user.field = [];
    this.user.field = tmpDataArray;
    this.user.exstartdate = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;
    this.user.attachmentIdList = attachmentData;
    this._createExpenseService.saveExpense(this.user).subscribe(expensesLst => {
      this.expensesList = expensesLst;
      $('#loadingSubmitModal').modal('hide');
      if (expensesLst !== null) {
        this.isTrascError = true;
        this.flash.message = 'Expense Report Saved Successfully';
        this.flash.type = 'success';
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(() => {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['/expenses/view-expenses'], { relativeTo: ref.route });
        }, 500);
      }
    },

      error => {
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, 900);
      });
  }

  submitExpense() {
    this.user.field = [];
    this.fieldArray.forEach(x => {
      delete x['state'];
    })

    let tmpDataArray = this.fieldArray.map(x => Object.assign({}, x));

    tmpDataArray.forEach(data => {
      delete data.id;
    })

    let attachmentData = [];

    let postFileArray = this.expenseAttachmentComponent.getAttachmentsToSubmit();
    postFileArray.forEach(x => {
      if (x["attachmentId"]) {
        attachmentData.push(x["attachmentId"]);
      }
    });

    this.user.field = tmpDataArray;
    this.user.attachmentIdList = attachmentData;
    this.user.exstartdate = this.expenseStartDateField.year + '-' + this.expenseStartDateField.month + '-' + this.expenseStartDateField.day;

    this._createExpenseService.submitExpense(this.user).subscribe(expensesLst => {

      this.expensesList = expensesLst;
      $('#loadingSubmitModal').modal('hide');

      if (expensesLst !== null) {
        this.isTrascError = true;
        this.flash.message = 'Expense Report Submitted Successfully';
        this.flash.type = 'success';
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(function () {
          ref.isTrascError = false;
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['/expenses/view-expenses'], { relativeTo: ref.route });
        }, 1000);
      }
    },
      error => {
        $('#loadingSubmitModal').modal('hide');
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, 1000);
      });
  }

  checkMultiSelect() {
    let count = 0;
    this.fieldArray.forEach(x => {
      if (x.state) {
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

  checkDeleteStatus() {
    return this.fieldArray.some(field => field.state == true);
    // let count = 0;
    // this.fieldArray.forEach(x=>{
    //   if(x.state){
    //     count++;
    //   }
    // });
    // console.log(count);
    // if(count>=1){
    //   return true;
    // }
  }

  isAllChecked() {
    if (this.fieldArray.length == 0) {
      return false;
    }
    return this.fieldArray.every(_ => _.state);
  }

  checkAll(event) {
    if (this.fieldArray.length == 1) {
      this.selectedRowId = this.fieldArray[0].id;
    }
    this.fieldArray.forEach(x => x.state = event.target.checked)
  }

  onEditChecked(event) {
    if (event.target.checked) {
      this.selectedRowId = event.target.value;
    } else {
      let count = 0;
      this.fieldArray.forEach(x => {
        if (x.state) {
          count++;
        }
      });
      if (count == 0) {
        this.selectedRowId = 0;
      } else if (count == 1) {
        this.fieldArray.forEach(x => {
          if (x.state) {
            this.selectedRowId = x.id;
          }
        });
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

    selectedExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
    selectedExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + "  " + this.currencyExchangeDetails.exchangeRatePattern;
    selectedExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
    if (this.tasksData.length > 0 && this.tasksData[0].isInternal) {
      this.isBillable = true;
    } else {
      this.isBillable = false;
    }
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
    // this.editExpense.receiptPrice = "";
    // this.editExpense.currencyCode = "";
    // this.editExpense.quantity = "";
    // this.editExpense.baseExchangeAmt="";
    // this.editExpense.exchangeRateWithDesc = "";
    // for (let i = 0; i < this.expenseTypesData.length; i++) {
    //   if (!isMileage && this.expenseTypesData[i].expenseTypeName == 'Mileage') {
    //     const expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    //     if (localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS') {
    //       this._createExpenseService.getMileageRate(localStorage.getItem('orgId'), expenseDate, this.expenseTypesData[i].expenseTypeId).subscribe(response => {
    //         if (response.message == null) {
    //           this.getMileageRate = 0;
    //         } else {
    //           this.getMileageRate = response.message;
    //         }
    //       });
    //       this.addExpense.receiptPrice = String(this.getMileageRate);
    //       this.editExpense.receiptPrice = String(this.getMileageRate);
    //     }
    //     else {
    //       this.addExpense.receiptPrice = String(0);
    //       this.editExpense.receiptPrice = String(0);
    //     }
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
        this.addExpense.receiptPrice = String(0);
      }
    }
  }

  populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId) {
    this._createExpenseService.populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId)
      .subscribe(currExchangeDetails => {
        this.currencyExchangeDetails = currExchangeDetails;

        if (this.selectedRowId > 0) {
          this.editExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
          this.editExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + " " + this.currencyExchangeDetails.exchangeRatePattern;
          this.editExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
        } else {
          this.addExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
          this.addExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + " " + this.currencyExchangeDetails.exchangeRatePattern;
          this.addExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
        }

      },
        error => this.errorMessage = <any>error);
  }

  populateCurrencyExchangeDetailsAdd(receiptCurrCode, qty, receiptPrice, expenseDate, projectId) {
    this._createExpenseService.populateCurrencyExchangeDetails(receiptCurrCode, qty, receiptPrice, expenseDate, projectId)
      .subscribe(currExchangeDetails => {
        this.currencyExchangeDetails = currExchangeDetails;
        this.addExpense.exchangeRate = String(this.currencyExchangeDetails.currencyExchangeRate);
        this.addExpense.exchangeRateWithDesc = String(this.currencyExchangeDetails.currencyExchangeRate) + " " + this.currencyExchangeDetails.exchangeRatePattern;
        this.addExpense.baseExchangeAmt = String(this.currencyExchangeDetails.employeeBaseCurrencyAmt);
      },
        error => this.errorMessage = <any>error);
  }



  onSelectCurrency(event): void {
    if (this.selectedRowId > 0) {
      this.selectedQuantity = +(this.editExpense.quantity);
      this.selectedReceiptPrice = +(this.editExpense.receiptPrice);
      this.selectedProjectId = +(this.editExpense.projectId);
    } else {
      this.selectedQuantity = +(this.addExpense.quantity);
      this.selectedReceiptPrice = +(this.addExpense.receiptPrice);
      this.selectedProjectId = +(this.addExpense.projectId);
    }
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;

    this.populateCurrencyExchangeDetails(event, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onSelectCurrencyAddExpense(event): void {
    this.selectedQuantity = +(this.addExpense.quantity);
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
      this.populateCurrencyExchangeDetailsAdd(event, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onChangeQty(event): void {
    if (this.selectedRowId > 0) {
      this.selectedReceiptCurrency = this.editExpense.currencyCode;
      this.selectedReceiptPrice = +(this.editExpense.receiptPrice);
      this.selectedProjectId = +(this.editExpense.projectId);
    } else {
      this.selectedReceiptCurrency = this.addExpense.currencyCode;
      this.selectedReceiptPrice = +(this.addExpense.receiptPrice);
      this.selectedProjectId = +(this.addExpense.projectId);
    }
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
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
      this.populateCurrencyExchangeDetailsAdd(this.selectedReceiptCurrency, event, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
  }

  onChangeReceiptPrice(event): void {
    if (this.selectedRowId > 0) {
      this.selectedQuantity = +(this.editExpense.quantity);
      this.selectedReceiptCurrency = this.editExpense.currencyCode;
      this.selectedProjectId = +(this.editExpense.projectId);
    } else {
      this.selectedQuantity = +(this.addExpense.quantity);
      this.selectedReceiptCurrency = this.addExpense.currencyCode;
      this.selectedProjectId = +(this.addExpense.projectId);
    }
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;

    this.populateCurrencyExchangeDetails(this.selectedReceiptCurrency, this.selectedQuantity, event, this.selectedExpenseDate, this.selectedProjectId);
  }
  onChangeExpenseDateAddExpense(): void {
    this.selectedQuantity = +(this.addExpense.quantity);
    this.selectedReceiptCurrency = this.addExpense.currencyCode;
    this.selectedProjectId = +(this.addExpense.projectId);
    this.selectedReceiptPrice = +(this.addExpense.receiptPrice);
    this.selectedExpenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
    if (this.selectedQuantity != 0 && this.selectedProjectId != 0 && this.selectedReceiptCurrency != '' && this.selectedReceiptPrice != 0) {
      this.populateCurrencyExchangeDetailsAdd(this.selectedReceiptCurrency, this.selectedQuantity, this.addExpense.receiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    } else if (this.selectedQuantity != 0) {
      this.populateCurrencyExchangeDetailsAdd(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
    } else if (this.selectedReceiptCurrency != '') {
      this.populateCurrencyExchangeDetailsAdd(this.selectedReceiptCurrency, this.selectedQuantity, this.selectedReceiptPrice, this.selectedExpenseDate, this.selectedProjectId);
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
      this.populateCurrencyExchangeDetailsAdd(this.selectedReceiptCurrency, this.selectedQuantity, event, this.selectedExpenseDate, this.selectedProjectId);
  }

  onSelectedRowDelete(): void {
    this.fieldArray = this.fieldArray.filter(field => field.state !== true);
    // if (this.fieldArray.length >= 1 && this.selectedRowId > 0) {
    //   this.fieldArray = this.fieldArray.filter(field => field.id !== this.selectedRowId);
    // }
    //$('#delete_expense').modal('hide');
  }

  /*onSelectedRowDelete() {
    if(this.fieldArray.length > 1 && this.selectedRowId > 0) {
      const index = this.fieldArray.findIndex(field => field._id === this.selectedRowId);
      this.fieldArray.splice(index, 1);
    }
  }*/

  checkReportExistOrNot(field, date: { "year": number, "month": number, "day": number }) {
    let selectedDate = date.year + '-' + date.month + '-' + date.day;
    this._createExpenseService.checkReportExistOrNot(selectedDate).subscribe(response => {
      this.existReportCount = +(response.reportsAlreadyExistCount);
      if (this.existReportCount > 0) {
        this.isExistReport = true;
        this.isTrascError = true;
        let ref = this;
        this.flash.message = 'Expense Report Exists for Selected Week';
        this.errorMessage = 'Expense Report Exists for Selected Week';
        this.flash.type = 'error';
        this.alertError.nativeElement.classList.add("show");
        setTimeout(function () {
          ref.isTrascError = false
          ref.alertError.nativeElement.classList.remove("show");
        }, 3000);
      } else {
        this.isExistReport = false;
      }
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

    if (this.addExpense.expenseTypeId != "" && localStorage.getItem('orgCode') && localStorage.getItem('orgCode') == 'OSIUS') {
      if (this.addExpense.expenseTypeName == 'Mileage') {
        let expenseDate = this.expenseSelectedDateField.year + '-' + this.expenseSelectedDateField.month + '-' + this.expenseSelectedDateField.day;
        this._createExpenseService.getMileageRate(localStorage.getItem('orgId'), expenseDate, this.addExpense.expenseTypeId).subscribe(response => {
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

  closeFix3(event, datePicker) {
    if (!this.datePickContainer3.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
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

  getExRateCurr(val) {
    if (val != undefined && val != "")
      return val.split(" ")[0];
  }

  uploadReceiptCalled() {
    this.expenseAttachmentComponent.uploadModalOpen();
  }

  getUploadEvent($event) {
    this.isUploading = $event;
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
