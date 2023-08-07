import { Component, OnInit, Input, ViewChild, SimpleChange, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ProjectActivities } from '../../shared/utilities/ProjectActivities';
import { ProjectStatus } from '../../shared/utilities/projectStatus';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
//import _ = require('underscore');
import { DatePipe } from '@angular/common';
import { Milestone } from '../../shared/utilities/projectRisk';
import { LeaveRequestService } from '../../shared/services/leaveRequest.service';
declare var $: any;

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.css'],
  providers: [DatePipe]
})
export class ProjectStatusComponent implements OnInit {
  projectStatus: ProjectStatus = new ProjectStatus();
  @Input() projectStatusArray: ProjectStatus[] = [];
  @Input() milestones: Milestone[];
  @Input() isDisableProjActi: boolean;
  @Output() activitiesChange = new EventEmitter<ProjectStatus[]>();
  @Output() deleteStatusActivitiesChange = new EventEmitter<ProjectStatus>();

  milestoneArray: string[];
  private selectUndefinedOptionValue: any;
  datePickerConfig: Partial<BsDatepickerConfig>;
  startDate: string;
  endDate: string;
  crntpage: number = 1;
  searchedText: String;
  employeeList: any;
  total: number = 0;
  noOfItemsPerPage: number = 5;
  isSelectedRow: any = null;
  isAnyRowSelected: boolean = false;
  selectReasonIndex: number;
  isResonTabDis: boolean = false;
  totalStatus: number = 0;
  statusPage: number = 1;
  isDisableDeleteBtn: boolean = true;
  objectId: any;
  rowIndexes: number
  constructor(public datepipe: DatePipe, private _leaveRequestService: LeaveRequestService) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log("milestones===" + JSON.stringify(this.milestones))
    if (this.projectStatusArray.length == 1) {
      this.isDisableDeleteBtn = false;

      for (let i = 0; i <= this.projectStatusArray.length; i++) {
        this.projectStatusArray[i].startDate = this.projectStatusArray[i].startDate ? new Date(this.projectStatusArray[i].startDate) : '';
        this.projectStatusArray[i].endDate = this.projectStatusArray[i].endDate ? new Date(this.projectStatusArray[i].endDate) : '';
        this.projectStatusArray[i].actualStartDate = this.projectStatusArray[i].actualStartDate ? new Date(this.projectStatusArray[i].actualStartDate) : '';
        this.projectStatusArray[i].actualEndDate = this.projectStatusArray[i].actualEndDate ? new Date(this.projectStatusArray[i].actualEndDate) : '';
      }
    } else {
      this.isDisableDeleteBtn = true;

      for (let i = 0; i <= this.projectStatusArray.length; i++) {
        this.projectStatusArray[i].startDate = this.projectStatusArray[i].startDate ? new Date(this.projectStatusArray[i].startDate) : '';
        this.projectStatusArray[i].endDate = this.projectStatusArray[i].endDate ? new Date(this.projectStatusArray[i].endDate) : '';
        this.projectStatusArray[i].actualStartDate = this.projectStatusArray[i].actualStartDate ? new Date(this.projectStatusArray[i].actualStartDate) : '';
        this.projectStatusArray[i].actualEndDate = this.projectStatusArray[i].actualEndDate ? new Date(this.projectStatusArray[i].actualEndDate) : '';
      }
    }
  }

  // getMilestone(selectMilestone, index) {
  //   console.log(JSON.stringify("project status===" + this.projectStatusArray))
  //   this.milestones.map(milestone => {
  //     if (milestone) {
  //       if (milestone.taskName === selectMilestone) {
  //         this.projectStatusArray[index].startDate = milestone.taskStartDate;
  //         this.projectStatusArray[index].endDate = milestone.taskEndDate;
  //       }
  //     }
  //   })

  // }

  ngOnInit() {
    //this.projectStatusArray.push(this.projectStatus);
    this.setdatePickerConfig();
    this.milestoneArray = ['Milestone1', 'Milestone2', 'Milestone3']
  }
  addedAccomplishedActivities() {
    console.log("addedAccomplishedActivities");
    this.activitiesChange.emit(this.projectStatusArray);
  }

  setdatePickerConfig() {
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        isAnimated: true,
      });
  }
  addAnotherRow() {
    this.isResonTabDis = false;
    this.projectStatus = new ProjectStatus();
    this.projectStatusArray.push(this.projectStatus);
    if ((this.projectStatusArray.length - 1) % this.noOfItemsPerPage == 0) {
      this.statusPage = this.statusPage + 1;
    }
    this.isDisableDeleteBtn = true;
  }
  deleteRow(index, id: number) {
    this.objectId = id;
    this.rowIndexes = index;
    $("#statusDeletemodel").modal({ show: true });
  }
  accept(isaccept) {
    if (isaccept) {
      let deleteIndex = this.rowIndexes + (this.statusPage - 1) * this.noOfItemsPerPage;
      if (!this.objectId) {
        this.projectStatusArray.splice(deleteIndex, 1);
      } else {
        this.projectStatusArray[deleteIndex].isDeleted = true;
        var deleteActivity = this.projectStatusArray[deleteIndex];
        this.projectStatusArray.splice(deleteIndex, 1);
        this.deleteStatusActivitiesChange.emit(deleteActivity);

      }

    }
    let listOfactivitys = this.projectStatusArray.filter(activitie => !(activitie.isDeleted));
    if (listOfactivitys.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
    $('#statusDeletemodel').modal('hide');
    //$("#deletemodel").modal({ show: false });
    // $("#deletemodel").remove();
    $(".modal-backdrop").hide();
  }
  filteredEmployeeSearch(search) {
    this.searchedText = search;
    console.log("filteredEmployeeSearch");
    this._leaveRequestService.getMailSuggestion(this.searchedText).subscribe
      (response => {
        this.employeeList = response;
      })
    this.searchedText = ''
    return this.employeeList;
  }
  selectedRow() {
    this.isSelectedRow = null;
  }
  onRowSelected(leave) {
    this.isAnyRowSelected = true;

  }
  isRowClicked(data, index) {
    this.isSelectedRow = data;
    this.isAnyRowSelected = true;
    this.isResonTabDis = true;
    this.selectReasonIndex = index;
  }
}
