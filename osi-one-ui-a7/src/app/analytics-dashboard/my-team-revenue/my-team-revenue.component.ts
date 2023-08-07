import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment'
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ToastrService } from 'ngx-toastr';
import { ExportFileService } from '../../shared/services/export-file.service';

@Component({
  selector: 'app-my-team-revenue',
  templateUrl: './my-team-revenue.component.html',
  styleUrls: ['./my-team-revenue.component.css']
})
export class MyTeamRevenueComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  // empOrg: any = "*";
  // empXferOrg: any = "*";
  // empPract: any = "*";
  // empSubPract: any = "*";
  // projName: any = "*";
  // empName: any = "*";
  empYear: any = moment().year();
  // client: any = "*";
  minEmpYear = moment().year() - 1;
  maxEmpYear = moment().year();

  myTeamRevenueChart: Chart;

  dropdownSettings = {};
  spinner: boolean = false;
  empXferOrgData: any = [];
  empPracticeData: any = [];
  empSubPracticeData: any = [];
  empProjectData: any = [];
  empYearData: any = [];
  empMinYearData: any = [];
  empMaxYearData: any = [];


  clientData: any = [];
  projects: any = [];
  organizations = [];
  employees = [];
  clients = [];

  projectData: any = [];
  employeeData: any = [];
  customerData: any = [];
  empOrgData: any = [];

  allOrgData: any = [];
  allProjectsData: any = [];
  allEmployeeData: any = [];
  allClientsData: any = [];
  empOrg: any = [];
  empProject: any = [];
  employee: any = [];
  client: any = [];

  months: any = [{'id': 1, 'value': 'Jan'},{'id': 2, 'value': 'Feb'},{'id': 3, 'value': 'Mar'},{'id': 4, 'value': 'Apr'},{'id': 5, 'value': 'May'},{'id': 6, 'value': 'Jun'},{'id': 7, 'value': 'Jul'},{'id': 8, 'value': 'Aug'},{'id': 9, 'value': 'Sept'},{'id': 10, 'value': 'Oct'},{'id': 11, 'value': 'Nov'},{'id': 12, 'value': 'Dec'}];
  monthArray: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthData: any = [];
  myTeamRevenueData: any = [];
  monthArrayOfMinYear: any = [];
  monthArrayOfMaxYear: any = [];
  monthWiseObjForMinYear = [];
  monthWiseObjForMaxYear = [];
  minMonthKeyArray: any = [];
  maxMonthKeyArray: any = [];
  minMonthObjArray: any = [];
  maxMonthObjArray: any = [];
  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private toasterService: ToastrService,
    private downloadFile: ExportFileService,
  ) { 
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'SelectAll',
      unSelectAllText: 'UnSelectAll',
      enableSearchFilter: true,
      itemsShowLimit: 2,
      classes: 'myclass custom-class'
    };
    this.getFiltersData();
  }

  getFiltersData() {
    // this.spinner = true;
    // this.resource.getFiltersDataWithCustomer().subscribe((response) => {
    //   this.spinner = false;

    //   this.getYearData(response);

    // }, (errorResponse) => {
    //   this.spinner = false;
    //   this.toasterService.error('Error Occured While Getting employee data!');
    // });
    const response: any = this.resource.getRevenueFilterData();
    this.getYearData(response);
  }

  getYearData(response: any) {
    this.spinner = true;
    this.es.getFromService(0).subscribe(res => {
      this.spinner = false;

      response['year'] = res.aggregations.by_year.buckets;
      this.bindFilterDropDownData(response);
      this.getMyTeamRevenue(this.empOrgData, this.projectData, this.employeeData, this.minEmpYear, this.maxEmpYear, this.clients);

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting year data!');
    });
  }

  updateHrsByResourceGrid() {
    this.maxEmpYear = this.empYear == '*' ? moment().year() : Number([this.empYear]);
    this.minEmpYear = this.empYear == '*' ? moment().year() - 1 : Number([this.empYear]) - 1;

    const org: any[] = this.pushToArray(this.empOrg);
    const project: any[] = this.pushToArray(this.empProject);
    const employee: any[] = this.pushToArray(this.employee);
    const client: any[] = this.pushToArray(this.client);

    this.getMyTeamRevenue(org, project, employee, this.minEmpYear, this.maxEmpYear, client);

  }

  bindFilterDropDownData(response: any) {
    this.empYearData = response.year;

    this.empYearData = this.empYearData.sort((a, b) => a.key - b.key);

    response.organisations.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    response.projects.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    response.employees.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    response.clients.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    this.empOrg = this.empOrgData = response.organisations;
    this.empProject = this.projectData = response.projects;
    this.employee = this.employeeData = response.employees;
    this.client = this.clients = response.clients;
  }

  empDropDownData(data: any) {
    const returnArr = []
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

  getIds(data: any) {
    const projectID: any = [];
    data.forEach((item) => {
      projectID.push(item.id);
    });
    return projectID;
  }

  getNames(data: any) {
    const names: any = [];
    data.forEach((item) => {
      names.push(item.itemName);
    });
    return names;
  }

  downloadDetailsInExel() {
    let downloadDetails: any;
    const file_name: any = 'my_revenue'
    const year: any = this.empYear;
    const project: any = this.getIds(this.empProject).toString();
    const org: any = this.getNames(this.empOrg).toString();
    const client: any = this.getIds(this.client).toString();
    const employee: any = this.getIds(this.employee).toString();

    const urlString: any = `year=${year}` + `&prj_organization=${org}` + `&project=${project}` + `&customer=${client}` + `&employee=${employee}`;
    this.resource.getExportToExcelData(urlString).subscribe((response) => {
      console.log('RESPONSE', response);
      downloadDetails = response.revenueRecords;
      if (downloadDetails && downloadDetails.length > 0) {
        this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
      } else {
        this.toasterService.error('Oops! No data to export');
      }
    });
  }

  getMyTeamRevenue(org: any, project: any, employee: any, minYear: any, maxYear: any, client: any) {
    this.es.getMyTeamRevenueData(employee, project, org, minYear, maxYear, client);
    this.spinner = true;
    this.es.getMyTeamRevenue().subscribe((response) => {
      this.spinner = false;
      this.isPageLoaded.emit(true); // data loaded
      this.myTeamRevenueData = response.aggregations ? response.aggregations.filtered.by_year.buckets : [];
      this.myTeamRevenueData = this.myTeamRevenueData.sort((a: any, b: any) => a.key - b.key);
      this.bindMyTeamRevenue();
    }, (errorResponse) => {
      this.isPageLoaded.emit(true); 
      this.spinner = false;
      this.toasterService.error('Error occured while my team revenue data');
    });
  }

  monthMap1: Map<number, number> = new Map<number, number>();
  monthMap2: Map<number, number> = new Map<number, number>();

  firstMonthArray : any[] = [];
  secondMonthArray : any[] = [];

  bindMyTeamRevenue() {
    this.monthArrayOfMinYear = [];
    this.monthArrayOfMaxYear = [];
    this.monthWiseObjForMinYear = [];
    this.monthWiseObjForMaxYear = [];
    this.minMonthKeyArray = [];
    this.maxMonthKeyArray = [];
    this.minMonthObjArray = [];
    this.maxMonthObjArray = [];
    this.firstMonthArray = [];
    this.secondMonthArray = [];
    this.monthData = [];

    this.myTeamRevenueData.forEach((yearWiseData) => {
      if (yearWiseData.key == this.minEmpYear) {
        this.monthArrayOfMinYear = yearWiseData.by_month.buckets;
      }
      else {
        this.monthArrayOfMaxYear = yearWiseData.by_month.buckets;
        }
      });

    this.months.forEach((month : any) =>  {
      const rec = this.monthArrayOfMinYear.find(item => item.key == month.id);
      this.monthWiseObjForMinYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.firstMonthArray.push(rec ? rec.by_revenue.value : NaN);
    })

    this.months.forEach((month : any) =>  {
      const rec = this.monthArrayOfMaxYear.find(item => item.key == month.id);
      this.monthWiseObjForMaxYear.push(this.alphaMonth(rec ? rec.key : month.id));
      this.secondMonthArray.push(rec ? rec.by_revenue.value : NaN);
    });

    this.minMonthKeyArray = Object.keys(this.monthWiseObjForMinYear);
    this.minMonthObjArray = Object.values(this.monthWiseObjForMinYear);
    this.maxMonthKeyArray = Object.keys(this.monthWiseObjForMaxYear);
    this.maxMonthObjArray = Object.values(this.monthWiseObjForMaxYear);

    this.minMonthKeyArray.forEach((item) => {
      this.monthData.push(this.monthArray[item - 1]);
    })

    this.createChart();
  }

  alphaMonth(value: any) {
    return this.months[value - 1]['value'];
  }

  onItemSelect(item: any) {
    this.getMyTeamRevenue(this.empOrg, this.empProject, this.employee, this.minEmpYear, this.maxEmpYear, this.client);
  }

  pushToArray(data: any[]) {
    const returnArray = [];
    data.forEach((item: any) => {
      returnArray.push(item.itemName);
    });
    return returnArray;
  }

  onItemDeSelect(item: any) {
    this.getMyTeamRevenue(this.empOrg, this.empProject, this.employee, this.minEmpYear, this.maxEmpYear, this.client);
  }

  onSelectAll(item: any, selectModelName:any) {
    this[selectModelName] = item;
    const org: any[] = this.empOrg;
    const project: any[] = this.empProject;
    const employee: any[] = this.employee;
    const client: any[] = this.client;

    this.getMyTeamRevenue(org, project, employee, this.minEmpYear, this.maxEmpYear, client);
  }

  onDeSelectAll(item: any, selectModelName:any) {
    this[selectModelName] = item;
    const org: any[] = this.empOrg;
    const project: any[] = this.empProject;
    const employee: any[] = this.employee;
    const client: any[] = this.client;

    this.getMyTeamRevenue(org, project, employee, this.minEmpYear, this.maxEmpYear, client);
  }

  refresh() {
    this.getFiltersData();
  }

  createChart() {
    if (this.myTeamRevenueChart) {
      this.myTeamRevenueChart.destroy();
    }
    this.myTeamRevenueChart = new Chart('myTeamRevenue', {
      type: 'line',
      data: {
        labels: this.monthWiseObjForMinYear,
        datasets: [
          {
            label: this.minEmpYear,
            data: this.firstMonthArray,
            lineTension: 0.1,
            fill: false,
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderCapStyle: 'butt',
            borderDash: [],
            borderJoinStyle: 'miter',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'blue',
            pointHoverBorderColor: 'yellow',
            pointHoverBorderWidth: 2,
            pointHitRadius: 10,
            spanGaps: false
          },
          {
            label: this.maxEmpYear,
            data: this.secondMonthArray,
            lineTension: 0.1,
            backgroundColor: 'yellow',
            borderColor: 'yellow',
            fill: false,
            borderCapStyle: 'butt',
            borderDash: [],
            borderJoinStyle: 'miter',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'yellow',
            pointHoverBorderColor: 'blue',
            pointHoverBorderWidth: 2,
            pointHitRadius: 10,
          }
        ]
      },
      options: {
        animation: {
          duration: 0,
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          enabled: true,
          mode: 'label',
          callbacks: {
            label: function (tooltipItem, data) {
              if (!data) {
                return false;
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
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
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
            scaleLabel: {
              display: true,
              labelString: 'Revenue',
              fontSize: 20
            }
          }]
        }
      }
    });
    this.isPageLoaded.emit(true);
  }


}

interface monthMap<K, V> {
  month: K
  revenue: V
}
