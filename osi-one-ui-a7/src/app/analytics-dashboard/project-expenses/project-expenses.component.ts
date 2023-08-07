import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-project-expenses',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './project-expenses.component.html',
  styleUrls: ['./project-expenses.component.css']
})
export class ProjectExpensesComponent implements OnInit {

  @Output() isPageLoaded = new EventEmitter<boolean>();
  dropdownSettings = {};
  spinner: boolean = false;
  compare: boolean = false;
  flag: boolean = true;

  columnDefs: any;
  gridOptions = <GridOptions>{};
  paginationPageSize = 10;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef = { resizable: true };

  org: DropdownFilterDataModel[];
  client: DropdownFilterDataModel[];
  project: DropdownFilterDataModel[];
  region: DropdownFilterDataModel[];
  practice: DropdownFilterDataModel[];
  subPractices: DropdownFilterDataModel[];

  orgData: DropdownFilterDataModel[];
  clientData: DropdownFilterDataModel[];
  projectData: DropdownFilterDataModel[];
  regionData: DropdownFilterDataModel[];
  practiceData: DropdownFilterDataModel[];
  subPracticeData: DropdownFilterDataModel[];

  projectExpensesData: any[] = [];
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

  projectExpensesChart: any;
  projectExpensesChartOptions: any = {
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
          // {
          //   id: 'line',
          //   position: 'right',
          //   gridLines: {
          //     display: false,
          //   },
          //   ticks: {
          //     beginAtZero: true,
          //     callback: value => `${value}%`
          //   }
          // },
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
        labelString: 'Expenses',
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
  hierarchicalExpensesData: any;

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
        this.org = Object.keys(filter).length > 0 ? filter.org : this.org;
        this.orgData = Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.region = Object.keys(filter).length > 0 ? filter.region : this.region;
        this.regionData = Object.keys(filter).length > 0 ? filter.regionData : this.regionData;
        this.practice = Object.keys(filter).length > 0 ? filter.practice : this.practice;
        this.practiceData = Object.keys(filter).length > 0 ? filter.practiceData : this.practiceData;
        this.subPractices = Object.keys(filter).length > 0 ? filter.subPractice : this.subPractices;
        this.subPracticeData = Object.keys(filter).length > 0 ? filter.subPracticeData : this.subPracticeData;
        this.client = Object.keys(filter).length > 0 ? filter.client : this.client;
        this.clientData = Object.keys(filter).length > 0 ? filter.clientData : this.clientData;
        this.project = Object.keys(filter).length > 0 ? filter.project : this.project;
        this.projectData = Object.keys(filter).length > 0 ? filter.projectData : this.projectData;
        this.orgMinYear = Object.keys(filter).length > 0 ? filter.orgMinYear : this.orgMinYear;
        this.orgMaxYear = Object.keys(filter).length > 0 ? filter.orgMaxYear : this.orgMaxYear;
        this.compare = Object.keys(filter).length > 0 ? filter.compare : this.compare;
        this.isGrid = Object.keys(filter).length > 0 ? filter.isGrid : this.isGrid;

        if (this.compare) {
          document.getElementById('toggle').classList.add('active');
        }
        if (this.isGrid) {
          document.getElementById('toggleGrid').classList.add('active');
        }

        this.getProjectExpensesData(this.org, this.region, this.practice, this.subPractices, this.client, this.project);
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
    this.resource.getProjectOrganizations().subscribe((response) => {
      this.spinner = false;

      this.org = this.orgData = response.Orgs;
      this.getRegionData(response.Orgs);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting organization data!');
    })
  }

