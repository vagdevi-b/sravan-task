import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { getDate, getFullYear } from 'ngx-bootstrap/chronos/utils/date-getters';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';

@Component({
  selector: 'app-emp-resignation-details',
  templateUrl: './emp-resignation-details.component.html',
  styleUrls: ['./emp-resignation-details.component.css']
})
export class EmpResignationDetailsComponent implements OnInit, OnChanges {
  resignationTypes: any = [{ name: "Voluntary", value: "Voluntary" },
  { name: "Involuntary", value: "Involuntary" },
  { name: "Termination", value: "Termination" }];

  dependencyTypes: any = [{ name: "High", value: "High" },
  { name: "Medium", value: "Medium" },
  { name: "Normal", value: "Normal" }];
  requestData: any[];
  @Input() ifCondition: any;
  userId: string;
  public model: any = {};
  employeeData: any;
  empInfoForm: FormGroup;
  @Output() selectedEmployeedata = new EventEmitter<any>();
  @Output() empinfo = new EventEmitter<any>();
  @Input() populateData = new EventEmitter<any>();
  @Input() flag = new EventEmitter<any>();


  @ViewChild('DatePickContainer2') datePickContainer2;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  resgdate: any;
  resgdate1: any;
  reqdate: any
  reqdate1: string;
  selectedempdetails: { resignationType: any; replacementRequired: any; dependencyType: any; requestedDateOfReleasing: string; dateOfResignation: any; };
  productList: any;
  mon: string;
  day: string;
  mon1: string;
  day1: string;
  resignationDate: any;
  reqdate2: string;
  selectedItems: any;
  show: boolean = false;
  validationError: any;
  inValidFields: any;
  expenseStartDateField: { "year": number, "month": number, "day": number };
  placement = "bottom-right";


  constructor(private employeeResignationService: EmployeeResignationService, private fb: FormBuilder,) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.getresignationrequest();
    this.createForm();
    this.resignationDate = this.disableDate();
    this.inValidFields = ["lwdRangeDate"];

    this.validationError = {
      lwdRangeDate: false
    };
  }


  disableDate() {
    const newDate = new Date();
    return {
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate()
    }
  }




  createForm() {
    this.empInfoForm = this.fb.group({
      empSelected: ['', [Validators.required]],
      resignationType: ['', [Validators.required]],
      replacementRequired: [true, [Validators.required]],
      dependencyType: ['', [Validators.required]],
      requestedDateOfReleasing: [''],
      dateOfResignation: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {

      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        switch (propName) {
          case 'populateData':
            {
              this.show = true;
              this.selectedItems = change.currentValue;
            }

            break;
        }
      }
    }
  }


  getData1(e) {
    if (e != undefined) {
      if (e.month < 10) {
        this.mon = '0' + e.month;
      } else {
        this.mon = e.month;
      }
      if (e.day < 10) {
        this.day = '0' + e.day;
      } else {
        this.day = e.day
      }
      this.resgdate1 = e.year + "-" + this.mon + "-" + this.day;
    }
    this.getData();
  }
  getData2(e) {
    if (e != undefined) {
      if (e.month < 10) {
        this.mon1 = '0' + e.month;
      } else {
        this.mon1 = e.month;
      }
      if (e.day < 10) {
        this.day1 = '0' + e.day;
      } else {
        this.day1 = e.day
      }

      this.reqdate2 = e.year + "-" + this.mon1 + "-" + this.day1;
    }
    this.getData();
  }

  getData() {
    const obj = {

      resignationType: this.empInfoForm.get('resignationType').value,
      replacementRequired: this.empInfoForm.get('replacementRequired').value === true ? true : false,
      dependencyType: this.empInfoForm.get('dependencyType').value,
      requestedDateOfReleasing: this.reqdate2,
      dateOfResignation: this.resgdate1,
    }
    this.selectedempdetails = obj;
    this.empinfo.emit(this.selectedempdetails);
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

  getresignationrequest(): void {
    this.employeeResignationService.getresignationrequest(this.userId).subscribe((res: any) => {
      this.requestData = res.employeeDtoList.filter(item => item.employeeId !== Number(this.userId));
    })
  }



  search = (text$: Observable<string>) =>

    text$.pipe(
      debounceTime(200),
      map(term => term == "" ? this.requestData.slice(0, 10)
        : this.requestData.filter(v => v.employeeFullName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  formatter = (x: { employeeFullName: string }) => x.employeeFullName;


  itemSelected($event) {
    this.employeeData = $event.item;
    this.selectedEmployeedata.emit(this.employeeData);
  }





  closeFix(event, datePicker) {

    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }

}
