import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response } from "@angular/http";
import { Organization } from "../../../shared/utilities/organization";
import { HttpUtilities } from "../../../shared/utilities";
import { AccuralRuleService } from "../../../shared/services/accuralRule.service";


@Component({
  selector: "show-LeaveAccruals",
  templateUrl: "./show-LeaveAccruals.html",
  styleUrls: ["./show-LeaveAccruals.css"]
})
export class ShowLeaveAccuralsComponent implements OnInit {
 
  ruleId: number;
  accrualDetails: any[] = [];
  // allLocation: any[] = [];
  leaveTypesList: any[] = [];
  employeeStatusList: any[] = [];
  accuralInterval: any[] = [];
  errorMessage: any;
  orgName: Organization;
  public interval;
  public leaveType;
  public loc;
  isUpdatable: Boolean = false;
  employeeStatus;
  allOrg = [];
  allLocationByOrgId = [];



  public user: any = {
    ruleId : null,
    ruleName: "", //Accrual Name
    typeDesc: "", // Desp
    locationId: null,
    leaveTypeId: null,
    lboundPeriod: null, //exp range to
    uboundPeriod: null, // exp range from
    leaveDays: null,
    advanceAccrual: "",
    empTitleId: 0, //not sending
    carryForwardDays: 0, //carryForwardDays
    accrualIntervalId: null,
    active: false,
    orgId:null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    private httpUtilities: HttpUtilities,
    private _accuralRuleService: AccuralRuleService
  ) {}

  ngOnInit() {
    this.ruleId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.getLeaveAccrualDetails(this.ruleId);
    // this.getAllLocations();
    this.getAllOrganization();
    this.getLeaveTypes();
    this.getAccrualInterval();
	this.getEmployeeStatusList();
    this.getOrganizationName();
  }

  getOrganizationName() {
    this._accuralRuleService
      .getOrganizationByEmployeeId()
      .subscribe(response => {
        this.orgName = response;
        console.log(this.orgName);
      }, error => (this.errorMessage = <any>error));
  }


  getAllOrganization() {
    this._accuralRuleService.getAllOrganization().subscribe(response => {
      this.allOrg = response;
    })
  }

  getLocationByOrgId(selectedOrgId) {
    
      this._accuralRuleService.getLocationByOrgId(selectedOrgId).subscribe(response => {
        this.allLocationByOrgId = response;
      })
   
  }
  getLeaveAccrualDetails(id) {
    this._accuralRuleService.getAccrualsByruleId(id).subscribe(resp => {
      // this.user = resp;
      Object.assign(this.user, resp);
      console.log("the Selected Accrual is ::: ");
      console.log(this.user);
    },
    ()=>{},
    ()=>{
      this.getLocationByOrgId(this.user.orgId);
    }
    );
  
  }

  updateLeaveAccurals(user) {
    console.log(JSON.stringify(this.user));

    if(user.ruleId != null){
    this._accuralRuleService
      .updateLeaveAccurals(user)
      .subscribe(response => {
        this.router.navigate(["/leaves/viewleaveaccurals"], {
          relativeTo: this.route
        });
        this.user = {};
      }, error => (this.errorMessage = <any>error));
    }
  }

  getAccrualInterval(): any {
    this._accuralRuleService.getAccuralPeriodInterval().subscribe(response => {
      this.accuralInterval = response;
      if (this.accuralInterval["osiLookupValueses"].length > 0) {
        this.accuralInterval = this.accuralInterval["osiLookupValueses"];

        this.accuralInterval.sort(function(a, b){
          if(a.lookupValue < b.lookupValue) return -1;
          if(a.lookupValue > b.lookupValue) return 1;
          return 0;
      })

      }
      console.log(this.accuralInterval);
    }, error => (this.errorMessage = <any>error));
  }

  // getAllLocations() {
  //   this._accuralRuleService.getLocations().subscribe(response => {
  //     this.allLocation = response;
  //     this.allLocation.sort(function(a, b){
  //       if(a.locationName < b.locationName) return -1;
  //       if(a.locationName > b.locationName) return 1;
  //       return 0;
  //   })
      
      
  //     console.log(this.allLocation);

       
  //   }, error => (this.errorMessage = <any>error));
  // }

  getLeaveTypes() {
    this._accuralRuleService.getLeaveTypes().subscribe(response => {
      this.leaveTypesList = response;

      this.leaveTypesList.sort(function(a, b){
        if(a.leaveTypeName < b.leaveTypeName) return -1;
        if(a.leaveTypeName > b.leaveTypeName) return 1;
        return 0;
    })
    }, error => (this.errorMessage = <any>error));
  }
  
  getEmployeeStatusList() {
    this._accuralRuleService.getEmployeeStatusList().subscribe(response => {
      this.employeeStatusList = response;

    /*  this.leaveTypesList.sort(function(a, b){
        if(a.leaveTypeName < b.leaveTypeName) return -1;
        if(a.leaveTypeName > b.leaveTypeName) return 1;
        return 0;
    })*/
    }, error => (this.errorMessage = <any>error));
  }

  onCancel() {
    this.router.navigate(["/leaves/viewleaveaccurals"], {
      relativeTo: this.route
    });
  }
}
