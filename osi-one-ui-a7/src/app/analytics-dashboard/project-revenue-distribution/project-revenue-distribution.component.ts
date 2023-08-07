import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';
import { GridOptions } from "ag-grid-community";
import * as moment from 'moment'

const MONTHS_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const MONTHS_MAP = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};
const MONTHS_SHORT_NAME_OBJ: any = [{ "id": 1, "value": "Jan" }, { "id": 2, "value": "Feb" }, { "id": 3, "value": "Mar" },
{ "id": 4, "value": "Apr" }, { "id": 5, "value": "May" }, { "id": 6, "value": "Jun" },
{ "id": 7, "value": "Jul" }, { "id": 8, "value": "Aug" }, { "id": 9, "value": "Sep" },
{ "id": 10, "value": "Oct" }, { "id": 11, "value": "Nov" }, { "id": 12, "value": "Dec" }];

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
    '#F8171B', // burgundy bright
    '#A020F0', // purple bright
    '#FF0066', // broadwaypink bright
    '#006633', // starbucks dark
    '#003F87', // sign blue dark
    '#05B8CC', // cerulean bright
    '#FF8000', // orange dark
    '#993300', // chocolate dark
    '#FFFF00', // yello bright
    '#802A2A', // brown dark
    '#8B8878', // cornsilk4 dark
  ],

  // for year previous to selected year's bars
  previous: [
    '#FB7E81', // burgundy pale
    '#D9A5F9', // purple pale
    '#FF99C2', // broadwaypink pale
    '#66FFB2', // starbucks pale
    '#71B3FF', // sign blue pale
    '#8CF1FC', // cerulean pale
    '#FFCC99', // orange pale
    '#FFA477', // chocolate pale
    '#FFFF99', // yellow pale
    '#DF9D9D', // brown pale
    '#D0CFC9', // cornsilk4 pale
  ]
}

@Component({
  selector: 'app-project-revenue-distribution',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './project-revenue-distribution.component.html',
  styleUrls: ['./project-revenue-distribution.component.css']
})
export class ProjectRevenueDistributionComponent implements OnInit {

  @Output() isPageLoaded = new EventEmitter<boolean>();
  dropdownSettings = {};
  spinner: boolean = false;
  isGrid: boolean = false;

  columnDefs: any = [];
  gridOptions = <GridOptions>{};
  defaultColDef = { resizable: true };
  paginationPageSize = 10;
  gridApi: any;
  gridColumnApi: any;
  gridHeight: any = 0;

  org: any = [];
  client: any = [];
  project: any = [];
  region: any = [];
  practice: any = [];
  subPractices: any = [];

  orgData: DropdownFilterDataModel[];
  clientData: DropdownFilterDataModel[];
  projectData: DropdownFilterDataModel[];
  regionData: DropdownFilterDataModel[];
  practiceData: DropdownFilterDataModel[];
  subPracticeData: DropdownFilterDataModel[];

  orgStackedChart: Chart;
  orgYearData: any[] = [{ "key": (new Date().getFullYear() - 2).toString() }, { "key": (new Date().getFullYear() - 1).toString() }, { "key": new Date().getFullYear().toString() }];
  maxYear = moment().year();
  minYear = moment().year() - 1;

  typeOfChart: any = 'bar';
  projectRevenueDist: ProjectRevenueDistributionModel[];
  selectedYearData: any = [];
  previousYearData: any = [];
  dataset: any[];
  lastChanedDd = '';
  compare: boolean = false;

  constructor(private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private downloadFile: ExportFileService,
    private gridService: GridService,
    private toasterService: ToastrService) {
  }

  ngOnInit() {
    // this.setPreservedFilter();
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      idField: "id",
      textField: "itemName",
      itemsShowLimit: 1,
      classes: "myclass custom-class"
    };
    //this.getOrganizationData();
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
        this.minYear = Object.keys(filter).length > 0 ? filter.minYear : this.minYear;
        this.maxYear = Object.keys(filter).length > 0 ? filter.maxYear : this.maxYear;
        this.compare = Object.keys(filter).length > 0 ? filter.compare : this.compare;
        this.isGrid = Object.keys(filter).length > 0 ? filter.grid : this.isGrid;

