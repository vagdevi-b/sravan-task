import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { Chart } from 'chart.js';
import * as moment from 'moment'
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid-community";
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-projects-pandl-dashboard',
  templateUrl: './projects-pandl-dashboard.component.html',
  styleUrls: ['./projects-pandl-dashboard.component.css']
})
export class ProjectsPandlDashboardComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  selected: any;
  spinner: boolean = false;
  empOrg = "*";
  empProject = "*";
  empBU = "*";
  empPractice = "*";
  empSubPractice = "*";
  empMonth = ".*";
  empYear = moment().year();

  prjOrgData = [];
  prjProjectData = [];
  prjBUData = [];
  prjPracticeData = [];
  prjSubPracticeData = [];
  prjYearData = [];
  prjNameData = [];
  projectsJSON = { data: [] };
  empJSON = { data: [] };
  months: any = [{ "id": 1, "value": "Jan" }, { "id": 2, "value": "Feb" }, { "id": 3, "value": "Mar" }, { "id": 4, "value": "Apr" }, { "id": 5, "value": "May" }, { "id": 6, "value": "Jun" }, { "id": 7, "value": "Jul" }, { "id": 8, "value": "Aug" }, { "id": 9, "value": "Sept" }, { "id": 10, "value": "Oct" }, { "id": 11, "value": "Nov" }, { "id": 12, "value": "Dec" }];

  paginationPageSize = 5;
  gridApiProjects: any;
  gridColumnApiProjects: any;
  gridOptionsProjects = <GridOptions>{};
  columnDefsProjects = [];
  defaultColDef = { resizable: true };

  gridApiEmployee: any;
  gridColumnApiEmployee: any;
  gridOptionsEmployee = <GridOptions>{};
  columnDefsEmployee = [];

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private router: Router,
    private gridService: GridService,
    private toasterService: ToastrService,
    private downloadFile: ExportFileService
  ) {
  }

  ngOnInit() {
    // this.getFiltersData();
    this.setPreservedFilter();
    this.columnDefsProjects = this.createColumnDefsProjects();
    this.columnDefsEmployee = this.createColumnDefsEmployee();
  } //----------------->> onInit END

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      this.spinner = false;
      const filter = res ? JSON.parse(res.filters) : null;
      if (Object.keys(filter).length > 0) {
        this.empOrg = filter && Object.keys(filter).length > 0 ? filter.org : this.empOrg;
        this.empProject = filter && Object.keys(filter).length > 0 ? filter.project : this.empProject;
        this.empBU = filter && Object.keys(filter).length > 0 ? filter.bu : this.empBU;
        this.empPractice = filter && Object.keys(filter).length > 0 ? filter.practice : this.empPractice;
        this.empSubPractice = filter && Object.keys(filter).length > 0 ? filter.subPractice : this.empSubPractice;
        this.empMonth = filter && Object.keys(filter).length > 0 ? filter.empMonth : this.empMonth;
        this.empYear = filter && Object.keys(filter).length > 0 ? filter.empYear : this.empYear;
        this.isPageLoaded.emit(true);
        this.getProjectDetails(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.empYear + this.empMonth, this.prjProjectData);
      } else {
        this.getFiltersData();
      }
    }, (errorResponse) => {
      this.spinner = false;
      this.getFiltersData();
    });
  }

  getFiltersData() {
    this.spinner = true;
    this.resource.getByProjectsList().subscribe(response => {
      this.spinner = false;
      this.getYearData(response);
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting project filters data!');
    });

  }

  getYearData(response: any) {
    this.spinner = true;
    this.es.getFromService(0).subscribe(res => {
      this.spinner = false;

      response['year'] = res.aggregations.by_year.buckets;
      this.bindFilterDropDownData(response);
      this.getProjectDetails(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.empYear + this.empMonth, this.prjProjectData);

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting year data!');
    });
  }

  bindFilterDropDownData(response: any) {
    this.prjOrgData = response.org;
    this.prjBUData = response.bu;
    this.prjPracticeData = response.practice;
    this.prjProjectData = response.project;
    this.prjSubPracticeData = response.subpractice;
    this.prjYearData = response.year;

    this.prjYearData = this.prjYearData.sort((a, b) => a.key - b.key);
    this.prjOrgData = this.prjOrgData.sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.prjBUData = this.prjBUData.sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.prjPracticeData = this.prjPracticeData.sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.prjProjectData = this.prjProjectData.sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.prjSubPracticeData = this.prjSubPracticeData.sort((a, b) => {
      return a > b ? 1 : a < b ? -1 : 0;
    });
  }

  getProjectDetails(year: any, org: any, practice: any, bu: any, subPractice: any, month: any, project: any) {
    this.es.getProjectPnlFirstTable(year, org, practice, bu, subPractice, month, project);
    this.spinner = true;
    this.isPageLoaded.emit(false);
    this.es.getFromService(19).subscribe(response => {
      this.spinner = false;
      this.isPageLoaded.emit(true);
      this.projectsJSON = {
        data: []
      };
      response.aggregations.filtered.by_selection.buckets.forEach(x => {
        let totalSum = 0;
        x.by_monthAvgCost.buckets.forEach(cost => {
          totalSum = totalSum + cost.total.value;
        });
        if (x.length != 0) {
          let temp = x.by_department.buckets[0].key.split('.');
          let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
          this.projectsJSON.data.push({
            "name": x.key,
            "bu": x.by_employeeBU.buckets[0].key,
            "practice": x.by_practices.buckets[0].key,
            "subPractice": x.by_sub_practices.buckets[0].key,
            "department": dept,
            "region": x.region.buckets[0].key,
            "hours": x.total_hours.value != 0 ? x.total_hours.value.toFixed() : 0,
            "cost": totalSum != 0 ? totalSum.toFixed() : "0",
            "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0",
            "margin": (x.total_revenue.value - totalSum).toFixed(),
            "margin_percentage": x.total_revenue.value != 0 ? (((x.total_revenue.value - totalSum) / x.total_revenue.value) * 100).toFixed() : "0",
          });
        }
      });
      this.projectsJSON.data = this.projectsJSON.data.sort((a, b) => {
        return a.name > b.name ? 1
          : a.name < b.name ? -1
            : 0;
      });
      this.getEmpDetailsForSelectedProject(this.projectsJSON.data[0]);
      // this.gridOptions.api.setRowData(this.projectsJSON.data);

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting projects data!');
    });

  }

  getEmpDetailsForSelectedProject(selectedProject: any) {
    this.selected = selectedProject ? selectedProject['name'] : '';
    this.es.getProjectPnLSecondTable(this.empYear, this.empYear + this.empMonth, this.prjProjectData, this.selected);
    this.spinner = false;
    this.es.getFromService(21).subscribe(response => {
      this.spinner = false;
      this.empJSON = {
        data: []
      };

      response.aggregations.filtered.by_selection.buckets.forEach((x: any) => {
        if (x.by_employeeBU.buckets.length != 0) {
          let temp = x.by_department.buckets[0].key.split('.');
          let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
          this.empJSON.data.push({
            "name": x.key,
            "bu": x.by_employeeBU.buckets[0].key,
            "practice": x.by_practices.buckets[0].key,
            "subPractice": x.by_sub_practices.buckets[0].key,
            "department": dept,
            "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed() : "0",
            "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
          });
        }
      });
      this.empJSON.data = this.empJSON.data.sort((a, b) => {
        return a.name > b.name ? 1
          : a.name < b.name ? -1
            : 0;
      });
      this.setFilters();
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting employee data!');
    });
  }

  //------------------------------------- PnL (APPLYING GLOBAL FILTERS) ------------------------------------------------------

  filterPnLCharts() {

    let year = this.empYear;
    let month = this.empYear + this.empMonth;
    let org = this.empOrg == '*' ? this.prjOrgData : [this.empOrg];
    let bu = this.empBU == '*' ? this.prjBUData : [this.empBU];
    let practice = this.empPractice == '*' ? this.prjPracticeData : [this.empPractice];
    let subPractice = this.empSubPractice == '*' ? this.prjSubPracticeData : [this.empSubPractice];

    this.getProjectDetails(year, org, practice, bu, subPractice, month, this.prjProjectData);
  }

  downloadDetailsInExel(name: any) {
    let downloadDetails: any;
    let file_name: any;
    if (this.projectsJSON.data && name === 'Project_Details') {
      downloadDetails = this.projectsJSON.data;
      file_name = name;
    } else if (this.empJSON.data && name === 'Employee_Details') {
      downloadDetails = this.empJSON.data;
      file_name = name + '_of_' + this.selected;
    }
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  private createColumnDefsProjects() {
    const columnDefsProjects = [
      {
        headerName: "Project Name",
        field: "name",
        width: 280,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Department",
        field: "department",
        width: 240,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Hours",
        field: "hours",
        width: 100,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.numberFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        sortable: true
      },
      {
        headerName: "Cost",
        field: "cost",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Revenue",
        field: "revenue",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "GM",
        field: "margin",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "GM %",
        field: "margin_percentage",
        width: 120,
        valueFormatter: this.percentageFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsProjects;
  }

  onGridReadyProjects(params) {
    this.gridApiProjects = params.api;
    this.gridColumnApiProjects = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeightProjects = function (params) {
    let lineCount = Math.floor(params.data.name.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  onProjectSelected(params) {
    let selectedProject = this.gridApiProjects.getSelectedRows();
    this.getEmpDetailsForSelectedProject(selectedProject[0])
  }

  private createColumnDefsEmployee() {
    const columnDefsEmployee = [
      {
        headerName: "Employee Name",
        field: "name",
        width: 280,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Department",
        field: "department",
        width: 250,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Cost",
        field: "cost",
        valueFormatter: this.currencyFormatter,
        width: 250,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Revenue",
        field: "revenue",
        valueFormatter: this.currencyFormatter,
        width: 250,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsEmployee;
  }

  onGridReadyEmployee(params) {
    this.gridApiEmployee = params.api;
    this.gridColumnApiEmployee = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeightEmployee = function (params) {
    let lineCount = Math.floor(params.data.name.length / 32) + 1;
    return (16 * lineCount) + 24;
  };

  currencyFormatter(params) {
    if (params.value) {
      return "$" + params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  percentageFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "%";
    } else {
      return '';
    }
  }

  numberFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  numberComparator(num1, num2) {
    return num1 - num2;
  }

  setFilters(): any {
    const obj = {
      'org': this.empOrg,
      'project': this.empProject,
      'bu': this.empBU,
      'practice': this.empPractice,
      'subPractice': this.empSubPractice,
      'empMonth': this.empMonth,
      'empYear': this.empYear
    }
    this.gridService.setFilters(obj);
  }

}
