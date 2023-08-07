import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExportFileService } from '../../shared/services/export-file.service';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { GridOptions } from "ag-grid-community";
import { CommonUtilities } from '../../shared/utilities';
import { GridService } from '../../dashboard-grid/grid.service';

const MONTHS_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_MAP = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

const DATASET_FORMAT: any = {
  type: 'bar',
  fill: 'false',
  label: undefined,
  data: undefined,
  backgroundColor: undefined,
}

const COLOR_PALETTE = {

  // for currently selected year's bars
  current: [
    '#A020F0', // purple bright
    '#FF0066', // broadwaypink bright
    '#003F87', // sign blue dark
    '#F8171B', // burgundy bright
    '#FF8000', // orange dark
    '#006633', // starbucks dark
    '#05B8CC', // cerulean bright
    '#993300', // chocolate dark
    '#FFFF00', // yellow bright
    '#802A2A', // brown dark
    '#8B8878', // cornsilk4 dark
  ],

  // for year previous to selected year's bars
  previous: [
    '#D9A5F9', // purple pale
    '#FF99C2', // broadwaypink pale
    '#71B3FF', // sign blue pale
    '#FB7E81', // burgundy pale
    '#FFCC99', // orange pale
    '#66FFB2', // starbucks pale
    '#8CF1FC', // cerulean pale
    '#FFA477', // chocolate pale
    '#FFFF99', // yellow pale
    '#DF9D9D', // brown pale
    '#D0CFC9', // cornsilk4 pale
  ]
}

@Component({
  selector: 'app-my-resource-revenue-source',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './my-resource-revenue-source.component.html',
  styleUrls: ['./my-resource-revenue-source.component.css']
})
export class MyResourceRevenueSourceComponent implements OnInit {

  @Output()
  isPageLoaded = new EventEmitter<boolean>();

  spinner: boolean = false;
  isGridModeOn: boolean = false;
  isCompareOn: boolean = false;

  // will be disabled if year selected is the least one
  // as we don't have previous year to compare to
  disableCompare: boolean = false;
  paginationPageSize: number = 10;

  hierarchicalRevenueData: any;

  resourceRevenueData: ChartDataModel[];
  columnDefs: any[] = undefined;
  gridRowData: any[] = undefined;
  gridOptions = <GridOptions>{};
  defaultColDef = { resizable: true };

  // all organisations id and names we get from backend to use in filter
  orgData: DropdownFilterDataModel[] = [];

  // organizations currently selected in UI
  selectedOrgs: DropdownFilterDataModel[] = [];

  practicesData: DropdownFilterDataModel[] = [];
  selectedPractices: DropdownFilterDataModel[] = [];

  subPracticesData: DropdownFilterDataModel[] = [];
  selectedSubPractices: DropdownFilterDataModel[] = [];

  // all employees id and names we get from backend
  employeesData: DropdownFilterDataModel[] = [];

  // employees currently selected in UI
  selectedEmployees: DropdownFilterDataModel[] = [];

  // all employees id and names we get from backend
  yearsList: number[];

  // year current selected in UI
  selectedYear: number;

  noDataFlag: boolean = true;

  dropdownSettings: any;

  myResourcesRevenueChart: Chart;
  previousYearDatasets: any[];
  selectedYearDatasets: any[];
  lastChanedDd = '';

  private myResourcesChartOptions: any = {
    type: 'bar',

    data: {
      labels: MONTHS_SHORT_NAMES
    },

    options: {

      animation: {
        duration: 0,
      },

      maintainAspectRatio: false,
      // aspectRatio: 3,

      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            if (!data) {
              return false;
            }
            return data.datasets[tooltipItem.datasetIndex].label + ' : ' + '$ ' +
              tooltipItem.yLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        },
        mode: 'label'
      },

