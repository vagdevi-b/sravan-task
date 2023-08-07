import { Component, OnInit } from "@angular/core";
import { NgForOf } from "@angular/common";
import { AppConstants } from "../shared/app-constants";
import { SimpleTimer } from "ng2-simple-timer";
import * as _ from "underscore";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ReportService } from "../report/report.service";
import { ViewReport } from "../report/viewreport";
import { JsonObject, JsonArray } from "@angular-devkit/core";
import { empty } from "rxjs/observable/empty";
import { CommonUtilities } from '../shared/utilities';
import { ToastrService } from 'ngx-toastr';
import { OsiMonth } from '../shared/component/osi-month-picker/osi-month';
declare var $: any;
@Component({
  selector: "app-dashboard",
  templateUrl: "./report-filter.component.html",
  styleUrls: ["./report-filter.component.css"]
})
export class ReportFilterComponent implements OnInit {
  constructor(
    private router: Router,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private commonUtilities: CommonUtilities,
    private toastrService: ToastrService
  ) {}

  filterflag: false;
  availableAndFilterColumns: any = {
    selectedColumns: "",
    filterConditions: "",
    orderByColumns: ""
  };
  rptMetaDataId: string;
  reportFileDownload: any;
  customReportName: string;
  availableColumns: JsonArray = [];
  groupByColumnss: JsonArray = [];
  groupByColumns: JsonArray = [];
  availableColumss: JsonArray = [];
  availableCols: JsonArray = [];
  selectedCols: JsonArray = [];
  selectedColumns: JsonArray = [];
  filterColumns: JsonArray = [];
  filterValues: JsonArray = [];
  errorMessage = "";
  successMessage = "";
  reportsResponse: ViewReport;
  viewReportsResponse: JsonObject;
  headerColumns: any[string];
  resultColumns: JsonArray = [];
  reportName: string;
  savedRptId: string;
  errorMsg: string;
  operationList = [[]];
  filterValuesList = [[]];
  operations: JsonArray = [];
  operation: any;
  selectedFilterValues: any[];
  filter: any;
  dropdownList: any;
  dropdownSettings: any = {};
  groupByList: any;
  showGroupBy: string;
  showDateFields = [];
  reportsDTO: any = {
    rptMetaDataId: "",
    reportName: "",
    savedRptId: "",
    rptViewName: "",
    allOrEmployee: "",
    displayFilterSummary: "",
    dynamicReportName: "",
    selectedColumns: [],
    filterConditions: [],
    orderByColumns: [],
    groupByColumns: [],
    availableAndFilterColumns: []
  };
  filterConditions: any = [];
  filterConditionss: any = [];
  orderByLists: any = [];
  groupByLists: any = [];
  comments: string;

