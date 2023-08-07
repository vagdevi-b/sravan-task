
import { Component, OnInit } from '@angular/core';
import { PandlService } from '../../shared/services/pandl.service';
import * as Feather from 'feather-icons';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { bold } from '@angular-devkit/core/src/terminal';
declare var $: any;
@Component({
  selector: 'app-report-plcustomerview',
  templateUrl: './report-plcustomerview.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class ReportPlcustomerviewComponent implements OnInit {
  gridData: any = [];
  showFilters: boolean;
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  totalcost: any = 0;
  totalrevenue: any = 0;
  margin: any = 0;
  totalbillinghours: any = 0;
  totalnonbillinghours: any = 0;
  totalinternalhours: any = 0;
  totalholidayhours: any = 0;
  totalptohours: any = 0;
  totalspecialleavehours: any = 0;
  chartData: any = [];
  utilization: any;
  barCanvas: Chart;
  hoursChart: Chart;
  hoursByProjectCanvas: Chart;
  empUtilCanvas: Chart;
  revenueByEmpCanvas: Chart;
  yearMonthLabels: any[];
  yearMonthCostData: any[];
  yearMonthRevenueData: any[];
  yearMonthBillableHours: any[];
  yearMonthNonBillableHours: any[];
  yearMonthInternalHours: any[];
  yearMonthPtoHours: any[];

  hoursEmpMonthGridData: any = [];
  hoursEmpMonthGridColumns: any = [];
  gridObj = {};
  columnDefs = [];
  rowData = [];
  monthOnMonthGridData: any[] = [];
  monthOnMonthGridColumns: any = [];
  monthColumnDefs: any[] = [];
  monthRowData: any[] = [];
  monthgridObj = {};
  utilByLevelsObj = {};
  utilByLevelsGridData: any[] = [];
  utilByLevelsGridColumns: any = [];
  utilByLevelsColumnDefs: any[] = [];
  utilByLevelsRowData: any[] = [];
  projectObj = {};
  hoursEmpMonthGridTotalObj = {};
  hoursEmpMonthGridTotalObjArray = [];
  monthOnMonthGridTotalObjArray = [];
  employeesRevenue: any[] = [];
  projectTotalHours: any[] = [];
  employeesUtil: any[] = [];
  subscriptions: Subscription [] = [];
  constructor(private pAndLsvc: PandlService) { }

  ngOnInit() {
    this.getdata();
  }

  getdata() {

    this.chartData = [];
    this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(data => {
      // console.log(data['P and L'], 'in grids');
      this.chartData = data['P and L'];
      this.calculateCostRevenueMargin();
      this.yearMonthChart();
      this.hoursBreakDownChart();
      this.utilByLevelsGrid();
      this.employeeUtilChart();
      this.hoursByProjectChart();
      this.revenueByEmployee();
      this.hoursByEmpMonthGrid();
      this.monthOnMonthRevenueGrid();

    }, err => {
      //console.log(err);
      //$('#loadingEditSubmitModal').modal('hide');
    }));
  }
  showfilters() {
    this.showFilters = true;
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden';
  }

  closingFilters(event) {
    // console.log(event);
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated';
    this.showFilters = event;
  }
  getPandLData(event) {
    // console.log(event);
    if (event) {
      this.getdata();
    }
  }
  filterArray(array, filters) {
    // console.log(filters,'filters');
    const filterKeys = Object.keys(filters);
    return array.filter(eachObj => {
      return filterKeys.every(eachKey => {
        if (!filters[eachKey].length) {
          return true; // passing an empty filter means that filter is ignored.
        }
        return filters[eachKey].includes(eachObj[eachKey]);
      });
    });
  }

  getUniqueDataAfterFilter(data, keyword) {
    // Declare a new array
    let newArray = [];

    // Declare an empty object
    let uniqueObject = {};

    // Loop for the array elements
    for (let i in data) {

      // Extract the title
      let objTitle = data[i][keyword];

      // Use the title as the index
      uniqueObject[objTitle] = data[i];
    }

    // Loop to push unique object into array
    for (let i in uniqueObject) {
      let obj = uniqueObject[i];
      newArray.push(obj);
    }

    // Display the unique objects
    let uniqueArray = newArray.sort(this.GetSortOrder(keyword));
    let filtered = uniqueArray.filter(function (el) {
      return el[keyword] != null;
    });
    return filtered;
  }
  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }
  ngAfterViewInit() {
    Feather.replace();
  }
  calculateCostRevenueMargin() {
    //$('#loadingEditSubmitModal').modal('show');
    this.totalcost = 0;
    this.totalrevenue = 0;
    this.margin = 0;
    this.totalbillinghours = 0;
    this.totalnonbillinghours = 0;
    this.totalinternalhours = 0;
    this.totalholidayhours = 0;
    this.totalptohours = 0;
    this.totalspecialleavehours = 0;
    for (let i = 0; i < this.chartData.length; i++) {
      this.totalcost = this.totalcost + this.chartData[i].recognized_cost;
      this.totalrevenue = this.totalrevenue + this.chartData[i].recognized_revenue;
      this.totalbillinghours = this.totalbillinghours + this.chartData[i].billable_hours;
      this.totalnonbillinghours = this.totalnonbillinghours + this.chartData[i].non_billable_hours;
      this.totalinternalhours = this.totalinternalhours + this.chartData[i].internal_hours;
      this.totalholidayhours = this.totalholidayhours + this.chartData[i].holiday_hours;
      this.totalptohours = this.totalptohours + this.chartData[i].pto_hours;
      this.totalspecialleavehours = this.totalspecialleavehours + this.chartData[i].special_leave_hours;
    }


    //margin formula:-margin = 100 * (revenue - costs) / revenue
    this.margin = this.roundTo(100 * (this.totalrevenue - this.totalcost) / this.totalrevenue, 2);
    if (!isFinite(this.margin)) {
      this.margin = 0;
    }
    let totalhours = this.totalbillinghours + this.totalnonbillinghours + this.totalinternalhours + this.totalholidayhours + this.totalptohours;
    this.utilization = this.roundTo((this.totalbillinghours / totalhours) * 100, 2);
    if (!isFinite(this.utilization)) {
      this.utilization = 0;
    }

    //adding k or m to total cost and revenue
    if (this.totalcost >= 1000 && this.totalcost <= 999999) {
      this.totalcost = this.roundTo((this.totalcost / 1000), 2) + 'K';
    } else if (this.totalcost >= 1000000 && this.totalcost <= 99999999) {
      this.totalcost = this.roundTo((this.totalcost / 1000000), 2) + 'M';
    } else if (this.totalcost >= 0 && this.totalcost <= 1000) {
      this.totalcost = this.totalcost;
    }
    if (this.totalrevenue >= 1000 && this.totalrevenue <= 999999) {
      this.totalrevenue = this.roundTo((this.totalrevenue / 1000), 2) + 'K';
    } else if (this.totalrevenue >= 1000000 && this.totalrevenue <= 99999999) {
      this.totalrevenue = this.roundTo((this.totalrevenue / 1000000), 2) + 'M';
    } else if (this.totalrevenue >= 0 && this.totalrevenue <= 1000) {
      this.totalrevenue = this.totalrevenue;
    }
    //$('#loadingEditSubmitModal').modal('hide');
  }
  roundTo(num: number, places: number) {
    let factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

  yearMonthChart() {
    if (this.barCanvas) {
      this.barCanvas.destroy();
    }

    //console.log('button click');
    console.log(this.chartData, 'chartdata');
    this.yearMonthLabels = [];
    this.yearMonthCostData = [];
    this.yearMonthRevenueData = [];

    let uniqueYearMonths = [];
    uniqueYearMonths = this.getUniqueDataAfterFilter(this.chartData, "yearmonth");
    //console.log(uniqueYearMonths, 'yearmonths');
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      let obj = {
        "yearmonth": uniqueYearMonths[i].yearmonth
      }
      let yearMonthChartData = this.filterArray(this.chartData, obj);
      let costsum = 0;
      let revenuesum = 0;
      for (let j = 0; j < yearMonthChartData.length; j++) {

        costsum = costsum + yearMonthChartData[j].recognized_cost;
        revenuesum = revenuesum + yearMonthChartData[j].recognized_revenue;
      }
      this.yearMonthLabels.push((uniqueYearMonths[i].year + '/' + uniqueYearMonths[i].month));
      this.yearMonthCostData.push(Math.round(costsum));
      this.yearMonthRevenueData.push(Math.round(revenuesum));
    }

    this.barCanvas = new Chart('barCanvas', {
      type: 'bar',
      data: {

        labels: this.yearMonthLabels,
        datasets: [{
          label: "Cost",
          backgroundColor: "rgb(8 77 188)",
          borderColor: "rgb(8 77 188)",
          hoverBackgroundColor: "rgb(8 77 188)",
          hoverBorderColor: "rgb(8 77 188)",
          data: this.yearMonthCostData,
          barThickness: 14,
          categoryPercentage: 0.25,
          barPercentage: 1.0
          // barPercentage: .325,
          // categoryPercentage: .5,
          // borderWidth: 5,
          // borderSkipped: false
        }, {
          label: "Revenue",
          backgroundColor: "rgb(58 129 243)",
          borderColor: "rgb(58 129 243)",
          hoverBackgroundColor: "rgb(58 129 243)",
          hoverBorderColor: "rgb(58 129 243)",
          data: this.yearMonthRevenueData,
          barThickness: 14,
          categoryPercentage: 0.25,
          barPercentage: 1.0
          // barPercentage: .325,
          // categoryPercentage: .5,
          // borderRadius: 5,
          // borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
            }
          }
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 5,
            usePointStyle: true
          }
        },
        scales: {
          yAxes: [{
            gridLines: {
              display: false
            },
            stacked: false,
            ticks: {
              beginAtZero: true,
              //stepSize: 2000,
              callback: function (value, index) {
                let tick = '';
                if (value >= 1000 && value <= 999999) {
                  tick = (value / 1000) + 'K';
                } else if (value >= 1000000 && value <= 9999999) {
                  tick = (value / 1000000) + 'M';
                } else if (value >= 0 && value <= 1000) {
                  tick = value;
                }
                return tick;
              }
            },
          }],
          xAxes: [{
            stacked: false,
            gridLines: {
              color: "transparent",
              display: false
            }
          }]
        },
        
      }
    });
  }

  hoursBreakDownChart() {
    if (this.hoursChart) {
      this.hoursChart.destroy();
    }

    //console.log('button click');
    //console.log(this.chartData, 'chartdata');
    this.yearMonthLabels = [];
    this.yearMonthBillableHours = [];
    this.yearMonthNonBillableHours = [];
    this.yearMonthInternalHours = [];
    this.yearMonthPtoHours = [];

    let uniqueYearMonths = [];
    uniqueYearMonths = this.getUniqueDataAfterFilter(this.chartData, "yearmonth");
    //console.log(uniqueYearMonths, 'yearmonths');
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      let obj = {
        "yearmonth": uniqueYearMonths[i].yearmonth
      }
      let yearMonthChartData = this.filterArray(this.chartData, obj);
      let billableHoursSum = 0;
      let nonBillableHoursSum = 0;
      let internalHoursSum = 0;
      let ptoHoursSum = 0;
      for (let j = 0; j < yearMonthChartData.length; j++) {

        billableHoursSum = billableHoursSum + yearMonthChartData[j].billable_hours;
        nonBillableHoursSum = nonBillableHoursSum + yearMonthChartData[j].non_billable_hours;
        internalHoursSum = internalHoursSum + yearMonthChartData[j].internal_hours;
        ptoHoursSum = ptoHoursSum + yearMonthChartData[j].pto_hours;
      }
      this.yearMonthLabels.push((uniqueYearMonths[i].year + '/' + uniqueYearMonths[i].month));
      this.yearMonthBillableHours.push(Math.round(billableHoursSum));
      this.yearMonthNonBillableHours.push(Math.round(nonBillableHoursSum));
      this.yearMonthInternalHours.push(Math.round(internalHoursSum));
      this.yearMonthPtoHours.push(Math.round(ptoHoursSum));
    }

    this.hoursChart = new Chart('hourschart', {
      type: 'bar',
      data: {

        labels: this.yearMonthLabels,
        datasets: [{
          label: "Billable",
          backgroundColor: "rgb(8 77 188)",
          borderColor: "rgb(8 77 188)",
          hoverBackgroundColor: "rgb(8 77 188)",
          hoverBorderColor: "rgb(8 77 188)",
          data: this.yearMonthBillableHours,
          barThickness: 14,
          categoryPercentage: 0.25,
          barPercentage: 1.0
        }, {
          label: "Non Billable",
          backgroundColor: "rgb(58 129 243)",
          borderColor: "rgb(58 129 243)",
          hoverBackgroundColor: "rgb(58 129 243)",
          hoverBorderColor: "rgb(58 129 243)",
          data: this.yearMonthNonBillableHours,
          barThickness: 14,
          categoryPercentage: 0.25,
          barPercentage: 1.0
        }, {
          label: "Internal",
          backgroundColor: "#ff9c01",
          borderColor: "#ff9c01",
          hoverBackgroundColor: "#ff9c01",
          hoverBorderColor: "#ff9c01",
          data: this.yearMonthInternalHours,
          barThickness: 14,
          categoryPercentage: 0.25,
          barPercentage: 1.0
        },
        {
          label: "PTO",
          backgroundColor: "#084dbc",
          borderColor: "#084dbc",
          hoverBackgroundColor: "#084dbc",
          hoverBorderColor: "#084dbc",
          data: this.yearMonthPtoHours,
          barThickness: 14,
          categoryPercentage: 0.25,
          barPercentage: 1.0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
            }
          }
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 5,
            usePointStyle: true
          }
        },
        scales: {
          yAxes: [{
            gridLines: {
              display: false
            },
            stacked: false,
            ticks: {
              beginAtZero: true,
              //stepSize: 2000,
              callback: function (value, index) {
                let tick = '';
                if (value >= 1000 && value <= 999999) {
                  tick = (value / 1000) + 'K';
                } else if (value >= 1000000 && value <= 9999999) {
                  tick = (value / 1000000) + 'M';
                } else if (value >= 0 && value <= 1000) {
                  tick = value;
                }
                return tick;
              }
            },
          }],
          xAxes: [{
            stacked: false,
            gridLines: {
              color: "transparent",
              display: false
            }
          }]
        }
      }
    });
  }

  employeeUtilChart() {
    if (this.empUtilCanvas) {
      this.empUtilCanvas.destroy();
    }

    //console.log('button click');
    //console.log(this.chartData, 'chartdata');
    //$('#loadingEditSubmitModal').modal('show');
    let empUtilLabels = ["0", "20", "40", "60", "80", "100"]
    this.employeesUtil = [];

    let uniqueEmps = [];
    uniqueEmps = this.getUniqueDataAfterFilter(this.chartData, "employee");
    let empLabels = [];

    //console.log(uniqueEmps, 'uniqueEmps');

    for (let i = 0; i < uniqueEmps.length; i++) {
      let obj = {
        "employee": uniqueEmps[i].employee
      }

      let empUtilData = this.filterArray(this.chartData, obj);
      let utilization = 0;
      let billableHoursSum = 0;
      let nonBillableHoursSum = 0;
      let internalHoursSum = 0;
      let ptoHoursSum = 0;
      let holidayHoursSum = 0;
      for (let j = 0; j < empUtilData.length; j++) {

        billableHoursSum = billableHoursSum + empUtilData[j].billable_hours;
        nonBillableHoursSum = nonBillableHoursSum + empUtilData[j].non_billable_hours;
        internalHoursSum = internalHoursSum + empUtilData[j].internal_hours;
        ptoHoursSum = ptoHoursSum + empUtilData[j].pto_hours;
        holidayHoursSum = holidayHoursSum + empUtilData[j].holiday_hours;
      }
      let totalhours = billableHoursSum + nonBillableHoursSum + internalHoursSum + holidayHoursSum + ptoHoursSum;
      utilization = this.roundTo((billableHoursSum / totalhours) * 100, 2);
      if (!isFinite(utilization)) {
        utilization = 0;
      }
      let utilObj = {
        "employee": uniqueEmps[i].employee,
        "utilization": utilization
      }
      this.employeesUtil.push(utilObj);
    }
    let sortedData = this.employeesUtil.sort(this.GetSortOrder('utilization'));
    //console.log(sortedData, 'sortedData');
    let utilData = sortedData.map(x => x.utilization);
    empLabels = sortedData.map(x => x.employee);
    this.calcHeight(empLabels.length, 'empUtil');

    this.empUtilCanvas = new Chart('empUtilCanvas', {
      type: 'horizontalBar',
      plugins: [ChartDataLabels],
      data: {

        labels: empLabels,
        datasets: [{
          label: "Utilization",
          backgroundColor: "#03a9f4",
          borderColor: "#03a9f4",
          hoverBackgroundColor: "#03a9f4",
          hoverBorderColor: "#03a9f4",
          data: utilData,
          barThickness: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 5,
            usePointStyle: true
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Utilization',
              fontStyle: 'bold'
            },
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              min:0,
              max:100,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Employee',
              fontStyle: 'bold'
            },
            stacked: true,
            gridLines: {
              color: "transparent",
              display: false
            },
            ticks: {
              beginAtZero: true,
            },
          }]
        },
        plugins: {
          datalabels: {
            display: true,
            formatter: function(value, context) {
              return value + '%';
            },
            color: 'Black',
            anchor: 'start',
            align:'end'
          }
        }
      }
    });

  }

  hoursByProjectChart() {
    if (this.hoursByProjectCanvas) {
      this.hoursByProjectCanvas.destroy();
    }

    this.projectTotalHours = [];
    let projectBillingHours = [];
    let projectNonBillingHours = [];
    let projectInternalHours = [];
    let projectPtoHours = [];
    let projectHolidayHours = [];

   let customerCost=[];
   let customerRevenue=[];

    let uniqueprojects = [];
    uniqueprojects = this.getUniqueDataAfterFilter(this.chartData, "customer");
    let projectLabels = [];

    //console.log(uniqueprojects, 'uniqueprojects');

    for (let i = 0; i < uniqueprojects.length; i++) {
      //projectLabels.push(uniqueprojects[i].project);
      let obj = {
        "customer": uniqueprojects[i].customer
      }

      let projectHoursData = this.filterArray(this.chartData, obj);
      let utilization = 0;
      let billableHoursSum = 0;
      let nonBillableHoursSum = 0;
      let internalHoursSum = 0;
      let ptoHoursSum = 0;
      let holidayHoursSum = 0;
      for (let j = 0; j < projectHoursData.length; j++) {

        billableHoursSum = billableHoursSum + projectHoursData[j].billable_hours;
        nonBillableHoursSum = nonBillableHoursSum + projectHoursData[j].non_billable_hours;
        internalHoursSum = internalHoursSum + projectHoursData[j].internal_hours;
        ptoHoursSum = ptoHoursSum + projectHoursData[j].pto_hours;
        holidayHoursSum = holidayHoursSum + projectHoursData[j].holiday_hours;
      }

      let totalHours = billableHoursSum + nonBillableHoursSum + internalHoursSum + ptoHoursSum + holidayHoursSum;
      let projectHours = {
        "project": uniqueprojects[i].project,
        "totalHours": totalHours,
        "billingHours": billableHoursSum,
        "nonBillingHours": nonBillableHoursSum,
        "internalHours": internalHoursSum,
        "ptoHours":ptoHoursSum,
        "holidayHours":holidayHoursSum
      };
      this.projectTotalHours.push(projectHours);
      

    }
    let sortedProjectHours = this.projectTotalHours.sort(this.GetSortOrder('totalHours')).reverse();
      projectLabels = sortedProjectHours.map(x => x.project);
      projectBillingHours = sortedProjectHours.map(x => x.billingHours);
      projectNonBillingHours = sortedProjectHours.map(x => x.nonBillingHours);
      projectInternalHours = sortedProjectHours.map(x => x.internalHours);
      projectPtoHours = sortedProjectHours.map(x => x.ptoHours);
      projectHolidayHours = sortedProjectHours.map(x => x.holidayHours);
    this.calcProjectHeight(projectLabels.length);

    this.hoursByProjectCanvas = new Chart('hoursByProjectCanvas', {
      type: 'horizontalBar',
      data: {

        labels: projectLabels,
        datasets: [{
          label: "Billable",
          backgroundColor: "#03a9f4",
          borderColor: "#03a9f4",
          hoverBackgroundColor: "#03a9f4",
          hoverBorderColor: "#03a9f4",
          data: projectBillingHours,
          barThickness: 10
        },
        {
          label: "PTO",
          backgroundColor: "#99c14e",
          borderColor: "#99c14e",
          hoverBackgroundColor: "#99c14e",
          hoverBorderColor: "#99c14e",
          data: projectPtoHours,
          barThickness: 10
        },
        {
          label: "Internal",
          backgroundColor: "#ff7676",
          borderColor: "#ff7676",
          hoverBackgroundColor: "#ff7676",
          hoverBorderColor: "#ff7676",
          data: projectInternalHours,
          barThickness: 10
        },
        {
          label: "Holiday",
          backgroundColor: "#ff9c01",
          borderColor: "#ff9c01",
          hoverBackgroundColor: "#ff9c01",
          hoverBorderColor: "#ff9c01",
          data: projectHolidayHours,
          barThickness: 10
        },
        {
          label: "NonBillable",
          backgroundColor: "#084dbc",
          borderColor: "#084dbc",
          hoverBackgroundColor: "#084dbc",
          hoverBorderColor: "#084dbc",
          data: projectNonBillingHours,
          barThickness: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 5,
            usePointStyle: true
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Billable,NonBillable,Internal,PTO,Holiday',
              fontStyle: 'bold'
            },
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              callback: function (value, index) {
                let tick = '';
                if (value >= 1000 && value <= 999999) {
                  tick = (value / 1000) + 'K';
                } else if (value >= 1000000 && value <= 9999999) {
                  tick = (value / 1000000) + 'M';
                } else if (value >= 0 && value <= 1000) {
                  tick = value;
                }
                return tick;
              }
            },
            stacked: true
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Project',
              fontStyle: 'bold'
            },
            stacked: true,
            gridLines: {
              color: "transparent",
              display: false
            }
          }]
        }
      }
    });

  }

  revenueByEmployee() {
    if (this.revenueByEmpCanvas) {
      this.revenueByEmpCanvas.destroy();
    }
    this.employeesRevenue = [];

    let uniqueEmps = [];
    uniqueEmps = this.getUniqueDataAfterFilter(this.chartData, "employee");
    let empLabels = [];

    //console.log(uniqueEmps, 'uniqueEmps');

    for (let i = 0; i < uniqueEmps.length; i++) {
      let obj = {
        "employee": uniqueEmps[i].employee
      }

      let empRevenueData = this.filterArray(this.chartData, obj);
      let revenueSum = 0;
      for (let j = 0; j < empRevenueData.length; j++) {
        revenueSum = revenueSum + empRevenueData[j].recognized_revenue;
      }
      let empRevObj = {
        "employee": uniqueEmps[i].employee,
        "revenue": Math.round(revenueSum)
      }
      this.employeesRevenue.push(empRevObj);

    }
    let sortedEmpRevenues = this.employeesRevenue.sort(this.GetSortOrder('revenue')).reverse();
    empLabels = sortedEmpRevenues.map(x => x.employee);
    let revenueData = [];
    revenueData = sortedEmpRevenues.map(x => x.revenue);
    this.calcHeight(empLabels.length, 'empRevenue');

    this.revenueByEmpCanvas = new Chart('revenueByEmpCanvas', {
      type: 'horizontalBar',
      plugins: [ChartDataLabels],
      data: {

        labels: empLabels,
        datasets: [{
          label: "Revenue",
          backgroundColor: "#03a9f4",
          borderColor: "#03a9f4",
          hoverBackgroundColor: "#03a9f4",
          hoverBorderColor: "#03a9f4",
          data: revenueData,
          barThickness: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.xLabel.toLocaleString();
            }
          }
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 5,
            usePointStyle: true
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revenue',
              fontStyle: 'bold'
            },
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              //stepSize: 2000,
              callback: function (value, index) {
                let tick = '';
                if (value >= 1000 && value <= 999999) {
                  tick = (value / 1000) + 'K';
                } else if (value >= 1000000 && value <= 9999999) {
                  tick = (value / 1000000) + 'M';
                } else if (value >= 0 && value <= 1000) {
                  tick = value;
                }
                return tick;
              }
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Employee',
              fontStyle: 'bold'
            },
            stacked: true,
            gridLines: {
              color: "transparent",
              display: false
            }
          }]
        },
        plugins: {
          datalabels: {
            display: true,
            color: 'Black',
            anchor: 'end',
            align:'end'
          }
        }
      }
    });

  }


  hoursByEmpMonthGrid() {
    this.hoursEmpMonthGridData = [];
    this.hoursEmpMonthGridColumns = [];
    let yearMonths = this.getUniqueDataAfterFilter(this.chartData, 'yearmonth');
    let uniqueYearMonths = [];
    let employees = this.getUniqueDataAfterFilter(this.chartData, 'employee');
    let uniqueEmps = [];
    //add projects hours by employee
    let projects = this.getUniqueDataAfterFilter(this.chartData, 'project');
    let uniqueProjects = [];
    let projectData = [];
    let projectEmpYMData = [];
    let projObj = {};
    for (let i = 0; i < projects.length; i++) {
      uniqueProjects.push(projects[i].project);
    }
    //console.log(uniqueProjects, 'uniqpproj');
    for (let i = 0; i < yearMonths.length; i++) {
      uniqueYearMonths.push(yearMonths[i].yearmonth);
    }
    for (let j = 0; j < employees.length; j++) {
      uniqueEmps.push(employees[j].employee);
    }
    //console.log(uniqueYearMonths);
    for (let i = 0; i < uniqueEmps.length; i++) {
      this.gridObj['Employee'] = uniqueEmps[i];
      projectEmpYMData = this.getProjEmpYearMonthData(uniqueEmps[i], 'projectHours');
      this.gridObj['project'] = projectEmpYMData;
      for (let j = 0; j < uniqueYearMonths.length; j++) {
        let obj = {
          "employee": uniqueEmps[i],
          "yearmonth": uniqueYearMonths[j],

        }
        let yearMonthEmpData = [];
        yearMonthEmpData = this.filterArray(this.chartData, obj);
        let billableHoursSum = 0;
        let nonBillableHoursSum = 0;
        for (let k = 0; k < yearMonthEmpData.length; k++) {
          billableHoursSum = billableHoursSum + yearMonthEmpData[k].billable_hours;
          nonBillableHoursSum = nonBillableHoursSum + yearMonthEmpData[k].non_billable_hours;
        }
        let totalHours = 0;
        totalHours = Math.round(billableHoursSum + nonBillableHoursSum);
        this.gridObj[uniqueYearMonths[j].toString()] = totalHours;


      }



      this.hoursEmpMonthGridData.push(this.gridObj);

      //this.projectObj = {};
      //projectData = [];
      this.gridObj = {};

    }
    this.columnDefs = this.generateColumns(this.hoursEmpMonthGridData);
    let tableColumns = this.columnDefs.filter(function (el) {
      return el['field'] != 'project';
    });
    this.hoursEmpMonthGridColumns = tableColumns.map(x => x.field);
    this.rowData = this.hoursEmpMonthGridData;
    //console.log(this.hoursEmpMonthGridColumns, 'hoursEmpMonthGridColumns');
    //console.log(this.hoursEmpMonthGridData, 'grid');

    //footer totals
    this.hoursEmpMonthGridTotalObjArray=[];
    for (let i = 0; i < this.hoursEmpMonthGridColumns.length; i++) {
      
      let prop = this.hoursEmpMonthGridColumns[i];
      if (prop !== 'Employee') {
        let propSum = 0;
        for (let j = 0; j < this.hoursEmpMonthGridData.length; j++) {
          propSum = propSum + this.hoursEmpMonthGridData[j][prop];
        }
        this.hoursEmpMonthGridTotalObjArray.push(propSum);
        //this.hoursEmpMonthGridTotalObj[prop] = propSum;
        propSum = 0;
      }
      
    }
    //this.hoursEmpMonthGridTotalObjArray.push(this.hoursEmpMonthGridTotalObj);
  }

  getProjEmpYearMonthData(empName, dataType) {
    let projectData = [];
    let ProjObj = {};
    let yearMonths = this.getUniqueDataAfterFilter(this.chartData, 'yearmonth');
    let uniqueYearMonths = [];
    //let employees = this.getUniqueDataAfterFilter(this.chartData, 'employee');
    //let uniqueEmps = [];
    //add projects hours by employee
    let projects = this.getUniqueDataAfterFilter(this.chartData, 'project');
    let uniqueProjects = [];
    for (let i = 0; i < projects.length; i++) {
      uniqueProjects.push(projects[i].project);
    }
    //console.log(uniqueProjects, 'uniqpproj');
    for (let i = 0; i < yearMonths.length; i++) {
      uniqueYearMonths.push(yearMonths[i].yearmonth);
    }
    // for (let j = 0; j < employees.length; j++) {
    //   uniqueEmps.push(employees[j].employee);
    // }
    //console.log(uniqueYearMonths);

    for (let j = 0; j < uniqueProjects.length; j++) {

      for (let i = 0; i < uniqueYearMonths.length; i++) {
        let filterObj = {
          "employee": empName,
          "project": uniqueProjects[j],
          "yearmonth": uniqueYearMonths[i]
        }
        let projEmpYearMonthData = [];
        projEmpYearMonthData = this.filterArray(this.chartData, filterObj);
        if (projEmpYearMonthData.length === null || projEmpYearMonthData.length === 0) {

        } else {
          ProjObj['Employee'] = uniqueProjects[j];
          let billableHoursSum = 0;
          let nonBillableHoursSum = 0;
          let revenueSum = 0;
          if (dataType === 'projectHours') {
            for (let k = 0; k < projEmpYearMonthData.length; k++) {
              billableHoursSum = billableHoursSum + projEmpYearMonthData[k].billable_hours;
              nonBillableHoursSum = nonBillableHoursSum + projEmpYearMonthData[k].non_billable_hours;
            }
            let totalHours = 0;
            totalHours = Math.round(billableHoursSum + nonBillableHoursSum);
            ProjObj[uniqueYearMonths[i].toString()] = totalHours;
          } else if (dataType === 'projectRevenue') {
            for (let k = 0; k < projEmpYearMonthData.length; k++) {
              revenueSum = revenueSum + projEmpYearMonthData[k].recognized_revenue;
            }
            let totalRevenue = 0;
            totalRevenue = Math.round(revenueSum);
            ProjObj[uniqueYearMonths[i].toString()] = totalRevenue;
          }

        }
      }
      if (Object.keys(ProjObj).length !== 0) {
        projectData.push(ProjObj);
      } else {

      }
      ProjObj = {};


    }



    return projectData;
  }
  monthOnMonthRevenueGrid() {
    this.monthOnMonthGridData = [];
    this.monthOnMonthGridColumns = [];
    let yearMonths = this.getUniqueDataAfterFilter(this.chartData, 'yearmonth');
    let uniqueYearMonths = [];
    let employees = this.getUniqueDataAfterFilter(this.chartData, 'employee');
    let uniqueEmps = [];
    let projectEmpYMData = [];

    for (let i = 0; i < yearMonths.length; i++) {
      uniqueYearMonths.push(yearMonths[i].yearmonth);
    }
    for (let j = 0; j < employees.length; j++) {
      uniqueEmps.push(employees[j].employee);
    }
    //console.log(uniqueYearMonths);
    for (let i = 0; i < uniqueEmps.length; i++) {
      this.monthgridObj['Employee'] = uniqueEmps[i];
      projectEmpYMData = this.getProjEmpYearMonthData(uniqueEmps[i], 'projectRevenue');
      //console.log(projectEmpYMData, 'revenue');
      this.monthgridObj['project'] = projectEmpYMData;
      for (let j = 0; j < uniqueYearMonths.length; j++) {
        let obj = {
          "employee": uniqueEmps[i],
          "yearmonth": uniqueYearMonths[j],

        }
        let yearMonthEmpData = [];
        yearMonthEmpData = this.filterArray(this.chartData, obj);
        let revenueSum = 0;
        for (let k = 0; k < yearMonthEmpData.length; k++) {
          revenueSum = revenueSum + yearMonthEmpData[k].recognized_revenue;
        }

        this.monthgridObj[uniqueYearMonths[j].toString()] = Math.round(revenueSum);;


      }
      this.monthOnMonthGridData.push(this.monthgridObj);
      this.monthgridObj = {};

    }
    this.monthColumnDefs = this.generateColumns(this.monthOnMonthGridData);
    let tableColumns = this.monthColumnDefs.filter(function (el) {
      return el['field'] != 'project';
    });
    this.monthOnMonthGridColumns = tableColumns.map(x => x.field);
    this.monthRowData = this.monthOnMonthGridData;
    //console.log(this.monthOnMonthGridData, 'grid');

     //footer totals
     this.monthOnMonthGridTotalObjArray=[];
     for (let i = 0; i < this.monthOnMonthGridColumns.length; i++) {
       
       let prop = this.monthOnMonthGridColumns[i];
       if (prop !== 'Employee') {
         let propSum = 0;
         for (let j = 0; j < this.monthOnMonthGridData.length; j++) {
           propSum = propSum + this.monthOnMonthGridData[j][prop];
         }
         this.monthOnMonthGridTotalObjArray.push(propSum);
         //this.hoursEmpMonthGridTotalObj[prop] = propSum;
         propSum = 0;
       }
       
     }
  }

  utilByLevelsGrid() {
    this.utilByLevelsGridData = [];
    this.utilByLevelsGridColumns = [];
    let yearMonths = this.getUniqueDataAfterFilter(this.chartData, 'yearmonth');
    let uniqueYearMonths = [];
    let jobCodes = this.getUniqueDataAfterFilter(this.chartData, 'Job_Code');
    let uniquejobCodes = [];
    for (let i = 0; i < yearMonths.length; i++) {
      uniqueYearMonths.push(yearMonths[i].yearmonth);
    }
    for (let j = 0; j < jobCodes.length; j++) {
      uniquejobCodes.push(jobCodes[j].Job_Code);
    }
    //console.log(uniquejobCodes);
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      this.utilByLevelsObj['YearMonth'] = uniqueYearMonths[i];
      for (let j = 0; j < uniquejobCodes.length; j++) {
        let obj = {
          "yearmonth": uniqueYearMonths[i],
          "Job_Code": uniquejobCodes[j]
        }

        let yearMonthLevelData = [];
        yearMonthLevelData = this.filterArray(this.chartData, obj);
        let utilization = 0;
        let billableHoursSum = 0;
        let nonBillableHoursSum = 0;
        let internalHoursSum = 0;
        let ptoHoursSum = 0;
        let holidayHoursSum = 0;
        for (let k = 0; k < yearMonthLevelData.length; k++) {
          billableHoursSum = billableHoursSum + yearMonthLevelData[k].billable_hours;
          nonBillableHoursSum = nonBillableHoursSum + yearMonthLevelData[k].non_billable_hours;
          internalHoursSum = internalHoursSum + yearMonthLevelData[k].internal_hours;
          ptoHoursSum = ptoHoursSum + yearMonthLevelData[k].pto_hours;
          holidayHoursSum = holidayHoursSum + yearMonthLevelData[k].holiday_hours;
        }
        let totalhours = billableHoursSum + nonBillableHoursSum + internalHoursSum + holidayHoursSum + ptoHoursSum;
        utilization = this.roundTo((billableHoursSum / totalhours) * 100, 2);
        if (!isFinite(utilization)) {
          utilization = 0;
        }
        this.utilByLevelsObj[uniquejobCodes[j].toString()] = utilization;


      }
      this.utilByLevelsGridData.push(this.utilByLevelsObj);
      this.utilByLevelsObj = {};

    }
    this.utilByLevelsColumnDefs = this.generateColumns(this.utilByLevelsGridData);
    this.utilByLevelsGridColumns = this.utilByLevelsColumnDefs.map(x => x.field);
    this.utilByLevelsRowData = this.utilByLevelsGridData;
    //console.log(this.utilByLevelsColumnDefs, 'columndef');
    //console.log(this.utilByLevelsGridData, 'grid');
  }
  generateColumns(data: any[]) {
    let columnDefinitions = [];

    data.map(object => {
      Object.keys(object).map(key => {
        let mappedColumn = {}
        if (key === 'employee') {
          mappedColumn = {
            headerName: key.toUpperCase(),
            field: key
          }
        } else {
          mappedColumn = {
            headerName: key.toUpperCase(),
            field: key,
            sortable: true
          }
        }
        columnDefinitions.push(mappedColumn);
      })
    })
    //Remove duplicate columns
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    )
    let sortedColumns = columnDefinitions.sort(this.GetSortOrder('field'));
    return sortedColumns.reverse();
  }
  calcHeight(numOfBars, fromChart) {
    var maxHeightOfChart = 250;
    var minHeight = 20; //setting the min height of the bar + margin between
    var chartHeight = minHeight * numOfBars > maxHeightOfChart ? minHeight * numOfBars : maxHeightOfChart;
    if (fromChart === 'empUtil') {
      document.getElementById("canvasContainer").style.height = chartHeight.toString() + "px";
    } else if (fromChart === 'empRevenue') {
      document.getElementById("empRevenueCanvasContainer").style.height = chartHeight.toString() + "px";
    }


  }
  calcProjectHeight(numOfBars) {
    var maxHeightOfChart = 250;
    var minHeight = 20; //setting the min height of the bar + margin between
    var chartHeight = minHeight * numOfBars > maxHeightOfChart ? minHeight * numOfBars : maxHeightOfChart;
    document.getElementById("customerViewCanvasContainer").style.height = chartHeight.toString() + "px";
  }

  downloadData(fromGrid:any){
    // console.log(fromGrid);
    switch (fromGrid){
      case 'monthOnMonthRevenue':
      this.pAndLsvc.exportToCsv(this.monthOnMonthGridData,'monthOnMonthRevenue');
      break;
      case 'hoursByEmployeeMonth':
      this.pAndLsvc.exportToCsv(this.hoursEmpMonthGridData,'hoursByEmployee');
      break;
      case 'revenueBreakDownByEmployee':
      this.pAndLsvc.exportToCsv(this.employeesRevenue,'revenueByEmployee');
      break;
      case 'hoursBreakdownByProject':
      this.pAndLsvc.exportToCsv(this.projectTotalHours,'projectTotalHours');
      break;
      case 'employeeUtilization':
      this.pAndLsvc.exportToCsv(this.employeesUtil,'employeesUtil');
      break;
      case 'utilizationByLevels':
      this.pAndLsvc.exportToCsv(this.utilByLevelsGridData,'utilizationByLevels');
      break;
    }
    }

