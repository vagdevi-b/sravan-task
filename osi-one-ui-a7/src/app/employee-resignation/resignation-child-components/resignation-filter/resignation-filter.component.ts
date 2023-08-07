import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { PandlService } from '../../../shared/services/pandl.service';

@Component({
  selector: 'app-resignation-filter',
  templateUrl: './resignation-filter.component.html',
  styleUrls: ['./resignation-filter.component.css']
})
export class ResignationFilterComponent implements OnInit {
  @ViewChild('DatePickContainer2') datePickContainer2;
  @ViewChild('DatePickContainer4') datePickContainer4;

  dropdownSettings = {};
  projectOrgDropDownSettings = {};
  projectPracticeDropDownSettings = {};
  projectSubPracticeDropDownSettings = {};
  customerDropDownSettings = {};
  projectDropDownSettings = {};
  employeeOrgDropDownSettings = {};
  employeeBuDropDownSettings = {};
  employeePracticeDropDownSettings = {};
  employeeDropDownSettings = {};
  employeeSubPracticeDropDownSettings = {};
  statusDropDownSettings = {};
  dropdownList: any = [];
  yearselected: any = [];
  year: any = [];
  // yearsdata: DropdownFilterDataModel[];
  projectorg: any = [];
  projectorgs: any = [];
  projectprct: any = [];
  projectsubprct: any = [];
  customer: any = [];
  project: any = [];
  employeeorg: any = [];
  employeebu: any = [];
  employeeprct: any = [];
  employeesubprct: any = [];
  employee: any = [];
  projectpractices: any = [];
  projectsubpractices: any = [];
  customers: any = [];
  projects: any = [];
  employeeorgs: any = [];
  employeeBUs: any = [];
  employeepractices: any = [];
  employeesubpractices: any = [];
  employees: any = [];


  //selected ngmodels of dropdowns
  projorg: any = [];
  projectpractice: any = [];
  projectsubpractice: any = [];
  custmer: any = [];
  prject: any = [];
  employeorg: any = [];
  employebu: any = [];
  employeepractice: any = [];
  employeesubpractice: any = [];
  employe: any = [];
  status: any = [];

  panelData: any = [];
  totalrevenue: any = 0;
  totalcost: any = 0;
  spinner: boolean = false;
  name = "";

  empdetails = [];
  rowData: any = [];
  arr1: any = [];
  filedatapopulate: any;
  rowData1: any;
  filtername: any;
  Status: any = [{ name: "Initiated", value: "Initiated" },
  { name: "Inprogress", value: "Inprogress" },
  { name: "Accepted", value: "Accepted" },
  { name: "Retained", value: "Retained" },
  { name: "Exit", value: "Exit" }];
  userIdinfo: string;
  orgs: any = [];
  businessUnits: any = [];
  filterForm: FormGroup;
  currentlySelectedOrg: any;
  currentlySelectedBu: any;
  currentlySelectedPractice: any;
  practiceData: any;
  subPractice: any;
  selectedData: any = [];
  mon: string;
  day: string;
  fromlwd: string = "";
  tolwd: string = "";
  mon1: string;
  day1: string;
  mon2: string;
  day2: string;
  mon3: string;
  day3: string;
  fromresgrange: string = "";
  toresgrange: string = "";
  selectedOrg: any;
  subPracticeData: any;
  statusdata: any = [];
  filteredOrgsList: any = [];
  filterEnable: boolean = false;
  organizationData: any = [];
  selected_orgs_Data: any = {};
  subpractice_Data: any = [];
  practice_Data: any = [];
  bu_Data: any = [];
  selected_bu_Data: any = {};
  selected_practice_Data: any = {};
  selected_subpractice_Data: any = {};
  selected_status_Data: any = {};
  fromLwdRangeDate: any = {};
  toLwdRangeDate: any = {};
  fromResignationRange: any = {};
  toResignationRange: any = {};
  selectedFromLWD: any = {};
  selectedToLWD: any = {};
  selectedFromResg: any = {};
  selectedToResg: any = {};
  constructor(private activemodel: NgbActiveModal, public fb: FormBuilder, public route: Router, private employeeResignationService: EmployeeResignationService, private pandlsvc: PandlService) {
    this.orgList();

  }

