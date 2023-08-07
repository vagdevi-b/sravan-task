import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from "ag-grid-community";
import * as moment from 'moment';
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';

const MONTHS_MAP = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

@Component({
  selector: 'app-my-future-revenue',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './my-future-revenue.component.html',
  styleUrls: ['./my-future-revenue.component.css']
})
export class MyFutureRevenueComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  empYear = moment().year();

  myTeamUtilChart: Chart;

  gridApi: any;
  gridColumnApi: any;
  gridOptions: any = <GridOptions>{};
  gridHeight: any = 0;
  paginationPageSize: any = 10;
  columnDefs: any = [];
  defaultColDef = { resizable: true };

  dropdownSettings = {};
  spinner = false;
  empYearData: any = [{ "key": (new Date().getFullYear() - 2).toString() }, { "key": (new Date().getFullYear() - 1).toString() }, { "key": new Date().getFullYear().toString() }];
  myFutureRevData: any = [];
  myFutureRevLabel: any = [];
  futureRev: any = [];
  avgFutureRev: any = [];
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
  orgData: any[] = [];
  currentYear: any = new Date().getFullYear();

  selectedOrgs: any[] = [];

  @ViewChild("stackMultiBarToggle")
  stackMultiBarToggleRef: ElementRef;
  lastChanedDd = '';


  constructor(
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
        this.selectedOrgs = Object.keys(filter).length > 0 ? filter.selectedOrgs : this.selectedOrgs;
        this.orgData = Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.pract = Object.keys(filter).length > 0 ? filter.pract : this.pract;
        this.practData = Object.keys(filter).length > 0 ? filter.practData : this.practData;
        this.subPract = Object.keys(filter).length > 0 ? filter.subPract : this.subPract;
        this.subPractData = Object.keys(filter).length > 0 ? filter.subPractData : this.subPractData;
        this.employee = Object.keys(filter).length > 0 ? filter.employee : this.employee;
        this.employeeData = Object.keys(filter).length > 0 ? filter.employeeData : this.employeeData;
        this.empYear = Object.keys(filter).length > 0 ? filter.empYear : this.empYear;
        this.empYearData = Object.keys(filter).length > 0 ? filter.empYearData : this.empYearData;
        this.isStacked = Object.keys(filter).length > 0 ? filter.isStacked : this.isStacked;
        this.isgridChart = Object.keys(filter).length > 0 ? filter.isgridChart : this.isgridChart;
        this.getMyFutureRevenue();
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
          this.getMyFutureRevenue();
        },
        () => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting employee filters!');
        }
      );
  }

  getMyFutureRevenue() {

    const payLoad = {
      'org': this.getItemNamesFromFilterData(this.selectedOrgs),
      'practice': this.getItemNamesFromFilterData(this.pract),
      'subPractice': this.getItemNamesFromFilterData(this.subPract),
      'employee': this.getIdsFromFilterData(this.employee)
    };

    this.spinner = true;
    this.resource
      .getMyFutureRevenue(payLoad)
      .subscribe(
        (res: any) => {
          this.spinner = false;
          this.myFutureRevData = [];
          this.myFutureRevData = res.Revenue.length > 0 ? res.Revenue.sort((a: any, b: any) => a.User > b.User ? 1 : a.User < b.User ? -1 : 0 || a.Year - b.Year || a.Mon - b.Mon) : [];
          this.myFutureRevData.map(eachRow => eachRow.Month = MONTHS_MAP[eachRow.Mon]);
          this.bindMyFutureRevenueData();
        },
        () => {
          this.spinner = false;
          this.toasterService.error('Error occurred while getting future revenue data!');
        }
      );
  }

  bindMyFutureRevenueData() {
    this.myFutureRevLabel = [];
    this.futureRev = [];
    this.avgFutureRev = [];
    let totalFutRev = 0;
    let noOfMonth = 0;
    this.myFutureRevData.forEach((item: any) => {
      totalFutRev += item.Revenue;
      noOfMonth = Number(item.Mon);
    });


    this.myFutureRevData.forEach((item: any) => {
      this.myFutureRevLabel.push(this.getAlphaMon(item.Mon));
      this.futureRev.push(item.Revenue);
      this.avgFutureRev.push(totalFutRev/this.myFutureRevData.length);
    });

    if (this.isgridChart) {
      document.getElementById('gridChart').classList.add('active');
      this.createGrid();
    } else {
      this.createChart();
    }
    this.setFilters();
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
      this.getMyFutureRevenue();
    }
  }

  refresh() {
    this.getOrgData();
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

  createGrid() {
    this.columnDefs = this.generateColumns(this.myFutureRevData);
    this.gridOptions.api.setRowData(this.myFutureRevData);
    this.gridOptions.api.sizeColumnsToFit();
  }

  downloadDetailsInExcel(): void {
    // const downloadDetails = this.myFutureRevData;
    const file_name = 'my_future_revenue_';

    const payLoad = {
      'org': this.getItemNamesFromFilterData(this.selectedOrgs),
      'practice': this.getItemNamesFromFilterData(this.pract),
      'subPractice': this.getItemNamesFromFilterData(this.subPract),
      'employee': this.getIdsFromFilterData(this.employee)
    };

    this.spinner = true;
    this.resource.getMyFutureRevenueExport(payLoad).subscribe((res: any) => {
      this.spinner = false;
      if (res && res.Revenue.length > 0) {
        res.Revenue.map(eachRow => eachRow.Mon = MONTHS_MAP[eachRow.Mon]);
        const futureRevenue = res.Revenue;
        this.downloadFile.exportAsExcelFile(futureRevenue, file_name);
      } else {
        this.toasterService.error('Ooops no data to export!');
      }
    },(errorResponse) => {
        this.spinner = false;
        this.toasterService.error('Error occurred while getting future revenue excel data!');
      }
    );
  }

  createChart() {

    if (this.myTeamUtilChart) {
      this.myTeamUtilChart.destroy();
    }

    this.myTeamUtilChart = new Chart('myTeamUtilization', {
      type: 'bar',
      data: {
        labels: this.myFutureRevLabel,
        datasets: [
          {
            label: 'Avg-Revenue',
            type: 'line',
            order: 1,
            fill: false,
            data: this.avgFutureRev,
            backgroundColor: '#66FFB2',
            borderColor: '#66FFB2',
            hoverBackgroundColor: '#66FFB2'
            // hidden: true,
          },
          {
            label: 'Revenue',
            type: 'bar',
            order: 2,
            // fill: false,
            data: this.futureRev,
            backgroundColor: '#28a745',
            // borderColor: '#28a745',
            hoverBackgroundColor: '#28a745'
            // hidden: true,
          }
        ]
      },
      options: {
        // maintainAspectRatio: false,
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
              return `${data.datasets[tooltipItem.datasetIndex].label}: $ ${tooltipItem.yLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            }
          },
          mode: 'label'
        },
        scales: {
          xAxes: [{
            // maxBarThickness: 15,
            // categoryPercentage: 0.5,
            // barPercentage: 1.0,
            // stacked: this.isStacked,

            gridLines: { display: false },
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            // stacked: this.isStacked,

            gridLines: { display: false },
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
          width: 180,
          sortable: true,
          filter: true
        };
        // if (key.toUpperCase() == 'USER' || key.toUpperCase() === 'YEAR' || key.toUpperCase() === 'MONTH') {
        //   mappedColumn['pinned'] = 'left'
        //   mappedColumn['width'] = 150
        // }

        // if (key.toUpperCase() == 'BU' || key.toUpperCase() == 'BILLABLE_UTILIZATION' || key.toUpperCase() == 'DEPARTMENT' ||
        //   key.toUpperCase() == 'GRADE_AND_LEVEL' || key.toUpperCase() == 'JOB' || key.toUpperCase() == 'MM' || key.toUpperCase() == 'ORGANIZATION' ||
        //   key.toUpperCase() == 'PRACTICE' || key.toUpperCase() == 'REGION' || key.toUpperCase() == 'SUB_PRACTICE' || key.toUpperCase() == 'SUPERVISOR' ||
        //   key.toUpperCase() == 'TITLE' || key.toUpperCase() == 'USER_STATUS' || key.toUpperCase() == 'USER_TYPE' || key.toUpperCase() == 'EMPLOYEE_ID') {
        //   mappedColumn['hide'] = true
        // }

        if (mappedColumn.field.toUpperCase() === 'MONTH' || mappedColumn.field.toUpperCase() === 'YEAR') {
          mappedColumn['pinned'] = 'left';
        }

        if (mappedColumn.field.toUpperCase() === 'MON') {
          mappedColumn['hide'] = true;
        }

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
      'empYearData': this.empYearData,
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

  getAlphaMon(id: any) {
    const month = this.months.filter((item: any) => item.id == id);
    return month[0].value;
  }

}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}