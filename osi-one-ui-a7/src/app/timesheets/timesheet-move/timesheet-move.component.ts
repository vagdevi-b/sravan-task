import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TimesheetService } from '../../shared/services/timesheet.service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtilities } from '../../shared/utilities';
declare var $: any;

@Component({
  selector: 'app-timesheet-move',
  templateUrl: './timesheet-move.component.html',
  styleUrls: ['./timesheet-move.component.css'],
  providers: [TimesheetService]
})
export class TimesheetMoveComponent implements OnInit, OnDestroy {
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  @ViewChild('projectSearchInput') projectSearchInput: ElementRef;
  @ViewChild('projectToSearchInput') projectToSearchInput: ElementRef;
  @ViewChild('DatePickContainer1') datePickContainer1;
  @ViewChild('DatePickContainer2') datePickContainer2;
  private fromProjectSubscription: Subscription;
  private toProjectSubscription: Subscription;
  timeSheetForm: FormGroup;
  hideSearching: Boolean = true;
  hideToSearching: Boolean = true;
  projectList = [];
  fromTaskList = [];
  toTaskList = [];
  employeeId: String = '';
  employeeLength: Boolean;
  employeeList: any[];
  fullName: any;
  selectedDates: any;
  errorMessage: String;
  successMessage: String;
  billTypeList = [{ id: 176, typeName: "BILLABLE" }, { id: 177, typeName: "NON BILLABLE" }, { id: 178, typeName: "INTERNAL" }, { id: 258, typeName: "NON-INVOICABLE" }];
  filteredBillTypeList = [{ id: 176, typeName: "BILLABLE" }, { id: 177, typeName: "NON BILLABLE" }, { id: 178, typeName: "INTERNAL" }, { id: 258, typeName: "NON-INVOICABLE" }];
  filteredFromBillTypeList = [];
  selectedEmpStartWeek;
  selectedEmpEndWeek;
  fromDateDateDisable;
  toDateDateDisable;
  recordMoveCount: Number = 0;
  hideRecordCount: Boolean = true;
  //Loader variables
  isLoadingToTask: Boolean = false;
  fromProjectLoader: Boolean = false;
  toProjectLoader: Boolean = false;
  fromTaskLoader: Boolean = false;
  fromEmpLoader: Boolean = false;
 
  dateInvalid = false;

  constructor(
    private formBuilder: FormBuilder,
    private timesheetService: TimesheetService,
    private calendar: NgbCalendar,
    private commonUtilities: CommonUtilities
  ) { }

