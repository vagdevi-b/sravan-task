import { ViewChild, ChangeDetectorRef } from "@angular/core";
import { OrgHolidays } from "./../../shared/utilities/OrgHolidays";
import { OptionalType } from "./../../shared/utilities/optionalType";
import { HolidaysModel } from "./../../shared/utilities/HolidaysModel.model";
import { CreateHolidayService } from "./../../shared/services/createHoliday.service";
import { ElementRef } from "@angular/core";
import { Organization } from "./../../shared/utilities/organization";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ContentChild } from "@angular/core/src/metadata/di";
import { resolve } from "../../../../node_modules/@angular-devkit/core";
// import { reject } from "../../../../node_modules/@types/q";
//import * as XLSX from 'ts-xlsx';
//import * as jsPDF  from 'jspdf';
import { toInteger } from "@ng-bootstrap/ng-bootstrap/util/util";

declare var $: any;

@Component({
  selector: "app-holidays",
  templateUrl: "./holidays.component.html",
  styleUrls: ["./holidays.component.css"]
})
export class HolidaysComponent implements OnInit {
  @ViewChild("content") content: ElementRef;
  @ViewChild("DatePickerContainer1") datePickerContainer1;
  @ViewChild("DatePickerContainer2") datePickerContainer2;

  route: any;
  router: any;
  arrayBuffer: any;
  crntpage = 1;
  file: File;
  _HolidayService: any;
  holidayForm: FormGroup;
  public user: any = {};
  errorMessage: string;
  data: any;
  holiday: HolidaysModel;
  addHoliday: HolidaysModel;
  editHoliday: HolidaysModel;
  expenses: any;
  selectedExpense: HolidaysModel;
  isNewRecord: boolean;
  taxList: any;
  nameId: Number;
  selectedRowId: Number;
  private holidayReq: any;
  validationError: any;
  inValidFields: any;
  public fieldArray: Array<any> = [];
  public deletedFieldArray: Array<any> = [];
  private newAttribute: any = {};
  private expenseData: any;
  holidaydate: string;
  expenseStartDateField: { year: number; month: number; day: number };
  expenseSelectedDateField: { year: number; month: number; day: number };
  listnames: OrgHolidays;
  orgName: Organization;
  isManager: boolean;
  locationId: any;
  holidayBean: any;
  holidayExists: boolean;
  holidaySelectedDate: { year: number; month: number; day: number };
  isDeleted: boolean;
  allLocation: any[];
  allHolidays: any[] = [];
  orgList: any[] = [];
  HoliName = "";
  optional = "";
  Weekend: boolean;
  editedLocation = "";
  isEditable = false;
  showMessage = false;
  successAlert = false;
  successMessage = '';
  isEnableAddHoliday = false;
  isDuplicateHoliday: Boolean = false;
  holidayExistMessage = "";
  orgId: any = null;
  holidayLocationId: any = null;
  isSelectedRow = false;
  selectedRow = null;
  all = false;
  optionals = [new OptionalType(1, "YES"), new OptionalType(2, "NO")];
  
  constructor(
    private _holidayService: CreateHolidayService,
    private _eref: ElementRef,
    private _cd: ChangeDetectorRef
  ) {
    this.orgName = new Organization("", "", false, "");
    this.addHoliday = new HolidaysModel("", "", "", "", "", false,false);
    this.editHoliday = new HolidaysModel("", "", "", "", "", false,false);
  }

  ngOnInit() {
    this.isDeleted = false;
    //this.getLocations();
    //this.getHolidayList();
    this.getOrganizations();
    $("#errorMessage").hide();
    this.orgId = "";
    this.holidayLocationId = "";
    /* if(localStorage.holidayOrgId){
      this.orgId = localStorage.holidayOrgId;
      this.getLocations(this.orgId);
    }
    if(localStorage.holidayLocationId){
      this.getLocations(this.orgId);
      this.holidayLocationId = localStorage.holidayLocationId;
      if(this.holidayLocationId){
        this.onSelect(this.holidayLocationId);
      }
      
    }*/
    // this.getOrganizationByEmployeeId();
    this.holidayForm = new FormGroup({
      holidaydate: new FormControl("", Validators.required),
      holidayname: new FormControl("", Validators.required),
      isWeekend: new FormControl("")
    });
    this.isManager = false;
  }

