import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectActivitiesData } from '../../shared/utilities/ProjectActivitiesData';
import { ProjectActivities } from '../../shared/utilities/ProjectActivities';
import { LeaveRequestService } from '../../shared/services/leaveRequest.service';
import { Employee } from '../../shared/utilities/employee.model';
declare var $: any;

@Component({
  selector: 'app-unaccomplished-activities',
  templateUrl: './unaccomplished-activities.component.html',
  styleUrls: ['./unaccomplished-activities.component.css']
})
export class UnaccomplishedActivitiesComponent implements OnInit, OnChanges {
  @Input() accomplishedActivities: ProjectActivities[];
  @Input() pageTitle: String;
  @Input() selectedProjectId: any;
  @Input() isDisableProjActi: boolean;
  @Output() activitiesChange = new EventEmitter<ProjectActivities[]>();
  @Output() deleteUnActivitiesChange = new EventEmitter<ProjectActivities>();
  constructor(private _leaveRequestService: LeaveRequestService) { }
  //fullName;
  //employeeId;
  employeeLength;
  searchedText: String;
  employeeList1: any;
  currentActivityIndex: number;
  employeeData: Employee;
  crntpage: number = 1;
  isSelectedRow: any = null;
  isAnyRowSelected: boolean = false;
  total: number = 0;
  noOfItemsPerPage: number = 5;
  selectedRowIndex: number;
  selectReasonIndex: number;
  employeeType: string;
  isResonTabDis: boolean = false;
  totalRec: number = 0;
  page: number = 1;
  isReasonEmpty: boolean = false;
  isChecked: boolean = false;
  AssignedUsersforproject: any;
  isDisableDeleteBtn: boolean = true;
  objectId: any;
  rowIndexes: number;
  fieldsetDis: boolean = false;

  ngOnInit() {
    console.log("projectActivitiesData==>");
    console.log(this.accomplishedActivities);
    this.getAssignedUsers(this.selectedProjectId)
    //let proejctActivity:ProjectActivities = new ProjectActivities("3","123","1","testing","activityName","dependency",[],[],[],[],"completion%","status","Comments","true","false");
    //this.accomplishedActivities.push(proejctActivity);
    //this.addedAccomplishedActivities();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.accomplishedActivities.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
  }

  getAssignedUsers(selectedProjectId) {
    this._leaveRequestService
      .getAssignedUsers(selectedProjectId)
      .subscribe((response) => {
        this.AssignedUsersforproject = response;
      });
  }

  addedAccomplishedActivities() {
    console.log("addedAccomplishedActivities");
    this.activitiesChange.emit(this.accomplishedActivities);
  }

  openEmployeeSelection(index, employeeType) {
    this.employeeType = employeeType;
    console.log("index=>" + this.currentActivityIndex);
    this.currentActivityIndex = index;
    index = index + (this.crntpage - 1) * this.noOfItemsPerPage;

    localStorage.setItem('currentActivityIndex', index);
    console.log("current index=>" + this.currentActivityIndex);
    $('#employeeList1').modal({ show: true });
  }

  filteredEmployeeSearch1(search) {
    console.log("filteredEmployeeSearch1");
    this.searchedText = search;
    this._leaveRequestService.getMailSuggestion(this.searchedText).subscribe
      (response => {
        this.employeeList1 = response;
      })
    this.searchedText = ''
    return this.employeeList1;
  }

