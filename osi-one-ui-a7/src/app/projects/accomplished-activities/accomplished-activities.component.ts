import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { ProjectActivitiesData } from "../../shared/utilities/ProjectActivitiesData";
import { ProjectActivities } from "../../shared/utilities/ProjectActivities";
import { LeaveRequestService } from "../../shared/services/leaveRequest.service";
import { Employee } from "../../shared/utilities/employee.model";
declare var $: any;

@Component({
  selector: "app-accomplished-activities",
  templateUrl: "./accomplished-activities.component.html",
  styleUrls: ["./accomplished-activities.component.css"],
})
export class AccomplishedActivitiesComponent implements OnInit {
  @Input() activities: ProjectActivities[];
  @Input() selectedProjectId: any;
  @Input() pageTitle: String;
  @Input() isDisableProjActi: boolean;
  @Output() activitiesChange = new EventEmitter<ProjectActivities[]>();
  @Output() deleteActivitiesChange = new EventEmitter<ProjectActivities>();

  constructor(private _leaveRequestService: LeaveRequestService) { }
  //fullName;
  //employeeId;
  employeeLength;
  searchedText: String;
  employeeList: any;
  AssignedUsersforproject: any;
  currentActivityIndex: number;
  employeeData: Employee;
  crntpage: number = 1;
  isSelectedRow: any = null;
  isAnyRowSelected: boolean = false;
  total: number = 0;
  rowIndexes: number;
  isaccept: boolean = false;
  noOfItemsPerPage: number = 5;
  isChecked: boolean = false;
  isDisableDeleteBtn: boolean = true;
  objectId: any;
  ngOnInit() {
    console.log("projectActivitiesData==>");
    console.log(this.activities);
    console.log("rohit");
    console.log(this.selectedProjectId);
    //let proejctActivity:ProjectActivities = new ProjectActivities("3","123","1","testing","activityName","dependency",[],[],[],[],"completion%","status","Comments","true","false");
    //this.accomplishedActivities.push(proejctActivity);
    //this.addedAccomplishedActivities();
    this.getAssignedUsers(this.selectedProjectId);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.activities.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
  }
  addedActivities() {
    console.log("addedAccomplishedActivities");
    this.activitiesChange.emit(this.activities);
  }

  openEmployeeSelection(index) {
    console.log("index=>" + this.currentActivityIndex);
    this.currentActivityIndex = index;
    index = index + (this.crntpage - 1) * this.noOfItemsPerPage;

    localStorage.setItem("currentActivityIndex", index);
    console.log("current index=>" + this.currentActivityIndex);
    $("#employeeList").modal({ show: true });
  }

  filteredEmployeeSearch(search) {
    this.searchedText = search;
    console.log("filteredEmployeeSearch");
    this._leaveRequestService
      .getMailSuggestion(this.searchedText)
      .subscribe((response) => {
        this.employeeList = response;
      });
    this.searchedText = "";
    return this.employeeList;
  }

  getAssignedUsers(selectedProjectId) {
    this._leaveRequestService
      .getAssignedUsers(selectedProjectId)
      .subscribe((response) => {
        this.AssignedUsersforproject = response;
      });
  }

  selectedEmployee(selectedData, employeeId) {
    console.log("selectedEmployee::");
    console.log(this.currentActivityIndex);
    this.currentActivityIndex = Number(
      localStorage.getItem("currentActivityIndex")
    );
    // this.fullName = selectedData;
    // this.employeeId = employeeId;
    let isExists = false;
    this.activities[this.currentActivityIndex].assignedTo.forEach((empId) => {
      if (empId == employeeId) {
        isExists = true;
      }
    });
    if (!isExists) {
      this.employeeData = new Employee(employeeId, selectedData);
      this.activities[this.currentActivityIndex].assignedToEmployees.push(
        this.employeeData
      );
      this.activities[this.currentActivityIndex].assignedTo.push(employeeId);
      console.log(this.activities[this.currentActivityIndex]);
    }
    $("#employeeList").modal("hide");
    this.activitiesChange.emit(this.activities);
  }
  removeAddedEmployees(activityIndex, employeeIndex) {
    activityIndex = activityIndex + (this.crntpage - 1) * this.noOfItemsPerPage;
    this.activities[activityIndex].assignedToEmployees.splice(employeeIndex, 1);
    this.activities[activityIndex].assignedTo.splice(employeeIndex, 1);
  }
  addAnotherRow() {
    let proejctActivity: ProjectActivities = new ProjectActivities("", "", "", "Accomplished", "", "", [], [], [], [], "", "", "", false, false, ""
    );
    this.activities.push(proejctActivity);
    console.log(
      "activities=" +
      this.activities.length +
      "=noofitems=" +
      this.noOfItemsPerPage +
      "--" +
      ((this.activities.length - 1) % this.noOfItemsPerPage == 0)
    );
    if ((this.activities.length - 1) % this.noOfItemsPerPage == 0) {
      this.crntpage = this.crntpage + 1;
    }
    this.isDisableDeleteBtn = true;
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
    $("#deletemodel").modal({ show: true });
  }

  accept(isaccept) {
    if (isaccept) {
      let deleteIndex = this.rowIndexes + (this.crntpage - 1) * this.noOfItemsPerPage;
      if (this.objectId == "") {
        this.activities.splice(deleteIndex, 1);
      } else {
        this.activities[deleteIndex].isDeleted = true;
        var deleteActivity = this.activities[deleteIndex];
        this.activities.splice(deleteIndex, 1);
        this.deleteActivitiesChange.emit(deleteActivity);
      }

    }
    let listOfactivitys = this.activities.filter(activitie => !(activitie.isDeleted));
    if (listOfactivitys.length == 1) {
      this.isDisableDeleteBtn = false;
    } else {
      this.isDisableDeleteBtn = true;
    }
    console.log("accomplished list==" + JSON.stringify(listOfactivitys.length))
    $('#deletemodel').modal('hide');
    //$("#deletemodel").modal({ show: false });
    // $("#deletemodel").remove();
    $(".modal-backdrop").hide();
  }

  /*getEmployist(event) {
    
    this.employeeId = '';
    this.employeeLength = false;
    if(this.searchReportId == "" && this.employeeId == ""){
      this.rowData = [];        
    }
    let mailId = event.target.value;
    if ((event.keyCode == 13 || event.type == "blur") && mailId != "") {
      // event.target.blur();      

      this.employeeList = [];

      this._leaveRequestService.getMailSuggestion(mailId).subscribe
        (response => {
          this.employeeList = response;

          if (this.employeeList.length > 1) {
            event.target.value = '';
            $('#employeeList').modal({ show: true });
          }
          else if (this.employeeList.length === 0) {
            this.employeeLength = true;
          }
          else {
            event.target.value = '';
            this.fullName = this.employeeList[0].fullName;
            this.employeeId = this.employeeList[0].employeeId;
            //this.getExpensesByDateAndStatus(this.selectedStatusExpense, this.selectedDates.id, this.startDateString, this.endDateString, this.currentPageItemCount)
          }
        })
    }
  }*/
}