  getLocations(orgId): void {
    this.fieldArray = [];
    //this.allLocation = [];
    localStorage.holidayOrgId = orgId;
    if (orgId) {
      this.isEnableAddHoliday = true;
      this.fieldArray = [];
      this._holidayService.getLocations(orgId).subscribe(response => {
        this.allLocation = response;
        // this.allLocation.push({ locationId: 0, locationName: "All" });
        //sort
        this.allLocation.sort(function (a, b) {
          if (a.locationName < b.locationName) return -1;
          if (a.locationName > b.locationName) return 1;
          return 0;
        });
      }, error => (this.errorMessage = <any>error));
    }
    else {
      this.isEnableAddHoliday = false;
      this.fieldArray = [];
      this.allLocation = [];
    }
    this.holidayLocationId = "";
  }

  getOrganizationByEmployeeId(): void {
    this._holidayService.getOrganizationByEmployeeId().subscribe(response => {
      this.orgName = response;
      this.isManager = this.orgName.manager;
    }, error => (this.errorMessage = <any>error));
  }
  getOrganizations(): void {
    this._holidayService.getOrganizations().subscribe(response => {
      this.orgList = response;
    }, error => (this.errorMessage = <any>error));
  }


  removeTheSelection() {
    //remove the selection once the modal open
    this.isEditable = false;
    this.selectedRow = null;
    this.isSelectedRow = false;
    this.selectedItem = null;
    this.selectedRowId = null;
  }

  openModal(id: string) {
    this.addHoliday = new HolidaysModel("", "", "", "", "", false,false);
    this.isDuplicateHoliday = false;
    this.showMessage = false;
    if (this.allLocation) {
      this.allLocation.forEach(x => {
        x.state = false;
        x.optional = false;
      });
    }
    this.holidaySelectedDate = { year: 0, month: 0, day: 0 };
    if (id == "add_holiday") {
      this.all = false;
      if (this.isEnableAddHoliday) {
        $("#add_holiday").modal({ show: true, backdrop: "static" });
      }
      else {
        this.errorMessage = 'Please Select Organization';
        $("#errorMessage").show();
        setTimeout(function () {
          $("#errorMessage").hide();
        }, 1000);
      }

      this.removeTheSelection();
    } else if (id == "edit_holiday" && this.isEditable) {
      $("#edit_holiday").modal({ show: true, backdrop: "static" });

      this.removeTheSelection();

      //data was not populating on modal so created individual var
      this.HoliName = this.editHoliday.holidayname;
      this.optional = this.editHoliday.optionals;
      this.Weekend = this.editHoliday.isWeekend;
      this.editedLocation = this.editHoliday["locationName"];

      //converting date to date obj
      let date: string[] = this.editHoliday.holidaydate.split("-");
      this.expenseSelectedDateField = {
        year: Number(date[0]),
        month: Number(date[1]),
        day: Number(date[2])
      };
    } else if (id == "delete_holiday" && this.isSelectedRow) {
      $("#delete_holiday").modal({ show: true, backdrop: "static" });
    }
  }

  adHolidaysToList() {
    var maxId: 0;
    if (this.fieldArray.length == 0) {
      this.addHoliday.id = "1";
    } else {
      maxId = Math.max.apply(
        Math,
        this.fieldArray.map(function (o) {
          return o.id;
        })
      );
      this.addHoliday.id = String(maxId + 1);
    }
    this.addHoliday.holidaydate =
      this.holidaySelectedDate.year +
      "-" +
      this.holidaySelectedDate.month +
      "-" +
      this.holidaySelectedDate.day;
    this.addHoliday.status = false;
    this.fieldArray.push(this.addHoliday);
    this.deletedFieldArray = this.fieldArray;
  }

