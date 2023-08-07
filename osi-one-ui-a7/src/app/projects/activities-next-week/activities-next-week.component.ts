import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ProjectActivities } from '../../shared/utilities/ProjectActivities';
import { LeaveRequestService } from '../../shared/services/leaveRequest.service';
import { Employee } from '../../shared/utilities/employee.model';
declare var $: any;

@Component({
  selector: 'app-activities-next-week',
  templateUrl: './activities-next-week.component.html',
  styleUrls: ['./activities-next-week.component.css']
})
export class ActivitiesNextWeekComponent implements OnInit {
  @Input() activities: ProjectActivities[];
  @Input() pageTitle: String;
  @Input() selectedProjectId: any;
  @Input() isDisableProjActi: boolean;
  @Output() activitiesChange = new EventEmitter<ProjectActivities[]>();
  @Output() deleteNextWeekAccomplishedActivities = new EventEmitter<ProjectActivities>();
 
  constructor(private _leaveRequestService: LeaveRequestService) { }
  //fullName;
  //employeeId;
  isChecked: boolean;
  employeeLength;
  searchedText:String;
  employeeList:any;
  currentActivityIndex:number;
  employeeData:Employee;
  crntpage: number =1;
  isSelectedRow: any = null;
  isAnyRowSelected:boolean = false;
  total: number = 0;
  noOfItemsPerPage:number = 5;
  nextWeekTotal : number = 0;
  nextWeekPage: number = 1;
  AssignedUsersforproject:any;
  isDisableDeleteBtn: boolean = true;
  objectId: any;
  rowIndexes: number
  ngOnInit() {
    console.log("projectActivitiesData==>");
    console.log(this.activities);
    this.getAssignedUsers(this.selectedProjectId)
    //let proejctActivity:ProjectActivities = new ProjectActivities("3","123","1","testing","activityName","dependency",[],[],[],[],"completion%","status","Comments","true","false");
    //this.accomplishedActivities.push(proejctActivity);
    //this.addedAccomplishedActivities();
  }
  ngOnChanges(changes: SimpleChanges) {
    if(this.activities.length == 1){
      this.isDisableDeleteBtn = false;
    }else{
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
  addedActivities(){
    console.log("addedAccomplishedActivities");
    this.activitiesChange.emit(this.activities);
  }

  openEmployeeSelection(index) {
    console.log("index=>"+this.currentActivityIndex);
    this.currentActivityIndex = index;
    index = index + (this.nextWeekPage - 1) * this.noOfItemsPerPage;
    localStorage.setItem('currentActivityIndex', index);
    console.log("current index=>"+this.currentActivityIndex);
    $('#nextWeekEmployeeList').modal({ show: true });
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

  selectedEmployee(selectedData, employeeId) {
    console.log("selectedEmployee::");
    console.log(this.currentActivityIndex);
    this.currentActivityIndex = Number(localStorage.getItem('currentActivityIndex'));
    // this.fullName = selectedData;
    // this.employeeId = employeeId;
    let isExists=false;
    this.activities[this.currentActivityIndex].assignedTo.forEach(empId => {
      if(empId == employeeId){
        isExists=true;
      }
    });
    if(!isExists){
      this.employeeData= new Employee(employeeId,selectedData);
      this.activities[this.currentActivityIndex].assignedToEmployees.push(this.employeeData);
      this.activities[this.currentActivityIndex].assignedTo.push(employeeId);
      console.log(this.activities[this.currentActivityIndex]);
    }   
    this.activitiesChange.emit(this.activities); 
    $('#nextWeekEmployeeList').modal('hide');
  }
  removeAddedEmployees(activityIndex,employeeIndex){
    this.activities[activityIndex].assignedToEmployees.splice(employeeIndex,1);
    this.activities[activityIndex].assignedTo.splice(employeeIndex,1);
  }
  addAnotherRow(){
    let proejctActivity:ProjectActivities = new ProjectActivities("","","","NextWeek","","",[],[],[],[],"","","",false,false,"");
    this.activities.push(proejctActivity);
    //this.nextWeekTotal = this.activities.length;
    console.log("activities="+this.activities.length+"=noofitems="+this.noOfItemsPerPage+"--"+((this.activities.length-1) % this.noOfItemsPerPage == 0));
    if((this.activities.length-1) % this.noOfItemsPerPage == 0){
     // this.crntpage = this.crntpage+1;
     this.nextWeekPage = this.nextWeekPage+1;
    }
    this.isDisableDeleteBtn = true;
  }
  selectedRow() {
    this.isSelectedRow = null;
  }
  isRowClicked(data) {
    this.isSelectedRow = data;
    this.isAnyRowSelected=true;
  }
  onRowSelected(leave) {
    this.isAnyRowSelected=true;
    
  }
  deleteRow(index, id: number) {
    this.objectId = id;
    this.rowIndexes = index;
    $("#nextWeekDeletemodel").modal({ show: true });
  }
  accept(isaccept) {
    if (isaccept) {
      let deleteIndex = this.rowIndexes + (this.nextWeekPage - 1) * this.noOfItemsPerPage;
      if (this.objectId == "") {
        this.activities.splice(deleteIndex, 1);
      } else {
        this.activities[deleteIndex].isDeleted = true;
        var deletactivity =  this.activities[deleteIndex];
        this.activities.splice(deleteIndex, 1);
        this.deleteNextWeekAccomplishedActivities.emit(deletactivity);
      }

    }
     let listOfactivitys = this.activities.filter(activitie=>!(activitie.isDeleted));
     if(listOfactivitys.length == 1){
       this.isDisableDeleteBtn = false;
     }else{
      this.isDisableDeleteBtn = true;
     }
     console.log("unAccomplished list=="+JSON.stringify(listOfactivitys.length))
     $('#nextWeekDeletemodel').modal('hide');
    //$("#deletemodel").modal({ show: false });
    // $("#deletemodel").remove();
    $(".modal-backdrop").hide();
  }
  

}

