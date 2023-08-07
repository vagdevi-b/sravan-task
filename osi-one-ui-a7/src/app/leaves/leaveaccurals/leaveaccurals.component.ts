import { RuleModel } from "./../../shared/utilities/ruleModel.model";
import { CreateHolidayService } from "./../../shared/services/createHoliday.service";
import { AccuralRuleService } from "./../../shared/services/accuralRule.service";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as $ from "jquery";
import { Accurals } from "../../shared/utilities/accurals.model";
import { Organization } from "../../shared/utilities/organization";
//import { HttpUtilities } from '../../../shared/utilities';
//import { AppConstants } from '../../../shared/app-constants';

@Component({
  selector: "app-leave-accurals",
  templateUrl: "./leave-accurals.component.html",
  styleUrls: ["./leaveaccurals.component.css"]
})
export class LeaveAccuralsComponent implements OnInit {
  uRulesBoundPeriod: any;
  iRulesBoundPeriod: any;
  empState: any;
  leaveTypesList: any;
  employeeStatusList: any;
  employeeStatus;
  employeeLevel: any;
  accuralNames: any;
  accuralInterval: any[];
  empStatus: any;
  locations: any;
  leaveTypesName: any;
  leaveType: any;
  // locationName: any;
  organaizationName: any;
  inValidFields: any;
  validationError: any;
  leaveTypes: any;
  public fieldArray: Array<any> = [];
  listnames: any;
  //orgName: any;
  isManager: any;
  errorMessage: any;
  addRule: any;
  rules: any;
  leaveSelectedFromDate: { year: number; month: number; day: number };
  leaveSelectedToDate: { year: number; month: number; day: number };
  medicineAddList = Array<RuleModel>();
  accurals: Accurals[];
  orgName: Organization;
  isEnable = false;
  isPto = false;
  selectedleaveTypeName = '';
  allOrg = [];
  allLocationByOrgId = [];