  editHolidaysToList(editedObj) {
    this.isDuplicateHoliday = true;
    this.holidayExistMessage = "";
    editedObj.id = this.editHoliday.id;
    editedObj.locationName = this.editHoliday["locationName"];

    if (
      // to check fields are provided or not
      !!editedObj.holidaydate &&
      editedObj.holidaydate["day"] != 0 &&
      editedObj.holidayname.trim() != ""
    ) {
      //adding location Id to the edited field
      editedObj.locationId = this.allLocation.find(
        _ => editedObj.locationName === _.locationName
      ).locationId;

      if (typeof editedObj["holidaydate"] === "object") {
        // adding 0 to month to convert single digit month to double digit eg: 7 to 07
        editedObj["holidaydate"].month =
          editedObj["holidaydate"]["month"].toString().length === 1
            ? "0" + editedObj["holidaydate"]["month"]
            : editedObj["holidaydate"]["month"];

        // converting obj date to yyyy-mm-dd
        editedObj["holidaydate"] =
          editedObj["holidaydate"].year +
          "-" +
          editedObj["holidaydate"].month +
          "-" +
          editedObj["holidaydate"].day;
      }

      // checking for duplicate entry.
      this.isDuplicateHoliday = this.allHolidays.some(x => {
        return (
          x.holidaydate === editedObj.holidaydate &&
          x.locationName.trim().toLowerCase() ===
          editedObj.locationName.trim().toLowerCase() &&
          x.holidayname.trim().toLowerCase() ===
          editedObj.holidayname.trim().toLowerCase() &&
          x.optionals === editedObj["optionals"]
        );
      });

      if (this.isDuplicateHoliday) {
        //duplicate record found then do not update the record
        this.showMessage = true;
        this.holidayExistMessage =
          "Holiday with this Name & Date already exists for " +
          editedObj.locationName;
        let ref = this;
        setTimeout(function () {
          ref.showMessage = false;
        }, 3000);
      } else {
        //no duplicate record found then updating the record
        this.successMessage = 'Holiday updated successfully.'
        let tempArr: any[] = [];
        tempArr.push(editedObj);
        const sendHoliday = { "orgId": Number(this.orgId), holidaysList: tempArr };

        //callig the service
        this._holidayService.updateHoliday(sendHoliday).subscribe(response => {
          this.selectedRow = null;
          this.isSelectedRow = false;
          this.fieldArray = [];
          this.onSelect(this.holidayLocationId);
          let ref = this;

          this.successAlert = true;

          setTimeout(function () {
            ref.successAlert = false;
          }, 3000);
          // this.selectedItem = null;
        }, error => {
          this.errorMessage = error;
          $("#errorMessage").show();
        });
        /*  setTimeout(function() {
            window.location.reload();
          }, 1000);
         */
        $("#edit_holiday").modal("hide");


      }
    } else {
      this.showMessage = true;
      if (this.holidayExistMessage === "") {
        this.holidayExistMessage = "Please provide the mandatory field";
      }
      let ref = this;
      setTimeout(function () {
        ref.showMessage = false;
      }, 3000);
    }

    this.selectedRowId = null;
    this.isEditable = false;

    let itemToUpdate = this.fieldArray.find(
      this.findIndexToUpdate,
      this.editHoliday.id
    );
    let updateIndex = this.fieldArray.indexOf(itemToUpdate);

    this.fieldArray[updateIndex] = this.editHoliday;
  }

  findIndexToUpdate(editHoliday) {
    return editHoliday._id === this;
  }

  deleteFieldValue(index) {
    if (this.fieldArray.length > 1) {
      this.fieldArray.splice(index, 1);
    }
  }

  onEditChecked(event) {
    if (event.target.checked) {
      this.selectedRowId = event.target.value;
    }
  }

  selectedItem = {};
  setClickedRow(item) {
    this.isSelectedRow = true;
    this.isEditable = true;
    this.selectedItem = item;
    this.selectedRow = item.id;
    this.selectedRowId = item.id;
    Object.assign(this.editHoliday, item);
  }

  onSelectedRowDelete(): void {
    this._holidayService.deleteHoliday(this.selectedRow).subscribe(resp => { });

    this.deletedFieldArray = this.fieldArray;

    if (this.fieldArray.length >= 1 && this.selectedRowId >= 0) {
      this.fieldArray = this.fieldArray.filter(
        field => field.id != this.selectedRowId
      );
      this.isDeleted = false;
    }
    this.isDeleted = true;
  }

  onSelect(event) {
    this.isSelectedRow = false;
    this.selectedRow = null;
    localStorage.holidayLocationId = event;
    if (event != "null") {
      this._holidayService
        .getHolidaysBasedOnLocation(event)
        .subscribe(response => {
          this.fieldArray = response;

          if (!!this.fieldArray) {
            this.fieldArray.sort((a, b) => {
              const dateA = new Date(a.holidaydate);
              const dateB = new Date(b.holidaydate);
              return dateA.getTime() - dateB.getTime();
            });
          }
        }, error => (this.errorMessage = <any>error));
    } else {
      this.getHolidayList();
      //this.fieldArray = [];
    }
  }

  createHoliday() {
    this.isDuplicateHoliday = false;
    this.user.holidaysList = [];
    this.user.holidaysList = this.fieldArray;
    if (this.deletedFieldArray.length != this.fieldArray.length) {
      this._holidayService.createHoliday(this.user).subscribe(createService => {
        this.user = createService;
        //this.getHolidayList();
      }, error => (this.errorMessage = <any>error));
    } else {
      this._holidayService.createHoliday(this.user).subscribe(createService => {
        this.user = createService;
        this.fieldArray = [];
        this.onSelect(this.holidayLocationId);
      }, error => (this.errorMessage = <any>error));
    }
    /*setTimeout(function() {
      window.location.reload();
    }, 1000);*/
  }

