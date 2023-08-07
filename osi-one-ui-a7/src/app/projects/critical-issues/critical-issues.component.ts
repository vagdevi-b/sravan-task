import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ProjectRisk, Risk } from '../../shared/utilities/projectRisk';
//import _ = require('underscore');
import { LeaveRequestService } from '../../shared/services/leaveRequest.service';
import { ProjectService } from '../project.service';

import { underscore } from '@angular-devkit/core/src/utils/strings';
//import { tr } from 'ngx-bootstrap';
declare var $: any;

@Component({
  selector: 'app-critical-issues',
  templateUrl: './critical-issues.component.html',
  styleUrls: ['./critical-issues.component.css']
})
export class CriticalIssuesComponent implements OnInit {
  allCriticals: any[];
  @Input() projectRiskArray: ProjectRisk[];
  @Input() isDisableProjActi: boolean;
  @Output() activitiesChange = new EventEmitter<ProjectRisk[]>();
  @Output() deleteRiskActivitiesChange = new EventEmitter<ProjectRisk>();
  projectRisk: ProjectRisk = new ProjectRisk();
  private selectUndefinedOptionValue: any;
  private selectExecutiveValue: any;
  step: any;
  isEnableRisk: boolean = true;
  isRiskUpdate: boolean = false;
  riskTypes: Risk[] = [];
  criticalemployeeList: any;
  searchedText: string;
  executives: string[];
  isRiskType: boolean = false
  isRiskTypeEmpty: boolean = false;
  isOwnerEmpty: boolean = false;
  riskTotal: number = 0;
  riskpPage: number = 1;
  noOfItemsPerPage: number = 5;
  spinner: boolean = false;
  isCriticality: boolean = false;
  isDisableDeleteBtn: boolean = true;
  objectId: any;
  rowIndexes: number;
  @ViewChild("riskType") riskType: ElementRef;
  @ViewChild("risk") risk: ElementRef;
  @ViewChild("owner") owner: ElementRef;
  @ViewChild("criticality") criticality: ElementRef;
  constructor(private _leaveRequestService: LeaveRequestService, private projectService: ProjectService) { }

