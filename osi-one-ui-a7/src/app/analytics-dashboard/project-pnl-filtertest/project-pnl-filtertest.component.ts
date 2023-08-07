import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { GridOptions } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { GridService } from '../../dashboard-grid/grid.service';

@Component({
  selector: 'app-project-pnl-filtertest',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './project-pnl-filtertest.component.html',
  styleUrls: ['./project-pnl-filtertest.component.css']
})
export class ProjectPnlFiltertestComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  dropdownSettings = {};
  spinner: boolean = false;
  compare: boolean = false;
  flag: boolean = true;
  changeChart: boolean = true;

  org: any = [];
  employee: any = [];
  client: any = [];
  project: any = [];
  practice: any = [];
  subPractice: any = [];

  columnDefs: any = [];
  gridOptions = <GridOptions>{};
  paginationPageSize = 10;
  gridApi: any;
  gridColumnApi: any;
  gridHeight: any = 0;

  orgData: any = [];
  clientData: any = [];
  projectData: any = [];
  practiceData: any = [];
  subPracticeData: any = [];
  employeeData: any = [];

  orgID: any = [];
  clientID: any = [];
  projectID: any = [];

  organsizationProjectData: any[] = [];
  months: any = [{ 'id': 1, 'value': 'Jan' }, { 'id': 2, 'value': 'Feb' }, { 'id': 3, 'value': 'Mar' }, { 'id': 4, 'value': 'Apr' }, { 'id': 5, 'value': 'May' }, { 'id': 6, 'value': 'Jun' }, { 'id': 7, 'value': 'Jul' }, { 'id': 8, 'value': 'Aug' }, { 'id': 9, 'value': 'Sept' }, { 'id': 10, 'value': 'Oct' }, { 'id': 11, 'value': 'Nov' }, { 'id': 12, 'value': 'Dec' }];
  chartData: any = ['bar', 'line'];

  chartType = 'bar';
  orgStackedChart: Chart;
  orgStackGroupedChart: Chart;
  orgProjectData: any[] = [];
  orgYearData: any[] = [{ 'key': (new Date().getFullYear() - 2).toString() }, { 'key': (new Date().getFullYear() - 1).toString() }, { 'key': new Date().getFullYear().toString() }];
  orgProject: any[] = [];
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

  stackChartCompare: any = [];
  stackChartMultiCompare: any = [];
  stackChartYAxes: any = [
    {
      id: 'bar-stack',
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
          } return '$' + formatNumber(value);
        }
      },
    },
    {
      id: 'line',
      gridLines: { display: false },
      position: 'right',
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
      id: 'line',
      position: 'right',
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
      id: 'bar-stack',
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

  lineChartCompare: any = [];
  lineChartMultiCompare: any = [];
  lineChartYAxes: any = [{
    gridLines: {
      display: false
    },
    ticks: {
      beginAtZero: true,
      min: 1,
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

  lineChartMultiYAxes: any = this.lineChartYAxes;
  typeOfChart: any = 'bar';
  resourceRevenue: any = [];
  isGrid: boolean = false;
  currentYearData: any = [];
  lastYearData: any = [];
  lastChanedDd = '';

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private gridService: GridService,
    private downloadFile: ExportFileService,
    private toasterService: ToastrService
  ) { }
  ngAfterViewInit(): void {
  }

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

        this.getOrgProjectData(this.getNames(this.employee), this.getNames(this.org), this.getNames(this.project),
          this.getNames(this.practice), this.getNames(this.subPractice), this.orgMinYear, this.orgMaxYear);
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
      this.toasterService.error('Error Occured While Getting filters data!');
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
      this.toasterService.error('Error Occured While Getting filters data!');
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
      this.toasterService.error('Error Occured While Getting filters data!');
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
      this.getOrgProjectData(this.pushToArray(this.employee), this.getNames(this.org), this.pushToArray(this.orgProject),
        this.pushToArray(this.practice), this.pushToArray(this.subPractice), this.orgMinYear, this.orgMaxYear);

    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting filters data!');
    });
  }


  getOrgProjectData(employees: any, org: any, project: any, pract: any, subPract: any, minYear: any, maxYear: any) {
    this.es.getMyOrgProjectRevenueTest(employees, org, project, pract, subPract, minYear, maxYear);
    this.spinner = true;
    this.es.getOrgProjectRevenueTest().subscribe((response) => {
      this.spinner = false;
      this.isPageLoaded.emit(true);

      this.organsizationProjectData = response.aggregations ? response.aggregations.filtered.by_year.buckets : [];
      this.organsizationProjectData = this.organsizationProjectData.sort((a: any, b: any) => a.key - b.key);
      this.bindOrgProjData();
      this.setFilters();
    });
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
      this.getPracticeData(this.org);
    } else if (this.lastChanedDd === 'practice') {
      this.getSubPracticeData(this.org, this.practice)
    } else if (this.lastChanedDd === 'subpractice') {
      this.getEmployeesByProjectID(this.org, this.practice, this.subPractice)
    } else if (this.lastChanedDd === 'employee') {
      this.getProjectData(this.employee)
    } else if (this.lastChanedDd === 'project') {
      this.getOrgProjectData(this.pushToArray(this.employee), this.getNames(this.org), this.pushToArray(this.project),
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

  updateHrsByResourceGrid() {
    this.orgMaxYear = Number([this.orgMaxYear]);
    this.orgMinYear = Number([this.orgMaxYear]) - 1;

    this.getOrgProjectData(this.pushToArray(this.employee), this.getNames(this.org), this.pushToArray(this.project),
      this.pushToArray(this.practice), this.pushToArray(this.subPractice), this.orgMinYear, this.orgMaxYear);
  }

  differenceArray: any = [];
  percentageArray: any = [];
  differnceMinArray: any = [];
  percentageMinArray: any = [];

  currentYear: any = new Date().getFullYear().toString();
  currentMonth: any = (new Date().getMonth() + 1).toString();

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

    this.organsizationProjectData.forEach((yearData) => {
      if (yearData.key == this.orgMinYear) {
        this.monthMinBuckets = yearData.by_month.buckets;
      }
      else {
        this.monthMaxBuckets = yearData.by_month.buckets;
      }
    });

    this.resourceRevenue = [];
    this.organsizationProjectData.forEach((yearItem) => {
      yearItem.by_month.buckets.forEach((monthItem) => {
        let obj = {};
        obj['Year'] = yearItem.key;
        obj['Month'] = this.alphaMonth(monthItem.key);
        obj['Revenue'] = monthItem.by_revenue.value.toFixed();
        obj['Cost'] = this.totalCostByEmployee(monthItem.by_employee.buckets).toFixed();
        const margin = Number((((monthItem.by_revenue.value - this.totalCostByEmployee(monthItem.by_employee.buckets)) / monthItem.by_revenue.value) * 100).toFixed()) + '%';
        obj['Average Revenue'] = monthItem.by_revenue_avg.value.toFixed();
        obj['Margin'] = margin == '-Infinity%' ? 0 + '%' : margin;
        obj['Mon'] = monthItem.key;
        this.resourceRevenue.push(obj);
      });
    });
    this.resourceRevenue = this.resourceRevenue.sort((a, b) => a.Year - b.Year || a.Mon - b.Mon);

    this.months.forEach((month: any) => {
      let rec = this.monthMinBuckets.find(item => item.key == month.id);
      this.monthsForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMinMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMinMonth.push(rec ? this.totalCostByEmployee(rec.by_employee.buckets) : NaN);
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
        this.costMaxMonth.push(rec ? this.totalCostByEmployee(rec.by_employee.buckets) : NaN);
      }
    })

    for (var index = 0; index < this.revenueMaxMonth.length; index++) {
      var diff = this.revenueMaxMonth[index] - this.costMaxMonth[index];
      this.differenceArray.push(diff);
      var percentage = (diff / this.revenueMaxMonth[index]) * 100;
      percentage = Number(percentage.toFixed());
      this.percentageArray.push(percentage);
    }

    for (var index = 0; index < this.revenueMinMonth.length; index++) {
      var diff = this.revenueMinMonth[index] - this.costMinMonth[index];
      this.differnceMinArray.push(diff);
      var percentage = (diff / this.revenueMinMonth[index]) * 100;
      percentage = Number(percentage.toFixed());
      this.percentageMinArray.push(percentage);
    }

    if ((this.compare == false) && (this.typeOfChart == 'bar')) {
      this.comparePnL = [{ label: 'Margin', yAxisID: 'line', backgroundColor: '#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: 'Revenue', yAxisID: 'bar-stack', backgroundColor: '#1E90FF', hoverBackgroundColor: '#1E90FF', stack: 'bef1', data: this.revenueMaxMonth, },
      { label: 'Cost', yAxisID: 'bar-stack', backgroundColor: '#ff1a1a', hoverBackgroundColor: '#ff1a1a', stack: 'bef2', data: this.costMaxMonth, }];
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
      { label: this.orgMinYear + ' Margin', yAxisID: 'line', backgroundColor: '#99FF00', borderColor: '#99FF00', type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#1E90FF', hoverBackgroundColor: '#1E90FF', stack: 'bef1', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#ff1a1a', hoverBackgroundColor: '#ff1a1a', stack: 'bef2', data: this.costMaxMonth },
      { label: this.orgMinYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#DCEAF0', hoverBackgroundColor: '#DCEAF0', borderWidth: 1, stack: 'now1', data: this.revenueMinMonth },
      { label: this.orgMinYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#FFC8C5', hoverBackgroundColor: '#FFC8C5', borderWidth: 1, stack: 'now2', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
      // this.createStackedChart();
      if (this.isGrid == true) {
        document.getElementById('toggleGrid').classList.add('active');
        this.createGrid();
      } else {
        this.createStackedChart();
      }
    }

  }


  totalCostByEmployee(data: any) {
    let total: any = 0;
    data.forEach((item: any) => {
      total += item.by_cost.value;
    });
    return total;
  }

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

    this.resourceRevenue = [];
    this.organsizationProjectData.forEach((yearItem) => {
      yearItem.by_month.buckets.forEach((monthItem) => {
        let obj = {};
        obj['Year'] = yearItem.key;
        obj['Month'] = this.alphaMonth(monthItem.key);
        obj['Revenue'] = monthItem.by_revenue.value.toFixed();
        obj['Cost'] = this.totalCostByEmployee(monthItem.by_employee.buckets).toFixed();
        const margin = Number((((monthItem.by_revenue.value - this.totalCostByEmployee(monthItem.by_employee.buckets)) / monthItem.by_revenue.value) * 100).toFixed()) + '%';
        obj['Average Revenue'] = monthItem.by_revenue_avg.value.toFixed();
        obj['Margin'] = margin == '-Infinity%' ? 0 + '%' : margin;
        obj['Mon'] = monthItem.key;
        this.resourceRevenue.push(obj);
      });
    });
    this.resourceRevenue = this.resourceRevenue.sort(((a, b) => a.Year - b.Year || a.Mon - b.Mon));

    this.months.forEach((month: any) => {
      let rec = this.monthMinBuckets.find(item => item.key == month.id);
      this.monthsForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMinMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMinMonth.push(rec ? this.totalCostByEmployee(rec.by_employee.buckets) : NaN);
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
        this.costMaxMonth.push(rec ? this.totalCostByEmployee(rec.by_employee.buckets) : NaN);
      }
    })

    this.differenceAndPercentage(this.revenueMaxMonth, this.costMaxMonth, this.differenceArray, this.percentageArray);
    this.differenceAndPercentage(this.revenueMinMonth, this.costMinMonth, this.differnceMinArray, this.percentageMinArray);

  }

  differenceAndPercentage(revenueArray: any[], costArray: any[], differenceArray: any[], percentageArray: any[]) {
    for (var index = 0; index < revenueArray.length; index++) {
      var diff = revenueArray[index] - costArray[index];
      differenceArray.push(diff);
      var percentage = (diff / revenueArray[index]) * 100;
      percentage = Number(percentage.toFixed());
      percentageArray.push(percentage);
    }
  }

  alphaMonth(value: any) {
    return this.months[value - 1]['value'];
  }

  toggle(event: any) {
    this.comparePnL = [];
    this.yaxeswc = [];
    this.bindOrgProjDatan();
    if ((event.target.classList.contains('active')) && (this.typeOfChart == 'line')) {
      this.bindOrgProjDatan();
      this.compare = false;
      this.comparePnL = [{ label: 'Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#1E90FF', borderColor: '#1E90FF', spanGaps: false },
      { label: 'Cost', data: this.costMaxMonth, lineTension: 0.1, backgroundColor: '#ff1a1a', borderColor: '#ff1a1a', fill: false, spanGaps: false }];
      this.yaxeswc = this.lineChartYAxes
      this.createStackedChart();
    } else if ((event.target.classList.contains('active')) && (this.typeOfChart == 'bar')) {
      this.bindOrgProjDatan();
      this.compare = false;
      this.comparePnL = [{ label: ' Margin', yAxisID: 'line', backgroundColor: '#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: 'Revenue', backgroundColor: '#1E90FF', hoverBackgroundColor: '#1E90FF', stack: 'bef1', data: this.revenueMaxMonth, },
      { label: 'Cost', backgroundColor: '#ff1a1a', hoverBackgroundColor: '#ff1a1a', stack: 'bef2', data: this.costMaxMonth, }];
      this.yaxeswc = this.stackChartYAxes;
      this.createStackedChart();
    } else if ((!event.target.classList.contains('active')) && (this.typeOfChart == 'line')) {
      this.bindOrgProjDatan();
      this.compare = true;
      this.comparePnL = [{ label: this.orgMaxYear + ' Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#1E90FF', borderColor: '#1E90FF', spanGaps: false },
      { label: this.orgMaxYear + ' Cost', data: this.costMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#ff1a1a', borderColor: '#ff1a1a', spanGaps: false },
      { label: this.orgMinYear + ' Revenue', data: this.revenueMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#DCEAF0', borderColor: '#DCEAF0', spanGaps: false },
      { label: this.orgMinYear + ' Cost', data: this.costMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#FFC8C5', borderColor: '#FFC8C5', spanGaps: false }];
      this.yaxeswc = this.lineChartMultiYAxes;
      this.createStackedChart();
    } else if ((!event.target.classList.contains('active')) && (this.typeOfChart == 'bar')) {
      this.bindOrgProjDatan();
      this.compare = true;
      this.comparePnL = [{ label: this.orgMaxYear + ' Margin', yAxisID: 'line', backgroundColor: '#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: this.orgMinYear + ' Margin', yAxisID: 'line', backgroundColor: '#99FF00', borderColor: '#99FF00', type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#1E90FF', hoverBackgroundColor: '#1E90FF', stack: 'bef1', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#ff1a1a', hoverBackgroundColor: '#ff1a1a', stack: 'bef2', data: this.costMaxMonth },
      { label: this.orgMinYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#DCEAF0', hoverBackgroundColor: '#DCEAF0', borderWidth: 1, stack: 'now1', data: this.revenueMinMonth },
      { label: this.orgMinYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#FFC8C5', hoverBackgroundColor: '#FFC8C5', borderWidth: 1, stack: 'now2', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
      this.createStackedChart();
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
    this.isPageLoaded.emit(true);
    this.setFilters();
  }

  projectRevenuePrevious: any = [];
  projectRevenueCurrent: any = [];

  createGrid(): any {
    if (!this.compare && this.orgMaxYear == this.currentYear) {
      this.resourceRevenue = this.resourceRevenue.filter(item => Number(item.Year) == this.orgMaxYear);
      this.resourceRevenue = this.resourceRevenue.filter(item => Number(item.Mon) < this.currentMonth);
    }
    else if (this.compare && this.orgMaxYear == this.currentYear) {
      this.projectRevenuePrevious = this.resourceRevenue.filter(item => Number(item.Year) != this.orgMaxYear);
      this.projectRevenueCurrent = this.resourceRevenue.filter(item => Number(item.Year) == this.orgMaxYear);
      this.projectRevenueCurrent = this.projectRevenueCurrent.filter(item => Number(item.Mon) < this.currentMonth);
      this.resourceRevenue = this.projectRevenuePrevious.concat(this.projectRevenueCurrent);
    }
    else if (!this.compare && this.orgMaxYear != this.currentYear) {
      this.resourceRevenue = this.resourceRevenue.filter(item => Number(item.Year) == this.orgMaxYear);
    }
    this.columnDefs = this.generateColumns(this.resourceRevenue);
    this.gridOptions.api.setRowData(this.resourceRevenue);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
  }

  gridData: any = [];
  gridDataForPrevious: any = [];
  gridDataForCurrent: any = [];

  downloadDetailsInExel() {
    const file_name = 'my_resource_revenue_';
    if (this.org.length === 0) {
      this.toasterService.error("Oops! No data to export");
    }
    else {
      const payLoad = {
        "columns": ["year", "month", "employee", "employee_monthly_cost", "project_revenue", "emp_organization", "emp_practice", "emp_sub_practice", "project"],
        "filters": {
          "year": [this.orgMinYear, this.orgMaxYear],
          "emp_organization": this.org ? this.org.map((item: any) => item.itemName) : [],
          "prj_practice": this.practice ? this.practice.map((item: any) => item.itemName) : [],
          "prj_sub_practice": this.subPractice ? this.subPractice.map((item: any) => item.itemName) : [],
          "employee": this.employee ? this.employee.map((item: any) => item.itemName) : [],
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
      }, (errorResponse) => {
        this.spinner = false;
        this.toasterService.error("Error occures while getting export excel data!");
      });
    }
  }

  generateColumns(data: any[]) {
    let columnDefinitions = [];

    data.map(object => {

      Object.keys(object).map(key => {
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
                  tooltipItem.yLabel.toString() + '%';
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