  getDateCheckedBasedOnLocation(event) {
    let holidateDate = event.year + "-" + event.month + "-" + event.day;
    this._holidayService
      .getDateCheckedBasedOnLocation(holidateDate, this.locationId)
      .subscribe(response => {
        this.isSelectedRow = false;
        this.selectedRow = null;
        this.holidayBean = response;
        this.addHoliday.holidaydate = "";
        this.holidayExists = this.holidayBean.holidayExists;
      }, error => (this.errorMessage = <any>error));
  }

  isAllChecked() {
    if (this.allLocation != undefined) {
      return this.allLocation.forEach(_ => _.state);
    }
  }

  checkAll(ev) {
    this.allLocation.forEach(x => (x.state = ev.target.checked));
  }



  addHolidayToList(holidayData) {
    this.isDuplicateHoliday = true;
    this.holidayExistMessage = "";
    let holidays: any[] = [];

    if (
      !!holidayData.holidaydate &&
      holidayData.holidayname != "" &&
      holidayData.holidaydate["day"] != 0
    ) {
      let selectedLocations = [];
      this.allLocation.forEach(_ => {
        if (_.state) {
          selectedLocations.push(_);
        }
      });
      selectedLocations.forEach(_ => {
        holidays.push({
          holidayname: holidayData.holidayname,
          holidaydate: holidayData.holidaydate,
          locationId: _.locationId,
          locationName: _.locationName,
          isWeekend: holidayData.isWeekend,
          optionals: _.optional
        });
      });

      for (let i = 0; i < holidays.length; i++) {
        holidays[i]["holidaydate"].month =
          holidays[i]["holidaydate"]["month"].toString().length === 1
            ? "0" + holidays[i]["holidaydate"]["month"]
            : holidays[i]["holidaydate"]["month"];

        holidays[i]["holidaydate"] =
          holidays[i]["holidaydate"].year +
          "-" +
          holidays[i]["holidaydate"].month +
          "-" +
          holidays[i]["holidaydate"].day;

        this.isDuplicateHoliday = this.allHolidays.some(x => {
          return (
            x.holidaydate === holidays[i].holidaydate &&
            x.locationName.trim().toLowerCase() ===
            holidays[i].locationName.trim().toLowerCase() &&
            x.holidayname.trim().toLowerCase() ===
            holidays[i].holidayname.trim().toLowerCase()
          );
        });

        if (this.isDuplicateHoliday) {
          this.showMessage = true;
          this.holidayExistMessage =
            "Holiday with this Name & Date already exists for " +
            holidays[i].locationName;
          let ref = this;
          setTimeout(function () {
            ref.showMessage = false;
          }, 3000);
          break;
        }
      }
    }
    if (!this.isDuplicateHoliday) { //not duplicate then create
      const sendHoliday = { "orgId": Number(this.orgId), holidaysList: holidays };

      this.createNewHoliday(sendHoliday); //create new holiday
      let ref = this;
      $("#add_holiday").modal("hide"); // hide the modal
      this.successMessage = 'New Holiday Created';
      this.successAlert = true;
      setTimeout(() => { // hiding the alert message
        this.successAlert = false
      }, 2000)

      //refresh the list
      //this.getHolidayList();

    } else { // if any field is missing
      this.showMessage = true;
      if (this.holidayExistMessage === "") {
        this.holidayExistMessage =
          "Please provide the mandatory field with atleast one Location";
      }
      let ref = this;
      setTimeout(function () {
        ref.showMessage = false;
      }, 3000);
    }
  }

  createNewHoliday(newHoliday) {
    this._holidayService.createHoliday(newHoliday).subscribe(resp => {
      this.fieldArray.push(resp);
      this.fieldArray = [];
      this.onSelect(this.holidayLocationId);
    });
    /* setTimeout(function() {
       window.location.reload();
     }, 1000);*/
  }

  getHolidayList() {
    this._holidayService.getHolidayList().subscribe(resp => {
      this.fieldArray = resp;
      this.allHolidays = resp;

      this.fieldArray.sort((a, b) => {
        const dateA = new Date(a.holidaydate);
        const dateB = new Date(b.holidaydate);
        return dateA.getTime() - dateB.getTime();
      });
      this._cd.detectChanges();

    });
  }

  public onClick(event, datePicker, str) {
    // close the datepicker when user clicks outside the element
    if (str === "d1") {
      if (!this.datePickerContainer1.nativeElement.contains(event.target)) {
        // check click origin
        datePicker.close();
      }
    } else if (str === "d2") {
      if (!this.datePickerContainer2.nativeElement.contains(event.target)) {
        // check click origin
        datePicker.close();
      }

    }
  }

  trackByFn(index, item) {
    return index;
  }
}
