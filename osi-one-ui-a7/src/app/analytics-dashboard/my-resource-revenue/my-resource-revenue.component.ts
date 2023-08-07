import {Component, OnInit, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { GridOptions } from "ag-grid-community";
import { ToastrService } from 'ngx-toastr';
import { GridService } from '../../dashboard-grid/grid.service';

const MONTHS_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const BAR_COLORS = {

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
};

const LINE_COLORS = {
  previous: ['#66FF00', '#f48a6e', '#e0b1cb'],
  current: ['#FF8000', '#e5575f', '#5e548e']
};

@Component({
  selector: 'app-my-resource-revenue',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './my-resource-revenue.component.html',
  styleUrls: ['./my-resource-revenue.component.css']
})
export class MyResourceRevenueComponent implements OnInit {

  @Output() isPageLoaded = new EventEmitter<boolean>();
  dropdownSettings = {};
  spinner: boolean = false;
  compare: boolean = false;
  flag: boolean = true;

  org: any = [];
  employee: any = [];
  client: any = [];
  project: any = [];
  practice: any = [];
  subPractice: any = [];

  columnDefs: any;
  gridOptions = <GridOptions>{};
  paginationPageSize = 10;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef = { resizable: true };

  orgData: any = [];
  clientData: any = [];
  projectData: any = [];
  practiceData: any = [];
  subPracticeData: any = [];
  employeeData: any = [];

  myResourceRevenueData: any[] = [];
  months: any = [{ 'id': 1, 'value': 'Jan' }, { 'id': 2, 'value': 'Feb' }, { 'id': 3, 'value': 'Mar' }, { 'id': 4, 'value': 'Apr' }, { 'id': 5, 'value': 'May' }, { 'id': 6, 'value': 'Jun' }, { 'id': 7, 'value': 'Jul' }, { 'id': 8, 'value': 'Aug' }, { 'id': 9, 'value': 'Sept' }, { 'id': 10, 'value': 'Oct' }, { 'id': 11, 'value': 'Nov' }, { 'id': 12, 'value': 'Dec' }];
  orgYearData: any[] = [{ 'key': (new Date().getFullYear() - 2).toString() }, { 'key': (new Date().getFullYear() - 1).toString() }, { 'key': new Date().getFullYear().toString() }];
  orgProject: any[] = [];
  orgMaxYear = moment().year();
  orgMinYear = moment().year() - 1;
  isGrid: boolean = false;
  lastChanedDd = '';

  // contains current data shown by grid
  gridRowData: any[];

  // contains all grid rows(selected and previous)
  allGridRowsData: any[];

  myResourceRevenueChart: any;
  myResourceRevenueChartOptions: any = {
    type: 'bar',

    data: {
      labels: MONTHS_SHORT_NAMES
    },

    options: {

      animation: {
        duration: 0,
      },

      responsive: true,
      maintainAspectRatio: false,

      tooltips: {
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {

            if (!data) {
              return false;
            }
            else if (data.datasets[tooltipItem.datasetIndex].yAxisID === 'line') {
              return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
                tooltipItem.yLabel.toString() + '%';
            }

            return data.datasets[tooltipItem.datasetIndex].label + ' : ' + '$ ' +
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
          gridLines: {
            display: false,
            drawOnChartArea: false,
            color: 'none'
          },
        }],

        yAxes: [
          // settings for line y axis
          {
            id: 'line',
            position: 'right',
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              callback: value => `${value}%`
            }
          },
          // settings for bar y axis
          {
            id: 'bar',
            position: 'left',
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              min: 1,
              callback: value => {

                var ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'K' }
                ];

                function formatNumber(n) {
                  for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n.toFixed(2);
                }
                return '$' + formatNumber(value);
              }
            }
          }
        ],
      },

      scaleLabel: {
        display: true,
        labelString: 'Revenue',
        fontSize: 20
      },
    }
  };


  // these will contain data for Cost, Revenue and Margin of
  // selected and selected - 1 years
  selectedYearDatasets: any[];
  previousYearDatasets: any[];

  /* resource revenue data downloaded for chart will be transformed
   * and stored in this. the format would be
   * {
   *    '2019': { year: '2019', cost: [], revenue: [], margin: [] }
   *    '2020': { year: '2020', cost: [], revenue: [], margin: [] }
   * }
   * each array cost or revenue will be an array of length 12(months)
   *
   * Note: margin will be in percentages
   * */
  hierarchicalRevenueData: any;

  @ViewChild('compareToggle')
  compareToggleRef: ElementRef;

  @ViewChild('gridToggle')
  gridToggleRef: ElementRef;

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private gridService: GridService,
    private downloadFile: ExportFileService,
    private toasterService: ToastrService
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
    this.setPreservedFilter();
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      this.spinner = false;
      const filter = res && res.filters ? JSON.parse(res.filters) : null;
      if (filter) {
        this.employee = filter && Object.keys(filter).length > 0 ? filter.employees : this.employee;
        this.employeeData = filter && Object.keys(filter).length > 0 ? filter.employeeData : this.employeeData;
        this.org = filter && Object.keys(filter).length > 0 ? filter.org : this.org;
        this.orgData = filter && Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.project = filter && Object.keys(filter).length > 0 ? filter.project : this.project;
        this.projectData = filter && Object.keys(filter).length > 0 ? filter.projectData : this.projectData;
        this.practice = filter && Object.keys(filter).length > 0 ? filter.pract : this.practice;
        this.practiceData = filter && Object.keys(filter).length > 0 ? filter.practiceData : this.practiceData;
        this.subPractice = filter && Object.keys(filter).length > 0 ? filter.subPract : this.subPractice;
        this.subPracticeData = filter && Object.keys(filter).length > 0 ? filter.subPracticeData : this.subPracticeData;
        this.orgMinYear = filter && Object.keys(filter).length > 0 ? filter.orgMinYear : this.orgMinYear;
        this.orgMaxYear = filter && Object.keys(filter).length > 0 ? filter.orgMaxYear : this.orgMaxYear;
        this.compare = filter && Object.keys(filter).length > 0 ? filter.compare : this.compare;
        this.isGrid = filter && Object.keys(filter).length > 0 ? filter.isGrid : this.isGrid;

        this.getMyResourceRevenueData(this.getNames(this.employee), this.getNames(this.org),this.getNames(this.project),
          this.getNames(this.practice),this.getNames(this.subPractice), this.orgMinYear, this.orgMaxYear);

        if (this.isGrid) {
          this.gridToggleRef.nativeElement.classList.add('active');
        }
        if (this.compare) {
          this.compareToggleRef.nativeElement.classList.add('active');
        }
      } else {
        this.getOrganizationData()
      }

    }, (errorResponse) => {
      this.spinner = false;
      this.getOrganizationData();
    });
  }


  getOrganizationData() {
    this.spinner = true;
    this.resource.getResourceOrganizations().subscribe((response) => {
      this.spinner = false;

      this.org = this.orgData = response.Orgs;
      this.getPracticeData(response.Orgs);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error occurred while getting organization filters data!');
    });
  }

  getPracticeData(org: any) {
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : []
    }
    this.spinner = true;
    this.resource.getPracticeByProjectID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.practice = this.practiceData = response.Practices;
      this.getSubPracticeData(org, response.Practices);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error occurred while getting practice filters data!');
    });
  }

  getSubPracticeData(org: any, pract: any) {
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : [],
      "practice": pract ? pract.map((item: any) => item.itemName) : []
    }
    this.spinner = true;
    this.resource.getSubPracticeByProjectID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.subPractice = this.subPracticeData = response.SubPractices;
      this.getEmployeesByProjectID(org, pract, response.SubPractices);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error occurred while getting filters data!');
    });
  }

  getEmployeesByProjectID(org: any, pract: any, subPract: any) {
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : [],
      "prac": pract ? pract.map((item: any) => item.itemName) : [],
      "subPrac": subPract ? subPract.map((item: any) => item.itemName) : []
    }
    this.spinner = true;
    this.resource.getEmployeesByProjectID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.employee = this.employeeData = response.Employees;
      this.getProjectData(response.Employees);

    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting filters data!');
    });
  }

  getProjectData(emp: any) {
    const payLoad = {
      "empId": emp ? emp.map((item: any) => item.id) : []
    }
    this.spinner = true;
    this.resource.getProjectsByCustID(payLoad).subscribe((response) => {
      this.spinner = false;

      this.project = this.projectData = response.Projects;
      this.getMyResourceRevenueData(this.pushToArray(this.employee), this.getNames(this.org), this.pushToArray(this.orgProject),
        this.pushToArray(this.practice), this.pushToArray(this.subPractice), this.orgMinYear, this.orgMaxYear);

    }, () => {
      this.spinner = false;
      this.toasterService.error('Error occurred while getting project filters data!');
    });
  }

  /* this retrieves the data required for chart/grid using all selected filters */
  getMyResourceRevenueData(employees: any, org: any, project: any, pract: any, subPract: any, minYear: any, maxYear: any) {
    this.spinner = true;

    const payload = {
      org: this.getNames(this.org),
      years: [this.orgMinYear, this.orgMaxYear],
      practice: this.getNames(this.practice),
      subPractice: this.getNames(this.subPractice),
      employee: this.getIds(this.employee),
      project: this.getIds(this.project)
    };

    this.resource
      .getMyResourceRevenue(payload)
      .subscribe(
        response => {
          this.spinner = false;
          this.myResourceRevenueData = response.Revenue;
          this.removeCurrentMonthData();
          this.addMarginToRevenueData();
          this.populateAllGridRowData();
          this.transformTabularDataToHierarchical();
          this.setColumnDefs();
          this.setGridRowData();
          this.isGrid ? this.populateGrid() : this.drawChart();
        },
        error => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting resource revenue data!');
        }
      );
  }

  removeCurrentMonthData() {
    const currentYear = moment().year();
    const currentMonth = moment().format('MMM'); // month short name like 'Mar'
    this.myResourceRevenueData = this.myResourceRevenueData
      .filter(eachRow => !(eachRow.Year === currentYear && eachRow.Month === currentMonth))
  }

  addMarginToRevenueData() {
    this.myResourceRevenueData
      .forEach(eachRow => {
        eachRow.Margin = ((eachRow.Revenue - eachRow.Cost) * 100 / eachRow.Revenue).toFixed();

        if (eachRow.Margin === -Infinity || eachRow.Margin === Infinity) {
          eachRow.Margin = 0;
        }

      });
  }

  /* basically this creates a copy of the downloaded chart data
   * but adds % to end of all margin values to show in grid */
  populateAllGridRowData() {
    let copiedObject;
    this.allGridRowsData = this.myResourceRevenueData
      .map(eachRow => {
        copiedObject = Object.assign({}, eachRow);
        copiedObject.Margin = `${copiedObject.Margin}%`;
        return copiedObject;
      });
  }

  setColumnDefs() {
    if (this.columnDefs === undefined && this.myResourceRevenueData.length > 0) {

      this.columnDefs = Object.keys(this.myResourceRevenueData[0])
        .map(eachColumnName => {
          const singleColumnDef = {
            field: eachColumnName,
            headerName: eachColumnName.toUpperCase(),
            sortable: true,
            filter: true
          }

          if ( singleColumnDef.field.toUpperCase() === 'YEAR'
            || singleColumnDef.field.toUpperCase() === 'MONTH'
          ) {
            singleColumnDef['pinned'] = 'left';
          }

          if (singleColumnDef.field.toUpperCase() === 'MON') {
            singleColumnDef['hide'] = true;
          }

          return singleColumnDef;
        });

      if (this.columnDefs.length === 0) {
        console.log('No resource revenue data available.');
      }
    }
  }

  /* if compare is on, both years data will be shown
   * else only selected year's data will be shown */
  setGridRowData() {
    if (this.compare) {
      this.gridRowData = this.allGridRowsData;
    }
    else {
      // == is intentional in filter because this.selectedYear is string
      // and eachRow.year might be a number
      this.gridRowData = this.allGridRowsData
        .filter(eachRow => eachRow.Year == this.orgMaxYear);
    }
  }

  /* this method transforms the tabular data received from server to a hierarchical format
   * this makes it easy to pass data to new Chart() */
  transformTabularDataToHierarchical() {
    const selectedYear = Number(this.orgMaxYear);
    let costSelectedYear = 0;
    let costPrevYear = 0;
    let revSelectedYear = 0;
    let revPrevYear = 0;
    let noOfMonthSelYear = 0;
    let noOfMonthPrevYear = 0;
    this.myResourceRevenueData.forEach((item: any) => {
      if (item.Year === selectedYear) {
        costSelectedYear += item.Cost;
        revSelectedYear += item.Revenue
        noOfMonthSelYear = Number(item.Mon);
      } else {
        costPrevYear += item.Cost;
        revPrevYear += item.Revenue
        noOfMonthPrevYear = Number(item.Mon);
      }
    });

    const years = [Number(this.orgMaxYear) - 1, Number(this.orgMaxYear)];
    this.hierarchicalRevenueData = {};

    let eachYearData = null;
    for (const eachYear of years) {

      eachYearData = {
        Year: eachYear,
        Cost: [],
        Revenue: [],
        Margin: [],
        AvgCost: [],
        AvgRevenue: []
      };


      let monthIdx;
      for (const eachRow of this.myResourceRevenueData) {
        if (eachRow.Year == eachYear) {
          // here we are getting the org array using current row's org
          // setting the revenue at the month's index
          // Below we are doing Number() - 1 because months start at 1 but array index start at 0
          monthIdx = Number(eachRow.Mon) - 1;
          eachYearData.Cost[monthIdx] = eachRow.Cost;
          eachYearData.Revenue[monthIdx] = eachRow.Revenue;
          eachYearData.Margin[monthIdx] = eachRow.Margin;
          eachYearData.AvgCost[monthIdx] = eachYear === this.orgMaxYear ? costSelectedYear/noOfMonthSelYear : costPrevYear/noOfMonthPrevYear;
          eachYearData.AvgRevenue[monthIdx] = eachYear === this.orgMaxYear ? revSelectedYear/noOfMonthSelYear : revPrevYear/noOfMonthPrevYear;
        }
      }

      this.hierarchicalRevenueData[eachYear] = eachYearData;
    }
  }

  populateGrid() {
    this.gridOptions.api.sizeColumnsToFit();
    this.isPageLoaded.emit(true);
  }

  drawChart() {

    if (this.myResourceRevenueChart) {
      this.myResourceRevenueChart.destroy();
    }

    this.populateMyResourcesChartDatasets();
    this.setDatasetsInChartOptions();
    this.setFilters();
    this.myResourceRevenueChart = new Chart(
      "myResourceRevenueChart", this.myResourceRevenueChartOptions
    );

    this.isPageLoaded.emit(true);
  }

  /* populates the current and previous year datasets
   * each dataset created in this method will be in a format that can
   * be placed in Chart options */
  populateMyResourcesChartDatasets() {

    // populating selected and previous year datasets
    this.selectedYearDatasets = [];
    this.populateSingleYearChartDatasets(
      this.orgMaxYear, this.selectedYearDatasets,
      BAR_COLORS.current, LINE_COLORS.current
    );

    this.previousYearDatasets = [];
    this.populateSingleYearChartDatasets(
      Number(this.orgMaxYear) - 1, this.previousYearDatasets,
      BAR_COLORS.previous, LINE_COLORS.previous
    );
  }

  populateSingleYearChartDatasets(
    year: number | string, datasetArray: any[],
    barColors: string[], lineColors: string[]
  ) {
    const theDatasets: any[] = [
      { key: 'Cost', type: 'bar', yAxisId: 'bar', backgroundColor: barColors[1], order: 2 },
      { key: 'Revenue', type: 'bar', yAxisId: 'bar', backgroundColor: barColors[0], order: 2 },
      {
        key: 'Margin', type: 'line', yAxisId: 'line', fill: false,
        backgroundColor: lineColors[0], order: 1, pointHitRadius: 5,
      },
      {
        key: 'AvgCost', type: 'line', yAxisId: 'bar', fill: false,
        backgroundColor: lineColors[1], order: 1, pointHitRadius: 5,
      },
      {
        key: 'AvgRevenue', type: 'line', yAxisId: 'bar', fill: false,
        backgroundColor: lineColors[2], order: 1, pointHitRadius: 5,
      }
    ];

    let singleDataset: any;
    theDatasets.forEach(each => {
      singleDataset = {};

      if (each.type === 'line') {
        singleDataset.fill = each.fill ? each.fill : false;
        singleDataset.borderColor = each.backgroundColor;
      }

      singleDataset.type = each.type;
      singleDataset.order = each.order;
      singleDataset.data = this.hierarchicalRevenueData[year][each.key];
      singleDataset.label = `${year} ${each.key}`;
      singleDataset.yAxisID = each.yAxisId;
      singleDataset.backgroundColor = each.backgroundColor;
      datasetArray.push(singleDataset);
    });
  }

  setDatasetsInChartOptions() {
    // setting datasets into chart options
    if (this.compare) {
      this.myResourceRevenueChartOptions
        .data.datasets = this.previousYearDatasets.concat(this.selectedYearDatasets);
    }
    else {
      this.myResourceRevenueChartOptions.data.datasets = this.selectedYearDatasets;
    }
  }

  onSelectDeselectAll(item: any, selectModelName: any) {
    this[selectModelName] = item;
  }

  onClose(event: any): void {
    let { target } = event;
    let count = 5;
    let eleFound = '';
    while(target.parentElement && (target.parentElement.nodeName.toLowerCase() != 'body' || target.parentElement.id != 'modal-container') && count > 0) {
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
      this.getPracticeData(this.org);
    } else if (this.lastChanedDd === 'practice') {
      this.getSubPracticeData(this.org, this.practice)
    } else if (this.lastChanedDd === 'subpractice') {
      this.getEmployeesByProjectID(this.org, this.practice, this.subPractice)
    } else if (this.lastChanedDd === 'employee') {
      this.getProjectData(this.employee)
    } else if (this.lastChanedDd === 'project') {
      this.getMyResourceRevenueData(this.pushToArray(this.employee), this.getNames(this.org), this.pushToArray(this.project),
        this.pushToArray(this.practice), this.pushToArray(this.subPractice), this.orgMinYear, this.orgMaxYear);
    }
  }

  pushToArray(data: any[]) {
    let returnArray = [];
    data.forEach((item: any) => {
      returnArray.push(item.itemName);
    });
    return returnArray;
  }

  onYearChange() {
    this.orgMaxYear = Number([this.orgMaxYear]);
    this.orgMinYear = Number([this.orgMaxYear]) - 1;

    this.getMyResourceRevenueData(this.pushToArray(this.employee), this.getNames(this.org), this.pushToArray(this.project),
      this.pushToArray(this.practice), this.pushToArray(this.subPractice), this.orgMinYear, this.orgMaxYear);
  }

  onCompareToggle(event: any) {
    this.compare = !this.compare;
    this.setFilters();
    this.drawChart();

    this.setGridRowData();
  }

  onGridToggle(event: any): any {
    this.isGrid = !this.isGrid;

    if (!this.isGrid) {
      this.drawChart();
    }
    else {
      this.populateGrid();
    }

    this.isPageLoaded.emit(true);
    this.setFilters();
  }

  // onExportExcel() {
  //   const file_name = 'my_resource_revenue_';
  //   const payLoad = {
  //     "columns": ["year", "month", "employee", "employee_monthly_cost", "project_revenue", "emp_organization", "emp_practice", "emp_sub_practice", "project"],
  //     "filters": {
  //       "year": [this.orgMinYear, this.orgMaxYear],
  //       "emp_organization": this.org ? this.org.map((item: any) => item.itemName) : [],
  //       "prj_practice": this.practice ? this.practice.map((item: any) => item.itemName) : [],
  //       "prj_sub_practice": this.subPractice ? this.subPractice.map((item: any) => item.itemName) : [],
  //       "employee": this.employee ? this.employee.map((item: any) => item.itemName) : [],
  //       "project": this.project ? this.project.map((item: any) => item.itemName) : []
  //     }
  //   }
  //   this.spinner = true;
  //   this.resource.getExportToExcelData(payLoad).subscribe((response) => {
  //     this.downloadFile.exportAsExcelFile(response.Records, file_name);
  //     this.spinner = false;
  //   }, (errorResponse) => {
  //     this.spinner = false;
  //     this.toasterService.error("Error occurred while getting export excel data!");
  //   });
  // }

  onExportExcel() {
    const file_name = 'my_resource_revenue_';
    const payLoad = {
      org: this.getNames(this.org),
      years: this.compare ? [this.orgMinYear, this.orgMaxYear] : [this.orgMaxYear],
      practice: this.getNames(this.practice),
      subPractice: this.getNames(this.subPractice),
      employee: this.getIds(this.employee),
      project: this.getIds(this.project)
    };

    this.spinner = true;
    this.resource
      .getExcelDataForMyResourceRevenue(payLoad)
      .subscribe((response) => {
        this.spinner = false;
        this.downloadFile.exportAsExcelFile(
          // month number column(Mon) is not required as month short name is enough
          response.Revenue.map(({Mon, ...otherColumns}) => otherColumns), file_name
        );
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error("Error occurred while getting export excel data!");
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  refresh() {
    this.orgMaxYear = moment().year();
    this.orgMinYear = moment().year() - 1;
    this.getOrganizationData();
  }

  getIds(data: any) {
    let projectID: any = [];
    data.forEach((item) => {
      projectID.push(item.id);
    });
    return projectID;
  }

  getNames(data: any) {
    let names: any = [];
    data.forEach((item) => {
      names.push(item.itemName);
    });
    return names;
  }

  setFilters(): any {
    const obj = {
      'employees': this.employee,
      'employeeData': this.employeeData,
      'org': this.org,
      'orgData': this.orgData,
      'project': this.project,
      'projectData': this.projectData,
      'pract': this.practice,
      'practiceData': this.practiceData,
      'subPract': this.subPractice,
      'subPracticeData': this.subPracticeData,
      'orgMinYear': this.orgMinYear,
      'orgMaxYear': this.orgMaxYear,
      'compare': this.compare,
      'isGrid': this.isGrid

    }
    this.gridService.setFilters(obj);
  }
}
