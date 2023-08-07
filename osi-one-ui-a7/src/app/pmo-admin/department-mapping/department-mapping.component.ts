import { Component, OnInit } from "@angular/core";
import { DepartmentMappingService } from "./../../shared/services/department-mapping.service";
import { DeptMappingModel } from "./departmentMappingModel";

declare var $: any;
@Component({
  selector: "app-department-mapping",
  templateUrl: "./department-mapping.component.html",
  styleUrls: ["./department-mapping.component.css"]
})
export class DepartmentMappingComponent implements OnInit {
  constructor(private deptMapService: DepartmentMappingService) {}

  ngOnInit() {
    this.OrganizationList();
    this.subPracticeList();
    this.practiceList();
    this.deptList();
    this.buList();
    this.regionList();
    // this.getAllDeptMap();

    this.deptMapping.orgId = null;
    this.deptMapping.segment1 = "";
    this.deptMapping.segment2 = null;
    this.deptMapping.segment3 = null;
    this.deptMapping.segment4 = null;
    this.deptMapping.segment5 = null;
    this.deptMapping.segment6 = null;
    this.deptMapping.segment7 = null;
    this.deptMapping.active = true;
  }

  deptMapping = new DeptMappingModel();
  successTextAlert: String;
  ErrorTextAlert: String;
  headerName: String;
  listOfBU = [];
  listOfOrg = [];
  listOfDept = [];
  listOfRegion = [];
  listOfPractice = [];
  listOfSubPractice = [];
  isEditable: Boolean = false;
  isDuplicate: Boolean = false;
  listOfMap = [];
  totalData: Number = 0;
  crntpage;
  isUpdatable: Boolean = false;
  isView: Boolean = false;

  isRowSelected: Boolean = false;
  selectedRow = {};

  searchData = {
    orgName: null,
    bu: null,
    practice: null,
    subPractice: null,
    dept: null,
    region: null
  };

  searchDataFn(searchVal) {
    // console.log(searchVal);
    this.getAllDeptMap(searchVal);
  }

  setClickedRow(selectedRow) {
    this.isRowSelected = true;
    // this.selectedRow = selectedRow;
    Object.assign(this.selectedRow, selectedRow);
    Object.assign(this.deptMapping, this.selectedRow);
    console.log(this.selectedRow);
  }

  removeSelection() {
    this.selectedRow = {};
    this.isRowSelected = false;
  }

  clearRecord() {
    this.listOfMap = [];
    this.totalData = 0;
    this.removeSelection();
  }

  getAllDeptMap(searchData) {
    console.log(searchData);

    this.deptMapService.getAllDeptMapping(searchData).subscribe(resp => {
      this.listOfMap = resp;
      console.log(this.listOfMap);

      if (this.listOfMap.length != 0) {
        this.totalData = this.listOfMap.length;
      }
    });
  }

  OrganizationList() {
    this.deptMapService
      .OrganizationList()
      .subscribe(resp => (this.listOfOrg = resp));
  }
  buList() {
    this.deptMapService.buList().subscribe(resp => (this.listOfBU = resp));
  }

  practiceList() {
    this.deptMapService
      .practiceList()
      .subscribe(resp => (this.listOfPractice = resp));
  }
  subPracticeList() {
    this.deptMapService
      .subPracticeList()
      .subscribe(resp => (this.listOfSubPractice = resp));
  }
  deptList() {
    this.deptMapService
      .departmentList()
      .subscribe(resp => (this.listOfDept = resp));
  }
  regionList() {
    this.deptMapService
      .regionList()
      .subscribe(resp => (this.listOfRegion = resp));
  }

  getOrgShrtName(idx) {
    console.log(
      this.listOfOrg.filter(x => x.orgId === Number(idx))[0]["orgShortName"]
    );

    this.deptMapping.segment1 = this.listOfOrg.filter(
      x => x.orgId === Number(idx)
    )[0]["orgShortName"];
  }

  showModal(action) {
    if (action == "create") {
      this.deptMapping.orgId = null;
      this.deptMapping.segment1 = "";
      this.deptMapping.segment2 = null;
      this.deptMapping.segment3 = null;
      this.deptMapping.segment4 = null;
      this.deptMapping.segment5 = null;
      this.deptMapping.segment6 = null;
      this.deptMapping.segment7 = null;
      this.deptMapping.active = true;
      this.headerName = "Create Department Mapping";
      this.isEditable = true;
      this.isUpdatable = false;
      this.isView = false;
      $("#deptMappingModal").modal("show");
    } else if (action == "edit") {
      this.headerName = "Update Department Mapping";
      this.isEditable = true;
      this.isUpdatable = true;
      if (this.isRowSelected) {
        $("#deptMappingModal").modal("show");
      }
    } else if (action == "delete") {
      if (this.isRowSelected) {
        $("#deleteMapping").modal("show");
      }
    } else {
      this.headerName = "View Department Mapping";
      this.isEditable = false;
      this.isUpdatable = false;
      this.isView = true;
      if (this.isRowSelected) {
        $("#deptMappingModal").modal("show");
      }
    }
  }

  SelectedRowDelete() {
    const id = this.selectedRow["rollupId"];
    this.deptMapService.deleteDeptMapping(id).subscribe(
      resp => {
        console.log(resp);
      },
      () => {},
      () => {
        console.log("Row Deleted");
        this.getAllDeptMap(this.searchData);
        this.isRowSelected = false;
        this.selectedRow = null;
      }
    );
  }

  addDepartment(formObj) {
    formObj.segment1 = this.deptMapping.segment1;
    // if (formObj.active === true) {
    //   formObj.active = 1;
    // } else formObj.active = 0;

    formObj.active = formObj.active ? 1 : 0;

    console.log(formObj);
    this.deptMapService.createDeptMapping(formObj).subscribe(
      resp => console.log(resp),
      () => {},
      () => {
        console.log("Created");
        console.log(this.searchData);
        this.getAllDeptMap(this.searchData);
        this.isRowSelected = false;
        this.selectedRow = null;
        $("#deptMappingModal").modal("hide");
      }
    );
  }

  editSelectedRowDetails(saveData) {
    console.log(saveData);
    saveData.rollupId = this.selectedRow["rollupId"];
    saveData.segment1 = this.deptMapping.segment1;
    this.deptMapService.updateDeptMapping(saveData).subscribe(
      resp => console.log(resp),
      err => {
        console.log("Record not updated successfully =>", err);
      },
      () => {
        console.log("Updated");
        this.getAllDeptMap(this.searchData);
        this.isRowSelected = false;
        this.selectedRow = null;
        $("#deptMappingModal").modal("hide");
      }
    );
  }
}