  selectedEmployee(selectedData, employeeId) {
    console.log("selectedEmployee::");
    this.currentActivityIndex = Number(localStorage.getItem('currentActivityIndex'));
    console.log(this.currentActivityIndex);
    // this.fullName = selectedData;
    // this.employeeId = employeeId;
    let isExists = false;
    if (this.employeeType == 'assigned') {
      this.accomplishedActivities[this.currentActivityIndex].assignedTo.forEach(empId => {
        if (empId == employeeId) {
          isExists = true;
        }
      });
    } else {
      this.accomplishedActivities[this.currentActivityIndex].reassignedTo.forEach(empId => {
        if (empId == employeeId) {
          isExists = true;
        }
      });
    }
    if (!isExists) {
      if (this.employeeType == 'assigned') {
        this.employeeData = new Employee(employeeId, selectedData);
        this.accomplishedActivities[this.currentActivityIndex].assignedToEmployees.push(this.employeeData);
        this.accomplishedActivities[this.currentActivityIndex].assignedTo.push(employeeId);
        console.log(this.accomplishedActivities[this.currentActivityIndex]);
      } else {
        this.employeeData = new Employee(employeeId, selectedData);
        this.accomplishedActivities[this.currentActivityIndex].reassignedToEmployees.push(this.employeeData);
        this.accomplishedActivities[this.currentActivityIndex].reassignedTo.push(employeeId);
        console.log(this.accomplishedActivities[this.currentActivityIndex]);
      }
    }
    this.activitiesChange.emit(this.accomplishedActivities);
    $('#employeeList1').modal('hide');
  }
  removeAddedEmployees(activityIndex, employeeIndex) {
    activityIndex = activityIndex + (this.crntpage - 1) * this.noOfItemsPerPage;
    this.accomplishedActivities[activityIndex].assignedToEmployees.splice(employeeIndex, 1);
    this.accomplishedActivities[activityIndex].assignedTo.splice(employeeIndex, 1);
  }
  removeAddedReEmployees(activityIndex, employeeIndex) {
    activityIndex = activityIndex + (this.crntpage - 1) * this.noOfItemsPerPage;
    this.accomplishedActivities[activityIndex].reassignedToEmployees.splice(employeeIndex, 1);
    this.accomplishedActivities[activityIndex].assignedTo.splice(employeeIndex, 1);
  }
  addAnotherRow(index) {
    this.isResonTabDis = false;
    this.isDisableDeleteBtn = true;
    let proejctActivity: ProjectActivities = new ProjectActivities("", "", "", "UnAccomplished", "", "", [], [], [], [], "", "", "", false, false, "");
    this.accomplishedActivities.push(proejctActivity);
    //this.totalRec = this.accomplishedActivities.length;
    console.log("activities=" + this.accomplishedActivities.length + "=noofitems=" + this.noOfItemsPerPage + "--" + ((this.accomplishedActivities.length - 1) % this.noOfItemsPerPage == 0));
    if ((this.accomplishedActivities.length - 1) % this.noOfItemsPerPage == 0) {
      this.crntpage = this.crntpage + 1;
    }
  }
  selectedRow() {
    this.isSelectedRow = null;
  }
  isRowClicked(data, index) {
    this.isSelectedRow = data;
    this.isAnyRowSelected = true;
    //this.selectedRowIndex=index;
    this.isResonTabDis = true;
    this.selectReasonIndex = index;
  }
  onRowSelected(leave) {
    this.isAnyRowSelected = true;

  }
  deleteRow(index, id: number) {
    this.objectId = id;
    this.rowIndexes = index;
    $("#unAccDeleteModel").modal({ show: true });
  }
  accept(isaccept) {
    if (isaccept) {
      let deleteIndex = this.rowIndexes + (this.crntpage - 1) * this.noOfItemsPerPage;
      if (this.objectId == "") {
        this.accomplishedActivities.splice(deleteIndex, 1);
      } else {
        this.accomplishedActivities[deleteIndex].isDeleted = true;
        var deleteActivity = this.accomplishedActivities[deleteIndex];
        this.accomplishedActivities.splice(deleteIndex, 1);
        this.deleteUnActivitiesChange.emit(deleteActivity);
      }

    }
    let listOfactivitys = this.accomplishedActivities.filter(activitie => !(activitie.isDeleted));
    if (listOfactivitys.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
    console.log("unAccomplished list==" + JSON.stringify(listOfactivitys.length))
    $('#unAccDeleteModel').modal('hide');
    //$("#deletemodel").modal({ show: false });
    // $("#deletemodel").remove();
    $(".modal-backdrop").hide();
  }
}