import { AccuralRuleService } from "./../../shared/services/accuralRule.service";
import { OrgHolidays } from "./../../shared/utilities/OrgHolidays";
import { leave } from "@angular/core/src/profile/wtf_impl";

import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Http, Response } from "@angular/http";
import * as $ from "jquery";
import { HttpUtilities } from "../../shared/utilities";
import { AppConstants } from "../../shared/app-constants";
import { toInteger } from "@ng-bootstrap/ng-bootstrap/util/util";

@Component({
  selector: "app-view-leave-accurals",
  templateUrl: "./viewleaveaccurals.component.html",
  styleUrls: ["./viewleaveaccurals.component.css"]
})
export class ViewLeaveAccuralsComponent implements OnInit {
  accuralNames: any;
  empStatus: any;
  leaveTypesName: any;
  errorMessage: any;
  locationName: any;
  organaizationName: any;
  rowSelection: string;
  leaveId: any;
  private gridApi;
  private gridColumnApi;

  isSelectedRow = false;
  selectedRow = null;

  public columnDefs1: any[];
  public columnDefs: any[];
  public rowData;
  public gridOptions;

  public paginationPageSize;
  private noOfHours: any;
  private appData = AppConstants;

  public user: any = {};
  isNotManager: boolean = true;

  allAccruals: any[] = [];
  total: number = 0;
  leaveType: any[] = [];
  crntpage: number = 1;
  selectedRuleId: number;
  allLocations: any[] = [];
  empStatusList: any[] =[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpUtilities: HttpUtilities,
    private _accuralRuleService: AccuralRuleService
  ) {}

  ngOnInit() {
    this.getAllAccrualsRule();
   // this.getOrganisationDetails();
  }

  getOrganisationDetails() {
    this._accuralRuleService.getOrganizationByEmployeeId().subscribe(resp => {
      this.organaizationName = resp.organisationName;
    });
  }

  getAllAccrualsRule() {
    this._accuralRuleService.getAccruals().subscribe(response => {
      this.allAccruals = response;

      if (this.allAccruals.length > 0) {
        this.total = this.allAccruals.length;
      }

      //get the locations as per accrual rule
    /*  this._accuralRuleService.getLocations().subscribe(response => {
        this.allLocations = response;
        this.allAccruals.forEach(data =>
          this.allLocations.forEach(x => {
            if(data.locationId === x.locationId){
            data.locationName = x["locationName"]; 
            
            };console.log(x["locationName"]);
          })
        );
      }); */

      //get the leave type
      this._accuralRuleService.getLeaveTypes().subscribe(resp => {
        this.leaveType = resp;
        console.log(resp);
        
        this.allAccruals.forEach(acc => {
        this.leaveType.forEach(leaveType => {
            if (acc.leaveTypeId === leaveType.leaveTypeId) {
              acc.leaveTypeName = leaveType.leaveTypeName;
              console.log(acc.leaveTypeName);
            }
          });
        });
      });
      
      
      //getEmployee Status list
        this._accuralRuleService.getEmployeeStatusList().subscribe(resp => {
          this.empStatusList = resp;

          this.allAccruals.forEach(acc => {
          this.empStatusList.forEach(statusList => {
              if (acc.empTitleId === statusList.lookUpId) {
                acc.empStatus = statusList.lookUpDesc;
                console.log(acc.empTitleId);
              }
            });
          });

        })


      console.log(this.allAccruals);
    });
  }

  createAccurals() {
    this.router.navigate(["/leaves/leaveaccurals/"], {
      relativeTo: this.route
    });
  }

  getLeaveAccrualDetails(id) {
    this._accuralRuleService.getAccrualsByruleId(id).subscribe(resp => {
      console.log(resp);
    });
  }

  showSelectedAccurals(accuralObj) {}

  onRowSelected(event) {
    console.log("hi in on row selected event : " + event);
    if (event.node.selected) {
      this.leaveId = event.node.data.leaveId;
      this.router.navigate(["leaves/editLeaveAccruals/", this.leaveId], {
        relativeTo: this.route
      });
    }
  }

  setClickedRow(accrualObj) {
    this.isSelectedRow = true;
    this.selectedRow = accrualObj.ruleId;
  }

  showMe() {
    this._accuralRuleService.getAccrualsByruleId(30).subscribe(resp => {
      console.log(resp);
    });

    this.router.navigate(["../editLeaveAccruals/", this.selectedRow], {
      relativeTo: this.route
    });
  }

  editLeaveAccrual() {
    if (this.isSelectedRow) {
      this.selectedRuleId = this.selectedRow;
      let ruleId = this.selectedRuleId;
      this.getLeaveAccrualDetails(ruleId);
      console.log(ruleId);
      console.log(ruleId.valueOf());
      this.router.navigate(["../editLeaveAccruals/" + ruleId.valueOf()], {
        relativeTo: this.route
      });
    }
  }

  viewLeaveAccrual() {
    if (this.isSelectedRow) {
      this.selectedRuleId = this.selectedRow;
      let ruleId = this.selectedRuleId;
      this.getLeaveAccrualDetails(ruleId);
      this.router.navigate(["../showLeaveAccruals/" + ruleId], {
        relativeTo: this.route
      });
    }
  }
}
