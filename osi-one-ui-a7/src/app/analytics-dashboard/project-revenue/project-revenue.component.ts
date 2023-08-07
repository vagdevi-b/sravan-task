import { Component, OnInit } from '@angular/core';
import { TransformDataService } from './services/transform-data.service';
import { ChartService } from './services/chart.service';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';


@Component({
  selector: 'app-project-revenue',
  templateUrl: './project-revenue.component.html',
  styleUrls: ['./project-revenue.component.css']
})
export class ProjectRevenueComponent implements OnInit {

  lineChartData = undefined;
  bubbleChartData = undefined;
  spinner: boolean = false;
  inProjRevenueData: any = [];
  selectedItems: any;
  dropdownSettings = {};
  projects: any = [];
  organizations = [];
  employees = [];
  clients = [];
  year: any = moment().year();
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

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private toasterService: ToastrService,
    private transformDataService: TransformDataService,
    private chartService: ChartService
  ) {

    this.chartService.chartDataChanged.subscribe((chartType: string) => {
      if (chartType === 'line_chart') {
        this.lineChartData = this.chartService.getChartData(chartType);
      }
      else if (chartType === 'bubble_chart') {
        this.bubbleChartData = this.chartService.getChartData(chartType);
      }
      else {
        console.log(`Unknown chart type: '${chartType}'!`);
      }
    });

    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'SelectAll',
      unSelectAllText: 'UnSelectAll',
      enableSearchFilter: true,
      badgeShowLimit: 1,
      classes: 'myclass custom-class'
    };

  }

  ngOnInit() {
    this.getFilterData();
  }

  getFilterData() {
    // this.spinner = true;
    // this.resource.getFiltersDataWithCustomer().subscribe((response) => {
    //   this.spinner = false;

    //   this.getYearData(response);

    // }, (errorResponse) => {
    //   this.spinner = false;
    //   this.toasterService.error('Error Occured While Getting filters data!');
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
      this.getProjectsRevenue(this.year, this.allOrgData, this.allProjectsData, this.allEmployeeData, this.allClientsData);

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting year data!');
    });
  }

  bindFilterDropDownData(response: any) {
    let orgData = this.allOrgData = response.organisations;
    let empData = this.allEmployeeData = response.employees;
    let projectsData = this.allProjectsData = response.projects;
    let clientData = this.allClientsData = response.clients;


    orgData = orgData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    projectsData = projectsData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    empData = empData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    clientData = clientData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    this.empOrg = this.empOrgData = this.empDropDownData(orgData);

    this.empProject = this.projectData = this.empDropDownData(projectsData);

    this.employee = this.employeeData = this.empDropDownData(empData);

    this.client = this.clients = this.empDropDownData(clientData);
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

  // ----------elasticsearch------------------
  getProjectsRevenue(year: any, org: any, project: any, employee: any, customer: any) {

    this.es.getProjectsGeneratedRevenue(year, org, project, employee, customer);
    this.spinner = true;
    this.es.getProjectsRevenue().subscribe((response) => {
      this.spinner = false;
      this.inProjRevenueData = response ? response : {};
      // return this.inProjRevenueData;

      this.transformDataService.fetchProjectsData(this.inProjRevenueData);

      // fetchProjectsDataPromise.then(() => {
      //   this.lineChartData = this.chartService.getChartData('line_chart');
      // });

      // fetchProjectsDataPromise.subscribe(() => {
      this.bubbleChartData = this.chartService.getChartData('bubble_chart');
      // });

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting invoiced revenue by customer data!');
    });
  }


  onItemSelect(item: any) {
    const org: any[] = this.pushToArray(this.empOrg);
    const project: any[] = this.pushToArray(this.empProject);
    const employee: any[] = this.pushToArray(this.employee);
    const client: any[] = this.pushToArray(this.client);

    this.getProjectsRevenue(this.year, org, project, employee, client);
  }

  pushToArray(data: any[]) {
    const returnArray = [];
    data.forEach((item: any) => {
      returnArray.push(item.itemName);
    });
    return returnArray;
  }

  onItemDeSelect(item: any) {
    const org: any[] = this.pushToArray(this.empOrg);
    const project: any[] = this.pushToArray(this.empProject);
    const employee: any[] = this.pushToArray(this.employee);
    const client: any[] = this.pushToArray(this.client);

    this.getProjectsRevenue(this.year, org, project, employee, client);
  }

  onSelectAll(item: any) {
    const org: any[] = this.pushToArray(this.empOrg);
    const project: any[] = this.pushToArray(this.empProject);
    const employee: any[] = this.pushToArray(this.employee);
    const client: any[] = this.pushToArray(this.client);

    this.getProjectsRevenue(this.year, org, project, employee, client);
  }

  onDeSelectAll(item: any) {
    const org: any[] = this.pushToArray(this.empOrg);
    const project: any[] = this.pushToArray(this.empProject);
    const employee: any[] = this.pushToArray(this.employee);
    const client: any[] = this.pushToArray(this.client);
    this.getProjectsRevenue(this.year, org, project, employee, client);
  }

}