        if (this.compare) {
          document.getElementById('toggle').classList.add('active');
        }
        if (this.isGrid) {
          document.getElementById('toggleGrid').classList.add('active');
        }
        this.getProjectRevenueDistributionData(this.org, this.region, this.practice, this.subPractices, this.client, this.project);
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
    }, (errorResponse) => {
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
    }, (errorResponse) => {
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
    }, (errorResponse) => {
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

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting sub practice data!');
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
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting client data!');
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
      this.getProjectRevenueDistributionData(org, region, practice, subPractice, client, response.Projects);
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting project data!');
    });
  }

  getProjectRevenueDistributionData(org: any, region: any, practice: any, subPractice: any, client: any, project: any) {
    this.spinner = true;
    const payLoad = {
      "years": [Number(this.maxYear), Number(this.maxYear) - 1],
      "org": org ? org.map((item: any) => item.itemName) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "practice": practice ? practice.map((item: any) => item.itemName) : [],
      "subPractice": subPractice ? subPractice.map((item: any) => item.itemName) : [],
      "client": client ? client.map((item: any) => item.id) : [],
      "project": project ? project.map((item: any) => item.id) : []
    }
    this.resource.getProjectRevenueDistribution(payLoad).subscribe((response) => {
      this.spinner = false;
      this.projectRevenueDist = response.Revenue;
      this.bindOrgProjData();
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting project revenue distribution data!');
    });
  }

  bindOrgProjData() {
    this.dataset = [];
    this.selectedYearData = [];
    this.previousYearData = [];
    this.projectRevenueDist.forEach((item: any) => {
      if (this.maxYear == item.Year) {
        this.selectedYearData.push(item);
      } else {
        this.previousYearData.push(item);
      }
    });

    this.selectedYearData = this.maxYear == this.currentYear ? this.selectedYearData.filter(item => this.getNumMonth(item.Month) < this.currentMonth) : this.selectedYearData;

    if (!this.compare) {
      const revenueDataset = this.selectedYearData.length > 0 ? this.createDataset(Number(this.maxYear), this.selectedYearData, COLOR_PALETTE.current, 'Revenue') : [];
      // const costDataset = this.selectedYearData.length > 0 ? this.createDataset(Number(this.maxYear), this.selectedYearData, COLOR_PALETTE.current, 'Cost') : [];
      this.dataset = revenueDataset;
    } else {
      const revenueDatasetPrev = this.selectedYearData.length > 0 ? this.createDataset(Number(this.maxYear) - 1, this.previousYearData, COLOR_PALETTE.previous, 'Revenue') : [];
      // const costDatasetPrev = this.selectedYearData.length > 0 ? this.createDataset(Number(this.maxYear) - 1, this.previousYearData, COLOR_PALETTE.current, 'Cost') : [];
      const revenueDatasetSel = this.selectedYearData.length > 0 ? this.createDataset(Number(this.maxYear), this.selectedYearData, COLOR_PALETTE.current, 'Revenue') : [];
      // const costDatasetSel = this.selectedYearData.length > 0 ? this.createDataset(Number(this.maxYear), this.selectedYearData, COLOR_PALETTE.current, 'Cost') : [];
      const dataset1 = revenueDatasetPrev;
      this.dataset = dataset1.concat(revenueDatasetSel);
    }
    if (this.isGrid) {
      this.createGrid();
    }
    else {
      this.createStackedChart();
    }
    this.setFilters();
  }

  getNumMonth(mon: string) {
    const month = MONTHS_SHORT_NAME_OBJ.filter((item: any) => {
      return mon === item.value;
    });
    return month[0].id;
  }

  createDataset(year: any, data: any, colorsArray: any[], stat: any) {
    let datasetArray: any = []
    const orgArr = this.pushToArrayByName(this.orgData);
    let singleDataset: any = {};
    orgArr.forEach((org: any, index: any) => {
      let orgArray: any = [];
      singleDataset = Object.assign({}, DATASET_FORMAT);
      // data.forEach((dataItem: any) => {
      //   if (dataItem.Org === org) {
      //     orgArray.push(dataItem[stat]);
      //   }
      // });
      singleDataset.data = this.getDatasetData(year, org, stat);
      singleDataset.label = `${year}-${org}-${stat}`;
      singleDataset.backgroundColor = colorsArray[index];
      datasetArray.push(singleDataset);
    });
    console.log(stat, datasetArray);
    return datasetArray;
  }

  getDatasetData(year: any, org: any, stat: any) {
    let arr: any = [];
    MONTHS_SHORT_NAME_OBJ.forEach((month: any) => {
      this.projectRevenueDist.forEach((dataItem: any) => {
        if (dataItem.Year === year && dataItem.Month === month.value && dataItem.Org === org) {
          arr.push(dataItem[stat]);
        };
      });
    });
    return arr;
  }

  pushToArrayByName(data: any[]) {
    return data && data.length > 0 ? data.map((item: any) => item.itemName) : [];
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
        this.getProjectRevenueDistributionData(this.org, this.region, this.practice, this.subPractices,
          this.client, this.project);
        break;
    }
  }

  updateHrsByResourceGrid() {
    this.getProjectRevenueDistributionData(this.org, this.region, this.practice, this.subPractices,
      this.client, this.project);
  }

  currentYear: any = new Date().getFullYear().toString();
  currentMonth: any = (new Date().getMonth() + 1).toString();
  bindOrgProjDatan() {
    this.isPageLoaded.emit(true);
  }

  toggle(event: any) {
    this.compare = event.target.classList.contains('active') ? false : true;
    this.bindOrgProjData();
  }

  toggleGrid(event: any): any {
    if (event.target.classList.contains('active')) {
      this.isGrid = false;
      this.createStackedChart();
    } else {
      this.isGrid = true;
      this.createGrid();
    }
    this.setFilters();
  }

  distributionForGrids: any = [];

  createGrid(): any {
    this.distributionForGrids = [];
    this.distributionForGrids = this.compare ? this.previousYearData.concat(this.selectedYearData) : this.selectedYearData;
    this.columnDefs = this.generateColumns(this.distributionForGrids);
    this.gridOptions.api.setRowData(this.distributionForGrids);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
    this.isPageLoaded.emit(true);
  }

  downloadDetailsInExel() {
    const file_name = 'project_revenue_distribution';
    const payLoad = {
      "columns": ["year",
      "month",
      "emp_organization",
      "emp_practice",
      "emp_sub_practice",
      "customer",
      "project",
      "prj_region",
      "project_cost",
      "project_revenue"],
      "sortByColumns": [
        "year",
        "month"
      ],
      "filters": {
        "year": this.compare ? [this.maxYear, this.maxYear - 1] : [this.maxYear],
        "prj_organization": this.org ? this.org.map((item: any) => item.itemName) : [],
        "prj_practice": this.practice ? this.practice.map((item: any) => item.itemName) : [],
        "prj_sub_practice": this.subPractices ? this.subPractices.map((item: any) => item.itemName) : [],
        "prj_region": this.region ? this.region.map((item: any) => item.itemName) : [],
        "customer": this.client ? this.client.map((item: any) => item.itemName) : [],
        "project": this.project ? this.project.map((item: any) => item.itemName) : []
      }
    }
    this.spinner = true;
    this.resource.getExportToExcelData(payLoad).subscribe((response) => {
      this.spinner = false;
      
      response.Records.map(eachRow => {
        eachRow.month = MONTHS_MAP[eachRow.month]
      });
      
      this.downloadFile.exportAsExcelFile(response.Records, file_name);
      
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error("Error occures while getting export excel data!");
    });
  }

  generateColumns(data: any[]) {
    let columnDefinitions = [];
    data.map(object => {
      Object.keys(object).map(key => {
        let mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          // width: 90,
          sortable: true,
          filter: true
        };
        if (key.toUpperCase() == 'YEAR' || key.toUpperCase() == 'MONTH') {
          mappedColumn['pinned'] = 'left'
          // mappedColumn['width'] = 150
        }
        if (key.toUpperCase() == 'MON') {
          mappedColumn['hide'] = true
        }
        columnDefinitions.push(mappedColumn);
      });
    });
    //Remove duplicate columns
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    );
    return columnDefinitions;
  }

  getRowHeight = function (params: any) {
    let lineCount = Math.floor(params.data.length / 32) + 1;
    let height = (12 * lineCount) + 24;
    return height;
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }

  refresh() {
    this.maxYear = moment().year();
    this.minYear = moment().year() - 1;
    this.getOrganizationData();
  }

  createStackedChart() {
    if (this.orgStackedChart) {
      this.orgStackedChart.destroy();
    }
    this.orgStackedChart = new Chart('OrgProjectRevenue', {
      type: this.typeOfChart,
      data: {
        labels: MONTHS_SHORT_NAMES,
        datasets: this.dataset,
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
            label: function (tooltipItem, data) {
              if (!data) {
                return false;
              }
              else if (data.datasets[tooltipItem.datasetIndex].yAxisID == 'line') {
                return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
                  tooltipItem.yLabel.toString() + "%";
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
            // stacked: true,
            gridLines: {
              display: false,
            }
          }],
          yAxes: [{
            id: 'bar',
            gridLines: { display: false },
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
          },
          // {
          //   id: 'line',
          //   gridLines: { display: false },
          //   position: 'right',
          //   // stacked: false,
          //   ticks: {
          //     beginAtZero: true,
          //   },
          //   scaleLabel: {
          //     display: true,
          //     labelString: '# of invoices',
          //     fontSize: 16,
          //     fontFamily: 'inherit'
          //   }
          // }
        ]
        },
        scaleLabel: {
          display: true,
          labelString: 'Revenue',
          fontSize: 20
        },
      }
    });
    this.isPageLoaded.emit(true);
  }

  setFilters() {
    const obj = {
      "org": this.org,
      "orgData": this.orgData,
      "region": this.region,
      "regionData": this.regionData,
      "practice": this.practice,
      "practiceData": this.practiceData,
      "subPractice": this.subPractices,
      "subPracticeData": this.subPracticeData,
      "client": this.client,
      "clientData": this.clientData,
      "project": this.project,
      "projectData": this.projectData,
      "minYear": this.minYear,
      "maxYear": this.maxYear,
      "compare": this.compare,
      "grid": this.isGrid
    }
    this.gridService.setFilters(obj);
  }
}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}

class ProjectRevenueDistributionModel {
  Month: string;
  Year: number;
  Org: string;
  Revenue: number;
  Cost: number;
  Margin: number;
}