  ngOnInit() {
    this.fromProjectSubscription = fromEvent(this.projectSearchInput.nativeElement, 'keyup').pipe(
      map((evt: any) => evt.target.value),
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((text: string) => this.searchForProject(text, 'from'));

    this.toProjectSubscription = fromEvent(this.projectToSearchInput.nativeElement, 'keyup').pipe(
      map((evt: any) => evt.target.value),
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((text: string) => this.searchForProject(text, 'to'));

    this.createFormGroup();
  }

  ngOnDestroy() {
    this.fromProjectSubscription.unsubscribe();
    this.toProjectSubscription.unsubscribe();
  }

  searchForProject(projectString, actionOn) {
    if (actionOn == 'from') {
      this.timeSheetForm.get('fromProjectId').setValue('');
    } else {
      this.timeSheetForm.get('toProjectId').setValue('');
    }
    if (projectString.length > 2) {
      if (actionOn == 'from') {
        this.fromProjectLoader = true;
      } else {
        this.toProjectLoader = true;
      }
      let projectFilterObject = { filterProjectName: projectString };
      this.timesheetService.getProjectsByName(projectFilterObject).subscribe(response => {
        this.projectList = response;
        if (actionOn == 'from') {
          this.fromProjectLoader = false;
          this.hideSearching = false;
        } else {
          this.toProjectLoader = false;
          this.hideToSearching = false;
        }
      }, error => {
        this.fromProjectLoader = false;
        this.toProjectLoader = false;
        this.errorMessage = "Error In Getting Projects";
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, 3000);
      })
    } else {
      if (actionOn == 'from') {
        this.fromProjectLoader = false;
        this.hideSearching = true;
      } else {
        this.fromProjectLoader = false;
        this.hideToSearching = true;
      }
    }
  }

  projectSelected(project, actionOn) {
    if (actionOn == 'from') {
      this.hideSearching = true;
      this.timeSheetForm.get('fromProjectName').setValue(project.projectName);
      this.timeSheetForm.get('fromProjectId').setValue(project.projectId);
      this.projectChange(project.projectId, actionOn);
    } else {
      this.hideToSearching = true;
      this.timeSheetForm.get('toProjectName').setValue(project.projectName);
      this.timeSheetForm.get('toProjectId').setValue(project.projectId);
      this.projectChange(project.projectId, actionOn);
    }
  }

  createFormGroup() {
    this.timeSheetForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      fromProjectId: ['', Validators.required],
      fromProjectName: ['', Validators.required],
      fromTaskId: ['', Validators.required],
      tsFromDate: ['', Validators.required],
      tsToDate: ['', Validators.required],
      toProjectId: ['', Validators.required],
      toProjectName: ['', Validators.required],
      toTaskId: ['', Validators.required],
      toBillType: ['', Validators.required],
      fromBillType: ['', Validators.required],
    }, {
        validator: Validators.compose([
          this.dateLessThan('tsFromDate', 'tsToDate', { 'tsFromDate': true }),
        ])
      });
  }

  projectChange(projectId, actionOn) {
    this.fromTaskLoader = actionOn == "from" ? true : false;
    this.isLoadingToTask = actionOn == "to" ? true : false;
    this.timesheetService.getTaskListByProject(projectId).subscribe(response => {
      if (actionOn == "from") {
        this.fromTaskLoader = false;
        this.hideRecordCount = true;
        this.timeSheetForm.get('fromTaskId').setValue('');
        this.fromTaskList = response;
        this.timeSheetForm.get('employeeId').setValue('');
        this.employeeList = []
      } else {
        this.timeSheetForm.get('toTaskId').setValue('');
        this.toTaskList = response;
        this.isLoadingToTask = false;
      }
    }, error => {
      console.error(error);
      this.isLoadingToTask = false;
      this.errorMessage = "Error in getting tasks";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 3000);
    })
  }

  getBillTypes(e, actionOn) {
    if (actionOn == 'to') {
      this.timeSheetForm.get('toBillType').setValue('');
      let selectedTask = this.toTaskList.filter(x => x.taskId == e.target.value);
      if (selectedTask[0].taskType == 176 || selectedTask[0].taskType == 177) {
        this.filteredBillTypeList = this.billTypeList.filter(x => x.id == 176 || x.id == 177);
      } else {
        this.filteredBillTypeList = this.billTypeList.filter(x => x.id == selectedTask[0].taskType);
      }
    }
  }

  getEmployeeList() {
    this.fromEmpLoader = true;
    let taskIds = this.timeSheetForm.value['fromTaskId'];
    this.timesheetService.getEmployeeDetails(taskIds).subscribe(response => {
      this.fromEmpLoader = false;
      this.timeSheetForm.get('employeeId').setValue('');
      this.employeeList = response;
      this.employeeList.sort((a,b) => (a.fullName > b.fullName) ? 1 : ((b.fullName > a.fullName) ? -1 : 0));
      console.log(response)
    }, error => {
      this.errorMessage = "Error in getting employee details";
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 3000);
    })
  }

  clearForm() {
    this.timeSheetForm.reset();
    this.timeSheetForm.get('toProjectId').setValue('');
    this.timeSheetForm.get('toTaskId').setValue('');
    this.timeSheetForm.get('fromProjectId').setValue('');
    this.timeSheetForm.get('fromTaskId').setValue('');
    this.timeSheetForm.get('toBillType').setValue('');
    this.timeSheetForm.get('fromBillType').setValue('');
    this.fullName = '';
    this.employeeId = '';
    this.hideRecordCount = true;
    this.projectList = [];
    this.fromTaskList = [];
    this.toTaskList = [];
    this.employeeList = [];
  }

  onSubmit() {
    var invalid: Boolean = false;
    var value = undefined;
    var field = undefined;
    if (this.timeSheetForm.value['fromProjectName'] == '') {
      invalid = true;
      value = 'From Project Name';
      field = this.timeSheetForm.value['fromProjectName'];
    }
    else if (this.timeSheetForm.value['fromTaskId'] == '') {
      invalid = true;
      value = 'From Task Name';
      field = this.timeSheetForm.value['fromTaskId'];

    }
    else if (this.timeSheetForm.value['employeeId'] == '') {
      invalid = true;
      value = 'Employees';
      field = this.timeSheetForm.value['employeeId'];

    }
    else if (this.timeSheetForm.value['tsFromDate'] == '') {
      invalid = true;
      value = 'From Date';
      field = this.timeSheetForm.value['tsFromDate'];

    }
    else if (this.timeSheetForm.value['tsToDate'] == '') {
      invalid = true;
      value = 'To Date';
      field = this.timeSheetForm.value['tsToDate'];

    }
    else if (this.timeSheetForm.value['fromBillType'] == '') {
      invalid = true;
      value = 'Bill Type';
      field = this.timeSheetForm.value['fromBillType'];

    }
    else if (this.timeSheetForm.value['toProjectName'] == '') {
      invalid = true;
      value = 'To Project Name';
      field = this.timeSheetForm.value['toProjectName'];

    }
    else if (this.timeSheetForm.value['toTaskId'] == '') {
      invalid = true;
      value = 'To Task Name';
      field = this.timeSheetForm.value['toTaskId'];

    }
    else if (this.timeSheetForm.value['toBillType'] == '') {
      invalid = true;
      value = 'To Bill Type';
      field = this.timeSheetForm.value['toBillType'];

    }


    if (invalid) {
      // Main.errorHandler("Mandatory field data is Invalid - " + value);
      this.errorMessage = "Mandatory field data is Invalid - " + value;
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 3000);
      return;

    }

    const tsFromDate = this.timeSheetForm.value['tsFromDate'];
    const tsToDate = this.timeSheetForm.value['tsToDate'];

    let dataToPost = {
      employeeId: this.timeSheetForm.value['employeeId'],
      fromProjectId: this.timeSheetForm.value['fromProjectId'],
      fromTaskId: this.timeSheetForm.value['fromTaskId'],
      tsFromDate: this.commonUtilities.getISODateFromDateStruct(tsFromDate),
      tsToDate: this.commonUtilities.getISODateFromDateStruct(tsToDate),
      toProjectId: this.timeSheetForm.value['toProjectId'],
      toTaskId: this.timeSheetForm.value['toTaskId'],
      toBillType: this.timeSheetForm.value['toBillType'],
      fromBillType: this.timeSheetForm.value['fromBillType']
    };
    $('#loadingSubmitModal').modal('show');
    this.timesheetService.moveTimesheets(dataToPost).subscribe(response => {
      $('#loadingSubmitModal').modal('hide');

      if (response.code === 200) {
        this.successMessage = 'Timesheets moved';
        this.alertSuccess.nativeElement.classList.add('show');
        setTimeout(() => {
          this.alertSuccess.nativeElement.classList.remove('show');
        }, 3000);
      } else if (response.code === 206) { // for partial timesheet movement
        this.errorMessage = response.message;
        this.alertError.nativeElement.classList.add('show');
        setTimeout(() => {
          this.alertError.nativeElement.classList.remove('show');
        }, 8000);
      }
    }, error => {
      $('#loadingSubmitModal').modal('hide');
      console.error(error)
      let err = JSON.parse(error._body);
      this.errorMessage = <any>err.message;
      this.alertError.nativeElement.classList.add("show");
      let ref = this;
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 3000);
    });

  }

  dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1 = c.get(dateField1).value;
      const date2 = c.get(dateField2).value;
      if ((date1 !== null && date2 !== null) && new Date(date1.year, date1.month - 1, date1.day) > new Date(date2.year, date2.month - 1, date2.day)) {
        return validatorField;
      }
      return null;
    };
  }

  closeFix1(event, datePicker) {
    if (!this.datePickContainer1.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  closeFix2(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }
}