      legend: {
        display: true,
        // position: 'right',
        // align: 'middle'
      },

      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            drawOnChartArea: false,
            color: 'none'
          },
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              var ranges = [{ divider: 1e6, suffix: 'M' }, { divider: 1e3, suffix: 'k' }];
              function formatNumber(n) {
                for (var i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                  }
                }
                return n.toFixed(2);
              } return '$' + formatNumber(value);
            }
          }
        }],
      }
    }
  }

  constructor(
    private resourceUtilizationService: ResourceUtilizationService,
    private toastrService: ToastrService,
    private exportFileService: ExportFileService,
    private gridService: GridService,
    private commonUtilities: CommonUtilities,
  ) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'itemName',
      itemsShowLimit: 1,
      classes: 'myclass custom-class'
    };

    this.setYearsData();
    this.setPreservedFilter();
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res && res.filters ? JSON.parse(res.filters) : null;
      if (filter) {
        this.selectedOrgs = filter && Object.keys(filter).length > 0 ? filter.org : this.selectedOrgs;
        this.orgData = filter && Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.selectedPractices = filter && Object.keys(filter).length > 0 ? filter.selectedPractices : this.selectedPractices;
        this.practicesData = filter && Object.keys(filter).length > 0 ? filter.practicesData : this.practicesData;
        this.selectedSubPractices = filter && Object.keys(filter).length > 0 ? filter.selectedSubPractices : this.selectedSubPractices;
        this.subPracticesData = filter && Object.keys(filter).length > 0 ? filter.subPracticesData : this.subPracticesData;
        this.selectedEmployees = filter && Object.keys(filter).length > 0 ? filter.employee : this.selectedEmployees;
        this.employeesData = filter && Object.keys(filter).length > 0 ? filter.employeeData : this.employeesData;
        this.isCompareOn = filter && Object.keys(filter).length > 0 ? filter.compare : this.isCompareOn;
        this.isGridModeOn = filter && Object.keys(filter).length > 0 ? filter.grid : this.isGridModeOn;
        this.selectedYear = filter && Object.keys(filter).length > 0 ? filter.year : this.selectedYear;

        if (this.isCompareOn) {
          document.getElementById("toggle").classList.add('active');
        }
        if (this.isGridModeOn) {
          document.getElementById("toggleGrid").classList.add('active');
        }
        this.getMyResourceRevenueSourcesData();
      }
      else {
        this.setYearsData();
        this.getOrgData();
      }
    }, (errorResponse) => {
      this.spinner = false;
      this.setYearsData();
      this.getOrgData();
      //this.toastrService.error('Error occurred While getting preserved filters data!');
    })
  }

  setYearsData() {
    const currentYear = moment().year();

    // currently told to take only past 4 years
    this.yearsList = [currentYear - 2, currentYear - 1, currentYear];
    this.selectedYear = currentYear;
  }

  getOrgData() {
    this.spinner = true;

    this.resourceUtilizationService
      .getResourceOrganizations()
      .subscribe(
        (response) => {
          this.spinner = false;
          this.selectedOrgs = this.orgData = response.Orgs;
          this.getPracticesData();
        },
        this.dataFetchErrorHandler
      );
  }

  getPracticesData() {
    this.spinner = true;

    const payload = {
      orgId: this.getIdsFromFilterData(this.selectedOrgs)
    };

    this.resourceUtilizationService
      .getPracticeByProjectID(payload)
      .subscribe(
        (response) => {
          this.spinner = false;
          this.selectedPractices = this.practicesData = response.Practices;
          this.getSubPracticesData();
        },
        this.dataFetchErrorHandler
      );
  }

  getSubPracticesData() {
    this.spinner = true;

    const payload = {
      orgId: this.getIdsFromFilterData(this.selectedOrgs),
      practice: this.getItemNamesFromFilterData(this.selectedPractices)
    };

    this.resourceUtilizationService
      .getSubPracticeByProjectID(payload)
      .subscribe(
        (response) => {
          this.spinner = false;
          this.selectedSubPractices = this.subPracticesData = response.SubPractices;
          this.getEmployeesData();
        },
        this.dataFetchErrorHandler
      );
  }

  getEmployeesData() {
    this.spinner = true;

    const payload = {
      orgId: this.getIdsFromFilterData(this.selectedOrgs),
      prac: this.getItemNamesFromFilterData(this.selectedPractices),
      subPrac: this.getItemNamesFromFilterData(this.selectedSubPractices)
    };

    this.resourceUtilizationService
      .getEmployeesByProjectID(payload)
      .subscribe(
        (response) => {
          this.spinner = false;
          this.selectedEmployees = this.employeesData = response.Employees;
          this.getMyResourceRevenueSourcesData();
        },
        this.dataFetchErrorHandler
      );
  }

  /* gets the data to display the chart or populate the grid */
  getMyResourceRevenueSourcesData() {
    this.spinner = true;

    const payload = {
      'years': [Number(this.selectedYear) - 1, Number(this.selectedYear)],
      'org': this.getItemNamesFromFilterData(this.selectedOrgs),
      'practice': this.getItemNamesFromFilterData(this.selectedPractices),
      'subPractice': this.getItemNamesFromFilterData(this.selectedSubPractices),
      'employee': this.getIdsFromFilterData(this.selectedEmployees)
    }

    this.resourceUtilizationService
      .getMyResourceRevenueSources(payload)
      .subscribe(
        (response) => {
          this.spinner = false;
          this.resourceRevenueData = response.Revenue;
          this.addMMMToEachRow(this.resourceRevenueData);
          this.setColumnDefs();
          this.setGridRowData();
          this.transformTabularDataToHierarchical();
          // this.populateMyResourcesChartDatasets();
          this.isGridModeOn ? this.populateGrid() : this.drawChart();
        },
        this.dataFetchErrorHandler
      );
    this.setFilters();
  }

  /* Adds month short name key to each row in chart/grid/excel data
   * In each row of rows, Month key must be present with values
   * between 01 and 12 */
  addMMMToEachRow(rows: any[]) {
    if (!rows) {
      return;
    }

    rows.map(eachRow => {
      eachRow['Mon'] = MONTHS_MAP[eachRow.Month]
    });
  }

  onYearChange() {
    this.getMyResourceRevenueSourcesData();
  }

  onCompareToggle() {
    this.isCompareOn = !this.isCompareOn;
    this.setFilters();
    this.drawChart();

    this.setGridRowData();
  }

  onGridToggle() {
    this.isGridModeOn = !this.isGridModeOn;
    // this.setFilters();
    this.drawChart();
  }

  populateGrid() {
    this.gridOptions.api.sizeColumnsToFit();
    this.isPageLoaded.emit(true);
  }

  drawChart() {

    if (this.myResourcesRevenueChart) {
      this.myResourcesRevenueChart.destroy();
    }

    this.populateMyResourcesChartDatasets();
    this.setDatasetsInChartOptions();
    this.setFilters();
    this.myResourcesRevenueChart = new Chart(
      "myResourcesRevenueChart", this.myResourcesChartOptions
    );

    this.isPageLoaded.emit(true);
  }

  /* this method transforms the tabular data received from server to a hierarchical format
   * this makes it easy to pass data to new Chart() */
  transformTabularDataToHierarchical() {
    const years = [Number(this.selectedYear) - 1, Number(this.selectedYear)];
    const selectedOrgNames = Array.from(new Set(this.resourceRevenueData.map((item: any) => item.Org)));
    this.hierarchicalRevenueData = {};

    let eachYearData = null;
    for (const eachYear of years) {

      eachYearData = {
        year: eachYear,
        orgs: new Map()
      }

      for (const eachOrg of selectedOrgNames) {
        eachYearData.orgs.set(eachOrg, []);
        eachYearData.orgs.get(eachOrg).length = 12;
        eachYearData.orgs.get(eachOrg).fill(0, 0, 12);
      }

      for (const eachRow of this.resourceRevenueData) {
        if (eachRow.Year == eachYear) {
          // here we are getting the org array using current row's org
          // adding that org's that month's revenue to that org's that month's index
          // Below we are doing Number() - 1 because months start at 1 but array index start at 0
          eachYearData
            .orgs
            .get(eachRow.Org)[Number(eachRow.Month) - 1] += eachRow.Revenue;
        }
      }

      this.hierarchicalRevenueData[eachYear] = eachYearData;
    }
  }

  /* populates the current and previous year datasets
   * each dataset created in this method will be in a format that can
   * be placed in Chart options */
  populateMyResourcesChartDatasets() {

    // populating selected and previous year datasets
    this.selectedYearDatasets = [];
    this.populateSingleYearChartDatasets(
      this.selectedYear, this.selectedYearDatasets, COLOR_PALETTE.current
    );

    this.previousYearDatasets = [];
    this.populateSingleYearChartDatasets(
      Number(this.selectedYear) - 1,
      this.previousYearDatasets, COLOR_PALETTE.previous
    );
  }

  populateSingleYearChartDatasets(
    year: number | string, datasetArray: any[], colorsArray: string[]
  ) {
    const selectedOrgNames = Array.from(new Set(this.resourceRevenueData.map((item: any) => item.Org)));
    let singleDataset: any;
    selectedOrgNames.forEach((eachOrg, index) => {
        singleDataset = Object.assign({}, DATASET_FORMAT);
        singleDataset.data = this.hierarchicalRevenueData[year].orgs.get(eachOrg);
        singleDataset.label = `${year}-${eachOrg}`;
        singleDataset.backgroundColor = colorsArray[index];
        datasetArray.push(singleDataset);
      });
  }

  setDatasetsInChartOptions() {
    // setting datasets into chart options
    if (!this.disableCompare && this.isCompareOn) {
      this.myResourcesChartOptions
        .data.datasets = this.previousYearDatasets.concat(this.selectedYearDatasets);
    }
    else {
      this.myResourcesChartOptions.data.datasets = this.selectedYearDatasets;
    }
  }

  dataFetchErrorHandler(error) {
    this.spinner = false;
    this.toastrService.error("Error occured while getting Organizations data!");
  }

  getIdsFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray ? objArray.map(eachObj => eachObj.id) : [];
  }

  getItemNamesFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray ? objArray.map(eachObj => eachObj.itemName) : [];
  }

  setColumnDefs() {
    if (this.columnDefs === undefined && this.resourceRevenueData.length > 0) {

      this.columnDefs = Object.keys(this.resourceRevenueData[0])
        .map(eachColumnName => {
          const singleColumnDef = {
            field: eachColumnName,
            headerName: eachColumnName.toUpperCase(),
            sortable: true,
            filter: true
          }

          if (singleColumnDef.field.toUpperCase() === 'MON' || singleColumnDef.field.toUpperCase() === 'YEAR') {
            singleColumnDef['pinned'] = 'left';
          }
          if (singleColumnDef.field.toUpperCase() == 'MONTH') {
              singleColumnDef['hide'] = true
          }

          return singleColumnDef;
        });

      if (this.columnDefs.length === 0) {
        console.log('No resource count data available.');
      }
    }
  }

  /* if compare is on, both years data will be shown
   * else only selected year's data will be shown */
  setGridRowData() {
    if (this.isCompareOn) {
      this.gridRowData = this.resourceRevenueData;
    }
    else {
      // == is intentional in filter because this.selectedYear is string
      // and eachRow.year might be a number
      this.gridRowData = this.resourceRevenueData
        .filter(eachRow => eachRow.Year == this.selectedYear);
    }
  }

  onRefresh() {
    this.selectedYear = moment().year();
    this.getOrgData();
  }

  onSelectDeselectAll(item: any, selectModelName: any) {
    this[selectModelName] = item;
  }

  onClose(event: any): void {
    let { target } = event;
    let count = 5;
    let eleFound = '';
    while (target.parentElement && (target.parentElement.nodeName.toLowerCase() != 'body' || target.parentElement.id != 'modal-container') && count > 0) {
      if (target.id.includes('mdd') || (target.parentElement && target.parentElement.id.includes('mdd'))) {
        eleFound = target.id.includes('mdd') ? target.id : (target.parentElement.id.includes('mdd') ? target.parentElement.id : '').split('mdd')[1].toLowerCase();
        break;
      }
      target = target.parentElement;
      count--;
    }
    if (!eleFound) {
      this.getData();
      this.lastChanedDd = '';
    } else if (eleFound != this.lastChanedDd) {
      this.getData();
      this.lastChanedDd = eleFound;

    }
  }

  getData(): void {
    if (this.lastChanedDd === 'org') {
      this.getPracticesData();
    } else if (this.lastChanedDd === 'pract') {
      this.getSubPracticesData();
    } else if (this.lastChanedDd === 'subpract') {
      this.getEmployeesData();
    } else if (this.lastChanedDd === 'employee') {
      this.getMyResourceRevenueSourcesData();
    }
  }

  onExportToExcel() {
    // const downloadDetails = this.gridRowData;
    this.spinner = true;
    const fileName = 'my_resource_revenue_source_';

    const payload = {
      columns: ['Year', 
        'Month',
        'Employee',
        'Emp_Organization',
        'Emp_Region',
        'Emp_BU',
        'Emp_Practice',
        'Emp_Sub_Practice',
        'Emp_Xfer_Entity', 
        'Project',
        'Prj_Organization',
        'Prj_Region',
        'Prj_BU',
        'Prj_Practice',
        'Prj_Sub_Practice',
        'Prj_Xfer_Entity',
        'Project_Revenue',
        'Project_Cost'
        ],
        sortByColumns: ['Year', 'Month'],

      filters: {
        year: this.selectedYear
          ? this.isCompareOn
            ? [Number(this.selectedYear - 1), this.selectedYear]
            : [this.selectedYear]
          : [],
        emp_organization: this.getItemNamesFromFilterData(this.selectedOrgs),
        emp_practice: this.getItemNamesFromFilterData(this.selectedPractices),
        emp_sub_practice: this.getItemNamesFromFilterData(this.selectedSubPractices),
        employee_id: this.getIdsFromFilterData(this.selectedEmployees)
      }
    };

    this.resourceUtilizationService
      .getExportToExcelData(payload)
      .subscribe(
        response => {
          this.spinner = false;

          // this.addMMMToEachRow(response.Records);
          response.Records.map(eachRow => {
            eachRow.Month = MONTHS_MAP[eachRow.Month]
          }); 
          
          this.exportFileService
            .exportAsExcelFile(response.Records, fileName);
        },
        error => {
          this.spinner = false;
          this.toastrService.error("Error occurred while getting excel data for export.")
        }
      );
  }

  setFilters() {
    const obj = {
      "org": this.selectedOrgs,
      "orgData": this.orgData,
      "selectedPractices": this.selectedPractices,
      "practicesData": this.practicesData,
      "selectedSubPractices": this.selectedSubPractices,
      "subPracticesData": this.subPracticesData,
      "employee": this.selectedEmployees,
      "employeeData": this.employeesData,
      "compare": this.isCompareOn,
      "grid": this.isGridModeOn,
      "year": this.selectedYear
    }
    this.gridService.setFilters(obj);
  }

}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}

class ChartDataModel {
  Year: number;
  Month: string;
  Org: number;
  Revenue: number
}