refresh() {
  this.getdata();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
}

Chart['elements'].Rectangle.prototype.draw = function () {
  let ctx = this._chart.ctx;
  let view = this._view;
  let left, right, top, bottom, signX, signY, borderSkipped;
  let borderWidth = view.borderWidth;

  //////////////////// edit this to change how rounded the edges are /////////////////////
  let borderRadius = 4;

  if (!view.horizontal) {
    // bar
    left = view.x - view.width / 2;
    right = view.x + view.width / 2;
    top = view.y;
    bottom = view.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = view.borderSkipped || 'bottom';
  } else {
    // horizontal bar
    left = view.base;
    right = view.x;
    top = view.y - view.height / 2;
    bottom = view.y + view.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = view.borderSkipped || 'left';
  }
  // let left = view.x - view.width / 2;
  // let right = view.x + view.width / 2;
  // let top = view.y;
  // let bottom = view.base;

  ctx.beginPath();
  ctx.fillStyle = view.backgroundColor;
  ctx.strokeStyle = view.borderColor;
  ctx.lineWidth = view.borderWidth;

  let barCorners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom]
  ];

  //start in bottom-left
  ctx.moveTo(barCorners[0][0], barCorners[0][1]);

  for (let i = 1; i < 4; i++) {
    let x = barCorners[1][0];
    let y = barCorners[1][1];
    let width = barCorners[2][0] - barCorners[1][0];
    let height = barCorners[0][1] - barCorners[1][1];


    //Fix radius being too big for small values
    if (borderRadius > width / 2) {
      borderRadius = width / 2;
    }
    if (borderRadius > height / 2) {
      borderRadius = height / 2;
    }



    // DRAW THE LINES THAT WILL BE FILLED - REPLACING lineTo with quadraticCurveTo CAUSES MORE EDGES TO BECOME ROUNDED
    ctx.moveTo(x + borderRadius, y);
    ctx.lineTo(x + width - borderRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    ctx.lineTo(x + width, y + height - borderRadius);
    ctx.lineTo(x + width, y + height, x + width - borderRadius, y + height);
    ctx.lineTo(x + borderRadius, y + height);
    ctx.lineTo(x, y + height, x, y + height - borderRadius);
    ctx.lineTo(x, y + borderRadius);
    ctx.quadraticCurveTo(x, y, x + borderRadius, y);

  }

  //ctx.parentElement.style.width = width +'px';
  //FILL THE LINES
  ctx.fill();
};
