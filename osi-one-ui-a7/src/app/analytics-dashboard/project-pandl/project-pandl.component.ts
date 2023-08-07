import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-project-pandl',
  templateUrl: './project-pandl.component.html',
  styleUrls: ['./project-pandl.component.css']
})
export class ProjectPandlComponent implements OnInit, AfterViewInit {
  dropdownSettings = {};
  spinner: boolean = false;
  compare: boolean = false;
  changeChart: boolean = true;

  orgData : any = [];
  clientData : any = [];
  projectData : any = [];
  practiceData : any = [];

  organsizationProjectData: any[] = [];
  months: any = [{ 'id': 1, 'value': 'Jan' }, { 'id': 2, 'value': 'Feb' }, { 'id': 3, 'value': 'Mar' }, { 'id': 4, 'value': 'Apr' }, { 'id': 5, 'value': 'May' }, { 'id': 6, 'value': 'Jun' }, { 'id': 7, 'value': 'Jul' }, { 'id': 8, 'value': 'Aug' }, { 'id': 9, 'value': 'Sept' }, { 'id': 10, 'value': 'Oct' }, { 'id': 11, 'value': 'Nov' }, { 'id': 12, 'value': 'Dec' }];
  chartData: any = ['bar', 'line'];

  chartType = 'bar';
  orgStackedChart: Chart;
  orgStackGroupedChart: Chart;
  orgProjectData: any[] = [];
  orgYearData: any[] = [];
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
      stacked: true,
      ticks: {
        beginAtZero: true,
        callback: function (value) {
          let ranges = [{ divider: 1e6, suffix: 'M' }, { divider: 1e3, suffix: 'k' }];
          function formatNumber(n) {
            for (let i = 0; i < ranges.length; i++) {
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
      stacked: true,
      ticks: {
        beginAtZero: true, min: 1,
        callback: function (value) {
          let ranges = [
            { divider: 1e6, suffix: 'M' },
            { divider: 1e3, suffix: 'k' }
          ];
          function formatNumber(n) {
            for (let i = 0; i < ranges.length; i++) {
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
        let ranges = [
          { divider: 1e6, suffix: 'M' },
          { divider: 1e3, suffix: 'k' }
        ];
        function formatNumber(n) {
          for (let i = 0; i < ranges.length; i++) {
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

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private toasterService: ToastrService
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'SelectAll',
      unSelectAllText: 'UnSelectAll',
      enableSearchFilter: true,
      badgeShowLimit: 1,
      itemsShowLimit: 10,
      classes: 'myclass custom-class'
    };
  }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.getProjectData();
  }

  getProjectData() {

    // this.spinner = true;
    // this.resource.getFiltersDataWithCustomer().subscribe((response) => {
    //   this.spinner = false;

    //   this.getYearData(response);

    // }, (errorResponse) => {
    //   this.spinner = false;
    //   this.toasterService.error('Error Occured While Getting filters data!');
    // });
    let response: any = this.resource.getRevenueFilterData();
    this.getYearData(response);

  }

  getYearData(response: any) {
    this.spinner = true;
    this.es.getFromService(0).subscribe(res => {
      this.spinner = false;

      response['year'] = res.aggregations.by_year.buckets;
      this.bindFilterDropDownData(response);
      this.getOrgProjectData(this.orgProjectData, this.orgMinYear, this.orgMaxYear);

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting year data!');
    });

  }

  bindFilterDropDownData(response: any) {
    let orgProj = this.orgProjectData = response.projects;
    this.orgYearData = response.year;

    this.orgYearData = this.orgYearData.sort((a, b) => a.key - b.key);
    orgProj = orgProj.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    this.orgProject = this.orgProjectData = this.projDropDownData(orgProj);
  }

  getOrgProjectData(project: any, minYear: any, maxYear: any) {
    this.es.getMyOrgProjectRevenue(project, minYear, maxYear);
    this.spinner = true;
    this.es.getOrgProjectRevenue().subscribe((response) => {
      this.spinner = false;

      this.organsizationProjectData = response.aggregations ? response.aggregations.filtered.by_year.buckets : [];
      this.organsizationProjectData = this.organsizationProjectData.sort((a: any, b: any) => a.key - b.key);
      this.bindOrgProjData();
    })
  }

  updateHrsByResourceGrid() {
    this.orgMaxYear = Number([this.orgMaxYear]);  
    this.orgMinYear = Number([this.orgMaxYear]) - 1;

    this.getOrgProjectData(this.orgProjectData, this.orgMinYear, this.orgMaxYear);

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

    this.organsizationProjectData.forEach((yearData) => {
      if (yearData.key == this.orgMinYear) {
        this.monthMinBuckets = yearData.by_month.buckets;
      }
      else {
        this.monthMaxBuckets = yearData.by_month.buckets;
      }
    });

    this.months.forEach((month: any) => {
      let rec = this.monthMinBuckets.find(item => item.key == month.id);
      this.monthsForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMinMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMinMonth.push(rec ? rec.by_cost.value : NaN);
    });

    this.months.forEach((month: any) => {
      let rec = this.monthMaxBuckets.find(item => item.key == month.id);
      this.monthsForMaxYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMaxMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMaxMonth.push(rec ? rec.by_cost.value : NaN);
    })

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
      this.comparePnL = [{ label: 'Margin', yAxisID: 'line', backgroundColor: '#FFCC00', borderColor:'#FFCC00', type: 'line', fill: false,  data: this.percentageArray },
      { label: 'Revenue', yAxisID: 'bar-stack', backgroundColor: '#624ed3', hoverBackgroundColor : '#624ed3', data: this.revenueMaxMonth, },
      { label: 'Cost', yAxisID: 'bar-stack', backgroundColor: '#e03756',hoverBackgroundColor : '#e03756', data: this.costMaxMonth, }];
      this.yaxeswc = this.stackChartYAxes;
      this.createStackedChart();
    }
    else if ((this.compare == true) && (this.typeOfChart == 'bar')) {

      this.comparePnL = [{ label: this.orgMaxYear + ' Margin', yAxisID: 'line', borderColor: '#FFCC00', backgroundColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: this.orgMinYear + ' Margin', yAxisID: 'line', backgroundColor: '#99FF00', borderColor: '#99FF00', type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#624ed3',hoverBackgroundColor : '#624ed3', stack: 'bef', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#e03756',hoverBackgroundColor : '#e03756', stack: 'bef', data: this.costMaxMonth },
      { label: this.orgMinYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#8a9aab',hoverBackgroundColor : '#8a9aab', borderWidth: 1, stack: 'now', data: this.revenueMinMonth },
      { label: this.orgMinYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#F08080',hoverBackgroundColor : '#F08080', borderWidth: 1, stack: 'now', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
      this.createStackedChart();
    }
    else if ((this.compare == false) && (this.typeOfChart == 'line')) {
      this.comparePnL = [{ label: 'Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#624ed3', borderColor: '#624ed3', spanGaps: false },
      { label: 'Cost', data: this.costMaxMonth, lineTension: 0.1, backgroundColor: '#e03756', borderColor: '#e03756', fill: false, spanGaps: false }];
      this.yaxeswc = this.lineChartYAxes;
      this.createStackedChart();
    }
    else if ((this.compare == true) && (this.typeOfChart == 'line')) {
      this.comparePnL = [{ label: this.orgMaxYear + ' Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#624ed3', borderColor: '#624ed3', spanGaps: false },
      { label: this.orgMaxYear + ' Cost', data: this.costMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#e03756', borderColor: '#e03756', spanGaps: false },
      { label: this.orgMinYear + ' Revenue', data: this.revenueMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#8a9aab', borderColor: '#8a9aab', spanGaps: false },
      { label: this.orgMinYear + ' Cost', data: this.costMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#F08080', borderColor: '#F08080', spanGaps: false }];
      this.yaxeswc = this.lineChartMultiYAxes;
      this.createStackedChart();
    }
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

    this.months.forEach((month: any) => {
      let rec = this.monthMinBuckets.find(item => item.key == month.id);
      this.monthsForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMinMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMinMonth.push(rec ? rec.by_cost.value : NaN);
    });

    this.months.forEach((month: any) => {
      let rec = this.monthMaxBuckets.find(item => item.key == month.id);
      this.monthsForMaxYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.revenueMaxMonth.push(rec ? rec.by_revenue.value : NaN);
      this.costMaxMonth.push(rec ? rec.by_cost.value : NaN);
    })

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

  updateChart() {
    this.comparePnL = [];
    this.yaxeswc = [];
    this.bindOrgProjDatan();
    this.chartType = String([this.chartType]);
    // this.chartType = this.chartType.toString().toLowerCase();
    if (this.chartType == 'line' && this.compare == false) {
      this.typeOfChart = this.chartType;
      this.comparePnL = [{ label: 'Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#624ed3', borderColor: '#624ed3', spanGaps: false },
      { label: 'Cost', data: this.costMaxMonth, lineTension: 0.1, backgroundColor: '#e03756', borderColor: '#e03756', fill: false, spanGaps: false }];
      this.yaxeswc = this.lineChartYAxes;
      this.createStackedChart();
    }
    else if (this.chartType == 'line' && this.compare == true) {
      this.typeOfChart = this.chartType;
      this.comparePnL = [{ label: this.orgMaxYear + ' Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#624ed3', borderColor: '#624ed3', spanGaps: false },
      { label: this.orgMaxYear + ' Cost', data: this.costMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#e03756', borderColor: '#e03756', spanGaps: false },
      { label: this.orgMinYear + ' Revenue', data: this.revenueMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#8a9aab', borderColor: '#8a9aab', spanGaps: false },
      { label: this.orgMinYear + ' Cost', data: this.costMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#F08080', borderColor: '#F08080', spanGaps: false }];
      this.yaxeswc = this.lineChartMultiYAxes;
      this.createStackedChart();
    }
    else if (this.chartType == 'bar' && this.compare == false) {
      this.typeOfChart = this.chartType;
      this.comparePnL = [{ label: 'Margin', yAxisID: 'line', backgroundColor: '#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: 'Revenue', backgroundColor: '#624ed3', hoverBackgroundColor :'#624ed3',  data: this.revenueMaxMonth, },
      { label: 'Cost', backgroundColor: '#e03756', hoverBackgroundColor :'#e03756', data: this.costMaxMonth, }];
      this.yaxeswc = this.stackChartYAxes;
      this.createStackedChart();
    }
    else if (this.chartType == 'bar' && this.compare == true) {
      this.typeOfChart = this.chartType;
      this.comparePnL = [{ label: this.orgMaxYear+' Margin', yAxisID: 'line', backgroundColor: '#FFCC00',borderColor:'#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: this.orgMinYear + ' Margin', yAxisID: 'line', backgroundColor: '#99FF00', borderColor:'#99FF00', type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#624ed3',hoverBackgroundColor :'#624ed3', stack: 'bef', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#e03756',hoverBackgroundColor :'#e03756', stack: 'bef', data: this.costMaxMonth },
      { label: this.orgMinYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#8a9aab', hoverBackgroundColor :'#8a9aab',borderWidth: 1, stack: 'now', data: this.revenueMinMonth },
      { label: this.orgMinYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#F08080',hoverBackgroundColor :'#F08080', borderWidth: 1, stack: 'now', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
      this.createStackedChart();
    }
  }

  toggle(event: any) {
    this.comparePnL = [];
    this.yaxeswc = [];
    this.bindOrgProjDatan();
    if ((event.target.classList.contains('active')) && (this.typeOfChart == 'line')) {
      this.bindOrgProjDatan();
      this.compare = false;
      this.comparePnL = [{ label: 'Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#624ed3', borderColor: '#624ed3', spanGaps: false },
      { label: 'Cost', data: this.costMaxMonth, lineTension: 0.1, backgroundColor: '#e03756', borderColor: '#e03756', fill: false, spanGaps: false }];
      this.yaxeswc = this.lineChartYAxes
      this.createStackedChart();
    } else if ((event.target.classList.contains('active')) && (this.typeOfChart == 'bar')) {
      this.bindOrgProjDatan();
      this.compare = false;
      this.comparePnL = [{ label:' Margin', yAxisID: 'line', backgroundColor:'#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: 'Revenue', backgroundColor: '#624ed3', hoverBackgroundColor :'#624ed3', data: this.revenueMaxMonth, },
      { label: 'Cost', backgroundColor: '#e03756', hoverBackgroundColor:'#e03756', data: this.costMaxMonth, }];
      this.yaxeswc = this.stackChartYAxes;
      this.createStackedChart();
    } else if ((!event.target.classList.contains('active')) && (this.typeOfChart == 'line')) {
      this.bindOrgProjDatan();
      this.compare = true;
      this.comparePnL = [{ label: this.orgMaxYear + ' Revenue', data: this.revenueMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#624ed3', borderColor: '#624ed3', spanGaps: false },
      { label: this.orgMaxYear + ' Cost', data: this.costMaxMonth, lineTension: 0.1, fill: false, backgroundColor: '#e03756', borderColor: '#e03756', spanGaps: false },
      { label: this.orgMinYear + ' Revenue', data: this.revenueMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#8a9aab', borderColor: '#8a9aab', spanGaps: false },
      { label: this.orgMinYear + ' Cost', data: this.costMinMonth, lineTension: 0.1, fill: false, backgroundColor: '#F08080', borderColor: '#F08080', spanGaps: false }];
      this.yaxeswc = this.lineChartMultiYAxes;
      this.createStackedChart();
    } else if ((!event.target.classList.contains('active')) && (this.typeOfChart == 'bar')) {
      this.bindOrgProjDatan();
      this.compare = true;
      this.comparePnL = [{ label: this.orgMaxYear + ' Margin', yAxisID: 'line',backgroundColor : '#FFCC00', borderColor: '#FFCC00', type: 'line', fill: false, data: this.percentageArray },
      { label: this.orgMinYear + ' Margin', yAxisID: 'line',backgroundColor : '#99FF00', borderColor: '#99FF00', type: 'line', fill: false, data: this.percentageMinArray },
      { label: this.orgMaxYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#624ed3', hoverBackgroundColor:'#624ed3', stack: 'bef', data: this.revenueMaxMonth },
      { label: this.orgMaxYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#e03756', hoverBackgroundColor:'#e03756',stack: 'bef', data: this.costMaxMonth },
      { label: this.orgMinYear + ' Revenue', yAxisID: 'bar-stack', backgroundColor: '#8a9aab', hoverBackgroundColor:'#8a9aab', borderWidth: 1, stack: 'now', data: this.revenueMinMonth },
      { label: this.orgMinYear + ' Cost', yAxisID: 'bar-stack', backgroundColor: '#F08080',hoverBackgroundColor:'#F08080',borderWidth: 1, stack: 'now', data: this.costMinMonth }];
      this.yaxeswc = this.stackChartMultiYAxes;
      this.createStackedChart();
    }
  }

  refresh() {
    this.getProjectData();
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
              else if(data.datasets[tooltipItem.datasetIndex].yAxisID == 'line') {
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
}
