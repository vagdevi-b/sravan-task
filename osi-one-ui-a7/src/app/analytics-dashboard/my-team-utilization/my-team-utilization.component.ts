import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from "ag-grid-community";
import * as moment from 'moment';
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';

@Component({
  selector: 'app-my-team-utilization',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './my-team-utilization.component.html',
  styleUrls: ['./my-team-utilization.component.css']
})
export class MyTeamUtilizationComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  empYear = moment().year();

  myTeamUtilChart: Chart;

  gridApi: any;
  gridColumnApi: any;
  gridOptions: any = <GridOptions>{};
  defaultColDef = { resizable: true };
  gridHeight: any = 0;
  paginationPageSize: any = 10;
  columnDefs: any = [];

  dropdownSettings = {};
  spinner = false;
  empYearData: any = [{ "key": (new Date().getFullYear() - 2).toString() }, { "key": (new Date().getFullYear() - 1).toString() }, { "key": new Date().getFullYear().toString() }];
  myTeamUtilData: any = [];
  myTeamUtilLabel: any = [];
  ptoHrs: any = [];
  billableHrs: any = [];
  holidayHrs: any = [];
  internalHrs: any = [];
  nonBillableHrs: any = [];
  specialLeaves: any = [];
  isStacked = false;
  isgridChart = false;
  charts: any = [];
  months: any = [{ 'id': 1, 'value': 'Jan' }, { 'id': 2, 'value': 'Feb' },
  { 'id': 3, 'value': 'Mar' }, { 'id': 4, 'value': 'Apr' }, { 'id': 5, 'value': 'May' },
  { 'id': 6, 'value': 'Jun' }, { 'id': 7, 'value': 'Jul' }, { 'id': 8, 'value': 'Aug' },
  { 'id': 9, 'value': 'Sep' }, { 'id': 10, 'value': 'Oct' }, { 'id': 11, 'value': 'Nov' },
  { 'id': 12, 'value': 'Dec' }];

  projects: any = [];
  organizations = [];
  employees = [];
  clients = [];

  projectData: any = [];
  employeeData: any = [];
  customerData: any = [];
  empOrgData: any = [];
  clientData: any = [];

  empOrg: any = [];
  empProject: any = [];
  employee: any = [];
  client: any = [];
  pract: any = [];
  practData: any = [];
  subPract: any = [];
  subPractData: any = [];
  // isGrid: boolean = false;

  // all orgs fetched
  orgData: any[] = [];

  // selected orgs in orgs filter
  selectedOrgs: any[] = [];

  @ViewChild("stackMultiBarToggle")
  stackMultiBarToggleRef: ElementRef;
  lastChanedDd = '';
  billPercent: any[] = [];

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private gridService: GridService,
    private downloadFile: ExportFileService,
    private toasterService: ToastrService
  ) {
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
        this.selectedOrgs = Object.keys(filter).length > 0 ? filter.selectedOrgs : this.selectedOrgs;
        this.orgData = Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.pract = Object.keys(filter).length > 0 ? filter.pract : this.pract;
        this.practData = Object.keys(filter).length > 0 ? filter.practData : this.practData;
        this.subPract = Object.keys(filter).length > 0 ? filter.subPract : this.subPract;
        this.subPractData = Object.keys(filter).length > 0 ? filter.subPractData : this.subPractData;
        this.employee = Object.keys(filter).length > 0 ? filter.employee : this.employee;
        this.employeeData = Object.keys(filter).length > 0 ? filter.employeeData : this.employeeData;
        this.empYear = Object.keys(filter).length > 0 ? filter.empYear : this.empYear;
        this.isStacked = Object.keys(filter).length > 0 ? filter.isStacked : this.isStacked;
        this.isgridChart = Object.keys(filter).length > 0 ? filter.isgridChart : this.isgridChart;
        this.getUtilData();
      } else {
        this.getOrgData();
      }

    }, (errorResponse) => {
      this.spinner = false;
      this.getOrgData();
      //this.toasterService.error('Error Occured While Getting preserved filters data!');
    });
  }

  getOrgData() {
    this.spinner = true;
    this.resource
      .getResourceOrganizations()
      .subscribe(
        response => {
          this.spinner = false;
          this.orgData = this.selectedOrgs = response.Orgs;
          this.getPracticesData();
        },
        error => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting organization filters!');
        }
      );
  }

  getPracticesData() {
    this.spinner = true;

    const payload = {
      orgId: this.getIdsFromFilterData(this.selectedOrgs)
    }

    this.resource
      .getPracticeByProjectID(payload)
      .subscribe(
        (res: any) => {
          this.spinner = false;
          this.pract = this.practData = res.Practices;
          this.getSubPract();
        },
        () => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting practice filters!');
        }
      );
  }

  getSubPract() {
    this.spinner = true;

    const payload = {
      orgId: this.getIdsFromFilterData(this.selectedOrgs),
      practice: this.getItemNamesFromFilterData(this.pract)
    };

    this.resource
      .getSubPracticeByProjectID(payload)
      .subscribe(
        (res: any) => {
          this.spinner = false;
          this.subPract = this.subPractData = res.SubPractices;
          this.getEmployee();
        },
        () => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting sub-practice filters!');
        }
      );
  }

  getEmployee() {
    this.spinner = true;

    const payload = {
      orgId: this.getIdsFromFilterData(this.selectedOrgs),
      prac: this.getItemNamesFromFilterData(this.pract),
      subPrac: this.getItemNamesFromFilterData(this.subPract)
    }

    this.resource
      .getEmployeesByProjectID(payload)
      .subscribe(
        (res: any) => {
          this.spinner = false;
          this.employee = this.employeeData = res.Employees;
          this.getUtilData();
        },
        () => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting employee filters!');
        }
      );
  }

  getUtilData() {

    const payLoad = {
      'years': [this.empYear],
      'org': this.getItemNamesFromFilterData(this.selectedOrgs),
      'practice': this.getItemNamesFromFilterData(this.pract),
      'subPractice': this.getItemNamesFromFilterData(this.subPract),
      'employee': this.getIdsFromFilterData(this.employee)
    };

    this.spinner = true;
    this.resource
      .getResourceUtilization(payLoad)
      .subscribe(
        (res: any) => {
          this.spinner = false;
          this.myTeamUtilData = [];
          this.myTeamUtilData = res.Resources.length > 0 ? res.Resources.sort((a: any, b: any) => a.User > b.User ? 1 : a.User < b.User ? -1 : 0 || a.Year - b.Year || a.Mon - b.Mon) : [];
          this.bindMyTeamUtilizationData();
        },
        () => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting resource utilization data!');
        }
      );
  }

  bindMyTeamUtilizationData() {
    this.myTeamUtilLabel = [];
    this.billableHrs = [];
    this.internalHrs = [];
    this.nonBillableHrs = [];
    this.billPercent = [];
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    this.months.forEach((month: any) => {
      let bill: any = 0;
      let nonBill: any = 0;
      let inter: any = 0;
      const obj = {};
      this.myTeamUtilData.forEach((item: any) => {
        if (month.value === item.Month) {
          if (item.Year === year && item.Mon >= currentMonth) {
            bill = NaN;
            nonBill += NaN;
            inter += NaN;
          } else {
            bill += item.Billable_Hours;
            nonBill += item.Non_Billable_Hours;
            inter += item.Internal_Hours;
          }
        }
        obj['billable'] = bill;
        obj['nonBillable'] = nonBill;
        obj['internal'] = inter;
      });
      obj['month'] = month.value;
      this.myTeamUtilLabel.push(obj['month']);
      this.billableHrs.push(obj['billable']);
      this.nonBillableHrs.push(obj['nonBillable']);
      this.internalHrs.push(obj['internal']);
      const per = ((obj['billable'] / (obj['billable'] + obj['nonBillable'] + obj['internal'])) * 100).toFixed(2);
      this.billPercent.push(per);
    });

    if (this.isgridChart) {
      document.getElementById('gridChart').classList.add('active');
      this.createGrid();
      // if (this.isStacked) {

      // } else {
      //   document.getElementById('toggle').classList.add('active');
      // }
    } else {
      // if (this.isStacked) {
      //   this.createChart();
      // } else {
      //   document.getElementById('toggle').classList.add('active');
      //   this.createChart();
      // }
      this.createChart();
    }
    this.setFilters();
  }

  alphaMonth(value: any) {
    return this.months[value - 1]['value'];
  }

  updateHrsByResourceGrid() {
    this.getUtilData();
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
      this.getPracticesData();
    } else if (this.lastChanedDd === 'pract') {
      this.getSubPract();
    } else if (this.lastChanedDd === 'subpract') {
      this.getEmployee();
    } else if (this.lastChanedDd === 'employee') {
      this.getUtilData();
    }
  }

  createGrid() {
    this.columnDefs = this.generateColumns(this.myTeamUtilData);
    this.gridOptions.api.setRowData(this.myTeamUtilData);
    // this.gridOptions.api.sizeColumnsToFit();
  }

  gridChart(event: any) {
    if (event.target.classList.contains('active')) {
      this.isgridChart = false;
      this.createChart();
    } else {
      this.isgridChart = true;
      this.createGrid();
    }
    this.isPageLoaded.emit(true);
    this.setFilters();
  }

  toggle(event: any) {
    if (event.target.classList.contains('active')) {
      this.isStacked = true;
      this.createChart();
    } else {
      this.isStacked = false;
      this.createChart();
    }
    this.isPageLoaded.emit(true);
    this.setFilters();
  }

  downloadDetailsInExcel(): void {
    // month number column is ignored for excel data as we have month short name
    const downloadDetails = this.myTeamUtilData.map(({Mon, ...otherColumns}) => otherColumns);
    const file_name = 'my_resource_utilization_';
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  refresh() {
    this.empYear = moment().year();
    this.getOrgData();
  }

  createChart() {

    if (this.myTeamUtilChart) {
      this.myTeamUtilChart.destroy();
    }

    this.myTeamUtilChart = new Chart('myTeamUtilization', {
      type: 'bar',
      data: {
        labels: this.myTeamUtilLabel,
        datasets: [
          {
            label: 'Billable %',
            yAxisID: 'line',
            borderColor: '#2b8c6f',
            backgroundColor: '#2b8c6f',
            type: 'line',
            fill: false,
            data: this.billPercent
          },
          {
            label: 'Billable',
            data: this.billableHrs,
            backgroundColor: '#28a745',
            hoverBackgroundColor: '#28a745',
            // hidden: true,
          },
          {
            label: 'Non Billable',
            data: this.nonBillableHrs,
            backgroundColor: '#dc3545',
            hoverBackgroundColor: '#dc3545',
            // hidden: true,
          },
          {
            label: 'Internal',
            data: this.internalHrs,
            backgroundColor: '#ffc107',
            hoverBackgroundColor: '#ffc107',
            // hidden: true,
          }
        ]
      },
      options: {
        aspectRatio: 4.1,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              if (!data) {
                return false;
              }
              else if (data.datasets[tooltipItem.datasetIndex].yAxisID == 'line') {
                return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
                  tooltipItem.yLabel.toString() + '%';
              }
              return data.datasets[tooltipItem.datasetIndex].label + ': ' +
                tooltipItem.yLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'hrs';
            }
          },
          mode: 'label'
        },
        scales: {
          xAxes: [{
            // maxBarThickness: 15,
            // categoryPercentage: 0.5,
            // barPercentage: 1.0,
            stacked: false,

            gridLines: { display: false },
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            stacked: false,

            gridLines: { display: false },
            ticks: {
              callback: function (value) {
                return value + 'hrs';
              }
            }
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
          }],
        },
      }
    });
    this.isPageLoaded.emit(true);
  }

  generateColumns(data: any[]) {
    let columnDefinitions = [];

    data.forEach(object => {

      Object.keys(object).forEach(key => {
        const mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          width: 200,
          sortable: true,
          filter: true
        };
        if (
            key.toUpperCase() == 'MONTH' 
            || key.toUpperCase() == 'YEAR'){
              mappedColumn['pinned'] = 'left'
              mappedColumn['width'] = 90
            }
        else if(
            key.toUpperCase() == 'NAME'
            || key.toUpperCase() === 'SUPERVISOR'){
              mappedColumn['width'] = 160
            }
        else if(
            key.toUpperCase() === 'BILLABLE_HOURS'
            || key.toUpperCase() === 'INTERNAL_HOURS'){
              mappedColumn['width'] = 170
            }
        else if(
            key.toUpperCase() === 'NON_BILLABLE_HOURS'
            || key.toUpperCase() === 'BILLABLE_UTILIZATION'
            ) {
              mappedColumn['width'] = 200
        }
        // month number should be hidden as month short name is enough for grid
        else if (key.toUpperCase() === 'MON') {
            mappedColumn['hide'] = true;
        }
        else{mappedColumn['hide'] = true}
        columnDefinitions.push(mappedColumn);
      });
    });
    // Remove duplicate columns
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    );
    return columnDefinitions;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeight = function (params) {
    const lineCount = Math.floor(params.data.length / 32) + 1;
    const height = (12 * lineCount) + 24;
    return height;
  };

  setFilters(): any {
    const obj = {
      'orgData': this.orgData,
      'selectedOrgs': this.selectedOrgs,
      'pract': this.pract,
      'practData': this.practData,
      'subPract': this.subPract,
      'subPractData': this.subPractData,
      'employee': this.employee,
      'employeeData': this.employeeData,
      'empYear': this.empYear,
      'isStacked': this.isStacked,
      'isgridChart': this.isgridChart

    }
    this.gridService.setFilters(obj);
  }

  getIdsFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray && objArray.length > 0 ? objArray.map(eachObj => eachObj.id) : [];
  }

  getItemNamesFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray && objArray.length > 0 ? objArray.map(eachObj => eachObj.itemName) : [];
  }
}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}