  ngOnInit() {

    this.userIdinfo = localStorage.getItem('userId');
    this.projectOrgDropDownSettings = {
      singleSelection: true,
      idField: "orgId",
      textField: "orgShortName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.employeeBuDropDownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    }

    this.employeePracticeDropDownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.employeeSubPracticeDropDownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.statusDropDownSettings = {
      singleSelection: false,
      idField: "value",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    }

    this.createForm();



  }

  createForm() {
    this.filterForm = this.fb.group({
      year: [''],
      org: [''],
      Bu: [''],
      practice: [''],
      subpractice: [''],
      status: [{ value: [] }],
      fromlwdRange: [''],
      tolwdRange: [''],
      fromResignationDate: [''],
      toResignationDate: ['']
    });
  }
  orgList() {
    this.employeeResignationService.getOrganizations().subscribe(response => {
      this.orgs = response;
      if (response) {
        localStorage.setItem('orgs_Data', JSON.stringify(response));
      }
    });

    if (localStorage.getItem('selected_orgs_Data') && localStorage.getItem('selected_orgs_Data') != '') {
      const setFilterData = JSON.parse(localStorage.getItem("selected_orgs_Data"));
      this.orgs = JSON.parse(localStorage.getItem('orgs_Data'));
      this.projorg.push(setFilterData);
    }
    if (localStorage.getItem('bu_Data') && localStorage.getItem('bu_Data') != '') {
      this.businessUnits = JSON.parse(localStorage.getItem('bu_Data'));
      if (localStorage.getItem('selected_bu_Data') && localStorage.getItem('selected_bu_Data') != '') {
        const setFilterData = JSON.parse(localStorage.getItem("selected_bu_Data"));
        this.employebu.push(setFilterData);
      }
    }
    if (localStorage.getItem('practice_Data') && localStorage.getItem('practice_Data') != '') {
      this.practiceData = JSON.parse(localStorage.getItem('practice_Data'));
      if (localStorage.getItem('selected_practice_Data') && localStorage.getItem('selected_practice_Data') != '') {
        const setFilterData = JSON.parse(localStorage.getItem("selected_practice_Data"));
        this.employeepractice.push(setFilterData);
      }
    }
    if (localStorage.getItem('subpractice_Data') && localStorage.getItem('subpractice_Data') != '') {
      this.subPractice = JSON.parse(localStorage.getItem('subpractice_Data'));
      if (localStorage.getItem('selected_subpractice_Data') && localStorage.getItem('selected_subpractice_Data') != '') {
        const setFilterData = JSON.parse(localStorage.getItem("selected_subpractice_Data"));
        this.employeesubpractice.push(setFilterData);
      }

    }

    if (localStorage.getItem('selected_status_Data') && localStorage.getItem('selected_status_Data') != '') {
      const setFilterData = localStorage.getItem("selected_status_Data").split(',');
      this.Status.forEach(element => {
        setFilterData.forEach(e => {
          if (element.value == e) {
            this.status.push(element);
          }
        })
      });
    }

    if (localStorage.getItem('from_Lwd_RangeDate') && localStorage.getItem('from_Lwd_RangeDate') != '') {
      this.fromLwdRangeDate = JSON.parse(localStorage.getItem('from_Lwd_RangeDate'));
    }
    if (localStorage.getItem('to_Lwd_RangeDate') && localStorage.getItem('to_Lwd_RangeDate') != '') {
      this.toLwdRangeDate = JSON.parse(localStorage.getItem('to_Lwd_RangeDate'));
    }
    if (localStorage.getItem('from_Resignation_Range') && localStorage.getItem('from_Resignation_Range') != '') {
      this.fromResignationRange = JSON.parse(localStorage.getItem('from_Resignation_Range'));
    }
    if (localStorage.getItem('to_Resignation_Range') && localStorage.getItem('to_Resignation_Range') != '') {
      this.toResignationRange = JSON.parse(localStorage.getItem('to_Resignation_Range'));
    }


  }

  onOrgSelected(item: any) {
    if (item) {
      this.selected_orgs_Data = JSON.stringify(item);
      localStorage.setItem('selected_orgs_Data', this.selected_orgs_Data);
    }
    this.currentlySelectedOrg = item.orgShortName;
    localStorage.setItem('orgs_Data_form', this.currentlySelectedOrg);
    const obj = {
      "id": 63,
      "dependents": [{ "OSIIND.Organization.VAL": this.currentlySelectedOrg, "STRUCTURE_TYPE": "EMPLOYEE" }]
    }
    this.employeeResignationService.getDependantData(obj).subscribe(res => {
      this.businessUnits = res;
      if (res) {
        this.bu_Data = JSON.stringify(res);
        localStorage.setItem('bu_Data', this.bu_Data);
      }
    });
  }


  onBuSelected(item: any) {
    if (item) {
      this.selected_bu_Data = JSON.stringify(item);
      localStorage.setItem('selected_bu_Data', this.selected_bu_Data);
    }
    this.currentlySelectedBu = item;
    localStorage.setItem('bu_Data_form', this.currentlySelectedBu);
    const obj = {
      "id": 61,
      "dependents": [{ "OSIIND.Organization.VAL": this.currentlySelectedOrg, "OSIIND.Business Unit.VAL": this.currentlySelectedBu, "STRUCTURE_TYPE": "EMPLOYEE" }]
    }
    this.employeeResignationService.getDependantData(obj).subscribe(res => {
      this.practiceData = res;
      if (res) {
        this.practice_Data = JSON.stringify(res);
        localStorage.setItem('practice_Data', this.practice_Data);
      }
    });
  }

  onPracticeSelected(item: any) {
    if (item) {
      this.selected_practice_Data = JSON.stringify(item);
      localStorage.setItem('selected_practice_Data', this.selected_practice_Data);
    }
    this.currentlySelectedPractice = item;
    localStorage.setItem('practice_form', this.currentlySelectedPractice);
    const obj = {
      "id": 60,
      "dependents": [{ "OSIIND.Organization.VAL": this.currentlySelectedOrg, "OSIIND.Business Unit.VAL": this.currentlySelectedBu, "OSIIND.Practice.VAL": this.currentlySelectedPractice, "STRUCTURE_TYPE": "EMPLOYEE" }]
    }
    this.employeeResignationService.getDependantData(obj).subscribe(res => {
      this.subPractice = res;
      if (res) {
        this.subpractice_Data = JSON.stringify(res);
        localStorage.setItem('subpractice_Data', this.subpractice_Data);
      }
    });
  }
  onSubPracticeSelected(item: any) {
    if (item) {
      this.selected_subpractice_Data = JSON.stringify(item);
      localStorage.setItem('selected_subpractice_Data', this.selected_subpractice_Data);
    }
    this.subPracticeData = item;
  }


  onStatusSelect(item: any) {
    if (item) {
      this.selected_status_Data = this.filterForm.controls['status'].value;
      localStorage.setItem('selected_status_Data', this.selected_status_Data);
    }
  }

  onItemSelect(item: any) {
    const currentlySelectedValue = item;
    this.selectedData.push(currentlySelectedValue);
    const status = Array.prototype.map.call(this.selectedData, function (item) {
      return item
    }).join(",");
    if (item) {
      this.selected_status_Data = this.filterForm.controls['status'].value;
      localStorage.setItem('selected_status_Data', this.selected_status_Data);
    }
    this.subPracticeData = item.name;
  }

  onItemDeSelect(e: any) {
    this.selectedData = this.Status.filter(item => item.value !== e);
    const status = Array.prototype.map.call(this.selectedData, function (item) {
      return item.value
    }).join(",");
    if (e) {
      this.selected_status_Data = this.filterForm.controls['status'].value;
      localStorage.setItem('selected_status_Data', this.selected_status_Data);
    }
    this.subPracticeData = e.name;

  }


  getDataFromLwd(e) {
    if (e) {
      this.selectedFromLWD = e;
      localStorage.setItem('from_Lwd_RangeDate', JSON.stringify(e));

    }

  }

  getDataToLwd(e) {
    if (e) {
      this.selectedToLWD = e;
      localStorage.setItem('to_Lwd_RangeDate', JSON.stringify(e));
    }
  }

  getDataFromResg(e) {
    if (e) {
      this.selectedFromResg = e;
      localStorage.setItem('from_Resignation_Range', JSON.stringify(e));
    }
  }

  getDataToResg(e) {
    if (e) {
      this.selectedToResg = e;
      localStorage.setItem('to_Resignation_Range', JSON.stringify(e));


    }
  }

  getallresignationlist() {
    this.statusdata = Array.prototype.map.call(this.selectedData, function (item) {
      return item
    }).join(",");

    console.log(this.filterForm.controls['fromlwdRange'].value);

    const obj = {}
    if (this.currentlySelectedOrg == undefined) {
      obj['organizationName'] = localStorage.getItem('orgs_Data_form')
    } else {
      obj['organizationName'] = this.currentlySelectedOrg;
    }

    if (this.currentlySelectedBu == undefined) {
      obj['businessUnit'] = localStorage.getItem('bu_Data_form')
    } else {
      obj['businessUnit'] = this.currentlySelectedBu;
    }

    if (this.currentlySelectedPractice == undefined) {
      obj['practice'] = localStorage.getItem('practice_form')
    } else {
      obj['practice'] = this.currentlySelectedPractice;
    }

    if (this.subPracticeData == undefined) {
      obj['subPractice'] = JSON.parse(localStorage.getItem("selected_subpractice_Data"));
    } else {
      obj['subPractice'] = this.subPracticeData;
    }

    if (localStorage.getItem("selected_status_Data") != null || localStorage.getItem("selected_status_Data") != undefined) {
      obj['status'] = localStorage.getItem("selected_status_Data").split(',');
    }

    if (Object.keys(this.selectedFromLWD).length > 0) {
      if (this.selectedFromLWD.month < 10) {
        this.mon = '0' + this.selectedFromLWD.month;
      } else {
        this.mon = this.selectedFromLWD.month;
      }
      if (this.selectedFromLWD.day < 10) {
        this.day = '0' + this.selectedFromLWD.day;
      } else {
        this.day = this.selectedFromLWD.day
      }
      obj['actualLWDStart'] = this.selectedFromLWD.year + "-" + this.mon + "-" + this.day;
    }

    if (Object.keys(this.selectedToLWD).length > 0) {
      if (this.selectedToLWD.month < 10) {
        this.mon = '0' + this.selectedToLWD.month;
      } else {
        this.mon = this.selectedToLWD.month;
      }
      if (this.selectedToLWD.day < 10) {
        this.day = '0' + this.selectedToLWD.day;
      } else {
        this.day = this.selectedToLWD.day
      }
      obj['actualLWDEnd'] = this.selectedToLWD.year + "-" + this.mon + "-" + this.day;
    }

    if (Object.keys(this.selectedFromResg).length > 0) {
      if (this.selectedFromResg.month < 10) {
        this.mon = '0' + this.selectedFromResg.month;
      } else {
        this.mon = this.selectedFromResg.month;
      }
      if (this.selectedFromResg.day < 10) {
        this.day = '0' + this.selectedFromResg.day;
      } else {
        this.day = this.selectedFromResg.day
      }
      obj['resignationDateStart'] = this.selectedFromResg.year + "-" + this.mon + "-" + this.day;
    }

    if (Object.keys(this.selectedToResg).length > 0) {
      if (this.selectedToResg.month < 10) {
        this.mon = '0' + this.selectedToResg.month;
      } else {
        this.mon = this.selectedToResg.month;
      }
      if (this.selectedToResg.day < 10) {
        this.day = '0' + this.selectedToResg.day;
      } else {
        this.day = this.selectedToResg.day
      }
      obj['resignationDateEnd'] = this.selectedToResg.year + "-" + this.mon + "-" + this.day;
    }
    const pageNumber = 0;
    const pageSize = 10;
    this.employeeResignationService.getallresignationdata(obj, pageNumber, pageSize).subscribe(response => {
      this.rowData = response.data.content;


      this.activemodel.close({ status: "success", filterdata: this.rowData, reset: "YES" });
    });

  }

  resetresignationlist() {
    localStorage.removeItem('selected_orgs_Data');
    localStorage.removeItem('selected_bu_Data');
    localStorage.removeItem('selected_practice_Data');
    localStorage.removeItem('selected_subpractice_Data');
    localStorage.removeItem('bu_Data');
    localStorage.removeItem('practice_Data');
    localStorage.removeItem('subpractice_Data');
    localStorage.removeItem('from_Lwd_RangeDate');
    localStorage.removeItem('to_Lwd_RangeDate');
    localStorage.removeItem('from_Resignation_Range');
    localStorage.removeItem('to_Resignation_Range');
    localStorage.removeItem('selected_status_Data');


    const obj = {}
    obj['status'] = ["Initiated", "Inprogress"];
    const pageNumber = 0;
    const pageSize = 10;
    this.employeeResignationService.getallresignationdata(obj, pageNumber, pageSize).subscribe(response => {
      this.rowData = response.data.content;
      this.activemodel.close({ status: "success", filterdata: this.rowData, reset: "NO" });
    });

  }

  closeFix(event, datePicker) {

    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }

  closeFix1(event, datePicker) {

    if (!this.datePickContainer4.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }

  close() {
    this.activemodel.close({ status: "Cancel" });
  }

  onReset() {
    this.filterForm.reset();
  }

}