  readonly YEAR_MONTH_FIELD_NAME_REGEX = /YearMonth/gi;
  yearMonthFilterMin: OsiMonth;
  yearMonthFilterMax: OsiMonth;

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'listName',
      textField: 'listValue',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit:2,
      allowSearchFilter: true
    };

    let filters = {
      filter: "",
      selectedFilterValues: ""
    };

    this.filterConditionss.push(filters);
    let orderByCol: any = {
      orderByList: ""
    };
    let groupByCol: any = {
      columnName: "",
      columnDisplayName: "",
      columnDataType: "",
      operation: ""
    };
    if (this.groupByLists.length == 0) {
      this.groupByLists.push(groupByCol);
    }
    if (this.orderByLists.length == 0) this.orderByLists.push(orderByCol);
    if (this.filterConditionss.length == 0)
      this.filterConditionss.push(filters);

    if (localStorage.getItem("savedReport")) {
      localStorage.removeItem("runReport");
      localStorage.setItem("saveReport", "saveReport");
      localStorage.setItem("backNavigation", "savedReport");
      $("#loadingEditSubmitModal").modal({ show: true, backdrop: "static" });
      this.reportsResponse = JSON.parse(localStorage.getItem("savedReport"));
      if (this.reportsResponse.allOrEmployee == "all")
        localStorage.setItem("allOrEmployee", "all");
      else localStorage.setItem("allOrEmployee", "Employee");
      this.reportName = this.reportsResponse.rptName + "";
      this.customReportName = this.reportsResponse.rptName + "";
      this.rptMetaDataId = this.reportsResponse.rptMetaDataId;
      this.savedRptId = this.reportsResponse.savedRptId;
      this.comments = this.reportsResponse.comments;
      this.reportsResponse.displayFilterSummary = this.reportsResponse.displayFilterSummary;
      this.reportsResponse.dynamicReportName = this.reportsResponse.rptName;
      this.reportService
        .getSavedReport(this.reportsResponse.reportType, this.savedRptId)
        .subscribe(
          response => {
            this.reportsDTO = response;
            this.availableAndFilterColumns = this.reportsDTO.availableAndFilterColumnsDTO;
            this.availableColumns = this.availableAndFilterColumns.rptMetaDataColsDTOList;
            this.filterColumns = this.availableAndFilterColumns.rptFiltersDTOList;
            this.availableColumss = this.availableAndFilterColumns.rptMetaDataColsDTOList;
            this.selectedColumns = this.reportsDTO.selectedColumns;
            this.filterConditionss = this.reportsDTO.filterConditions;
            for (let i = 0; i < this.filterConditionss.length; i++) {
              this.filterConditionss[i] = { filter: this.filterConditionss[i] };
            }
            this.orderByLists = this.reportsDTO.orderByColumns;
            this.groupByLists = this.reportsDTO.groupByColumns;
            for (let i = 0; i < this.groupByLists.length; i++) {
              let vv: any = this.groupByLists[i];
              vv.operation = vv.functionName;
              this.getFunctions(vv.columnName, i);
            }
            for (let i = 0; i < this.filterConditionss.length; i++) {
              let vv: any = this.filterConditionss[i].filter;
              this.getOperations(this.filterConditionss[i], i);
              setTimeout(() => {
                $("#filterColumnName1_" + i + " option")
                  .map(function() {
                    if ($(this).text() == vv.columnDisplayName) return this;
                  })
                  .attr("selected", "selected");
              }, 1000);
            }

            for (let i = 0; i < this.orderByLists.length; i++) {
              let vv: any = this.orderByLists[i];
              vv.orderByList = vv.columnName;
              setTimeout(() => {
                $("#orderBy" + i + " option")
                  .map(function() {
                    if ($(this).text() == vv.columnDisplayName) return this;
                  })
                  .attr("selected", "selected");
              }, 1000);

              // vv.orderByList = vv;
            }
            if (this.groupByLists.length == 0) this.addGroupByList();
            if (this.filterConditionss.length == 0) this.addColumnList();
            if (this.orderByLists.length == 0) this.addOrderByList(0);
            $("#loadingEditSubmitModal").modal("hide");
          },
          error => (this.errorMessage = <any>error)
        );
    }else if (localStorage.getItem("modifiedReport")) {
      this.reportsDTO = JSON.parse(localStorage.getItem("viewResponse"));
      this.reportName = this.reportsDTO.reportName + "";
      this.customReportName = this.reportsDTO.reportName + "";
      this.rptMetaDataId = this.reportsDTO.rptMetaDataId;
      this.savedRptId = this.reportsDTO.savedRptId;
      this.comments = this.reportsDTO.comments;
      this.reportsResponse = new ViewReport();
      if (this.reportsDTO.displayFilterSummary == 1)
        this.reportsResponse.displayFilterSummary = 1;
      else this.reportsResponse.displayFilterSummary = 0;
      this.reportsResponse.dynamicReportName = this.reportsDTO.dynamicReportName;
      this.reportsResponse.reportType = this.reportsDTO.rptViewName;


      this.availableAndFilterColumns = this.reportsDTO.availableAndFilterColumnsDTO;
      this.availableColumns = this.availableAndFilterColumns.rptMetaDataColsDTOList;
      this.filterColumns = this.availableAndFilterColumns.rptFiltersDTOList;
      this.availableColumss = this.availableAndFilterColumns.rptMetaDataColsDTOList;
      this.selectedColumns = this.reportsDTO.selectedColumns;
      for(let ii=0; ii<this.selectedColumns.length; ii++){
        let vvv: any = this.selectedColumns[ii];
        
        vvv.columnName = vvv.columnDisplayName.replace(/ /g, "_");
      }
      this.filterConditionss = this.reportsDTO.filterConditions;
      for (let i = 0; i < this.filterConditionss.length; i++) {
        this.filterConditionss[i] = { filter: this.filterConditionss[i] };
      }
      this.orderByLists = this.reportsDTO.orderByColumns;
      this.groupByLists = this.reportsDTO.groupByColumns;
      for (let i = 0; i < this.groupByLists.length; i++) {
        let vv: any = this.groupByLists[i];
        for(let ii=0; ii<this.filterColumns.length; ii++){
          let vvv: any = this.filterColumns[ii];
          if(vvv.columnName==vv.columnName){
            vv.columnDisplayName = vvv.columnDisplayName;
            vv.columnDataType = vvv.columnDataType;
          }
        }
        vv.operation = vv.functionName;
        this.getFunctions(vv.columnName, i);
      }
      for (let i = 0; i < this.filterConditionss.length; i++) {
        let vv: any = this.filterConditionss[i].filter;
        if( vv.columnDisplayName!=null){
        console.log(vv.columnName+"+++++++++"+$(this).text());
        this.getOperations(this.filterConditionss[i], i);
        setTimeout(() => {
          $("#filterColumnName1_" + i + " option")
            .map(function() {
              console.log($(this).text()+"Filter------");
              if ($(this).text() == vv.columnDisplayName) return this;
             // if ($(this).text() == vv.columnName) return this;
            })
            .attr("selected", "selected");
        }, 1000);
      }else{
        this.filterConditionss = [];
      }
      }

      for (let i = 0; i < this.orderByLists.length; i++) {
        let vv: any = this.orderByLists[i];
        if( vv.columnName!=null){
        vv.orderByList = vv.columnName;
        setTimeout(() => {
          $("#orderBy" + i + " option")
            .map(function() {
              console.log($(this).text()+"Order By======");
              if ($(this).text() == vv.columnDisplayName) return this;
            })
            .attr("selected", "selected");
        }, 1000);
      }else{
        this.orderByLists = [];
      }
        // vv.orderByList = vv;
      }
      if (this.groupByLists.length == 0) this.addGroupByList();
      if (this.filterConditionss.length == 0) this.addColumnList();
      if (this.orderByLists.length == 0) this.addOrderByList(0);
      $("#loadingEditSubmitModal").modal("hide");

    }else {
      localStorage.setItem("runReport", "runReport");
      localStorage.removeItem("saveReport");
      if (localStorage.getItem("allOrEmployee") == 'all'){
        localStorage.setItem("backNavigation", "allPMOReport");
      }else
        localStorage.setItem("backNavigation", "allReport");
    
      this.reportsResponse = JSON.parse(localStorage.getItem("report"));
      this.reportName = this.reportsResponse.rptName + "";
      this.rptMetaDataId = this.reportsResponse.rptMetaDataId;
      this.comments = this.reportsResponse.comments;
      this.reportsResponse.displayFilterSummary = this.reportsResponse.displayFilterSummary;
      if (this.reportsResponse.displayFilterSummary == 1)
        this.reportsResponse.displayFilterSummary = true;
      else this.reportsResponse.displayFilterSummary = false;

      this.reportsResponse.dynamicReportName = this.reportsResponse.rptName;
      this.reportService
        .getAvailableAndFilterColumns(this.reportsResponse.reportType)
        .subscribe(
          response => {
            this.availableAndFilterColumns = response;
            this.availableColumns = this.availableAndFilterColumns.rptMetaDataColsDTOList;
            this.filterColumns = this.availableAndFilterColumns.rptFiltersDTOList;
            this.availableColumss = this.availableAndFilterColumns.rptMetaDataColsDTOList;
          },
          error => (this.errorMessage = <any>error)
        );
    }
  }
  getFunctions(groupByList, i) {
    this.operations = [];
    console.log(this.filterColumns);
    for (let value of this.filterColumns) {
      let ii: any = value;
      if (ii.columnName == groupByList) {
        console.log(ii.columnDataType);
        if (
          ii.columnDataType == "bigint" ||
          ii.columnDataType == "number" ||
          ii.columnDataType == "decimal" ||
          ii.columnDataType == "int" ||
          ii.columnDataType == "double"
        ) {
          this.operations.push(
            { value: "count", name: "Count" },
            { value: "sum", name: "Sum" },
            { value: "min", name: "Min" },
            { value: "max", name: "Max" },
            { value: "avg", name: "Average" }
          );
        } else if (
          ii.columnDataType == "char" ||
          ii.columnDataType == "varchar" ||
          ii.columnDataType == "date" ||
          ii.columnDataType == "datetime"
        ) {
          this.operations.push({ value: "count", name: "Count" });
        }
        break;
      }
    }
    this.operationList[i] = this.operations;
  }

  pushToselectionForFn(val, i) {
    this.selectedColumns.forEach(x => {
      if (x["state"] == true) {
        this.groupByLists.forEach(y => {
          if (y["columnName"] != x["columnName"]) {
            x["state"] = false;
          }
        });
      }
    });

    this.selectedColumns.forEach(x => {
      this.groupByLists.forEach(y => {
        if (y["columnName"] == x["columnName"]) {
          x["state"] = true;
        }
      });
    });
  }

  getOperations(filters, i) {
    const filter = filters.filter;
    if (filter != "") {
      this.filter = filter;

      if (filter.columnName.match(this.YEAR_MONTH_FIELD_NAME_REGEX)) {
        filters.isFilterFieldYearMonth = true;
        if (filter.selectedValues && filter.selectedValues.length > 0) {
          filters.fromYearMonth = this.commonUtilities.getOsiMonthFromString(filter.selectedValues[0]);
          filters.toYearMonth = this.commonUtilities.getOsiMonthFromString(
            filter.selectedValues[filter.selectedValues.length - 1]
          );
        }
      }
      else {
        filters.isFilterFieldYearMonth = false;
        filters.fromYearMonth = undefined;
        filters.toYearMonth = undefined;
        // minFromMonth and minToMonth will be initially set to
        // the min month received from the backend.
        // similarly maxFromMonth and maxToMonth
        filters.minFromMonth = undefined;
        filters.maxFromMonth = undefined;
        filters.minToMonth = undefined;
        filters.maxToMonth = undefined;
      }
      if (filter.columnDataType != null && filter.columnDataType != "") {
        if (
          filter.columnDataType == "date" ||
          filter.columnDataType == "datetime"
        ) {
          this.showDateFields[i] = "date";
          this.reportService
            .getFilterValues(
              this.reportsResponse.reportType,
              filter.columnName,
              filter.columnDataType,
              localStorage.getItem("allOrEmployee")
            )
            .subscribe(
              response => {
                this.filterValues = response;
                // this.filter.fromDate = response[0].listName;
                // $("#fromDate_" + i).val(response[0].listName);
                // $("#toDate_" + i).val(response[0].listName);
                // this.filter.toDate = response[0].listName;
              },
              error => (this.errorMessage = <any>error)
            );
        } else {
          this.showDateFields[i] = null;
          $('#loadingEditSubmitModal').modal('show');
          this.reportService
            .getFilterValues(
              this.reportsResponse.reportType,
              filter.columnName,
              filter.columnDataType,
              localStorage.getItem("allOrEmployee")
            )
            .subscribe(
              response => {
                this.filterValues = response;
                this.filterValuesList[i] = response;
                let tmp = [];
                for(let i=0; i < response.length; i++) {
                    tmp.push({ listName: response[i].listName, listValue: response[i].listValue});
                }
                this.dropdownList = tmp;
                if (filters.isFilterFieldYearMonth) {
                  if (response.length > 0) {

                    this.yearMonthFilterMin = OsiMonth.from(
                      response[0].listValue,
                      'YYYYMM'
                    );

                    this.yearMonthFilterMax = OsiMonth.from(
                      response[response.length - 1].listValue,
                      'YYYYMM'
                    );

                    filters.minFromMonth = filters.minToMonth = this.yearMonthFilterMin;
                    filters.maxFromMonth = filters.maxToMonth = this.yearMonthFilterMax;
                  }
                }
                $('#loadingEditSubmitModal').modal('hide');
              },
              error => (this.errorMessage = <any>error)
            );
        }
      }
    } else {
      this.filterValuesList[i] = [];
      this.showDateFields[i] = null;
      $("#fromDate_" + i).val("");
      $("#toDate_" + i).val("");
    }
    if (filter.selectedValues) {
      let vv: any = this.filterConditionss[i];
      vv.selectedFilterValues = filter.selectedValues;
    } else if (filter.fromDate) {
      let vv: any = this.filterConditionss[i];
      vv.filter.fromDate = filter.fromDate;
      vv.filter.toDate = filter.toDate;
    }
  }
  countOfSelectedColumnFn = 0;
  countOfSelectedColumnSb = 0;
  addToExcludedALL() {
    this.availableColumns = this.availableColumss;
    let cols = JSON.parse(JSON.stringify(this.filterColumns));
    console.log(cols);
    this.availableColumss = [];
    this.selectedColumns = [];

    for (let value of cols) {
      let column: any = value;
      this.selectedColumns.push(column);
    }

    this.countOfSelectedColumnFn = this.selectedColumns.length;
    this.countOfSelectedColumnSb = this.selectedColumns.length;

    this.availableCols = [];
  }

  addToExcludedRepeat() {
    if (this.availableColumss.length != 0 && this.availableCols.length > 0) {
      for (let value of this.availableCols) {
        this.selectedColumns.push(value);
        for (let key in this.availableColumss) {
          if (value == this.availableColumss[key]) {
            this.availableColumss.splice(parseInt(key), 1);
          }
        }
      }
      this.availableCols = [];
    }

    this.countOfSelectedColumnFn = this.selectedColumns.length;
    this.countOfSelectedColumnSb = this.selectedColumns.length;
    console.log(this.countOfSelectedColumnFn);
  }
  removeFromExcludedRepeat() {
    if (this.selectedColumns.length != 0 && this.selectedCols.length > 0) {
      for (let value of this.selectedCols) {
        this.availableColumss.push(value);
        for (let key in this.selectedColumns) {
          if (value == this.selectedColumns[key]) {
            this.selectedColumns.splice(parseInt(key), 1);
            // Order By
            let list: any = this.groupByLists;
            for (let key1 in list) {
              let t: any = JSON.parse(JSON.stringify(list[key1]));
              let t1: any = value;
              if (t1.columnName == t.columnName) {
                this.groupByLists.splice(parseInt(key1), 1);
                this.operationList.splice(parseInt(key1), 1);
              }
            }
            // Filters
            let list1: any = this.orderByLists;
            for (let key2 in list1) {
              let t: any = JSON.parse(JSON.stringify(list1[key2]));
              let tt: any = t.orderByList;
              let t1: any = value;
              if (t1.columnName === tt) {
                this.orderByLists.splice(parseInt(key2), 1);
              }
            }
          }
        }
      }
      if (this.groupByLists.length == 0) {
        this.addGroupByList();
      }
      if (this.orderByLists.length == 0) {
        this.addOrderByList(0);
      }
      this.selectedCols = [];
    }

    this.countOfSelectedColumnFn = this.selectedColumns.length;
    this.countOfSelectedColumnSb = this.selectedColumns.length;
  }
  moveUp(columns) {
    for(var ii=0; ii< columns.length; ii++){
    let index = _.findLastIndex(this.selectedColumns, {
      columnDisplayName: columns[ii].columnDisplayName
    });
    if (index > 0) {
      let temp = _.clone(this.selectedColumns[index - 1]);
      this.selectedColumns[index - 1] = _.clone(columns[ii]);
      this.selectedColumns[index] = temp;
    }
  }
  }

  moveDown(columns) {
    for(var ii=(columns.length-1); ii>=0; ii--){
    let index = _.findLastIndex(this.selectedColumns, {
      columnDisplayName: columns[ii].columnDisplayName
    });
    if (index != this.selectedColumns.length - 1) {
      let temp = _.clone(this.selectedColumns[index + 1]);
      this.selectedColumns[index + 1] = _.clone(this.selectedCols[ii]);
      this.selectedColumns[index] = temp;
    }
  }
  }
  removeFromExcludedALL() {
    this.selectedColumns = [];
    this.groupByColumnss = [];
    this.availableColumss = JSON.parse(JSON.stringify(this.filterColumns));
    this.countOfSelectedColumnFn = 0;
    this.countOfSelectedColumnSb = 0;
  }

  disableOrderByPlus: Boolean = false;
  addOrderByList(i) {
    let orderByCol: any = {
      orderByList: ""
    };
    this.orderByLists.push(orderByCol);
    this.countOfSelectedColumnSb = this.countOfSelectedColumnSb - 1;

    let temp = -this.countOfSelectedColumnSb;
    if (this.selectedColumns.length == temp) {
      this.disableOrderByPlus = true;
    } else this.disableOrderByPlus = false;
  }

  removeOrderByList(i, val) {
    console.log(val);
    this.orderByLists.splice(i, 1);
    if (this.orderByLists.length == 0) {
      this.addOrderByList(i);
    }
    this.selectedColumns.forEach(x => {
      if (x["columnName"] === val) {
        x["status"] = false;
      }
    });
    this.countOfSelectedColumnSb += 1;
    let temp = -this.countOfSelectedColumnSb;
    if (this.selectedColumns.length == temp) {
      this.disableOrderByPlus = true;
    } else this.disableOrderByPlus = false;
  }

  sortBySelectedVal: any[] = [];
  pushToSelection(val, idx) {
    for (let i = 0; i < this.selectedColumns.length; i++) {
      if (this.selectedColumns[i]["status"] == true) {
        this.orderByLists.forEach(y => {
          if (y["orderByList"] != this.selectedColumns[i]["columnName"]) {
            this.selectedColumns[i]["status"] = false;
          }
        });
      }
    }

    this.selectedColumns.forEach(x => {
      this.orderByLists.forEach(y => {
        if (y["orderByList"] == x["columnName"]) {
          x["status"] = true;
        }
      });
    });
  }

  trackByFun(index, item) {
    return index;
  }

  addColumnList() {
    let filters = {
      filter: "",
      selectedFilterValues: ""
    };
    this.filterConditionss.push(filters);
  }
  removeColumnList(i) {
    this.filterValuesList.splice(i, 1);
    this.filterConditionss.splice(i, 1);
    for (let k = 0; k < this.filterConditionss.length; k++) {
      let tt: any = this.filterConditionss[k];
      let colDataType = null;
      if (tt.filter && tt.filter.columnDataType) {
        colDataType = tt.filter.columnDataType;
      } else {
        colDataType = tt.columnDataType;
      }
      if (colDataType === "date" || colDataType === "datetime") {
        this.showDateFields[k] = true;
      } else {
        this.showDateFields[k] = false;
      }
    }
    if (this.filterConditionss.length == 0) {
      this.addColumnList();
    }
    //this.filterValuesList[i] =[];
  }
  disableGroupByPlus: Boolean = false;
  addGroupByList() {
    let groupByCol: any = {
      columnName: "",
      operation: ""
    };
    this.groupByLists.push(groupByCol);
    this.countOfSelectedColumnFn = this.countOfSelectedColumnFn - 1;
    let temp = -this.countOfSelectedColumnFn;
    if (this.selectedColumns.length == temp) {
      this.disableGroupByPlus = true;
    } else this.disableGroupByPlus = false;
  }

  removeGroupByList(i, val) {
    console.log(i, val);
    this.groupByLists.splice(i, 1);
    if (this.groupByLists.length == 0) {
      this.addGroupByList();
    }

    this.selectedColumns.forEach(x => {
      if (x["columnName"] === val) {
        x["state"] = false;
      }
    });

    this.countOfSelectedColumnFn += 1;
    let temp = -this.countOfSelectedColumnFn;
    if (this.selectedColumns.length == temp) {
      this.disableGroupByPlus = true;
    } else this.disableGroupByPlus = false;
  }
  backToPreviousPage() {

    if (localStorage.getItem("backNavigation")=='savedReport') {
      this.router.navigate(["/reports/savedReports"], {
        relativeTo: this.route
      });
    } else if (localStorage.getItem("backNavigation")=='allPMOReport') {
      this.router.navigate(["/reports/allReports"], { relativeTo: this.route });
    } else {
      this.router.navigate(["/reports/runReports"], { relativeTo: this.route });
    }
  }
  closeErrorMessage(id) {
    $("#" + id).hide();
  }
  validateFields() {
    let err = false;
    this.reportsDTO.selectedColumns = this.selectedColumns;
    $("#errorMessage").hide();
    if (
      this.reportsDTO.selectedColumns == null ||
      this.reportsDTO.selectedColumns.length == 0
    ) {
      this.errorMessage = "Please select at least a Field to run the Report";
      window.scrollTo(0, 0);
      $("#errorMessage").show();
      err = true;
      setTimeout(() => {
        $("#errorMessage").hide();
      }, 3000);
      return;
    }
    for (let i = 0; i < this.groupByLists.length; i++) {
      let vv: any = this.groupByLists[i];
      if (
        vv.columnName != null &&
        vv.columnName != "" &&
        (vv.operation == null || vv.operation == "")
      ) {
        this.errorMessage = "Please select the required function";
        window.scrollTo(0, 0);
        $("#errorMessage").show();
        err = true;
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 3000);
        return;
      }
    }
    for (let i = 0; i < this.filterConditionss.length; i++) {
      let vv: any = this.filterConditionss[i];
      let fromDate = null;
      if (vv.filter.fromDate) fromDate = vv.filter.fromDate;
      else fromDate = $("#fromDate_" + i).val();
      let toDate = null;
      if (vv.filter.toDate) toDate = vv.filter.toDate;
      else toDate = $("#toDate_" + i).val();
      let selectedValues = [];
      if (vv.selectedFilterValues) selectedValues = vv.selectedFilterValues;
      let columnName = vv.filter ? vv.filter.columnName : vv.columnName;
      //validation
      if (
        columnName != null &&
        (selectedValues == null || selectedValues.length == 0) &&
        (fromDate == "" || toDate == "" || fromDate == null || toDate == null)
      ) {
        this.errorMessage = "Please fill the Filter Criteria";
        window.scrollTo(0, 0);
        $("#errorMessage").show();
        err = true;
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 3000);
        return;
      }
    }
    if (!err) $("#modelReject").modal({ show: true, backdrop: "static" });
  }
  runReport(action, fileType) {
    this.filterConditions = [];
    this.reportsDTO.action = action;
    localStorage.setItem("action", action);
    this.reportsDTO.groupByColumns = [];
    this.reportsDTO.filterConditions = [];
    this.reportsDTO.orderByColumns = [];
    this.reportsDTO.rptMetaDataId = this.rptMetaDataId;
    this.reportsDTO.selectedColumns = this.selectedColumns;
    this.reportsDTO.reportName = this.reportName;
    this.reportsDTO.dynamicReportName = this.reportsResponse.dynamicReportName;
    if (
      this.reportsDTO.dynamicReportName == null ||
      this.reportsDTO.dynamicReportName == ""
    )
      this.reportsDTO.dynamicReportName = this.reportName;
    this.reportsDTO.displayFilterSummary = this.reportsResponse.displayFilterSummary;
    if (this.reportsDTO.displayFilterSummary == true)
      this.reportsDTO.displayFilterSummary = 1;
    else this.reportsDTO.displayFilterSummary = 0;

    $("#errorMessage").hide();
    if (
      this.reportsDTO.selectedColumns == null ||
      this.reportsDTO.selectedColumns.length == 0
    ) {
      this.errorMessage = "Please select at least a Field to run the Report";
      window.scrollTo(0, 0);
      $("#errorMessage").show();
      setTimeout(() => {
        $("#errorMessage").hide();
      }, 3000);
      return;
    }
    if (action == "save") this.reportsDTO.reportName = this.customReportName;
    this.reportsDTO.comments = this.comments;
    for (let i = 0; i < this.groupByLists.length; i++) {
      let vv: any = this.groupByLists[i];
      if (
        vv.columnName != null &&
        vv.columnName != "" &&
        (vv.operation == null || vv.operation == "")
      ) {
        this.errorMessage = "Please select the required function";
        window.scrollTo(0, 0);
        $("#errorMessage").show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 3000);
        return;
      }
      let groupByColumn = {
        savedRptFuncId: vv.savedRptFuncId,
        columnName: vv.columnName,
        functionName: vv.operation,
        columnDisplayName: vv.columnDisplayName,
        columnDataType: vv.operation
      };
      this.reportsDTO.groupByColumns.push(groupByColumn);
    }
    for (let i = 0; i < this.filterConditionss.length; i++) {
      let vv: any = this.filterConditionss[i];
      let fromDate = null;
      if (vv.filter.fromDate) fromDate = vv.filter.fromDate;
      else fromDate = $("#fromDate_" + i).val();
      let toDate = null;
      if (vv.filter.toDate) toDate = vv.filter.toDate;
      else toDate = $("#toDate_" + i).val();
      let selectedValues = [];
      if (vv.selectedFilterValues) selectedValues = vv.selectedFilterValues;
      let columnName = vv.filter ? vv.filter.columnName : vv.columnName;
      let columnDisplayName = vv.filter ? vv.filter.columnDisplayName : vv.columnDisplayName;
      //validation
      if (
        columnName != null &&
        (selectedValues == null || selectedValues.length == 0) &&
        (fromDate == "" || toDate == "" || fromDate == null || toDate == null)
      ) {
        this.errorMessage = "Please fill the Filter Criteria";
        window.scrollTo(0, 0);
        $("#errorMessage").show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 3000);
        return;
      }
      let filterObject = {
        savedRptFilId: vv.filter ? vv.filter.savedRptFilId : vv.savedRptFilId,
        columnName: columnName,
        columnDisplayName: columnDisplayName,
        columnDataType: vv.filter
          ? vv.filter.columnDataType
          : vv.columnDataType,
        fromDate: fromDate,
        toDate: toDate,
        selectedValues: selectedValues
      };
      this.reportsDTO.filterConditions.push(filterObject);
    }
    for (let i = 0; i < this.orderByLists.length; i++) {
      let vv: any = this.orderByLists[i];
      let orderByColumn = {
        savedRptFuncId: vv.orderByList
          ? vv.orderByList.savedRptFuncId
          : vv.savedRptFuncId,
        columnName: vv.orderByList ? vv.orderByList : vv.columnName
      };
      this.reportsDTO.orderByColumns.push(orderByColumn);
    }

    this.reportsDTO.rptViewName = this.reportsResponse.reportType;
    this.reportsDTO.savedRptId = this.reportsResponse.savedRptId;
    localStorage.setItem("reportss", JSON.stringify(this.reportsDTO));
    this.reportsDTO.allOrEmployee = localStorage.getItem("allOrEmployee");
    if(this.customReportName==null || this.customReportName==''){
      this.customReportName = this.reportsDTO.dynamicReportName;
    }
    if(!this.reportsDTO.savedRptId)
      this.reportsDTO.savedRptId = this.savedRptId;
    // this.reportsDTO.filterConditions = this.filterConditionss;
    $("#loadingEditSubmitModal").modal({ show: true, backdrop: "static" });
    this.reportService.runReport(this.reportsDTO,fileType).subscribe(
      response => {
         let data : any =response;
         if(data.availableAndFilterColumnsDTO==null){
           if(this.filterColumns.length==this.availableAndFilterColumns.rptMetaDataColsDTOList.length){
            this.availableAndFilterColumns.rptMetaDataColsDTOList = [];
           }
           data.availableAndFilterColumnsDTO = this.availableAndFilterColumns;
         }
         if(data.customReportName==null)
          data.reportName = this.customReportName;
        if (data.displayFilterSummary == true)
         data.displayFilterSummary = 1;
        else data.displayFilterSummary = 0;
        var myJson = JSON.stringify(data);
        localStorage.setItem("viewResponse", myJson);
        //  this.viewReportsResponse = JSON.parse(localStorage.getItem("viewResponse"));
        //    this.headerColumns = this.viewReportsResponse.columnHeaders;

        $("#loadingEditSubmitModal").modal("hide");
        // this.router.navigate(["/reports/viewReport"], {
        //   relativeTo: this.route
        // });
        this.reportFileDownload = AppConstants.reportsDownloadURL + data.reportFileName + '.' + fileType;
        window.open(this.reportFileDownload, '_blank');
        // const link = document.createElement('a');
        // link.setAttribute('target', '_blank');
        // link.setAttribute('href', this.reportFileDownload);
        // link.setAttribute('download', data.reportFileName + '.' + fileType);
        // link.setAttribute('type', 'hidden');
        // link.href = this.reportFileDownload;
        // link.download = data.reportFileName + '.' + fileType;
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        // (keypress)="numberOnly($event)"
        // (change)="onCheckboxChange($event.target.value, $event.target.checked)"
      },
      Error => {
        this.errorMessage = Error;
        $("#loadingEditSubmitModal").modal("hide");
        $("#errorMessage").show();
        setTimeout(() => {
          $("#errorMessage").hide();
        }, 3000);
        //	this.setMessage(Error, AppConstants.errorMessageType);
        //	this.blockUI.stop();
        window.scrollTo(0, 0);
      }
    );
  }

  onTitleNameChange() {
    console.log(this.reportsResponse.dynamicReportName);
    var title = this.reportsResponse.dynamicReportName;
    var strReplace = title.replace(/[^a-zA-Z0-9-_ ]/g, "");
    this.reportsResponse.dynamicReportName = strReplace;
  }

  onReportNameChange() {
    console.log(this.customReportName);
    var title = this.customReportName;
    var strReplace = title.replace(/[^a-zA-Z0-9-_ ]/g, "");
    this.customReportName = strReplace;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    if((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 95 || k == 45 ||(k >= 48 && k <= 57)){
      return true
    }else{
      this.toastrService.error('Please Enter valid characters("a-z","A-Z","0-9","-","_")');
      return false;
    }
  }

  yearMonthRangeModified(filters: any, rowIndex: number) {
    if (filters.fromYearMonth) {
      filters.minToMonth = filters.fromYearMonth;
    }
    if (filters.toYearMonth) {
      filters.maxFromMonth = filters.toYearMonth;
    }
    if (filters.fromYearMonth && filters.toYearMonth) {

      if (filters.fromYearMonth.after(filters.toYearMonth)) {
        this.toastrService.error('From Month cannot be greater than To Month!');
        return;
      }

      filters.selectedFilterValues = this.commonUtilities
        .getYearMonthsInDateRange(filters.fromYearMonth, filters.toYearMonth);
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onItemDeSelect(items: any){
    console.log(items);
  }
}
