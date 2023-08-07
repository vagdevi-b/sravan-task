import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';
import { GridOptions } from 'ag-grid';
import * as moment from 'moment'
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-org-proj-revenue',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './org-proj-revenue.component.html',
  styleUrls: ['./org-proj-revenue.component.css']
})
export class OrgProjRevenueComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  dropdownSettings = {};
  spinner: boolean = false;
  flag: boolean;
  compare: boolean = false;
  changeChart: boolean = true;

  columnDefs: any = [];
  gridOptions = <GridOptions>{};
  paginationPageSize = 10;
  gridApi: any;
  gridColumnApi: any;
  gridHeight: any = 0;

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

  organsizationProjectData: any[] = [];
  months: any = [{ "id": 1, "value": "Jan" }, { "id": 2, "value": "Feb" }, { "id": 3, "value": "Mar" }, { "id": 4, "value": "Apr" }, { "id": 5, "value": "May" }, { "id": 6, "value": "Jun" }, { "id": 7, "value": "Jul" }, { "id": 8, "value": "Aug" }, { "id": 9, "value": "Sept" }, { "id": 10, "value": "Oct" }, { "id": 11, "value": "Nov" }, { "id": 12, "value": "Dec" }];

  orgStackedChart: Chart;
  orgYearData: any[] = [{ "key": (new Date().getFullYear() - 2).toString() }, { "key": (new Date().getFullYear() - 1).toString() }, { "key": new Date().getFullYear().toString() }];
  orgMaxYear = moment().year();
  orgMinYear = moment().year() - 1;
  comparePnL: any = [];
  yaxeswc: any[] = [];
  monthMinBuckets: any[] = [];
  monthMaxBuckets: any[] = [];
  monthsForMinYear: any[] = [];
  monthsForMaxYear: any[] = [];
  revenueMinMonth: any[] = [];
  costMinMonth: any[] = [];
  revenueMaxMonth: any[] = [];
  costMaxMonth: any[] = [];

  stackChartYAxes: any = [
    {
      id: "bar-stack",
      gridLines: { display: false },
      stacked: false,
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
          }
          return '$' + formatNumber(value);
        }
      },
    },
    {
      id: "line",
      gridLines: { display: false },
      position: "right",
      stacked: false,
      ticks: {
        beginAtZero: true,
        callback: function (value) {
          return value + '%';
        }
      }
    }];

  stackChartMultiYAxes: any = [
    {
      id: "line",
      position: "right",
      stacked: false,
      ticks: {
        beginAtZero: true,
        callback: function (value) {
          return value + '%';
        }
      },
      gridLines: {
        drawOnChartArea: false,
        display: false,
      },
    },
    {
      id: "bar-stack",
      gridLines: { display: false },
      stacked: false,
      ticks: {
        beginAtZero: true, min: 1,
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
            return n.toFixed(2);
          }
          return '$' + formatNumber(value);
        }
      },
    }];

  typeOfChart: any = 'bar';
  projectRevenue: any = [];
  isGrid: boolean = false;
  lastChanedDd = '';

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
    this.setPreservedFilter();
    // this.getOrgProjectData();
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

        this.getOrgProjectData(this.pushToArrayByName(this.org), this.pushToArrayByName(this.region), this.pushToArrayByName(this.practice),
          this.pushToArrayByName(this.subPractices), this.pushToArrayByName(this.client), this.pushToArrayByName(this.project),
          this.orgMinYear, this.orgMaxYear);
      } else {
        this.getOrganizationData()
      }

    }, (errorResponse) => {
      this.spinner = false;
      this.getOrganizationData();
    });
  }

  insertInArray(initial: any) {
    let arr = [];
    initial.forEach((item) => {
      arr.push(item.id);
    })
    return arr;
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
      this.getOrgProjectData(this.pushToArrayByName(this.org), this.pushToArrayByName(this.region), this.pushToArrayByName(this.practice), this.pushToArrayByName(this.subPractices), this.pushToArrayByName(this.client), this.pushToArrayByName(this.project), this.orgMinYear, this.orgMaxYear);
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting projects data!');
    });
  }

  getOrgProjectData(org: any, region: any, practice: any, subPractice: any, client: any, project: any, minYear: any, maxYear: any) {

    this.es.getProjectRevenue(org, region, practice, subPractice, client, project, minYear, maxYear);
    this.spinner = true;
    this.es.getProjectRevenueData().subscribe((response) => {
      this.spinner = false;

      this.organsizationProjectData = response.aggregations ? response.aggregations.filtered.by_year.buckets : [];
      this.organsizationProjectData.sort((a: any, b: any) => a.key - b.key);
      this.bindOrgProjData();
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting projects revenue data!');
    });
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
        this.getOrgProjectData(this.org, this.region, this.practice, this.subPractices, this.client, this.project, this.orgMinYear, this.orgMaxYear);
        break;
    }
  }

  updateHrsByResourceGrid() {
    this.orgMaxYear = Number([this.orgMaxYear]);
    this.orgMinYear = Number([this.orgMaxYear]) - 1;

    this.getOrgProjectData(this.pushToArrayByName(this.org), this.pushToArrayByName(this.region), this.pushToArrayByName(this.practice),
      this.pushToArrayByName(this.subPractices), this.pushToArrayByName(this.client), this.pushToArrayByName(this.project),
      this.orgMinYear, this.orgMaxYear);
  }

  differenceArray: any = [];
  percentageArray: any = [];
  differnceMinArray: any = [];
  percentageMinArray: any = [];

  bindOrgProjData() {
    this.monthsForMinYear = [];
    this.monthsForMaxYear = [];
    this.revenueMinMonth = [];
    this.revenueMaxMonth = [];
    this.costMinMonth = [];
    this.costMaxMonth = [];
    this.differenceArray = [];
    this.percentageArray = [];
    this.differnceMinArray = [];
    this.percentageMinArray = [];
    this.monthMinBuckets = [];
    this.monthMaxBuckets = [];
    // this.organsizationProjectData = [];

    this.organsizationProjectData.forEach((yearData) => {
      if (yearData.key == this.orgMinYear) {
        this.monthMinBuckets = yearData.by_month.buckets;
      }
      else {
        this.monthMaxBuckets = yearData.by_month.buckets;
      }
    });

    this.projectRevenue = [];
    this.organsizationProjectData.forEach((yearItem) => {
      yearItem.by_month.buckets.forEach((monthItem) => {
        let obj = {};
        obj['Year'] = yearItem.key;
        obj['Month'] = this.alphaMonth(monthItem.key);
        obj['Revenue'] = monthItem.by_revenue.value.toFixed();
        obj['Cost'] = monthItem.by_cost.value.toFixed();
        const margin = ((((monthItem.by_revenue.value - monthItem.by_cost.value) / monthItem.by_revenue.value) * 100).toFixed()) + '%';
        obj['Margin'] = margin == '-Infinity%' ? 0 + '%' : margin;
        obj['Mon'] = monthItem.key;
        this.projectRevenue.push(obj);
      });
    });
    this.projectRevenue = this.projectRevenue.sort(((a, b) => a.Year - b.Year || a.Mon - b.Mon));;

    this.months.forEach((month: any) => {
      let rec = this.monthMinBuckets.find(item => item.key == month.id);
      this.monthsForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMinMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMinMonth.push(rec ? rec.by_cost.value : NaN);
    });

    this.months.forEach((month: any) => {
      if (month.id >= this.currentMonth && this.orgMaxYear == this.currentYear) {
        let cur = this.monthMaxBuckets.find(item => item.key == month.id);
        this.monthsForMaxYear.push(this.alphaMonth(cur ? cur.key : month.id));
        this.revenueMaxMonth.push(NaN);
        this.costMaxMonth.push(NaN);
      }
      else {
        let rec = this.monthMaxBuckets.find(item => item.key == month.id);
        this.monthsForMaxYear.push(this.alphaMonth(rec ? rec.key : month.id));
        this.revenueMaxMonth.push(rec ? rec.by_revenue.value : NaN);
        this.costMaxMonth.push(rec ? rec.by_cost.value : NaN);
      }
    });

    for (let index = 0; index < this.revenueMaxMonth.length; index++) {
      let diff = this.revenueMaxMonth[index] - this.costMaxMonth[index];
      this.differenceArray.push(diff);
      let percentage = (diff / this.revenueMaxMonth[index]) * 100;
      percentage = Number(percentage.toFixed());
      this.percentageArray.push(percentage);
    }

    for (let index = 0; index < this.revenueMinMonth.length; index++) {
      let diff = this.revenueMinMonth[index] - this.costMinMonth[index];
      this.differnceMinArray.push(diff);
      let percentage = (diff / this.revenueMinMonth[index]) * 100;
      percentage = Number(percentage.toFixed());
      this.percentageMinArray.push(percentage);
    }

    if ((this.compare == false) && (this.typeOfChart == 'bar')) {
      this.comparePnL = [{ label: 'Margin', yAxisID: 'line', backgroundColor: "#FFCC00", borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: 'Revenue', yAxisID: 'bar-stack', backgroundColor: "#1E90FF", hoverBackgroundColor: "#1E90FF", stack: 'bef1', data: this.revenueMaxMonth, },
      { label: 'Cost', yAxisID: 'bar-stack', backgroundColor: "#ff1a1a", hoverBackgroundColor: "#ff1a1a", stack: 'bef2', data: this.costMaxMonth, }];
      this.yaxeswc = this.stackChartYAxes;
      // this.createStackedChart();
      if (this.isGrid == true) {
        document.getElementById('toggleGrid').classList.add('active');
        this.createGrid();
      } else {
        this.createStackedChart();
      }
    }
    else if ((this.compare == true) && (this.typeOfChart == 'bar')) {
      document.getElementById('toggle').classList.add('active');
      this.comparePnL = [{ label: this.orgMaxYear + ' Margin', yAxisID: 'line', borderColor: '#FFCC00', backgroundColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: this.orgMinYear + " Margin", yAxisID: 'line', backgroundColor: "#99FF00", borderColor: '#99FF00', type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + " Revenue", yAxisID: 'bar-stack', backgroundColor: "#1E90FF", hoverBackgroundColor: "#1E90FF", stack: 'bef1', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + " Cost", yAxisID: 'bar-stack', backgroundColor: "#ff1a1a", hoverBackgroundColor: "#ff1a1a", stack: 'bef2', data: this.costMaxMonth },
      { label: this.orgMinYear + " Revenue", yAxisID: 'bar-stack', backgroundColor: "#DCEAF0", hoverBackgroundColor: "#DCEAF0", borderWidth: 1, stack: 'now1', data: this.revenueMinMonth },
      { label: this.orgMinYear + " Cost", yAxisID: "bar-stack", backgroundColor: "#FFC8C5", hoverBackgroundColor: "#FFC8C5", borderWidth: 1, stack: 'now2', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
      // this.createStackedChart();
      if (this.isGrid == true) {
        document.getElementById('toggleGrid').classList.add('active');
        this.createGrid();
      } else {
        this.createStackedChart();
      }
    }
    this.setFilters();
  }

  totalCostByEmployee(data: any) {
    let total: any = 0;
    data.forEach((item: any) => {
      total += item.by_cost.value;
    });
    return total;
  }

  currentYear: any = new Date().getFullYear().toString();
  currentMonth: any = (new Date().getMonth() + 1).toString();
  bindOrgProjDatan() {
    this.monthsForMinYear = [];
    this.monthsForMaxYear = [];
    this.revenueMinMonth = [];
    this.revenueMaxMonth = [];
    this.costMinMonth = [];
    this.costMaxMonth = [];
    this.differenceArray = [];
    this.percentageArray = [];
    this.differnceMinArray = [];
    this.percentageMinArray = [];

    this.organsizationProjectData.forEach((yearData) => {
      if (yearData.key == this.orgMinYear) {
        this.monthMinBuckets = yearData.by_month.buckets;
      }
      else {
        this.monthMaxBuckets = yearData.by_month.buckets;
      }
    });

    this.projectRevenue = [];
    this.organsizationProjectData.forEach((yearItem) => {
      yearItem.by_month.buckets.forEach((monthItem) => {
        let obj = {};
        obj['Year'] = yearItem.key;
        obj['Month'] = this.alphaMonth(monthItem.key);
        obj['Revenue'] = monthItem.by_revenue.value.toFixed();
        obj['Cost'] = monthItem.by_cost.value.toFixed();
        const margin = ((((monthItem.by_revenue.value - monthItem.by_cost.value) / monthItem.by_revenue.value) * 100).toFixed()) + '%';
        obj['Margin'] = margin == '-Infinity%' ? 0 + '%' : margin;
        obj['Mon'] = monthItem.key;
        this.projectRevenue.push(obj);
      });
    });
    this.projectRevenue = this.projectRevenue.sort(((a, b) => a.Year - b.Year || a.Mon - b.Mon));

    this.months.forEach((month: any) => {
      let rec = this.monthMinBuckets.find(item => item.key == month.id);
      this.monthsForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMinMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMinMonth.push(rec ? rec.by_cost.value : NaN);
    });

    this.months.forEach((month: any) => {
      if (month.id >= this.currentMonth && this.orgMaxYear == this.currentYear) {
        let cur = this.monthMaxBuckets.find(item => item.key == month.id);
        this.monthsForMaxYear.push(this.alphaMonth(cur ? cur.key : month.id));
        this.revenueMaxMonth.push(NaN);
        this.costMaxMonth.push(NaN);
      }
      else {
        let rec = this.monthMaxBuckets.find(item => item.key == month.id);
        this.monthsForMaxYear.push(this.alphaMonth(rec ? rec.key : month.id));
        this.revenueMaxMonth.push(rec ? rec.by_revenue.value : NaN);
        this.costMaxMonth.push(rec ? rec.by_cost.value : NaN);
      }
    });

    for (var index = 0; index < this.revenueMaxMonth.length; index++) {
      var diff = this.revenueMaxMonth[index] - this.costMaxMonth[index];
      this.differenceArray.push(diff);
      var percentage = (diff / this.revenueMaxMonth[index]) * 100;
      percentage = Number(percentage.toFixed());
      this.percentageArray.push(percentage);
    }

    for (let index = 0; index < this.revenueMinMonth.length; index++) {
      let diff = this.revenueMinMonth[index] - this.costMinMonth[index];
      this.differnceMinArray.push(diff);
      let percentage = (diff / this.revenueMinMonth[index]) * 100;
      percentage = Number(percentage.toFixed());
      this.percentageMinArray.push(percentage);
    }
    this.isPageLoaded.emit(true);
  }

  alphaMonth(value: any) {
    return this.months[value - 1]['value'];
  }

  projDropDownData(data: any) {
    let returnArr = []
    data.map((item: any, index: any) => {
      return {
        id: index,
        itemName: item
      }
    }).forEach((item: any, index: any) => {
      returnArr.push(item);
    });
    return returnArr;
  }

  toggle(event: any) {
    this.comparePnL = [];
    this.yaxeswc = [];
    this.bindOrgProjDatan();
    if ((event.target.classList.contains('active')) && (this.typeOfChart == 'bar')) {
      this.compare = false;
      this.comparePnL = [{ label: ' Margin', yAxisID: 'line', backgroundColor: '#FFCC00', borderColor: "#FFCC00", type: 'line', fill: false, data: this.percentageArray },
      { label: 'Revenue', backgroundColor: "#1E90FF", hoverBackgroundColor: "#1E90FF", stack: 'bef1', data: this.revenueMaxMonth, },
      { label: 'Cost', backgroundColor: "#ff1a1a", hoverBackgroundColor: "#ff1a1a", stack: 'bef2', data: this.costMaxMonth, }];
      this.yaxeswc = this.stackChartYAxes;
    } else if ((!event.target.classList.contains('active')) && (this.typeOfChart == 'bar')) {
      this.compare = true;
      this.comparePnL = [{ label: this.orgMaxYear + " Margin", yAxisID: 'line', backgroundColor: '#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: this.orgMinYear + " Margin", yAxisID: 'line', backgroundColor: '#99FF00', borderColor: "#99FF00", type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + " Revenue", yAxisID: 'bar-stack', backgroundColor: "#1E90FF", hoverBackgroundColor: "#1E90FF", stack: 'bef1', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + " Cost", yAxisID: 'bar-stack', backgroundColor: "#ff1a1a", hoverBackgroundColor: "#ff1a1a", stack: 'bef2', data: this.costMaxMonth },
      { label: this.orgMinYear + " Revenue", yAxisID: 'bar-stack', backgroundColor: "#DCEAF0", hoverBackgroundColor: "#DCEAF0", borderWidth: 1, stack: 'now1', data: this.revenueMinMonth },
      { label: this.orgMinYear + " Cost", yAxisID: "bar-stack", backgroundColor: "#FFC8C5", hoverBackgroundColor: "#FFC8C5", borderWidth: 1, stack: 'now2', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
    }
    if (this.isGrid) {
      this.createGrid();
    }
    else {
      this.createStackedChart();
    }
    this.setFilters();
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

  projectRevenuePrevious: any = [];
  projectRevenueCurrent: any = [];

  createGrid(): any {
    if (!this.compare && this.orgMaxYear == this.currentYear) {
      this.projectRevenue = this.projectRevenue.filter(item => Number(item.Year) == this.orgMaxYear);
      this.projectRevenue = this.projectRevenue.filter(item => Number(item.Mon) < this.currentMonth);
    }
    else if (this.compare && this.orgMaxYear == this.currentYear) {
      this.projectRevenuePrevious = this.projectRevenue.filter(item => Number(item.Year) != this.orgMaxYear);
      this.projectRevenueCurrent = this.projectRevenue.filter(item => Number(item.Year) == this.orgMaxYear);
      this.projectRevenueCurrent = this.projectRevenueCurrent.filter(item => Number(item.Mon) < this.currentMonth);
      this.projectRevenue = this.projectRevenuePrevious.concat(this.projectRevenueCurrent);
    }
    else if (!this.compare && this.orgMaxYear != this.currentYear) {
      this.projectRevenue = this.projectRevenue.filter(item => Number(item.Year) == this.orgMaxYear);
    }
    this.columnDefs = this.generateColumns(this.projectRevenue);
    this.gridOptions.api.setRowData(this.projectRevenue);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
    this.isPageLoaded.emit(true);
  }

  
  gridData: any = [];
  gridDataForPrevious: any = [];
  gridDataForCurrent: any = [];

  downloadDetailsInExel() {
    const file_name = 'project_revenue_';
    if (this.org.length === 0) {
      this.toasterService.error("Oops! No data to export");
    }
    else {
      const payLoad = {
        "columns": ["year", "month", "project_cost", "project_revenue", "prj_organization", "prj_practice", "prj_sub_practice", "customer", "project", "prj_region"],
        "filters": {
          "year": [this.orgMinYear, this.orgMaxYear],
          "emp_organization": this.org ? this.org.map((item: any) => item.itemName) : [],
          "prj_practice": this.practice ? this.practice.map((item: any) => item.itemName) : [],
          "prj_sub_practice": this.subPractices ? this.subPractices.map((item: any) => item.itemName) : [],
          "prj_region": this.region ? this.region.map((item: any) => item.itemName) : [],
          "customer": this.client ? this.client.map((item: any) => item.itemName) : [],
          "project": this.project ? this.project.map((item: any) => item.itemName) : []
        }
      }
      this.spinner = true;
      this.resource.getExportToExcelData(payLoad).subscribe((response) => {
        if (response.Records && response.Records.length > 0) {
          this.gridData = response.Records;
          if (this.orgMaxYear == this.currentYear) {
            if (!this.compare) {
              this.gridData = this.gridData.filter(item => Number(item.year) == this.orgMaxYear);
              this.gridData = this.gridData.filter(item => Number(item.month) <= this.currentMonth);
            }
            else {
              this.gridDataForPrevious = this.gridData.filter(item => Number(item.year) != this.orgMaxYear);
              this.gridDataForCurrent = this.gridData.filter(item => Number(item.year) == this.orgMaxYear);
              this.gridDataForCurrent = this.gridDataForCurrent.filter(item => Number(item.month) <= this.currentMonth);
              this.gridData = this.gridDataForPrevious.concat(this.gridDataForCurrent);
            }
          }
          else {
            if (!this.compare) {
              this.gridData = this.gridData.filter(item => Number(item.year) == this.orgMaxYear);
            }
            else {
              this.gridDataForPrevious = this.gridData.filter(item => Number(item.year) != this.orgMaxYear);
              this.gridDataForCurrent = this.gridData.filter(item => Number(item.year) == this.orgMaxYear);
              this.gridData = this.gridDataForPrevious.concat(this.gridDataForCurrent);
            }
          }
          this.downloadFile.exportAsExcelFile(this.gridData, file_name);
        }
        else {
          this.toasterService.error("Oops! No data to export");
        }
        this.spinner = false;
      }, () => {
        this.spinner = false;
        this.toasterService.error("Error occures while getting export excel data!");
      });
    }
  }

  generateColumns(data: any[]) {
    let columnDefinitions = [];

    data.forEach(object => {
      Object.keys(object).forEach(key => {
        let mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          // width: 90
        };
        if (key.toUpperCase() == 'PROJECT') {
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

  getRowHeight = function (params) {
    let lineCount = Math.floor(params.data.length / 32) + 1;
    let height = (12 * lineCount) + 24;
    return height;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }

  refresh() {
    this.orgMaxYear = moment().year();
    this.orgMinYear = moment().year() - 1;
    this.getOrganizationData();
  }

  createStackedChart() {
    if (this.orgStackedChart) {
      this.orgStackedChart.destroy();
    }
    this.orgStackedChart = new Chart('OrgProjectRevenue', {
      type: this.typeOfChart,
      data: {
        labels: this.monthsForMaxYear,
        datasets: this.comparePnL,
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
                tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
        },
        legend: {
          display: true,
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            }
          }],
          yAxes: this.yaxeswc
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
