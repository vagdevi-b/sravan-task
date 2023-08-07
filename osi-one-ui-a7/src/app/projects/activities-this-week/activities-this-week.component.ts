import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ProjectActivities } from '../../shared/utilities/ProjectActivities';
import { LeaveRequestService } from '../../shared/services/leaveRequest.service';
import { Employee } from '../../shared/utilities/employee.model';
declare var $: any;

@Component({
  selector: 'app-activities-this-week',
  templateUrl: './activities-this-week.component.html',
  styleUrls: ['./activities-this-week.component.css']
})
export class ActivitiesThisWeekComponent implements OnInit {
  @Input() thisWeekActivities: ProjectActivities[];
  @Input() pageTitle: String;
  @Input() selectedProjectId: any;
  @Input() isDisableProjActi: boolean;
  @Output() activitiesChange = new EventEmitter<ProjectActivities[]>();
  @Output() deleteThisWeekAccomplishedActivities = new EventEmitter<ProjectActivities>();

  constructor(private _leaveRequestService: LeaveRequestService) { }
  //fullName;
  //employeeId;
  thisWeekPage: number = 1;
  isChecked: boolean;
  employeeLength;
  searchedText: String;
  thisWeekemployeeList: any;
  currentActivityIndex: number;
  employeeData: Employee;
  crntpage: number = 1;
  isSelectedRow: any = null;
  isAnyRowSelected: boolean = false;
  total: number = 0;
  noOfItemsPerPage: number = 5;
  rowIndexes: number;
  objectId: any;
  thisWeekTotal: number = 0;
  isDisableDeleteBtn: boolean = true;
  AssignedUsersforproject: any;
  ngOnInit() {
    console.log("projectActivitiesData==>");
    console.log(this.thisWeekActivities);
    this.getAssignedUsers(this.selectedProjectId)
    //let proejctActivity:ProjectActivities = new ProjectActivities("3","123","1","testing","activityName","dependency",[],[],[],[],"completion%","status","Comments","true","false");
    //this.accomplishedActivities.push(proejctActivity);
    //this.addedAccomplishedActivities();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.thisWeekActivities.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
  }
  addedActivities() {
    console.log("addedAccomplishedActivities");
    this.activitiesChange.emit(this.thisWeekActivities);
  }

  openEmployeeSelection(index) {
    console.log("index=>" + this.currentActivityIndex);
    this.currentActivityIndex = index;
    index = index + (this.crntpage - 1) * this.noOfItemsPerPage;
    localStorage.setItem('currentActivityIndex', index);
    console.log("current index=>" + this.currentActivityIndex);
    $('#thisWeekEmployeeList').modal({ show: true });
  }

  filteredEmployeeSearch(search) {
    this.searchedText = search;
    console.log("this week filteredEmployeeSearch");
    this._leaveRequestService.getMailSuggestion(this.searchedText).subscribe
      (response => {
        this.thisWeekemployeeList = response;
      })
    this.searchedText = ''
    return this.thisWeekemployeeList;
  }

  selectedEmployee(selectedData, employeeId) {
    console.log("selectedEmployee::");
    console.log(this.currentActivityIndex);
    this.currentActivityIndex = Number(localStorage.getItem('currentActivityIndex'));
    // this.fullName = selectedData;
    // this.employeeId = employeeId;
    let isExists = false;
    this.thisWeekActivities[this.currentActivityIndex].assignedTo.forEach(empId => {
      if (empId == employeeId) {
        isExists = true;
      }
    });
    if (!isExists) {
      this.employeeData = new Employee(employeeId, selectedData);
      this.thisWeekActivities[this.currentActivityIndex].assignedToEmployees.push(this.employeeData);
      this.thisWeekActivities[this.currentActivityIndex].assignedTo.push(employeeId);
      console.log(this.thisWeekActivities[this.currentActivityIndex]);
    }
    this.activitiesChange.emit(this.thisWeekActivities);
    $('#thisWeekEmployeeList').modal('hide');
  }
  removeAddedEmployees(activityIndex, employeeIndex) {
    activityIndex = activityIndex + (this.crntpage - 1) * this.noOfItemsPerPage;
    this.thisWeekActivities[activityIndex].assignedToEmployees.splice(employeeIndex, 1);
    this.thisWeekActivities[activityIndex].assignedTo.splice(employeeIndex, 1);
  }
  addAnotherRow() {
    let proejctActivity: ProjectActivities = new ProjectActivities("", "", "", "ThisWeek", "", "", [], [], [], [], "", "", "", false, false, "");
    this.thisWeekActivities.push(proejctActivity);
    //this.thisWeekTotal = this.thisWeekActivities.length;
    console.log("activities=" + this.thisWeekActivities.length + "=noofitems=" + this.noOfItemsPerPage + "--" + ((this.thisWeekActivities.length - 1) % this.noOfItemsPerPage == 0));
    if ((this.thisWeekActivities.length - 1) % this.noOfItemsPerPage == 0) {
      this.crntpage = this.crntpage + 1;
    }
    this.isDisableDeleteBtn = true;
  }
  getAssignedUsers(selectedProjectId) {
    this._leaveRequestService
      .getAssignedUsers(selectedProjectId)
      .subscribe((response) => {
        this.AssignedUsersforproject = response;
      });
  }

  selectedRow() {
    this.isSelectedRow = null;
  }
  isRowClicked(data) {
    this.isSelectedRow = data;
    this.isAnyRowSelected = true;
  }
  onRowSelected(leave) {
    this.isAnyRowSelected = true;

  }
  deleteRow(index, id: number) {
    this.objectId = id;
    this.rowIndexes = index;
    $("#thisWeekDeletemodel").modal({ show: true });
  }

  accept(isaccept) {
    if (isaccept) {
      let deleteIndex = this.rowIndexes + (this.crntpage - 1) * this.noOfItemsPerPage;
      if (this.objectId == "") {
        this.thisWeekActivities.splice(deleteIndex, 1);
      } else {
        this.thisWeekActivities[deleteIndex].isDeleted = true;
        var deleteActivity = this.thisWeekActivities[deleteIndex];
        this.thisWeekActivities.splice(deleteIndex, 1);
        this.deleteThisWeekAccomplishedActivities.emit(deleteActivity);
      }

    }
    let listOfactivitys = this.thisWeekActivities.filter(activitie => !(activitie.isDeleted));
    if (listOfactivitys.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
    console.log("thisWeekDeletemodel list==" + JSON.stringify(listOfactivitys.length))
    $('#thisWeekDeletemodel').modal('hide');
    //$("#deletemodel").modal({ show: false });
    // $("#deletemodel").remove();
    $(".modal-backdrop").hide();
  }

}