  ngOnInit() {
    this.setStaticValues();
    this.getProjectRisks();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.projectRisk = new ProjectRisk();
    if (this.projectRiskArray.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
    if (this.projectRiskArray.length > 0) {
      if (this.projectRiskArray[0].risk && this.projectRiskArray[0].criticality) {
        this.isEnableRisk = false;
        this.projectRiskArray.map(risk => {
          if (risk) {
            risk.owner = risk.ownerId;
            risk.type = risk.typeId;
          }
        })
      } else {
        this.isEnableRisk = true;
      }
    } else {
      this.isEnableRisk = true;
    }
    if (this.isDisableProjActi) {
      this.isEnableRisk = false;
    } else {
      this.isEnableRisk = true;
    }
  }
  saveProjectRisk() {
    this.booleanFlags();
    if (!this.projectRisk.type) {
      this.riskType.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isRiskType = true;
      return
    }
    if (!this.projectRisk.criticality) {
      this.criticality.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isCriticality = true
      return
    }
    if (!this.projectRisk.risk) {
      this.risk.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isRiskTypeEmpty = true;
      return
    }
    if (!this.projectRisk.owner) {
      this.owner.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isOwnerEmpty = true;
      return
    }
    if (!this.isRiskUpdate) {
      this.projectRiskArray.push(this.projectRisk);
      if (this.projectRiskArray.length > 1) {
        this.isDisableDeleteBtn = true;
      }
      if ((this.projectRiskArray.length - 1) % this.noOfItemsPerPage == 0) {
        //this.crntpage = this.crntpage+1;
        this.riskpPage = this.riskpPage + 1
      }
    }
    this.isEnableRisk = false;
    this.isRiskUpdate = false;
    this.activitiesChange.emit(this.projectRiskArray);
    this.projectRisk = new ProjectRisk();
  }
  addAnotherRow() {
    this.isEnableRisk = true;
    this.projectRisk = new ProjectRisk();
    this.step = null;
    this.isDisableDeleteBtn = true;
  }
  deleteRow(index, id: number) {
    this.objectId = id;
    this.rowIndexes = index;
    $("#criticalDeletemodel").modal({ show: true });
  }
  accept(isaccept) {
    if (isaccept) {
      let deleteIndex = this.rowIndexes + (this.riskpPage - 1) * this.noOfItemsPerPage;
      if (!this.objectId) {
        this.projectRiskArray.splice(deleteIndex, 1);
      } else {
        this.projectRiskArray[deleteIndex].isDeleted = true;
        var deleteActivity = this.projectRiskArray[deleteIndex];
        this.projectRiskArray.splice(deleteIndex, 1);
        this.deleteRiskActivitiesChange.emit(deleteActivity);
      }
      if (this.projectRiskArray.length == 1) {
        //this.isEnableRisk = true;
        this.isDisableDeleteBtn = false;
      } else {
        this.isDisableDeleteBtn = true;
      }

    }
    let listOfactivitys = this.projectRiskArray.filter(activitie => !(activitie.isDeleted));
    if (listOfactivitys.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
    $('#criticalDeletemodel').modal('hide');
    //$("#deletemodel").modal({ show: false });
    // $("#deletemodel").remove();
    $(".modal-backdrop").hide();
  }
  editProjectRisk(projectRisk: ProjectRisk) {
    this.isRiskUpdate = true;
    this.projectRisk = projectRisk;
    this.step = projectRisk.typeName;
    console.log("********test333*****" + this.step)
    this.isEnableRisk = true;
  }
  saveNextProjectRisk() {
    this.booleanFlags();
    if (!this.projectRisk.type) {
      this.riskType.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isRiskType = true;
      return
    }
    if (!this.projectRisk.risk) {
      this.risk.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isRiskTypeEmpty = true;
      return
    }
    if (!this.projectRisk.owner) {
      this.owner.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      this.isOwnerEmpty = true;
    }
    if (!this.isRiskUpdate) {
      this.projectRiskArray.push(this.projectRisk);
    }
    this.projectRisk = new ProjectRisk();
    this.isEnableRisk = true;
    this.isRiskUpdate = false;
    this.step = null;
    this.activitiesChange.emit(this.projectRiskArray);
  }
  close() {
    this.projectRisk = new ProjectRisk();
    if (this.projectRiskArray.length > 0) {
      this.isEnableRisk = false;
    }
  }
  filteredEmployeeSearch(search) {
    //window.scrollTo(0, 0);
    //this.owner.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.spinner = true;
    this.searchedText = search;
    this.criticalemployeeList = [];
    this._leaveRequestService.getMailSuggestion(search).subscribe
      (response => {
        this.spinner = false;
        if (response && response.length == 1) {
          this.projectRisk.owner = response[0].employeeId;
          this.projectRisk.ownerName = response[0].fullName;
          //this.owner.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
          this.searchedText = '';
          //$('#criticalempModal').modal('hide');
          return;
        } else {
          $('#criticalempModal').modal({ show: true });

          this.criticalemployeeList = response;

        }

      },
        (error) => {
          this.spinner = false;
          console.log("critical issue component")
        })
    return this.criticalemployeeList;
  }

  filteredEmployeePopSearch() {
    //window.scrollTo(0, 0);
    //this.owner.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

    this.criticalemployeeList = [];
    this._leaveRequestService.getMailSuggestion(this.searchedText).subscribe
      (response => {
        // this.spinner = false;
        this.criticalemployeeList = response;



      },
        (error) => {
          this.spinner = false;
          console.log("critical issue component")
        })
    return this.criticalemployeeList;
  }

  selectedEmployee(employeeId: number, empName: string) {
    this.projectRisk.owner = employeeId;
    this.projectRisk.ownerName = empName;
    this.owner.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    $('#criticalempModal').modal('hide');

  }
  setStaticValues() {
    this.executives = ['Yes', 'No'];
    //this.allCriticals = ['Minor','Medium','Major'];
    this.allCriticals = [{ code: 'L', name: 'Low' }, { code: 'M', name: 'Medium' }, { code: 'H', name: 'High' }]
    //   this.riskTypes = ['Scope','Delivery Schedule','Milestone/Deliverable','Design/Code quality','Infra related','Resource Skill'
    // ,'Qa/Compliance','Team attrition','Resource visa situation','Finance/payments','Resource avilability']
  }
  trackByMethod(index: number, el: any): number {
    return el.id;
  }
  getProjectRisks() {
    this.projectService.getProjectRisks()
      .subscribe(res => {
        this.riskTypes = res;
        console.log("project risks==" + JSON.stringify(res))
      })
  }
  getRiskTypeID(riskType) {
    this.projectRisk.type = riskType.riskTypeId;
    this.projectRisk.typeName = riskType.riskTypeName;
    console.log(this.projectRisk.type);
  }

  booleanFlags() {
    this.isRiskType = false;
    this.isRiskTypeEmpty = false;
    this.isOwnerEmpty = false;
    this.isCriticality = false
  }

}
