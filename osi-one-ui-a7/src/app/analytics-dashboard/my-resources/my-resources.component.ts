import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExportFileService } from '../../shared/services/export-file.service';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { GridOptions } from "ag-grid-community";
import { GridService } from '../../dashboard-grid/grid.service';

const MONTHS_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DATASET_NAMES = [
  'ASSOCIATE', 'STAFF', 'SENIOR', 'PRINCIPAL', 'PRACTICE_MANAGER', 'PRACTICE_DIRECTOR',  
  'SENIOR_PRACTICE_DIRECTOR', 'VICE_PRESIDENT', 'SENIOR_VICE_PRESIDENT', 'OTHERS', 'TOTAL_COUNT'
];

const DATASET_FORMAT: any = {
  yAxisId: 'bar',
  order: 2,
  type: 'bar',
  fill: 'false',
  label: undefined,
  data: undefined,
}

const LINE_DATASET_FORMAT: any = {
  yAxisId: 'line',
  order: 1,
  type: 'line',
  fill: 'false',
  label: undefined,
  data: undefined,
}

const COLOR_PALETTE = [
  '#1E90FF', '#87CEFA', '#003F87', '#71B3FF'
];
const COLOR_PALETTES = {

  // for currently selected year's bars
  current: [
    '#05B8CC', // cerulean bright
    '#FF8000', // orange dark
    '#993300', // chocolate dark
    '#FFFF00', // yello bright
    '#802A2A', // brown dark
    '#8B8878', // cornsilk4 dark
    '#003F87', // sign blue dark
    '#006633', // starbucks dark
    '#FF0066', // broadwaypink bright
    '#A020F0', // purple bright
    '#F8171B', // burgundy bright
  ],

  // for year previous to selected year's bars
  previous: [
    '#8CF1FC', // cerulean pale
    '#FFCC99', // orange pale
    '#FFA477', // chocolate pale
    '#FFFF99', // yellow pale
    '#DF9D9D', // brown pale
    '#D0CFC9', // cornsilk4 pale
    '#71B3FF', // sign blue pale
    '#66FFB2', // starbucks pale
    '#FF99C2', // broadwaypink pale
    '#D9A5F9', // purple pale
    '#FB7E81', // burgundy pale
  ]
}

@Component({
  selector: 'app-my-resources',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './my-resources.component.html',
  styleUrls: ['./my-resources.component.css']
})
export class MyResourcesComponent implements OnInit {

  @Output()
  isPageLoaded = new EventEmitter<boolean>();

  spinner: boolean = false;
  isGridModeOn: boolean = false;
  isCompareOn: boolean = false;

  // will be disabled if year selected is the least one
  // as we don't have previous year to compare to
  disableCompare: boolean = false;
  paginationPageSize: number = 10;

  months: any = [{ "value": "Jan", "id": 1 }, { "value": "Feb", "id": 2 }, { "value": "Mar", "id": 3 }, { "value": "Apr", "id": 4 }, { "value": "May", "id": 5 }, { "value": "Jun", "id": 6 }, { "value": "Jul", "id": 7 }, { "value": "Aug", "id": 8 }, { "value": "Sep", "id": 9 }, { "value": "Oct", "id": 10 }, { "value": "Nov", "id": 11 }, { "value": "Dec", "id": 12 }];

  resourceCountData: ChartDataModel[];
  columnDefs: any[] = undefined;
  gridRowData: any[] = undefined;
  gridOptions = <GridOptions>{};
  defaultColDef = { resizable: true };

  // the object of filter values we send while getting chart/grid data
  // made it a separate field because needed to use it in export excel method
  chartDataFilterPayload: any;

  // all organisations id and names we get from backend to use in filter
  orgData: DropdownFilterDataModel[];
  practiceData: DropdownFilterDataModel[];
  subPracticeData: DropdownFilterDataModel[];
  projectsData: DropdownFilterDataModel[];

  // organizations currently selected in UI
  selectedOrgs: DropdownFilterDataModel[];