  getRegionData(org: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : []
    }
    this.resource.getRegionDataForProjects(payLoad).subscribe((response) => {
      this.spinner = false;

      this.region = this.regionData = response.Regions;
      this.getPracticeData(org, response.Regions);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting region data!');
    });
  }

  getPracticeData(org: any, region: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : [],
      "region": region ? region.map((item: any) => item.itemName) : []
    }
    this.resource.getPracticesDataFromProjects(payLoad).subscribe((response) => {
      this.spinner = false;

      this.practice = this.practiceData = response.Practices;
      this.getSubPracticeData(org, region, response.Practices);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting practice data!');
    });
  }

  getSubPracticeData(org: any, region: any, practice: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "prac": practice ? practice.map((item: any) => item.itemName) : []
    }
    this.resource.getSubPracticesDataFromProjects(payLoad).subscribe((response) => {
      this.spinner = false;

      this.subPractices = this.subPracticeData = response.SubPractices;
      this.getClientData(org, region, practice, response.SubPractices);

    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting sub-pracices data!');
    });
  }

  getClientData(org: any, region: any, practice: any, subPractice: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "prac": practice ? practice.map((item: any) => item.itemName) : [],
      "subPrac": subPractice ? subPractice.map((item: any) => item.itemName) : []
    }
    this.resource.getClientDataFromProjects(payLoad).subscribe((response) => {
      this.spinner = false;
      this.client = this.clientData = response.Clients;
      this.getProjectData(org, region, practice, subPractice, response.Clients);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting clients data!');
    });
  }

  getProjectData(org: any, region: any, practice: any, subPractice: any, client: any) {
    this.spinner = true;
    const payLoad = {
      "orgId": org ? org.map((item: any) => item.id) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "prac": practice ? practice.map((item: any) => item.itemName) : [],
      "subPrac": subPractice ? subPractice.map((item: any) => item.itemName) : [],
      "custId": client ? client.map((item: any) => item.id) : []
    }
    this.resource.getProjectDataFromProjects(payLoad).subscribe((response) => {
      this.spinner = false;
      this.project = this.projectData = response.Projects;
      this.getProjectExpensesData(org, region, practice, subPractice, client, response.Projects);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting projects data!');
    });
  }

  /* this retrieves the data required for chart/grid using all selected filters */
  getProjectExpensesData(org: any, region: any, practice: any, subPractice: any, client: any, project: any) {
    this.spinner = true;

    const payLoad = {
      "years": [this.orgMinYear, this.orgMaxYear],
      "org": org ? org.map((item: any) => item.itemName) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "practice": practice ? practice.map((item: any) => item.itemName) : [],
      "subPractice": subPractice ? subPractice.map((item: any) => item.itemName) : [],
      "client": client ? client.map((item: any) => item.id) : [],
      "project": project ? project.map((item: any) => item.id) : []
    }

    this.resource
      .getProjectExpenses(payLoad)
      .subscribe(
        response => {
          this.spinner = false;
          this.projectExpensesData = response.Expenses;
          this.removeCurrentMonthData();
          // this.addMarginToRevenueData();
          this.populateAllGridRowData();
          this.transformTabularDataToHierarchical();
          this.setColumnDefs();
          this.setGridRowData();
          this.isGrid ? this.populateGrid() : this.drawChart();
        },
        error => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting resource expenses data!');
        }
      );
  }

  removeCurrentMonthData() {
    const currentYear = moment().year();
    const currentMonth = moment().format('MMM'); // month short name like 'Mar'
    const currentMonthNum = moment().month(); // month short name like '3'
    this.projectExpensesData = this.projectExpensesData
      .filter(eachRow => !(eachRow.Year === currentYear && Number(eachRow.Mon) >= (currentMonthNum + 1)))
  }

  addMarginToRevenueData() {
    this.projectExpensesData
      .forEach(eachRow => {
        eachRow.Margin = ((eachRow.Billable_Expense - eachRow.Non_Billable_Expense) * 100 / eachRow.Billable_Expense).toFixed();

        if (eachRow.Margin === -Infinity || eachRow.Margin === Infinity) {
          eachRow.Margin = 0;
        }

      });
  }

  /* basically this creates a copy of the downloaded chart data
   * but adds % to end of all margin values to show in grid */
  populateAllGridRowData() {
    let copiedObject;
    this.allGridRowsData = this.projectExpensesData
    // .map(eachRow => {
    //   copiedObject = Object.assign({}, eachRow);
    //   copiedObject.Margin = `${copiedObject.Margin}%`;
    //   return copiedObject;
    // });
  }

  setColumnDefs() {
    if (this.columnDefs === undefined && this.projectExpensesData.length > 0) {

      this.columnDefs = Object.keys(this.projectExpensesData[0])
        .map(eachColumnName => {
          const singleColumnDef = {
            field: eachColumnName,
            headerName: eachColumnName.toUpperCase(),
            sortable: true,
            filter: true
          }

          if (singleColumnDef.field.toUpperCase() === 'YEAR'
            || singleColumnDef.field.toUpperCase() === 'MONTH'
          ) {
            singleColumnDef['pinned'] = 'left';
          }

          if (singleColumnDef.field.toUpperCase() == 'MON') {
            singleColumnDef['hide'] = true
          }

          return singleColumnDef;
        });

      if (this.columnDefs.length === 0) {
        console.log('No resource revenue data available.');
      }
    }
    console.log("COLUMN_DEF", this.columnDefs)
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
    let nonBillExpSelectedYear = 0;
    let nonBillExpPrevYear = 0;
    let billExpSelectedYear = 0;
    let billExpPrevYear = 0;
    let noOfMonthSelYear = 0;
    let noOfMonthPrevYear = 0;
    this.projectExpensesData.forEach((item: any) => {
      if (item.Year === selectedYear) {
        nonBillExpSelectedYear += item.Non_Billable_Expense;
        billExpSelectedYear += item.Billable_Expense
        noOfMonthSelYear = Number(item.Mon);
      } else {
        nonBillExpPrevYear += item.Non_Billable_Expense;
        billExpPrevYear += item.Billable_Expense
        noOfMonthPrevYear = Number(item.Mon);
      }
    });

    const years = [Number(this.orgMaxYear) - 1, Number(this.orgMaxYear)];
    this.hierarchicalExpensesData = {};

    let eachYearData = null;
    for (const eachYear of years) {

      eachYearData = {
        Year: eachYear,
        Non_Billable_Expense: [],
        Billable_Expense: [],
        // Margin: [],
        Avg_Non_Billable_Expense: [],
        Avg_Billable_Expense: []
      };


      let monthIdx;
      for (const eachRow of this.projectExpensesData) {
        if (eachRow.Year == eachYear) {
          // here we are getting the org array using current row's org
          // setting the Billable_Expense at the month's index
          // Below we are doing Number() - 1 because months start at 1 but array index start at 0
          monthIdx = Number(eachRow.Mon) - 1;
          eachYearData.Non_Billable_Expense[monthIdx] = eachRow.Non_Billable_Expense;
          eachYearData.Billable_Expense[monthIdx] = eachRow.Billable_Expense;
          // eachYearData.Margin[monthIdx] = eachRow.Margin;
          eachYearData.Avg_Non_Billable_Expense[monthIdx] = eachYear === this.orgMaxYear ? nonBillExpSelectedYear / noOfMonthSelYear : nonBillExpPrevYear / noOfMonthPrevYear;
          eachYearData.Avg_Billable_Expense[monthIdx] = eachYear === this.orgMaxYear ? billExpSelectedYear / noOfMonthSelYear : billExpPrevYear / noOfMonthPrevYear;
        }
      }

      this.hierarchicalExpensesData[eachYear] = eachYearData;
    }
  }

  populateGrid() {
    this.gridOptions.api.sizeColumnsToFit();
    this.isPageLoaded.emit(true);
  }

  drawChart() {

    if (this.projectExpensesChart) {
      this.projectExpensesChart.destroy();
    }

    this.populateMyResourcesChartDatasets();
    this.setDatasetsInChartOptions();
    this.setFilters();
    this.projectExpensesChart = new Chart(
      "projectExpensesChart", this.projectExpensesChartOptions
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
      { key: 'Billable_Expense', type: 'bar', yAxisId: 'bar', backgroundColor: barColors[0], order: 2 },
      { key: 'Non_Billable_Expense', type: 'bar', yAxisId: 'bar', backgroundColor: barColors[1], order: 2 },
      // {
      //   key: 'Margin', type: 'line', yAxisId: 'line', fill: false,
      //   backgroundColor: lineColors[0], order: 1, pointHitRadius: 5,
      // },
      {
        key: 'Avg_Non_Billable_Expense', type: 'line', yAxisId: 'bar', fill: false,
        backgroundColor: lineColors[1], order: 1, pointHitRadius: 5,
      },
      {
        key: 'Avg_Billable_Expense', type: 'line', yAxisId: 'bar', fill: false,
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
      singleDataset.data = this.hierarchicalExpensesData[year][each.key];
      singleDataset.label = `${year} ${each.key}`;
      singleDataset.yAxisID = each.yAxisId;
      singleDataset.backgroundColor = each.backgroundColor;
      datasetArray.push(singleDataset);
    });
  }

  setDatasetsInChartOptions() {
    // setting datasets into chart options
    if (this.compare) {
      this.projectExpensesChartOptions
        .data.datasets = this.previousYearDatasets.concat(this.selectedYearDatasets);
    }
    else {
      this.projectExpensesChartOptions.data.datasets = this.selectedYearDatasets;
    }
    console.log("ALL_DATASETS", this.projectExpensesChartOptions
      .data.datasets);
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
    switch (this.lastChanedDd) {
      case 'org':
        this.getRegionData(this.org);
        break;
      case 'region':
        this.getPracticeData(this.org, this.region);
        break;
      case 'practice':
        this.getSubPracticeData(this.org, this.region, this.practice);
        break;
      case 'subpractice':
        this.getClientData(this.org, this.region, this.practice, this.subPractices);
        break;
      case 'client':
        this.getProjectData(this.org, this.region, this.practice, this.subPractices, this.client);
        break;
      case 'project':
        this.getProjectExpensesData(this.org, this.region, this.practice, this.subPractices, this.client, this.project);
        break;
    }
  }

  onYearChange() {
    this.orgMaxYear = Number([this.orgMaxYear]);
    this.orgMinYear = Number([this.orgMaxYear]) - 1;
    this.getProjectExpensesData(this.org, this.region, this.practice, this.subPractices, this.client, this.project);
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

  onExportExcel() {
    const file_name = 'project_expenses_';
    const payLoad = {
      "years": [this.orgMinYear, this.orgMaxYear],
      "org": this.org ? this.org.map((item: any) => item.itemName) : [],
      "region": this.region ? this.region.map((item: any) => item.itemName) : [],
      "practice": this.practice ? this.practice.map((item: any) => item.itemName) : [],
      "subPractice": this.subPractices ? this.subPractices.map((item: any) => item.itemName) : [],
      "client": this.client ? this.client.map((item: any) => item.id) : [],
      "project": this.project ? this.project.map((item: any) => item.id) : []
    }

    this.spinner = true;
    this.resource
      .getExcelDataForProjectExpenses(payLoad)
      .subscribe((response) => {
        this.spinner = false;
        this.downloadFile.exportAsExcelFile(response.Expenses, file_name);
      }, (errorResponse) => {
        this.spinner = false;
        this.toasterService.error("Error occurred while getting export excel data!");
      });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  refresh() {
    this.orgMaxYear = moment().year();
    this.orgMinYear = moment().year() - 1;
    this.getOrganizationData();
  }

  getIds(data: any) {
    return data.map((item: any) => item.id);
  }

  getNames(data: any) {
    return data.map((item: any) => item.itemName);
  }

  setFilters(): any {
    const obj = {
      'org': this.org,
      'orgData': this.orgData,
      'region': this.region,
      'regionData': this.regionData,
      'practice': this.practice,
      'practiceData': this.practiceData,
      'subPractice': this.subPractices,
      'subPracticeData': this.subPracticeData,
      'client': this.client,
      'clientData': this.clientData,
      'project': this.project,
      'projectData': this.projectData,
      'orgMinYear': this.orgMinYear,
      'orgMaxYear': this.orgMaxYear,
      'compare': this.compare,
      'isGrid': this.isGrid
    }
    this.gridService.setFilters(obj);
  }
}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}
