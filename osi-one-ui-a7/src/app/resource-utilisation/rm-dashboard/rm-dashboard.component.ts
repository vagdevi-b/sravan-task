import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";

import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { Chart } from 'chart.js';
import { GridOptions } from "ag-grid-community";
import * as moment from 'moment'
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';
declare var $: any;

@Component({
  selector: 'app-rm-dashboard',
  templateUrl: './rm-dashboard.component.html',
  styleUrls: ['./rm-dashboard.component.css']
})
export class RmDashboardComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  public searchString: string;
  public secondSearchString: string;
  isFirstTimeLoaded: boolean;
  title;
  selectedName;
  selectedEmpName;
  p: Number = 1;
  count: Number = 10;
  page: Number = 1;
  cnt: Number = 10;
  chartPieProjectType = Chart;
  projectTypes = [];
  projectTypeLabels = [];
  chartBarProjectTypePracticeswise = Chart;
  billableHoursPracticeswiseData = [];
  nonBillableHoursPracticeswiseData = [];
  internalHoursPracticeswiseData = [];
  ptoHoursPracticeswiseData = [];
  holidayHoursPracticeswiseData = [];
  specialLeaveHoursPracticeswiseData = [];
  projectPractices = [];
  chartBarProjectTypeSubPracticeswise = Chart;
  billableHoursSubPracticeswiseData = [];
  nonBillableHoursSubPracticeswiseData = [];
  internalHoursSubPracticeswiseData = [];
  ptoHoursSubPracticeswiseData = [];
  holidayHoursSubPracticeswiseData = [];
  specialLeaveHoursSubPracticeswiseData = [];
  projectSubPractices = [];
  chartLineEmpProjectType = Chart;
  billableMonthlyHoursData = [];
  nonBillableMonthlyHoursData = [];
  internalMonthlyHoursData = [];
  ptoMonthlyHoursData = [];
  holidayMonthlyHoursData = [];
  specialLeavesMonthlyHoursData = [];
  employeeLineLabels = [];
  empOrgData = [];
  empProjectData = [];
  empBUData = [];
  empPracticeData = [];
  empSubPracticeData = [];
  empYearData = [];
  empMonthData = [];
  empNameData = [];
  empOrg = "*";
  empProject = "*";
  empBU = "*";
  empPractice = "*";
  empSubPractice = "*";
  empBUTable = "*";
  empPracticeTable = "*";
  empSubPracticeTable = "*";
  prjTableBU = "*";
  prjTablePractice = "*";
  prjTableSubPractice = "*";
  empMonth = ".*";
  empYear = moment().year();
  json = {
    data: []
  };
  prjResUtilJSON = {
    data: []
  };
  totalEmployeeHours = 0;
  monthsInWord = {
    data: []
  };

  paginationPageSize: Number = 5;

  gridApiProjects;
  gridColumnApiProjects;
  gridOptionsProjects = <GridOptions>{};
  columnDefsProjects = [];
  defaultColDef = { resizable: true };

  gridApiEmployee;
  gridColumnApiEmployee;
  gridOptionsEmployee = <GridOptions>{};
  columnDefsEmployee = [];
  showLoader: boolean = false;

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private router: Router,
    private gridService: GridService,
    private downloadFile: ExportFileService
  ) {
    this.setPreservedFilter();
  }

  ngOnInit() {
    this.defaultView();
    this.columnDefsEmployee = this.createColumnDefsEmployee();
    this.columnDefsProjects = this.createColumnDefsProjects();
  } // ----------------->> onInit END

  setPreservedFilter() {
    let widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      let filter = res ? JSON.parse(res.filters) : null;
      this.empOrg = filter && Object.keys(filter).length > 0 ? filter.org : this.empOrg;
      this.empProject = filter && Object.keys(filter).length > 0 ? filter.project : this.empProject;
      this.empBU = filter && Object.keys(filter).length > 0 ? filter.bu : this.empBU;
      this.empPractice = filter && Object.keys(filter).length > 0 ? filter.practice : this.empPractice;
      this.empSubPractice = filter && Object.keys(filter).length > 0 ? filter.subPractice : this.empSubPractice;
      this.empBUTable = filter && Object.keys(filter).length > 0 ? filter.empBUTable : this.empBUTable;
      this.empPracticeTable = filter && Object.keys(filter).length > 0 ? filter.empPracticeTable : this.empPracticeTable;
      this.empSubPracticeTable = filter && Object.keys(filter).length > 0 ? filter.empSubPracticeTable : this.empSubPracticeTable;
      this.prjTableBU = filter && Object.keys(filter).length > 0 ? filter.prjTableBU : this.prjTableBU;
      this.prjTablePractice = filter && Object.keys(filter).length > 0 ? filter.prjTablePractice : this.prjTablePractice;
      this.prjTableSubPractice = filter && Object.keys(filter).length > 0 ? filter.prjTableSubPractice : this.prjTableSubPractice;
      this.empMonth = filter && Object.keys(filter).length > 0 ? filter.empMonth : this.empMonth;
      this.empYear = filter && Object.keys(filter).length > 0 ? filter.empYear : this.empYear;
      if (this.isFirstTimeLoaded) {
        this.isPageLoaded.emit(true);
      }
    });
  }

  defaultView() {
    this.showLoader = true;
    // ----------------------------------------- DROPDOWNS -----------------------------------------------------

    this.resource.getResourcesList().subscribe(response => {


      this.empNameData = response.employee;
      this.empOrgData = response.org;
      this.empBUData = response.bu;
      this.empPracticeData = response.practice;
      this.empProjectData = response.project;
      this.empSubPracticeData = response.subpractice;

      this.empOrgData = this.empOrgData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empBUData = this.empBUData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empPracticeData = this.empPracticeData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empProjectData = this.empProjectData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empSubPracticeData = this.empSubPracticeData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });

      this.es.getFromService(0).subscribe(response => {

        this.empYearData = response.aggregations.by_year.buckets;
        this.empYearData = this.empYearData.sort((a, b) => a.key - b.key);

        this.empMonthData = response.aggregations.by_month.buckets;
        this.empMonthData = this.empMonthData.sort((a, b) => a.key - b.key);
        this.inWords(this.empMonthData);


      }, error => {
        console.log('error');
      });

      // -----------------------------------------  PROJECT TYPE PIE CHART(DAFAULT VIEW)  ------------------------------------

      this.es.filterProjectPie(this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData,
        this.empBUData, this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData);
      this.es.getFromService(1).subscribe(response => {

        this.projectTypes = [];
        this.projectTypeLabels = [];
        let totalHours = response.aggregations.filtered.by_total_hours.value;
        let billableHours = response.aggregations.filtered.by_billable.value;
        this.projectTypes.push(((billableHours / totalHours) * 100).toFixed(2));
        this.projectTypeLabels.push("Billable");

        let nonBillableHours = response.aggregations.filtered.by_nonBillable.value;
        this.projectTypes.push(((nonBillableHours / totalHours) * 100).toFixed(2));
        this.projectTypeLabels.push("Non Billable");

        let internalHours = response.aggregations.filtered.by_internal.value;
        this.projectTypes.push(((internalHours / totalHours) * 100).toFixed(2));
        this.projectTypeLabels.push("Internal");

        let ptoHours = response.aggregations.filtered.by_PTO.value;
        this.projectTypes.push(((ptoHours / totalHours) * 100).toFixed(2));
        this.projectTypeLabels.push("PTO");

        let holidayHours = response.aggregations.filtered.by_holiday.value;
        this.projectTypes.push(((holidayHours / totalHours) * 100).toFixed(2));
        this.projectTypeLabels.push("Holiday");

        let specialLeaveHours = response.aggregations.filtered.by_specialLeaves.value;
        this.projectTypes.push(((specialLeaveHours / totalHours) * 100).toFixed(2));
        this.projectTypeLabels.push("Special Leave");

      }, error => {
        console.log('error');
      });

      // ------------------------------------- PROJECT TYPE PRACTICEWISE BAR CHART(DEFAULT VIEW) ----------------------------------

      this.es.getPracticeswiseProjectType(this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData,
        this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData);
      this.es.getFromService(7).subscribe(response => {

        let billableHoursPracticeswise = response.aggregations.filtered.by_billable.buckets;
        this.projectTypePracticeswiseLabel(billableHoursPracticeswise, this.billableHoursPracticeswiseData, this.empYear, this.empOrgData,
          this.empProjectData, this.empPracticeData, this.empBUData,
          this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData);

        let nonBillableHoursPracticeswise = response.aggregations.filtered.by_nonBillable.buckets;
        this.projectTypePracticeswiseLabel(nonBillableHoursPracticeswise, this.nonBillableHoursPracticeswiseData, this.empYear,
          this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
          this.empYear + this.empMonth, this.empNameData);

        let internalHoursPracticeswise = response.aggregations.filtered.by_internal.buckets;
        this.projectTypePracticeswiseLabel(internalHoursPracticeswise, this.internalHoursPracticeswiseData, this.empYear, this.empOrgData,
          this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
          this.empYear + this.empMonth, this.empNameData);

        let ptoHoursPracticeswise = response.aggregations.filtered.by_PTO.buckets;
        this.projectTypePracticeswiseLabel(ptoHoursPracticeswise, this.ptoHoursPracticeswiseData, this.empYear, this.empOrgData,
          this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
          this.empYear + this.empMonth, this.empNameData);

        let holidayHoursPracticeswise = response.aggregations.filtered.by_holiday.buckets;
        this.projectTypePracticeswiseLabel(holidayHoursPracticeswise, this.holidayHoursPracticeswiseData, this.empYear, this.empOrgData,
          this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
          this.empYear + this.empMonth, this.empNameData);

        let specialLeaveHoursPracticeswise = response.aggregations.filtered.by_specialLeaves.buckets;
        this.projectTypePracticeswiseLabel(specialLeaveHoursPracticeswise, this.specialLeaveHoursPracticeswiseData, this.empYear,
          this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
          this.empYear + this.empMonth, this.empNameData);

        // ------------------------------------- PROJECT TYPE SUB-PRACTICESWISE BAR CHART ----------------------------------------

        this.es.getSubPracticeswiseProjectType(this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData,
          this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData);
        this.es.getFromService(2).subscribe(response => {

          let billableHoursSubPracticeswise = response.aggregations.filtered.by_billable.buckets;
          this.projectTypeSubPracticeswiseLabel(billableHoursSubPracticeswise, this.billableHoursSubPracticeswiseData, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empNameData);

          let nonBillableHoursSubPracticeswise = response.aggregations.filtered.by_nonBillable.buckets;
          this.projectTypeSubPracticeswiseLabel(nonBillableHoursSubPracticeswise, this.nonBillableHoursSubPracticeswiseData, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empNameData);

          let internalHoursSubPracticeswise = response.aggregations.filtered.by_internal.buckets;
          this.projectTypeSubPracticeswiseLabel(internalHoursSubPracticeswise, this.internalHoursSubPracticeswiseData, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empNameData);

          let ptoHoursSubPracticeswise = response.aggregations.filtered.by_PTO.buckets;
          this.projectTypeSubPracticeswiseLabel(ptoHoursSubPracticeswise, this.ptoHoursSubPracticeswiseData, this.empYear, this.empOrgData,
            this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empNameData);

          let holidayHoursSubPracticeswise = response.aggregations.filtered.by_holiday.buckets;
          this.projectTypeSubPracticeswiseLabel(holidayHoursSubPracticeswise, this.holidayHoursSubPracticeswiseData, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empNameData);

          let specialLeaveHoursSubPracticeswise = response.aggregations.filtered.by_specialLeaves.buckets;
          this.projectTypeSubPracticeswiseLabel(specialLeaveHoursSubPracticeswise, this.specialLeaveHoursSubPracticeswiseData, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empNameData);

          // -------------------------------------- TABLE(DEFAULT) ---------------------------------------------------------------

          this.es.getEmployeeTableData(this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData,
            this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData);
          this.es.getFromService(4).subscribe(response => {

            this.json = {
              data: []
            };
            console.log(response);
            response.aggregations.filtered.by_employee.buckets.forEach(y => {  // For each Employee
              if (y.by_department.buckets.length != 0) {
                y.by_department.buckets.forEach(x => {  // For each Department
                  let temp = x.key.split('.');
                  let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
                  this.json.data.push({
                    "employee": y.key,
                    // "bu": x.by_employeeBU.buckets[0].key,
                    // "practice": x.by_practices.buckets[0].key,
                    // "subPractice": x.by_sub_practices.buckets[0].key,
                    "department": dept,
                    "dept_original": x.key,
                    "billable": x.by_billable.value != 0 ? ((x.by_billable.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                    "nonBillable": x.by_nonBillable.value != 0 ? ((x.by_nonBillable.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                    "internal": x.by_intenal.value != 0 ? ((x.by_intenal.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                    "pto": x.by_pto.value != 0 ? ((x.by_pto.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                    "holiday": x.by_holiday.value != 0 ? ((x.by_holiday.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                    "specialLeave": x.by_specialLeaves.value != 0 ?
                      ((x.by_specialLeaves.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                    "totalHours": x.by_employeehours.value.toFixed(),
                    "billableHrs": x.by_billable.value != 0 ? x.by_billable.value : '0',
                    "nonBillableHrs": x.by_nonBillable.value != 0 ? x.by_nonBillable.value : '0',
                    "internalHrs": x.by_intenal.value != 0 ? x.by_intenal.value : '0',
                    "ptoHrs": x.by_pto.value != 0 ? x.by_pto.value : '0',
                    "holidayHrs": x.by_holiday.value != 0 ? x.by_holiday.value : '0',
                    "specialLeaveHrs": x.by_specialLeaves.value != 0 ? x.by_specialLeaves.value : '0',
                  })
                })
              }
            });
            this.json.data = this.json.data.sort(function sortAll(a, b) {
              return a.employee > b.employee ? 1
                : a.employee < b.employee ? -1
                  : 0;
            });
            // -------------------------------  EMPLOYEE MONTHLY TREND(DEFAULT)  --------------------------------------
            this.selectedName = this.json.data[0] ? this.json.data[0] : {};
            this.es.getByEmployee(this.json.data[0]['employee'], this.json.data[0]['dept_original'], this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData,
              this.empBUData, this.empSubPracticeData, this.empNameData);
            this.es.getFromService(5).subscribe(response => {

              console.log("MONTHLY", response);
              if (this.isFirstTimeLoaded) {
                this.isPageLoaded.emit(true);
              }

              this.title = this.json.data[0].employee;
              let totalHours = response.aggregations.filtered.by_total_hours.buckets;

              this.billableMonthlyHoursData = [];
              let billableMonthlyHours = response.aggregations.filtered.by_billableMonthly.buckets;
              this.employeeMonth(billableMonthlyHours, this.billableMonthlyHoursData, totalHours, 0, this.empYear, this.empOrgData,
                this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

              this.nonBillableMonthlyHoursData = [];
              let nonBillableMonthlyHours = response.aggregations.filtered.by_nonbillableMonthly.buckets;
              this.employeeMonth(nonBillableMonthlyHours, this.nonBillableMonthlyHoursData, totalHours, 1, this.empYear, this.empOrgData,
                this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

              this.internalMonthlyHoursData = [];
              let internalMonthlyHours = response.aggregations.filtered.by_internalMonthly.buckets;
              this.employeeMonth(internalMonthlyHours, this.internalMonthlyHoursData, totalHours, 2, this.empYear, this.empOrgData,
                this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

              this.ptoMonthlyHoursData = [];
              let ptoMonthlyHours = response.aggregations.filtered.by_ptoMonthly.buckets;
              this.employeeMonth(ptoMonthlyHours, this.ptoMonthlyHoursData, totalHours, 3, this.empYear, this.empOrgData,
                this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

              this.holidayMonthlyHoursData = [];
              let holidayMonthlyHours = response.aggregations.filtered.by_holidayMonthly.buckets;
              this.employeeMonth(holidayMonthlyHours, this.holidayMonthlyHoursData, totalHours, 4, this.empYear, this.empOrgData,
                this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

              this.specialLeavesMonthlyHoursData = [];
              let specialLeavesMonthlyHours = response.aggregations.filtered.by_specialLeavesMonthly.buckets;
              this.employeeMonth(specialLeavesMonthlyHours, this.specialLeavesMonthlyHoursData, totalHours, 5, this.empYear,
                this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

              // ------------------------------------- 2nd(PROJECT DETAILS) TABLE DATA -------------------------------------------------

              this.es.getProjectForEmployeeData(this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData,
                this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData, this.json.data[0].employee, this.json.data[0].dept_original);
              this.es.getFromService(18).subscribe(response => {
                this.prjResUtilJSON = {
                  data: []
                };
                this.totalEmployeeHours = 0;
                response.aggregations.filtered.by_project.buckets.forEach(x => {
                  if (x.by_practices.buckets.length != 0 && x.by_employeeBU.length != 0) {
                    let temp = x.by_department.buckets[0].key.split('.');
                    let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
                    let internalHrs = x.by_internal.value + x.by_pto.value + x.by_holiday.value + x.by_specialLeave.value;
                    this.totalEmployeeHours = this.totalEmployeeHours + x.by_employeehours.value;

                    this.prjResUtilJSON.data.push({
                      "employee": x.key,
                      "bu": x.by_employeeBU.buckets[0].key,
                      "practice": x.by_practices.buckets[0].key,
                      "subPractice": x.by_sub_practices.buckets[0].key,
                      "department": dept,
                      "billable": x.by_billable.value,
                      "nonBillable": x.by_nonBillable.value,
                      "internal": internalHrs,
                      // "pto": x.by_pto.value != 0 ? ((x.by_pto.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                      // "holiday": x.by_holiday.value != 0 ? ((x.by_holiday.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                      // "specialLeave": x.by_specialLeave.value != 0 ?
                      //  ((x.by_specialLeave.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                      "totalHours": x.by_employeehours.value.toFixed(),
                      "billableHrs": x.by_billable.value != 0 ? x.by_billable.value : '0',
                      "nonBillableHrs": x.by_nonBillable.value != 0 ? x.by_nonBillable.value : '0',
                      "internalHrs": internalHrs != 0 ? internalHrs : '0',
                      // "ptoHrs": x.by_pto.value != 0 ? x.by_pto.value : '0',
                      // "holidayHrs": x.by_holiday.value != 0 ? x.by_holiday.value : '0',
                      // "specialLeaveHrs": x.by_specialLeave.value != 0 ? x.by_specialLeave.value : '0',
                    })
                  }
                });
                this.prjResUtilJSON.data = this.prjResUtilJSON.data.sort(function sortAll(a, b) {
                  return a.employee > b.employee ? 1
                    : a.employee < b.employee ? -1
                      : 0;
                });

                this.prjResUtilJSON.data.forEach(project => {
                  project.billable = this.totalEmployeeHours != 0 ? ((project.billable / this.totalEmployeeHours) * 100).toFixed(2) : 0;
                  project.nonBillable = this.totalEmployeeHours != 0 ? ((project.nonBillable / this.totalEmployeeHours) * 100).toFixed(2) : 0;
                  project.internal = this.totalEmployeeHours != 0 ? ((project.internal / this.totalEmployeeHours) * 100).toFixed(2) : 0;
                });

                this.selectedEmpName = this.prjResUtilJSON.data[0].employee;
                this.setFilters();
                this.renderChart();
                this.showLoader = false;

              }, error => {
                this.showLoader = false;
              });

            }, error => {
              this.showLoader = false;
            });

          }, error => {
            this.showLoader = false;
          });

        }, error => {
          this.showLoader = false;
        });

      }, error => {
        this.showLoader = false;
      });

    }, error => {
      this.showLoader = false;
    });

  }

  employeeMonth(data, value, totalHours, dataset, year, org, project, practice, bu, subPractice) {
    this.es.projectMonthsLabel(year, org, project, practice, bu, subPractice);
    this.es.getFromService(6).subscribe(response => {
      let months = [];
      this.employeeLineLabels = [];
      response.aggregations.filtered.by_projectmonth.buckets.forEach(x => {
        months.push(x.key);
      });

      months = months.sort((a, b) => a - b);

      months.forEach(x => {
        switch (x) {
          case 1: this.employeeLineLabels.push("Jan");
            break;
          case 2: this.employeeLineLabels.push("Feb");
            break;
          case 3: this.employeeLineLabels.push("Mar");
            break;
          case 4: this.employeeLineLabels.push("Apr");
            break;
          case 5: this.employeeLineLabels.push("May");
            break;
          case 6: this.employeeLineLabels.push("Jun");
            break;
          case 7: this.employeeLineLabels.push("Jul");
            break;
          case 8: this.employeeLineLabels.push("Aug");
            break;
          case 9: this.employeeLineLabels.push("Sep");
            break;
          case 10: this.employeeLineLabels.push("Oct");
            break;
          case 11: this.employeeLineLabels.push("Nov");
            break;
          case 12: this.employeeLineLabels.push("Dec");
        }
      });

      let monthlyTotalHours = 0;
      totalHours.forEach(x => {
        monthlyTotalHours = monthlyTotalHours + x.by_monthlyTotal.value;
      });

      months.forEach(key => {
        let x = data.find(object => object.key == key);
        // let monthlyTotalHours = totalHours.find(object => object.key == key);
        // value.push(x ? ((x.by_employeehours.value / monthlyTotalHours ) * 100) : '');
        value.push(x ? x.by_employeehours.value : '');

      });

      if (this.chartLineEmpProjectType.data) {
        this.chartLineEmpProjectType.data.labels = this.employeeLineLabels;
        this.chartLineEmpProjectType.data.datasets[dataset].data = value;
        this.chartLineEmpProjectType.chart.update();
      }

    }, error => {
      console.log('error');
    });

  }

  projectTypePracticeswiseLabel(data, value, year, practice, bu, subPractice, month, org, project, emp) {
    this.es.filterPracticewiseProjectTypeLabel(year, practice, bu, subPractice, month, org, project, emp);

    this.es.getFromService(8).subscribe(response => {
      this.projectPractices = [];
      var obj = {
        data: []
      };
      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        obj.data.push({
          "key": x.key,
          "value": x.by_employeehours.value
        });
      });

      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        this.projectPractices.push(x.key);
      });
      this.projectPractices = this.projectPractices.sort((a, b) => a - b);

      obj.data.forEach(x => {
        let b = data.find(xx => xx.key == x.key);
        value.push(b && (x.value != 0) ? (b.by_employeehours.value / x.value * 100) : '');
      });

    }, error => {
      console.log('error');
    });
  }

  projectTypeSubPracticeswiseLabel(data, value, year, practice, bu, subPractice, month, org, project, emp) {
    this.es.filterSubPracticewiseProjectTypeLabel(year, practice, bu, subPractice, month, org, project, emp);
    this.es.getFromService(3).subscribe(response => {
      this.projectSubPractices = [];
      var obj = {
        data: []
      };
      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        obj.data.push({
          "key": x.key,
          "value": x.by_employeehours.value
        });
      });

      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        this.projectSubPractices.push(x.key);
      });
      this.projectSubPractices = this.projectSubPractices.sort((a, b) => a - b);

      obj.data.forEach(x => {
        let b = data.find(xx => xx.key == x.key);
        value.push(b && (x.value != 0) ? (b.by_employeehours.value / x.value * 100) : '');
      });

    }, error => {
      console.log('error');
    });
  }

  // ------------------------------------- PROJECT TYPE PRACTICESWISE(APPLYING FILTERS) --------------------
  updateProjectTypePracticeswiseLabel(data, value, dataset, year, practice, bu, subPractice, month, org, project, emp) {

    this.es.filterPracticewiseProjectTypeLabel(year, practice, bu, subPractice, month, org, project, emp);

    this.es.getFromService(8).subscribe(response => {
      this.projectPractices = [];
      var obj = {
        data: []
      };

      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        obj.data.push({
          "key": x.key,
          "value": x.by_employeehours.value
        });
      });

      obj.data.forEach(x => {
        this.projectPractices.push(x.key)
        let b = data.find(xx => xx.key == x.key);
        value.push(b && (x.value != 0) ? (b.by_employeehours.value / x.value * 100) : '');
      });

      this.chartBarProjectTypePracticeswise.data.labels = this.projectPractices;
      this.chartBarProjectTypePracticeswise.data.datasets[dataset].data = value;
      this.chartBarProjectTypePracticeswise.chart.update();

    }, error => {
      console.log('error');
    });

  }
  // ------------------------------------- PROJECT TYPE SUB-PRACTICESWISE(APPLYING FILTERS) --------------------

  updateProjectTypeSubPracticeswiseLabel(data, value, dataset, year, practice, bu, subPractice, month, org, project, emp) {

    this.es.filterSubPracticewiseProjectTypeLabel(year, practice, bu, subPractice, month, org, project, emp);

    this.es.getFromService(3).subscribe(response => {
      this.projectSubPractices = [];
      var obj = {
        data: []
      };
      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        obj.data.push({
          "key": x.key,
          "value": x.by_employeehours.value
        });
      });

      obj.data.forEach(x => {
        let b = data.find(xx => xx.key == x.key);
        value.push(b && (x.value != 0) ? (b.by_employeehours.value / x.value * 100) : '');
      });


      response.aggregations.filtered.by_projectpractice.buckets.forEach(x => {
        this.projectSubPractices.push(x.key);
      });
      this.projectSubPractices = this.projectSubPractices.sort((a, b) => a - b);

      this.chartBarProjectTypeSubPracticeswise.data.labels = this.projectSubPractices;
      this.chartBarProjectTypeSubPracticeswise.data.datasets[dataset].data = value;
      this.chartBarProjectTypeSubPracticeswise.chart.update();

    }, error => {
      console.log('error');
    });

  }

  // --------------------------------------------- EMPLOYEE MONTHLY TREND(ON-CLICK) -------------------------------
  onEmployeeSelection(params) {
    let selectedProject = this.gridApiEmployee.getSelectedRows();
    this.tableData(selectedProject[0]);
  }

  tableData(data) {
    // this.selectedName = data.employee;
    this.selectedName = data ? data : {};
    this.title = data.employee;
    this.es.getByEmployee(data.employee, data.dept_original, this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData,
      this.empSubPracticeData, this.empNameData);
    this.es.getFromService(5).subscribe(response => {
      let totalHours = response.aggregations.filtered.by_total_hours.value;

      this.billableMonthlyHoursData = [];
      let billableMonthlyHours = response.aggregations.filtered.by_billableMonthly.buckets;
      this.updateEmployeeMonthlyTrends(billableMonthlyHours, this.billableMonthlyHoursData, totalHours, 0, this.empYear,
        this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

      this.nonBillableMonthlyHoursData = [];
      let nonBillableMonthlyHours = response.aggregations.filtered.by_nonbillableMonthly.buckets;
      this.updateEmployeeMonthlyTrends(nonBillableMonthlyHours, this.nonBillableMonthlyHoursData, totalHours, 1, this.empYear,
        this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

      this.internalMonthlyHoursData = [];
      let internalMonthlyHours = response.aggregations.filtered.by_internalMonthly.buckets;
      this.updateEmployeeMonthlyTrends(internalMonthlyHours, this.internalMonthlyHoursData, totalHours, 2, this.empYear,
        this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

      this.ptoMonthlyHoursData = [];
      let ptoMonthlyHours = response.aggregations.filtered.by_ptoMonthly.buckets;
      this.updateEmployeeMonthlyTrends(ptoMonthlyHours, this.ptoMonthlyHoursData, totalHours, 3, this.empYear,
        this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

      this.holidayMonthlyHoursData = [];
      let holidayMonthlyHours = response.aggregations.filtered.by_holidayMonthly.buckets;
      this.updateEmployeeMonthlyTrends(holidayMonthlyHours, this.holidayMonthlyHoursData, totalHours, 4, this.empYear,
        this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

      this.specialLeavesMonthlyHoursData = [];
      let specialLeavesMonthlyHours = response.aggregations.filtered.by_specialLeavesMonthly.buckets;
      this.updateEmployeeMonthlyTrends(specialLeavesMonthlyHours, this.specialLeavesMonthlyHoursData, totalHours, 5, this.empYear,
        this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);


    }, error => {
      console.log('error');
    });

    // ------------------------------------- 2nd(PROJECT DETAILS) TABLE DATA(ON-CLICK) -------------------------------------------------

    this.es.getProjectForEmployeeData(this.empYear, this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData,
      this.empSubPracticeData, this.empYear + this.empMonth, this.empNameData, data.employee, data.dept_original);
    this.es.getFromService(18).subscribe(response => {
      this.prjResUtilJSON = {
        data: []
      };
      this.totalEmployeeHours = 0;
      response.aggregations.filtered.by_project.buckets.forEach(x => {
        if (x.by_practices.buckets.length != 0 && x.by_employeeBU.length != 0) {
          let temp = x.by_department.buckets[0].key.split('.');
          let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
          let internalHrs = x.by_internal.value + x.by_pto.value + x.by_holiday.value + x.by_specialLeave.value;
          this.totalEmployeeHours = this.totalEmployeeHours + x.by_employeehours.value;
          this.prjResUtilJSON.data.push({
            "employee": x.key,
            "bu": x.by_employeeBU.buckets[0].key,
            "practice": x.by_practices.buckets[0].key,
            "subPractice": x.by_sub_practices.buckets[0].key,
            "department": dept,
            "billable": x.by_billable.value,
            "nonBillable": x.by_nonBillable.value,
            "internal": internalHrs,
            // "pto": x.by_pto.value != 0 ? ((x.by_pto.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
            // "holiday": x.by_holiday.value != 0 ? ((x.by_holiday.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
            // "specialLeave": x.by_specialLeave.value != 0 ? ((x.by_specialLeave.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
            "totalHours": x.by_employeehours.value.toFixed(),
            "billableHrs": x.by_billable.value != 0 ? x.by_billable.value : '0',
            "nonBillableHrs": x.by_nonBillable.value != 0 ? x.by_nonBillable.value : '0',
            "internalHrs": internalHrs != 0 ? internalHrs : '0',
            // "ptoHrs": x.by_pto.value != 0 ? x.by_pto.value : '0',
            // "holidayHrs": x.by_holiday.value != 0 ? x.by_holiday.value : '0',
            // "specialLeaveHrs": x.by_specialLeave.value != 0 ? x.by_specialLeave.value : '0',
          })
        }
      });
      this.prjResUtilJSON.data = this.prjResUtilJSON.data.sort(function sortAll(a, b) {
        return a.employee > b.employee ? 1
          : a.employee < b.employee ? -1
            : 0;
      });
      this.prjResUtilJSON.data.forEach(project => {
        project.billable = this.totalEmployeeHours != 0 ? ((project.billable / this.totalEmployeeHours) * 100).toFixed(2) : 0;
        project.nonBillable = this.totalEmployeeHours != 0 ? ((project.nonBillable / this.totalEmployeeHours) * 100).toFixed(2) : 0;
        project.internal = this.totalEmployeeHours != 0 ? ((project.internal / this.totalEmployeeHours) * 100).toFixed(2) : 0;
      });

      this.selectedEmpName = this.prjResUtilJSON.data[0].employee;


    }, error => {
      console.log('error');
    });

  }

  updateEmployeeMonthlyTrends(data, value, totalHours, dataset, year, org, project, practice, bu, subPractice) {
    this.es.projectMonthsLabel(year, org, project, practice, bu, subPractice);

    this.es.getFromService(6).subscribe(response => {
      let months = [];
      this.employeeLineLabels = [];
      response.aggregations.filtered.by_projectmonth.buckets.forEach(x => {
        months.push(x.key);
      });

      months = months.sort((a, b) => a - b);

      months.forEach(x => {
        switch (x) {
          case 1: this.employeeLineLabels.push("Jan");
            break;
          case 2: this.employeeLineLabels.push("Feb");
            break;
          case 3: this.employeeLineLabels.push("Mar");
            break;
          case 4: this.employeeLineLabels.push("Apr");
            break;
          case 5: this.employeeLineLabels.push("May");
            break;
          case 6: this.employeeLineLabels.push("Jun");
            break;
          case 7: this.employeeLineLabels.push("Jul");
            break;
          case 8: this.employeeLineLabels.push("Aug");
            break;
          case 9: this.employeeLineLabels.push("Sep");
            break;
          case 10: this.employeeLineLabels.push("Oct");
            break;
          case 11: this.employeeLineLabels.push("Nov");
            break;
          case 12: this.employeeLineLabels.push("Dec");
        }
      });

      months.forEach(key => {
        let x = data.find(object => object.key == key);
        // let monthlyTotalHours = totalHours.find(object => object.key == key);
        // value.push(x ? ((x.by_employeehours.value / monthlyTotalHours.by_monthlyTotal.value ) * 100) : '');
        value.push(x ? x.by_employeehours.value : '');
      });

      this.chartLineEmpProjectType.data.labels = this.employeeLineLabels;
      this.chartLineEmpProjectType.data.datasets[dataset].data = value;
      this.chartLineEmpProjectType.chart.update();

    }, error => {
      console.log('error');
    });
  }

  // ------------------------------------- RESOURCE UTILISATION(APPLYING GLOBAL FILTERS) --------------------------------------

  updateTable() {
    this.json.data = [];
    let bu = [];
    let practice = [];
    let subPractice = [];
    let prjBu = [];
    let prjPractice = [];
    let prjSubPractice = [];
    let globalBU = [];
    let globalPractice = [];
    let globalSubPractice = [];

    let year = this.empYear;
    let month = this.empYear + this.empMonth;
    let project = this.empProject == '*' ? this.empProjectData : [this.empProject];
    let org = this.empOrg == '*' ? this.empOrgData : [this.empOrg];

    bu = this.empBUTable == '*' ? (this.empBU == '*' ? this.empBUData : [this.empBU]) : [this.empBUTable];
    practice = this.empPracticeTable == '*' ?
      (this.empPractice == '*' ? this.empPracticeData : [this.empPractice]) : [this.empPracticeTable];
    subPractice = this.empSubPracticeTable == '*' ?
      (this.empSubPractice == '*' ? this.empSubPracticeData : [this.empSubPractice]) : [this.empSubPracticeTable];

    prjBu = this.prjTableBU == '*' ? bu : [this.prjTableBU];
    prjPractice = this.prjTablePractice == '*' ? practice : [this.prjTablePractice];
    prjSubPractice = this.prjTableSubPractice == '*' ? subPractice : [this.prjTableSubPractice];

    globalBU = this.empBU == '*' ? this.empBUData : [this.empBU];
    globalPractice = this.empPractice == '*' ? this.empPracticeData : [this.empPractice];
    globalSubPractice = this.empSubPractice == '*' ? this.empSubPracticeData : [this.empSubPractice];


    this.es.getEmployeeTableData(year, org, project, practice, bu, subPractice, month, this.empNameData);
    this.es.getFromService(4).subscribe(response => {

      this.json = {
        data: []
      };
      response.aggregations.filtered.by_employee.buckets.forEach(y => {
        if (y.by_department.buckets.length != 0) {
          y.by_department.buckets.forEach(x => {
            let temp = x.key.split('.');
            let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
            // let internalHrs = x.by_intenal.value + x.by_pto.value + x.by_holiday.value + x.by_specialLeaves.value;
            this.json.data.push({
              "employee": y.key,
              // "bu": x.by_employeeBU.buckets[0].key,
              // "practice": x.by_practices.buckets[0].key,
              // "subPractice": x.by_sub_practices.buckets[0].key,
              "department": dept,
              "dept_original": x.key,
              "billable": x.by_billable.value != 0 ? ((x.by_billable.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
              "nonBillable": x.by_nonBillable.value != 0 ? ((x.by_nonBillable.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
              "internal": x.by_intenal.value != 0 ? ((x.by_intenal.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
              "pto": x.by_pto.value != 0 ? ((x.by_pto.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
              "holiday": x.by_holiday.value != 0 ? ((x.by_holiday.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
              "specialLeave": x.by_specialLeaves.value != 0 ? ((x.by_specialLeaves.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
              "totalHours": x.by_employeehours.value.toFixed(),
              "billableHrs": x.by_billable.value != 0 ? x.by_billable.value : '0',
              "nonBillableHrs": x.by_nonBillable.value != 0 ? x.by_nonBillable.value : '0',
              "internalHrs": x.by_intenal.value != 0 ? x.by_intenal.value : '0',
              "ptoHrs": x.by_pto.value != 0 ? x.by_pto.value : '0',
              "holidayHrs": x.by_holiday.value != 0 ? x.by_holiday.value : '0',
              "specialLeaveHrs": x.by_specialLeaves.value != 0 ? x.by_specialLeaves.value : '0',
            })
          })
        }
      });
      this.json.data = this.json.data.sort(function sortAll(a, b) {
        return a.employee > b.employee ? 1
          : a.employee < b.employee ? -1
            : 0;
      });

      console.log("UPDATED_TABLE_DATA", this.json.data);

      if (this.json.data.length == 0) {
        this.title = 'Employee';
        this.chartLineEmpProjectType.data.labels = [];
        this.chartLineEmpProjectType.data.datasets[0].data = [];
        this.chartLineEmpProjectType.data.datasets[1].data = [];
        this.chartLineEmpProjectType.data.datasets[2].data = [];
        this.chartLineEmpProjectType.chart.update();
      }

      // -------------------------------  EMPLOYEE MONTHLY TREND(APPLYING FILTER)  ----------------------

      if (this.json.data.length != 0) {
        this.selectedName = this.json.data[0] ? this.json.data[0] : {};
        // this.selectedName = this.json.data[0].employee;
        this.es.getByEmployee(this.json.data[0].employee, this.json.data[0].dept_original, year, org, project, practice, bu, subPractice, this.empNameData);
        this.es.getFromService(5).subscribe(response => {
          this.title = this.json.data[0].employee;
          let totalHours = response.aggregations.filtered.by_total_hours.buckets;


          this.billableMonthlyHoursData = [];
          let billableMonthlyHours = response.aggregations.filtered.by_billableMonthly.buckets;
          this.updateEmployeeMonthlyTrends(billableMonthlyHours, this.billableMonthlyHoursData, totalHours, 0, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

          this.nonBillableMonthlyHoursData = [];
          let nonBillableMonthlyHours = response.aggregations.filtered.by_nonbillableMonthly.buckets;
          this.updateEmployeeMonthlyTrends(nonBillableMonthlyHours, this.nonBillableMonthlyHoursData, totalHours, 1, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

          this.internalMonthlyHoursData = [];
          let internalMonthlyHours = response.aggregations.filtered.by_internalMonthly.buckets;
          this.updateEmployeeMonthlyTrends(internalMonthlyHours, this.internalMonthlyHoursData, totalHours, 2, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

          this.ptoMonthlyHoursData = [];
          let ptoMonthlyHours = response.aggregations.filtered.by_ptoMonthly.buckets;
          this.updateEmployeeMonthlyTrends(ptoMonthlyHours, this.ptoMonthlyHoursData, totalHours, 3, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

          this.holidayMonthlyHoursData = [];
          let holidayMonthlyHours = response.aggregations.filtered.by_holidayMonthly.buckets;
          this.updateEmployeeMonthlyTrends(holidayMonthlyHours, this.holidayMonthlyHoursData, totalHours, 4, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);

          this.specialLeavesMonthlyHoursData = [];
          let specialLeavesMonthlyHours = response.aggregations.filtered.by_specialLeavesMonthly.buckets;
          this.updateEmployeeMonthlyTrends(specialLeavesMonthlyHours, this.specialLeavesMonthlyHoursData, totalHours, 5, this.empYear,
            this.empOrgData, this.empProjectData, this.empPracticeData, this.empBUData, this.empSubPracticeData);


          // ------------------------------------- 2nd(PROJECT DETAILS) TABLE DATA -------------------------------------------------

          this.es.getProjectForEmployeeData(year, org, project, prjPractice, prjBu, prjSubPractice, month,
            this.empNameData, this.json.data[0].employee, this.json.data[0].dept_original);
          this.es.getFromService(18).subscribe(response => {
            this.prjResUtilJSON = {
              data: []
            };
            this.totalEmployeeHours = 0;
            response.aggregations.filtered.by_project.buckets.forEach(x => {
              if (x.by_practices.buckets.length != 0 && x.by_employeeBU.length != 0) {
                let temp = x.by_department.buckets[0].key.split('.');
                let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
                let internalHrs = x.by_internal.value + x.by_pto.value + x.by_holiday.value + x.by_specialLeave.value;
                this.totalEmployeeHours = this.totalEmployeeHours + x.by_employeehours.value;
                this.prjResUtilJSON.data.push({
                  "employee": x.key,
                  "bu": x.by_employeeBU.buckets[0].key,
                  "practice": x.by_practices.buckets[0].key,
                  "subPractice": x.by_sub_practices.buckets[0].key,
                  "department": dept,
                  "billable": x.by_billable.value,
                  "nonBillable": x.by_nonBillable.value,
                  "internal": internalHrs,
                  // "pto": x.by_pto.value != 0 ? ((x.by_pto.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                  // "holiday": x.by_holiday.value != 0 ? ((x.by_holiday.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                  // "specialLeave": x.by_specialLeave.value != 0 ?
                  // ((x.by_specialLeave.value / x.by_employeehours.value) * 100).toFixed(2) : '0',
                  "totalHours": x.by_employeehours.value.toFixed(),
                  "billableHrs": x.by_billable.value != 0 ? x.by_billable.value : '0',
                  "nonBillableHrs": x.by_nonBillable.value != 0 ? x.by_nonBillable.value : '0',
                  "internalHrs": internalHrs != 0 ? internalHrs : '0',
                  // "ptoHrs": x.by_pto.value != 0 ? x.by_pto.value : '0',
                  // "holidayHrs": x.by_holiday.value != 0 ? x.by_holiday.value : '0',
                  // "specialLeaveHrs": x.by_specialLeave.value != 0 ? x.by_specialLeave.value : '0',
                })
              }
            });
            this.prjResUtilJSON.data = this.prjResUtilJSON.data.sort(function sortAll(a, b) {
              return a.employee > b.employee ? 1
                : a.employee < b.employee ? -1
                  : 0;
            });
            this.prjResUtilJSON.data.forEach(project => {
              project.billable = this.totalEmployeeHours != 0 ? ((project.billable / this.totalEmployeeHours) * 100).toFixed(2) : 0;
              project.nonBillable = this.totalEmployeeHours != 0 ? ((project.nonBillable / this.totalEmployeeHours) * 100).toFixed(2) : 0;
              project.internal = this.totalEmployeeHours != 0 ? ((project.internal / this.totalEmployeeHours) * 100).toFixed(2) : 0;
            });
            this.selectedEmpName = this.prjResUtilJSON.data[0].employee;


          }, error => {
            console.log('error');
          });

        }, error => {
          console.log('error');
        });
      } else {

        this.prjResUtilJSON = {
          data: []
        };
      }
      this.isPageLoaded.emit(true);

    }, error => {
      console.log('error');
      this.isPageLoaded.emit(true);
    });

    // ---------------------------------------  UPDATE PIE CHART  ---------------------------------------------

    this.es.filterProjectPie(year, org, project, globalPractice, globalBU, globalSubPractice, month, this.empNameData);
    this.es.getFromService(1).subscribe(response => {

      this.projectTypes = [];
      this.projectTypeLabels = [];
      let totalHours = response.aggregations.filtered.by_total_hours.value;
      let billableHours = response.aggregations.filtered.by_billable.value;
      this.projectTypes.push(((billableHours / totalHours) * 100).toFixed(2));
      this.projectTypeLabels.push("Billable");

      let nonBillableHours = response.aggregations.filtered.by_nonBillable.value;
      this.projectTypes.push(((nonBillableHours / totalHours) * 100).toFixed(2));
      this.projectTypeLabels.push("Non Billable");

      let internalHours = response.aggregations.filtered.by_internal.value;
      this.projectTypes.push(((internalHours / totalHours) * 100).toFixed(2));
      this.projectTypeLabels.push("Internal");

      let ptoHours = response.aggregations.filtered.by_PTO.value;
      this.projectTypes.push(((ptoHours / totalHours) * 100).toFixed(2));
      this.projectTypeLabels.push("PTO");

      let holidayHours = response.aggregations.filtered.by_holiday.value;
      this.projectTypes.push(((holidayHours / totalHours) * 100).toFixed(2));
      this.projectTypeLabels.push("Holiday");

      let specialLeaveHours = response.aggregations.filtered.by_specialLeaves.value;
      this.projectTypes.push(((specialLeaveHours / totalHours) * 100).toFixed(2));
      this.projectTypeLabels.push("Special Leave");

      this.chartPieProjectType.data.labels = this.projectTypeLabels;
      this.chartPieProjectType.data.datasets[0].data = this.projectTypes;
      this.chartPieProjectType.chart.update();

    }, error => {
      console.log('error');
    });


    // ---------------------------------------  Update SUB-PRACTICEsWISE CHART  ------------------------------------
    this.es.getSubPracticeswiseProjectType(year, org, project, globalPractice, globalBU, globalSubPractice, month, this.empNameData);
    this.es.getFromService(2).subscribe(response => {

      let billableHoursSubPracticeswise = response.aggregations.filtered.by_billable.buckets;
      this.billableHoursSubPracticeswiseData = [];
      this.updateProjectTypeSubPracticeswiseLabel(billableHoursSubPracticeswise, this.billableHoursSubPracticeswiseData, 0,
        this.empYear, this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice,
        this.empYear + this.empMonth, this.empNameData);

      let nonBillableHoursSubPracticeswise = response.aggregations.filtered.by_nonBillable.buckets;
      this.nonBillableHoursSubPracticeswiseData = [];
      this.updateProjectTypeSubPracticeswiseLabel(nonBillableHoursSubPracticeswise, this.nonBillableHoursSubPracticeswiseData, 1,
        this.empYear, this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice,
        this.empYear + this.empMonth, this.empNameData);

      let internalHoursSubPracticeswise = response.aggregations.filtered.by_internal.buckets;
      this.internalHoursSubPracticeswiseData = [];
      this.updateProjectTypeSubPracticeswiseLabel(internalHoursSubPracticeswise, this.internalHoursSubPracticeswiseData, 2,
        this.empYear, this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth,
        this.empNameData);

      let ptoHoursSubPracticeswise = response.aggregations.filtered.by_PTO.buckets;
      this.ptoHoursSubPracticeswiseData = [];
      this.updateProjectTypeSubPracticeswiseLabel(ptoHoursSubPracticeswise, this.ptoHoursSubPracticeswiseData, this.empYear, 3,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let holidayHoursSubPracticeswise = response.aggregations.filtered.by_holiday.buckets;
      this.holidayHoursSubPracticeswiseData = [];
      this.updateProjectTypeSubPracticeswiseLabel(holidayHoursSubPracticeswise, this.holidayHoursSubPracticeswiseData, this.empYear, 4,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let specialLeaveHoursSubPracticeswise = response.aggregations.filtered.by_specialLeaves.buckets;
      this.specialLeaveHoursSubPracticeswiseData = [];
      this.updateProjectTypeSubPracticeswiseLabel(specialLeaveHoursSubPracticeswise, this.specialLeaveHoursSubPracticeswiseData, 5,
        this.empYear, this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice,
        this.empYear + this.empMonth, this.empNameData);

    }, error => {
      console.log('error');
    });

    // ---------------------------------------  UPDATE PRACTICEWISE CHART  -----------------------------------------

    this.es.getPracticeswiseProjectType(year, org, project, globalPractice, globalBU, globalSubPractice, month, this.empNameData);
    this.es.getFromService(7).subscribe(response => {

      let billableHoursPracticeswise = response.aggregations.filtered.by_billable.buckets;
      this.billableHoursPracticeswiseData = [];
      this.updateProjectTypePracticeswiseLabel(billableHoursPracticeswise, this.billableHoursPracticeswiseData, 0, this.empYear,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let nonBillableHoursPracticeswise = response.aggregations.filtered.by_nonBillable.buckets;
      this.nonBillableHoursPracticeswiseData = [];
      this.updateProjectTypePracticeswiseLabel(nonBillableHoursPracticeswise, this.nonBillableHoursPracticeswiseData, 1, this.empYear,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let internalHoursPracticeswise = response.aggregations.filtered.by_internal.buckets;
      this.internalHoursPracticeswiseData = [];
      this.updateProjectTypePracticeswiseLabel(internalHoursPracticeswise, this.internalHoursPracticeswiseData, 2, this.empYear,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let ptoHoursPracticeswise = response.aggregations.filtered.by_PTO.buckets;
      this.ptoHoursPracticeswiseData = [];
      this.updateProjectTypePracticeswiseLabel(ptoHoursPracticeswise, this.ptoHoursPracticeswiseData, 3, this.empYear,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let holidayHoursPracticeswise = response.aggregations.filtered.by_holiday.buckets;
      this.holidayHoursPracticeswiseData = [];
      this.updateProjectTypePracticeswiseLabel(holidayHoursPracticeswise, this.holidayHoursPracticeswiseData, 4, this.empYear,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

      let specialLeaveHoursPracticeswise = response.aggregations.filtered.by_specialLeaves.buckets;
      this.specialLeaveHoursPracticeswiseData = [];
      this.updateProjectTypePracticeswiseLabel(specialLeaveHoursPracticeswise, this.specialLeaveHoursPracticeswiseData, 5, this.empYear,
        this.empOrgData, this.empProjectData, globalPractice, globalBU, globalSubPractice, this.empYear + this.empMonth, this.empNameData);

    }, error => {
      console.log('error');
    });
  }


  inWords(month) {
    this.monthsInWord = {
      data: []
    };
    month.forEach(x => {
      switch (x.key) {
        case 1: this.monthsInWord.data.push({ "key": "Jan", "value": "0" + x.key });
          break;
        case 2: this.monthsInWord.data.push({ "key": "Feb", "value": "0" + x.key });
          break;
        case 3: this.monthsInWord.data.push({ "key": "Mar", "value": "0" + x.key });
          break;
        case 4: this.monthsInWord.data.push({ "key": "Apr", "value": "0" + x.key });
          break;
        case 5: this.monthsInWord.data.push({ "key": "May", "value": "0" + x.key });
          break;
        case 6: this.monthsInWord.data.push({ "key": "Jun", "value": "0" + x.key });
          break;
        case 7: this.monthsInWord.data.push({ "key": "Jul", "value": "0" + x.key });
          break;
        case 8: this.monthsInWord.data.push({ "key": "Aug", "value": "0" + x.key });
          break;
        case 9: this.monthsInWord.data.push({ "key": "Sept", "value": "0" + x.key });
          break;
        case 10: this.monthsInWord.data.push({ "key": "Oct", "value": x.key });
          break;
        case 11: this.monthsInWord.data.push({ "key": "Nov", "value": x.key });
          break;
        case 12: this.monthsInWord.data.push({ "key": "Dec", "value": x.key });

      }
    });

  }


  renderChart() {

    // -------------------------------------- PROJECT TYPE PIE ----------------------------------------------

    this.chartPieProjectType = new Chart('pieProjectType', {
      type: 'pie',
      data: {
        labels: this.projectTypeLabels,
        datasets: [
          {
            label: 'Project_Type',
            data: this.projectTypes,
            backgroundColor: ["#28a745", "#dc3545", "#ffc107", "#8e60a8", "#0356fc", "#b103fc"],
            hoverBackgroundColor: ["#28a745", "#dc3545", "#ffc107", "#8e60a8", "#0356fc", "#b103fc"],
            hoverBorderWidth: 0
          }
        ]
      },
      options: {
        animation: {
          duration: 10,
          // onComplete: function () {
          //     var chartInstance = this.chart,
          //         ctx = chartInstance.ctx;
          //     ctx.textAlign = 'center';
          //     ctx.fillStyle = "rgba(0, 0, 0, 1)";
          //     ctx.textBaseline = 'middle';

          //     this.data.datasets.forEach(function (dataset, i) {
          //         var meta = chartInstance.controller.getDatasetMeta(i);
          //         meta.data.forEach(function (bar, index) {
          //             var data = dataset.data[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'%';
          //             ctx.fillText(data, bar.tooltipPosition().x, bar.tooltipPosition().y - 5);

          //         });
          //     });
          //   }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.labels[tooltipItem.index] + ': ' +
                data.datasets[0].data[tooltipItem.index] + '%';
              // return data.datasets[tooltipItem.datasetIndex].label +
              //   ': ' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%';
            }
          }
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            fontSize: 11,
            boxWidth: 10
          }
        }
      }
    });

    // ----------------------------------------- PROJECT TYPE SUB-PRACTICESWISE -----------------------------------

    this.chartBarProjectTypeSubPracticeswise = new Chart('barProjectTypeSubPracticeswise', {
      type: 'bar',
      data: {
        labels: this.projectSubPractices,
        datasets: [
          {
            label: 'Billable',
            data: this.billableHoursSubPracticeswiseData,
            backgroundColor: "#28a745",
            hoverBackgroundColor: "#28a745",
            // hidden: true,
          },
          {
            label: 'Non Billable',
            data: this.nonBillableHoursSubPracticeswiseData,
            backgroundColor: "#dc3545",
            hoverBackgroundColor: "#dc3545",
            // hidden: true,
          },
          {
            label: 'Internal',
            data: this.internalHoursSubPracticeswiseData,
            backgroundColor: "#ffc107",
            hoverBackgroundColor: "#ffc107"
          },
          {
            label: 'PTO',
            data: this.ptoHoursSubPracticeswiseData,
            backgroundColor: "#8e60a8",
            hoverBackgroundColor: "#8e60a8",
            // hidden: true,
          },
          {
            label: 'Holiday',
            data: this.holidayHoursSubPracticeswiseData,
            backgroundColor: "#0356fc",
            hoverBackgroundColor: "#0356fc",
            // hidden: true,
          },
          {
            label: 'Special Leave',
            data: this.specialLeaveHoursSubPracticeswiseData,
            backgroundColor: "#b103fc",
            hoverBackgroundColor: "#b103fc"
          }
        ]
      },
      options: {
        aspectRatio: 6,
        animation: {
          duration: 10,
          // onComplete: function () {
          //     var chartInstance = this.chart,
          //         ctx = chartInstance.ctx;
          //     ctx.textAlign = 'center';
          //     ctx.fillStyle = "rgba(0, 0, 0, 1)";
          //     ctx.textBaseline = 'bottom';

          //     this.data.datasets.forEach(function (dataset, i) {
          //         var meta = chartInstance.controller.getDatasetMeta(i);
          //         meta.data.forEach(function (bar, index) {
          //             var data = dataset.data[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          //             ctx.fillText(data, bar._model.x, bar._model.y - 5);

          //         });
          //     });
          //   }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label +
                ': ' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%';
            }
          }
        },
        scales: {
          xAxes: [{
            // maxBarThickness: 15,
            // categoryPercentage: 0.5,
            // barPercentage: 1.0,
            stacked: false,
            gridLines: { display: false },
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            stacked: false,
            ticks: {
              callback: function (value) {
                var ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' }
                ];
                function formatNumber(n) {
                  for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n;
                }
                return formatNumber(value) + '%';
              }
            }
          }],
        },
        onClick: function (c) {

          var elementEvent = chartSubPract.getElementsAtEvent(c);
          var datasetsIndex = chartSubPract.getDatasetAtEvent(c);

          if (elementEvent.length > 0 && datasetsIndex.length > 0) {
            var indexElementEvent = elementEvent[0]._index;
            var indexDataset = datasetsIndex[0]._datasetIndex
            var practice = this.data.labels[indexElementEvent];
            var label = this.data.datasets[indexDataset].label;
          }
        }
      }
    });
    let chartSubPract = this.chartBarProjectTypeSubPracticeswise;

    // --------------------------------------------------- PROJECT TYPE PRACTICESWISE -----------------------------------


    this.chartBarProjectTypePracticeswise = new Chart('barProjectTypePracticeswise', {
      type: 'bar',
      data: {
        labels: this.projectPractices,
        datasets: [
          {
            label: 'Billable',
            data: this.billableHoursPracticeswiseData,
            backgroundColor: "#28a745",
            hoverBackgroundColor: "#28a745",
            // hidden: true,
          },
          {
            label: 'Non Billable',
            data: this.nonBillableHoursPracticeswiseData,
            backgroundColor: "#dc3545",
            hoverBackgroundColor: "#dc3545",
            // hidden: true,
          },
          {
            label: 'Internal',
            data: this.internalHoursPracticeswiseData,
            backgroundColor: "#ffc107",
            hoverBackgroundColor: "#ffc107"
          },
          {
            label: 'PTO',
            data: this.ptoHoursPracticeswiseData,
            backgroundColor: "#8e60a8",
            hoverBackgroundColor: "#8e60a8",
            // hidden: true,
          },
          {
            label: 'Holiday',
            data: this.holidayHoursPracticeswiseData,
            backgroundColor: "#0356fc",
            hoverBackgroundColor: "#0356fc",
            // hidden: true,
          },
          {
            label: 'Special Leave',
            data: this.specialLeaveHoursPracticeswiseData,
            backgroundColor: "#b103fc",
            hoverBackgroundColor: "#b103fc"
          }
        ]
      },
      options: {
        aspectRatio: 4.1,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label +
                ': ' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%';
            }
          }
        },
        scales: {
          xAxes: [{
            // maxBarThickness: 15,
            // categoryPercentage: 0.5,
            // barPercentage: 1.0,
            stacked: false,
            gridLines: { display: false },
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            stacked: false,
            ticks: {
              callback: function (value) {
                var ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' }
                ];
                function formatNumber(n) {
                  for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n;
                }
                return formatNumber(value) + '%';
              }
            }
          }],
        },
        onClick: function (c) {

          var elementEvent = chartPract.getElementsAtEvent(c);
          var datasetsIndex = chartPract.getDatasetAtEvent(c);

          if (elementEvent.length > 0 && datasetsIndex.length > 0) {
            var indexElementEvent = elementEvent[0]._index;
            var indexDataset = datasetsIndex[0]._datasetIndex
            var practice = this.data.labels[indexElementEvent];
            var label = this.data.datasets[indexDataset].label;
          }
        }
      }
    });
    let chartPract = this.chartBarProjectTypePracticeswise;

    // --------------------------------------------------- Employee Monthly -------------------------------------------------

    this.chartLineEmpProjectType = new Chart('lineEmpProjectType', {
      type: 'line',
      data: {
        labels: this.employeeLineLabels,
        datasets: [
          {
            label: 'Billable',
            fill: false,
            data: this.billableMonthlyHoursData,
            borderColor: "#28a745",
            backgroundColor: "#28a745",
            hoverBackgroundColor: "#28a745",
            // hidden: true,
          },
          {
            label: 'Non Billable',
            fill: false,
            data: this.nonBillableMonthlyHoursData,
            borderColor: "#dc3545",
            backgroundColor: "#dc3545",
            hoverBackgroundColor: "#dc3545",
            // hidden: true,
          },
          {
            label: 'Internal',
            fill: false,
            data: this.internalMonthlyHoursData,
            borderColor: "#ffc107",
            backgroundColor: "#ffc107",
            hoverBackgroundColor: "#ffc107"
          },
          {
            label: 'PTO',
            fill: false,
            data: this.ptoMonthlyHoursData,
            borderColor: "#8e60a8",
            backgroundColor: "#8e60a8",
            hoverBackgroundColor: "#8e60a8",
            // hidden: true,
          },
          {
            label: 'Holiday',
            fill: false,
            data: this.holidayMonthlyHoursData,
            borderColor: "#0356fc",
            backgroundColor: "#0356fc",
            hoverBackgroundColor: "#0356fc",
            // hidden: true,
          },
          {
            label: 'Special Leave',
            fill: false,
            data: this.specialLeavesMonthlyHoursData,
            borderColor: "#b103fc",
            backgroundColor: "#b103fc",
            hoverBackgroundColor: "#b103fc"
          }
        ]
      },
      options: {
        aspectRatio: 5.5,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' +
                tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'hrs';
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: { display: false },
          }],
          yAxes: [{
            stacked: false,
            ticks: {
              callback: function (value) {
                var ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' }
                ];
                function formatNumber(n) {
                  for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n;
                }
                return formatNumber(value) + ' hrs';
              }
            }
          }],
        },
        legend: {
          display: true,
          labels: {
            fontSize: 11,
            boxWidth: 10
          }
        }
      }
    });
    this.isPageLoaded.emit(true);
    this.isFirstTimeLoaded = true;
  }

  downloadDetailsInExel(name) {
    let downloadDetails;
    let file_name;
    if (this.prjResUtilJSON.data && name === 'Project_Details') {
      downloadDetails = this.prjResUtilJSON.data;
      file_name = name + '_of_' + this.title;
    } else if (this.json.data && name === 'Employee_Details') {
      downloadDetails = this.json.data;
      file_name = name;
    }
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  private createColumnDefsEmployee() {
    const columnDefsEmployee = [
      {
        headerName: "Employee Name",
        field: "employee",
        width: 220,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Department",
        field: "department",
        width: 200,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Billable",
        field: "billable",
        width: 80,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Non Billable",
        field: "nonBillable",
        width: 90,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Internal",
        field: "internal",
        width: 90,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "PTO",
        field: "pto",
        width: 80,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Holiday",
        field: "holiday",
        width: 80,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Special Leaves",
        field: "specialLeave",
        width: 100,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Total Hours",
        field: "totalHours",
        width: 100,
        valueFormatter: this.numberFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsEmployee;
  }

  onGridReadyEmployee(params) {
    this.gridApiEmployee = params.api;
    this.gridColumnApiEmployee = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeightEmployee = function (params) {
    let lineCount = Math.floor(params.data.employee.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  private createColumnDefsProjects() {
    const columnDefsProjects = [
      {
        headerName: "Project",
        field: "employee",
        width: 350,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Department",
        field: "department",
        width: 240,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Billable",
        field: "billable",
        width: 100,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Non Billable",
        field: "nonBillable",
        width: 130,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Internal",
        field: "internal",
        width: 100,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Total Hours",
        field: "totalHours",
        width: 130,
        valueFormatter: this.numberFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsProjects;
  }

  onGridReadyProjects(params) {
    this.gridApiProjects = params.api;
    this.gridColumnApiProjects = params.columnApi;
    this.gridApiProjects.sizeColumnsToFit();
  }

  getRowHeightProjects = function (params) {
    let lineCount = Math.floor(params.data.employee.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  currencyFormatter(params) {
    if (params.value) {
      return "$" + params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  percentageFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "%";
    } else {
      return '';
    }
  }

  numberFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  numberComparator(num1, num2) {
    return num1 - num2;
  }

  setFilters(): any {
    const obj = {
      'org': this.empOrg,
      'project': this.empProject,
      'bu': this.empBU,
      'practice': this.empPractice,
      'subPractice': this.empSubPractice,
      'empBuTable': this.empBUTable,
      'empPracticeTable': this.empPracticeTable,
      'empSubPracticeTable': this.empSubPracticeTable,
      'prjTableBU': this.prjTableBU,
      'prjTablePractice': this.prjTablePractice,
      'prjTableSubPractice': this.prjTableSubPractice,
      'empMonth': this.empMonth,
      'empYear': this.empYear
    }
    this.gridService.setFilters(obj);
  }
}