  public user: any = {
    ruleName: null, //Accrual Name
    typeDesc: null, // Desp
    locationId: null,
    leaveTypeId: null,
    leaveDays: null,
    empTitleId: null,//not sending
    carryForwardDays: null, //carryForwardDays
    accrualIntervalId: null,
    active: true,
    advanceAccrual: true,
    orgId: null
  };


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _accuralRuleService: AccuralRuleService,
    private createHolidayService: CreateHolidayService
  ) {
    this.rules = new RuleModel("", "", 0, 0, 0);

    this.orgName = new Organization("", "", false, '');
  }

  ngOnInit() {
    //this.getLocations();
    // this.getOrganizationByEmployeeId();
    this.getAllOrganization();
    this.leaveSelectedFromDate = {
      year: Number(),
      month: Number(),
      day: Number()
    };
    this.leaveSelectedToDate = {
      year: Number(),
      month: Number(),
      day: Number()

    };

    this.inValidFields = [
      "experience",
      "type",
      "emplevel",
      "empstatus",
      "leavedays"
    ];
    this.validationError = {
      experience: false,
      type: false,
      emplevel: false,
      empstatus: false,
      leavedays: false
    };

    this._accuralRuleService
      .getOrganizationByEmployeeId()
      .subscribe(response => {
        this.orgName = response;
        console.log(this.orgName);
      }, error => (this.errorMessage = <any>error));

    // this._accuralRuleService.getLocations().subscribe(response => {
    //   this.locationName = response;
    //   this.locationName.sort(function (a, b) {
    //     if (a.locationName < b.locationName) return -1;
    //     if (a.locationName > b.locationName) return 1;
    //     return 0;
    //   })
    // }, error => (this.errorMessage = <any>error));

    this._accuralRuleService.getLeaveTypes().subscribe(response => {
      this.leaveTypesList = response;

      this.leaveTypesList.sort(function (a, b) {
        if (a.leaveTypeName < b.leaveTypeName) return -1;
        if (a.leaveTypeName > b.leaveTypeName) return 1;
        return 0;
      })

    }, error => (this.errorMessage = <any>error));

    this.getEmployeeStatus();




    /*this._accuralRuleService.getEmployeeStatus().subscribe(response => {
      this.empState = response;
     },
     error => this.errorMessage = <any>error); */

    this._accuralRuleService.getRuleIBoundPeriod().subscribe(response => {
      this.iRulesBoundPeriod = response;
    }, error => (this.errorMessage = <any>error));

    this._accuralRuleService.getAccuralPeriodInterval().subscribe(response => {
      this.accuralInterval = response;
      if (this.accuralInterval['osiLookupValueses'].length > 0) {
        this.accuralInterval = this.accuralInterval['osiLookupValueses'];

        this.accuralInterval.sort(function (a, b) {
          if (a.lookupValue < b.lookupValue) return -1;
          if (a.lookupValue > b.lookupValue) return 1;
          return 0;
        })

      }
      console.log(this.accuralInterval);
    }, error => (this.errorMessage = <any>error));

    /*  this._accuralRuleService.getRuleIBoundPeriod().subscribe(response => {
      this.iRulesBoundPeriod = response;
     }, */

    this._accuralRuleService.getRuleUBoundPeriod().subscribe(response => {
      this.uRulesBoundPeriod = response;
    }, error => (this.errorMessage = <any>error));

    this._accuralRuleService.getEmployeeLevel().subscribe(response => {
      this.employeeLevel = response;
    }, error => (this.errorMessage = <any>error));

    this._accuralRuleService.getAccrualIntervalDetails().subscribe(response => {
      this.accuralNames = response;
    }, error => (this.errorMessage = <any>error));
  }


  getAllOrganization() {
    this._accuralRuleService.getAllOrganization().subscribe(response => {
      this.allOrg = response;
    })
  }

  getLocationByOrgId(selectedOrgId) {
    this.allLocationByOrgId=[];
    this.user.locationId = null;
    if (selectedOrgId != "null") {
      this._accuralRuleService.getLocationByOrgId(selectedOrgId).subscribe(response => {
        this.allLocationByOrgId = response;
      })
    } else {
      this.allLocationByOrgId = [];
      this.user.locationId = null;
    }
  }

  getEmployeeStatus() {

    this._accuralRuleService.getEmployeeStatusList().subscribe(response => {

      if (response.length > 0) {
        this.employeeStatusList = response
        console.log(this.employeeStatusList);
      }
    })

  }
  addAccuralRule() {
    //this.rules.id = 1;
    //this.fieldArray.push(this.rules);
    var medData = new RuleModel("", "", 0, 0, 0); // creating object of your model class
    this.medicineAddList.push(medData);
    console.log("field array : " + JSON.stringify(this.medicineAddList));
    //this.rules = new RuleModel('','',0,0,0);

    /*var maxId : 0;
    if(this.fieldArray.length == 1){
      this.addRule.id = '1';
    }else{
      maxId = Math.max.apply(Math,this.fieldArray.map(function(o){return o.id;}));
      console.log("Add holiday : Value for maxId : " + maxId);
      this.addRule.id = String(maxId+1);
      console.log("addRule : Value for Next max : " + this.addRule.id);
    }

    this.fieldArray.push(this.addRule);
    console.log("field array : " + JSON.stringify(this.fieldArray));*/
  }
  onCancel() {
    this.router.navigate(["/leaves/viewleaveaccurals"], {
      relativeTo: this.route
    });
  }


  converter1(key, event) {
    this.isPto = false;
    if (this.user[key] === 'null') {
      this.user[key] = null
    }
    this.leaveTypesList.forEach(element => {
      if (element.leaveTypeId == event.target.value) {
        this.selectedleaveTypeName = element.leaveTypeName;
      }
    });
    if (this.selectedleaveTypeName == "PAID TIME OFF (PTO)" || this.selectedleaveTypeName == "Paid TIME Off (PTO)") {
      this.isPto = true;
    }
  }

  converter(key) {
    if (this.user[key] === 'null') {
      this.user[key] = null
    }

  }


  saveLeaveAccurals() {


    console.log(JSON.stringify(this.user));
    this._accuralRuleService
      .saveLeaveAccurals(this.user)
      .subscribe(response => {
        this.router.navigate(["/leaves/viewleaveaccurals"], {
          relativeTo: this.route
        });
        this.user = {};
      }, error => (this.errorMessage = <any>error));
  }

  validateField(field, value) {
    if (!value || value === "-- Select --" || value === -1 || value === "") {
      this.validationError[field] = true;
      if (this.inValidFields.indexOf(field) === -1) {
        this.inValidFields.push(field);
      }
    } else {
      this.validationError[field] = false;
      this.inValidFields.splice(this.inValidFields.indexOf(field), 1);
    }
  }

  validateDate(field, date: { year: number; month: number; day: number }) {
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



}