  // all employees id and names we get from backend
  employeesData: DropdownFilterDataModel[];

  // employees currently selected in UI
  selectedEmployees: DropdownFilterDataModel[];
  selectedPractices: DropdownFilterDataModel[];
  selectedSubPractices: DropdownFilterDataModel[];
  selectedProjects: DropdownFilterDataModel[];

  // all employees id and names we get from backend
  yearsList: number[];

  // year current selected in UI
  selectedYear: number;

  // latest and oldest years in yearsData
  maxYear: number;
  minYear: number;

  dropdownSettings: any;

  selectedYearDatasetType: any[] = [];
  previousYearAvgDatasetType: any[] = [];

  myResourcesChart: Chart;
  previousYearDataset: any;
  selectedYearDataset: any;
  previousYearAvgDataset: any;
  selectedYearAvgDataset: any;
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
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {

            if (!data) {
              return false;
            }
            else if (data.datasets[tooltipItem.datasetIndex].yAxisID === 'line') {
              return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
                tooltipItem.yLabel.toString();
            }

            return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
              tooltipItem.yLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        },
        mode: 'label'
      },

      legend: {
        display: true,
      },

      scales: {
        xAxes: [{
          // stacked: true,
          gridLines: {
            display: false,
            drawOnChartArea: false,
            color: 'none'
          },
        }],
        yAxes: [
          // settings for bar y axis
          {
            // stacked: true,
            id: 'bar',
            position: 'left',
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              min: 1,
              callback: value => {
                return value;
              }
            }
          },
          // settings for line y axis
          // {
          //   id: 'line',
          //   position: 'right',
          //   gridLines: {
          //     display: false,
          //   },
          //   ticks: {
          //     beginAtZero: true,
          //     callback: value => `${value}`
          //   }
          // },
        ],
      }
    }
  }

  constructor(
    private resourceUtilizationService: ResourceUtilizationService,
    private toastrService: ToastrService,
    private gridService: GridService,
    private exportFileService: ExportFileService
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
        this.selectedPractices = filter && Object.keys(filter).length > 0 ? filter.practice : this.selectedPractices;
        this.practiceData = filter && Object.keys(filter).length > 0 ? filter.practiceData : this.practiceData;
        this.selectedSubPractices = filter && Object.keys(filter).length > 0 ? filter.subPractice : this.selectedSubPractices;
        this.subPracticeData = filter && Object.keys(filter).length > 0 ? filter.subPracticeData : this.subPracticeData;
        this.selectedEmployees = filter && Object.keys(filter).length > 0 ? filter.employee : this.selectedEmployees;
        this.employeesData = filter && Object.keys(filter).length > 0 ? filter.employeeData : this.employeesData;
        this.selectedProjects = filter && Object.keys(filter).length > 0 ? filter.project : this.selectedProjects;
        this.projectsData = filter && Object.keys(filter).length > 0 ? filter.projectData : this.projectsData;
        this.isCompareOn = filter && Object.keys(filter).length > 0 ? filter.compare : this.isCompareOn;
        this.isGridModeOn = filter && Object.keys(filter).length > 0 ? filter.grid : this.isGridModeOn;
        this.selectedYear = filter && Object.keys(filter).length > 0 ? filter.year : this.selectedYear;
        if (this.isCompareOn) {
          document.getElementById("toggle").classList.add('active');
        }
        if (this.isGridModeOn) {
          document.getElementById("toggleGrid").classList.add('active');
        }
        this.getResourceCount(this.selectedOrgs, this.selectedPractices, this.selectedSubPractices, this.selectedEmployees);
      }
      else {
        this.setYearsData();
        this.getOrgData();
      }
    }, (errorResponse) => {
      this.spinner = false;
      this.setYearsData();
      this.getOrgData();
      //this.toastrService.error('Error Occured While Getting preserved filters data!');
    })
  }

  setYearsData() {
    const currentYear = moment().year();
    this.yearsList = [currentYear - 2, currentYear - 1, currentYear];
    this.maxYear = currentYear;
    this.minYear = this.yearsList[0];
    this.selectedYear = this.maxYear;
  }

  getOrgData() {
    this.spinner = true;

    this.resourceUtilizationService
      .getResourceOrganizations()
      .subscribe(
        (response) => {
          this.spinner = false;
          this.selectedOrgs = this.orgData = response.Orgs;
          this.getPracticeData(response.Orgs);
        },
        this.dataFetchErrorHandler
      );
  }

  getPracticeData(org: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? this.getIdsFromFilterData(org) : []
    }
    this.resourceUtilizationService.getPracticeByProjectID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.selectedPractices = this.practiceData = response.Practices;
      this.getSubPracticeData(org, response.Practices);
    }, this.dataFetchErrorHandler
    );
  }

  getSubPracticeData(org: any, pract: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? this.getIdsFromFilterData(org) : [],
      "practice": pract ? this.getItemNamesFromFilterData(pract) : []
    }

    this.resourceUtilizationService.getSubPracticeByProjectID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.selectedSubPractices = this.subPracticeData = response.SubPractices;
      this.getEmployeesData(org, pract, response.SubPractices);

    }, this.dataFetchErrorHandler
    );
  }

  getEmployeesData(org: any, pract: any, subPract: any) {
    this.spinner = true;

    const payLoad = {
      "orgId": org ? this.getIdsFromFilterData(org) : [],
      "prac": pract ? this.getItemNamesFromFilterData(pract) : [],
      "subPrac": subPract ? this.getItemNamesFromFilterData(subPract) : []
    }

    this.resourceUtilizationService.getEmployeesByProjectID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.selectedEmployees = this.employeesData = response.Employees;
      this.getResourceCount(org, pract, subPract, response.Employees);
    }, this.dataFetchErrorHandler
    );
  }

  /* gets the data to display the chart */
  getResourceCount(org: any, pract: any, subPract: any, employee: any) {
    this.spinner = true;

    this.chartDataFilterPayload = {
      'years': this.getYearFilterForResourceCount(),
      'org': this.getItemNamesFromFilterData(org),
      'practice': this.getItemNamesFromFilterData(pract),
      'subPractice': this.getItemNamesFromFilterData(subPract),
      'employee': this.getIdsFromFilterData(employee),
    }

    this.resourceUtilizationService
      .getResourceCount(this.chartDataFilterPayload)
      .subscribe(
        (response) => {
          this.spinner = false;
          this.resourceCountData = response.Resources;
          this.setColumnDefs();
          this.setGridRowData();
          this.populateMyResourcesChartDatasets();
          this.isGridModeOn ? this.populateGrid() : this.drawChart();
        },
        this.dataFetchErrorHandler
      );
    this.setFilter();
  }

  onYearChange() {
    // == is intentional as this.selectedYear will be set be select
    // in html and thus will be string
    // if (this.selectedYear == this.yearsList[0]) {
    //   this.disableCompare = true;
    // }
    // else {
    //   this.disableCompare = false;
    // }

    //this.getOrgData();
    this.getResourceCount(this.selectedOrgs, this.selectedPractices, this.selectedSubPractices, this.selectedEmployees);
  }

  onCompareToggle() {
    this.isCompareOn = !this.isCompareOn;
    this.setFilter();
    this.setColumnDefs();
    this.setGridRowData();
    this.isCompareOn && this.isGridModeOn ? this.populateGrid() : this.drawChart();
  }

  onGridToggle() {
    this.isGridModeOn = !this.isGridModeOn;
    this.setFilter();
    if (!this.isGridModeOn) {
      this.drawChart();
    }
  }

  populateGrid() {
    this.gridOptions.api.sizeColumnsToFit();
    this.isPageLoaded.emit(true);
  }

  drawChart() {

    if (this.myResourcesChart) {
      this.myResourcesChart.destroy();
    }

    this.setDatasetsInChartOptions();
    this.myResourcesChart = new Chart(
      "myResourcesChart", this.myResourcesChartOptions
    );

    this.isPageLoaded.emit(true);
  }

  setDatasetsInChartOptions() {
    // setting datasets into chart options
    if (!this.disableCompare && this.isCompareOn) {
      // this.myResourcesChartOptions.data.datasets = [
      //   this.previousYearDataset,
      //   this.previousYearAvgDataset,
      //   this.selectedYearDataset,
      //   this.selectedYearAvgDataset
      // ];
      this.myResourcesChartOptions.data.datasets = this.previousYearAvgDatasetType
        .concat([this.previousYearAvgDataset])
        .concat(this.selectedYearDatasetType)
        .concat([this.selectedYearAvgDataset]);
    }
    else {
      // this.myResourcesChartOptions.data.datasets = [
      //   this.selectedYearDataset,
      //   this.selectedYearAvgDataset
      // ];
      this.myResourcesChartOptions.data.datasets = this.selectedYearDatasetType
        .concat([this.selectedYearAvgDataset]);
    }
  }

  currentYear = moment().year();
  currentMonth = moment().month();

  getDatasetData(year: any, type: any) {
    return this.resourceCountData
      .filter((item: any) => item.Year === year)
      .map((item: any) => item[type]);
  }

  populateMyResourcesChartDatasets() {
    this.selectedYearDatasetType = [];
    this.previousYearAvgDatasetType = [];
    const years = [Number(this.selectedYear) - 1, Number(this.selectedYear)];
    const datasetArray: any = [];
    let singleDataset: any = {};
    years.forEach((eachYear: any) => {
      DATASET_NAMES.forEach((eachSet: any, index: number) => {
        if (eachYear === Number(this.selectedYear)) {
          singleDataset = Object.assign({}, DATASET_FORMAT);
          singleDataset.data = this.getDatasetData(eachYear, eachSet);
          singleDataset.label = `${eachYear}-${eachSet}`;
          singleDataset.backgroundColor = COLOR_PALETTES['current'][index];
          datasetArray.push(singleDataset);
          this.selectedYearDatasetType.push(singleDataset);
        } else {
          singleDataset = Object.assign({}, DATASET_FORMAT);
          singleDataset.data = this.getDatasetData(eachYear, eachSet);
          singleDataset.label = `${eachYear}-${eachSet}`;
          singleDataset.backgroundColor = COLOR_PALETTES['previous'][index];
          datasetArray.push(singleDataset);
          this.previousYearAvgDatasetType.push(singleDataset);
        }
      });
    });

    // populating datasets

    this.selectedYearDataset = Object.assign({}, DATASET_FORMAT);
    this.previousYearDataset = Object.assign({}, DATASET_FORMAT);
    this.selectedYearAvgDataset = Object.assign({}, LINE_DATASET_FORMAT);
    this.previousYearAvgDataset = Object.assign({}, LINE_DATASET_FORMAT);

    this.selectedYearDataset.data = [];
    this.selectedYearDataset.backgroundColor = COLOR_PALETTE[0];
    this.selectedYearDataset.label = this.selectedYear

    this.previousYearDataset.data = [];
    this.previousYearDataset.backgroundColor = COLOR_PALETTE[1];
    this.previousYearDataset.label = Number(this.selectedYear) - 1;

    this.selectedYearAvgDataset.data = [];
    this.selectedYearAvgDataset.backgroundColor = COLOR_PALETTE[2];
    this.selectedYearAvgDataset.borderColor = COLOR_PALETTE[2];
    this.selectedYearAvgDataset.label = `${this.selectedYear} - AVG_COUNT`;

    this.previousYearAvgDataset.data = [];
    this.previousYearAvgDataset.backgroundColor = COLOR_PALETTE[3];
    this.previousYearAvgDataset.borderColor = COLOR_PALETTE[3];
    this.previousYearAvgDataset.label = `${Number(this.selectedYear) - 1} - AVG_COUNT`;

    const selectedYear = Number(this.selectedYear);
    let countSelectedYear = 0;
    let countPrevYear = 0;
    this.resourceCountData.forEach((item: any) => {
      if (item.Year === selectedYear) {
        countSelectedYear += item.TOTAL_COUNT;
      } else {
        countPrevYear += item.TOTAL_COUNT;
      }
    });

    this.resourceCountData.forEach((eachRow) => {
      if (eachRow.Year === selectedYear) {
        if (eachRow.Year === this.currentYear && Number(eachRow.Mon) > this.currentMonth) {
          this.selectedYearDataset.data.push(NaN);
          this.selectedYearAvgDataset.data.push(NaN);
        }
        else {
          this.selectedYearDataset.data.push(eachRow.count);
          this.selectedYearAvgDataset.data.push((countSelectedYear / this.months.length).toFixed(0));
        }
      }
      else {
        this.previousYearDataset.data.push(eachRow.count);
        this.previousYearAvgDataset.data.push((countPrevYear / this.months.length).toFixed(0));
      }
    });
    //console.log("this",this.selectedYearDataset);
  }

  /* returns currently selected year or current and previous year
   * note: see comments on if and else blocks */
  getYearFilterForResourceCount() {

    let currentYear: number;

    if (!this.selectedYear) {
      currentYear = this.maxYear;
    }
    else {
      currentYear = Number(this.selectedYear);
    }

    return [currentYear - 1, currentYear];
    // return currentYear === this.minYear ?
    //   // if selected year is the oldest available year
    //   [currentYear - 1, currentYear] :
    //   // if selected year is not the oldest one available
    //   [currentYear - 1, currentYear];
  }

  dataFetchErrorHandler(error) {
    this.spinner = false;
    this.toastrService.error("Error occured while getting Organizations data!");
  }

  getIdsFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray && objArray.length > 0 ? objArray.map(eachObj => eachObj.id) : [];
  }

  getItemNamesFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray && objArray.length > 0 ? objArray.map(eachObj => eachObj.itemName) : [];
  }

  setColumnDefs() {
    if (this.columnDefs === undefined && this.resourceCountData.length > 0) {

      this.columnDefs = Object.keys(this.resourceCountData[0])
        .map(eachColumnName => {
          const singleColumnDef = {
            field: eachColumnName,
            headerName: eachColumnName.toUpperCase(),
            sortable: true,
            filter: true
          }

          if (singleColumnDef.field.toUpperCase() === 'YEAR' || singleColumnDef.field.toUpperCase() === 'MONTH') {
            singleColumnDef['pinned'] = 'left';
          }

          if (singleColumnDef.field.toUpperCase() === 'MON') {
            singleColumnDef['hide'] = true;
          }

          return singleColumnDef;
        });

      if (this.columnDefs.length === 0) {
        // console.log('No resource count data available.');
      }
    }
  }

  tempGridRowData: any = [];

  /* even when multiple year's data is fetched, grid should only show currently selected year's data */
  setGridRowData() {
    if (!this.isCompareOn) {
      if (Number(this.selectedYear) === this.currentYear) {
        this.gridRowData = this.resourceCountData
          .filter(eachRow => eachRow.Year == this.selectedYear);
        this.gridRowData = this.gridRowData.filter(eachRow => Number(eachRow.Mon) <= this.currentMonth);
      }
      else {
        this.gridRowData = this.resourceCountData
          .filter(eachRow => eachRow.Year == this.selectedYear);
      }
    }
    else {
      if (Number(this.selectedYear) === this.currentYear) {
        this.gridRowData = this.resourceCountData.filter(eachRow => eachRow.Year != this.selectedYear);
        this.tempGridRowData = this.resourceCountData
          .filter(eachRow => eachRow.Year == this.selectedYear);
        this.gridRowData = this.gridRowData.concat(this.tempGridRowData.filter(eachRow => Number(eachRow.Mon) <= this.currentMonth));
        // console.log(this.tempGridRowData);
        // console.log(this.gridRowData);
      }
      else {
        this.gridRowData = this.resourceCountData;
      }
    }
  }

  onRefresh() {
    this.maxYear = moment().year();
    this.minYear = this.maxYear - 1;
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
      this.getPracticeData(this.selectedOrgs);
    } else if (this.lastChanedDd === 'pract') {
      this.getSubPracticeData(this.selectedOrgs, this.selectedPractices);
    } else if (this.lastChanedDd === 'subpract') {
      this.getEmployeesData(this.selectedOrgs, this.selectedPractices, this.selectedSubPractices);
    } else if (this.lastChanedDd === 'employee') {
      this.getResourceCount(this.selectedOrgs, this.selectedPractices,
        this.selectedSubPractices, this.selectedEmployees);
    }
  }

  // onExportToExcel() {
  //   const downloadDetails = this.gridRowData;
  //   const fileName = 'my_resources_';
  //   this.exportFileService.exportAsExcelFile(downloadDetails, fileName)
  // }

  yearData: any = [];
  excelData: any = [];
  excelDataForTemp: any = [];
  excelDataForTemp2: any = [];

  onExportToExcel() {
    const fileName = 'my_resources_';
    this.yearData = [];
    this.yearData.push(this.selectedYear);
    if (!this.isCompareOn) {
      this.chartDataFilterPayload = {
        'years': this.yearData,
        'org': this.getItemNamesFromFilterData(this.selectedOrgs),
        'practice': this.getItemNamesFromFilterData(this.selectedPractices),
        'subPractice': this.getItemNamesFromFilterData(this.selectedSubPractices),
        'employee': this.getIdsFromFilterData(this.selectedEmployees),
      }
    }
    else {
      this.chartDataFilterPayload = {
        'years': this.getYearFilterForResourceCount(),
        'org': this.getItemNamesFromFilterData(this.selectedOrgs),
        'practice': this.getItemNamesFromFilterData(this.selectedPractices),
        'subPractice': this.getItemNamesFromFilterData(this.selectedSubPractices),
        'employee': this.getIdsFromFilterData(this.selectedEmployees),
      }
    }

    this.spinner = true;
    this.resourceUtilizationService
      .getExcelDataForMyResources(this.chartDataFilterPayload)
      .subscribe(
        (response) => {
          this.excelData = response.Resources;
          if (Number(this.selectedYear) === this.currentYear) {
            // console.log(Number(this.selectedYear));
            if (!this.isCompareOn) {
              this.excelData = this.excelData.filter(eachRow => Number(eachRow.Mon) <= this.currentMonth)
            }
            else {
              this.excelDataForTemp2 = this.excelData.filter(eachRow => eachRow.Year != this.selectedYear);
              this.excelDataForTemp = this.excelData.filter(eachRow => eachRow.Year == this.selectedYear);
              this.excelDataForTemp = this.excelDataForTemp.filter(eachRow => Number(eachRow.Mon) <= this.currentMonth)
              this.excelData = this.excelDataForTemp2.concat(this.excelDataForTemp);
            }
          }
          // console.log("month", this.excelData);
          if (this.excelData && this.excelData.length > 0) {

            // month number column(Mon) is not exported because month short name column is enough
            this.exportFileService.exportAsExcelFile(
              this.excelData.map(({Mon, ...otherColumns}) => otherColumns), fileName
            );
          } else {
            this.toastrService.error("Oops! No data to export to excel");
          }
          this.spinner = false;
        },
        error => {
          this.spinner = false;
          this.toastrService.error("Unable to retrieve data for exporting to Excel Sheet!");
        }
      );
  }

  setFilter() {
    const obj = {
      "org": this.selectedOrgs,
      "orgData": this.orgData,
      "practice": this.selectedPractices,
      "practiceData": this.practiceData,
      "subPractice": this.selectedSubPractices,
      "subPracticeData": this.subPracticeData,
      "employee": this.selectedEmployees,
      "employeeData": this.employeesData,
      "project": this.selectedProjects,
      "projectData": this.projectsData,
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
  count: number;
  Mon: string;
}
