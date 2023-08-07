import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { GridOptions } from "ag-grid-community";
import { GridService } from '../../dashboard-grid/grid.service';

@Component({
  selector: 'app-my-invoices',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.css']
})
export class MyInvoicesComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  dropdownSettings: any = {};
  spinner: boolean = false;
  flag: boolean;
  filter: any = [];

  orgMaxYear: any = moment().year();
  maxYear: any = moment().year();
  minYear: any = moment().year() - 1;

  columnDefs: any = [];
  gridOptions = <GridOptions>{};
  paginationPageSize = 10;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef = { resizable: true };
  gridHeight: any = 0;
  yearData: any = [];

  org: DropdownFilterDataModel[];
  client: DropdownFilterDataModel[];
  project: DropdownFilterDataModel[];
  region: DropdownFilterDataModel[];
  practice: DropdownFilterDataModel[];
  subPractice: DropdownFilterDataModel[];

  orgData: DropdownFilterDataModel[];
  clientData: DropdownFilterDataModel[];
  projectData: DropdownFilterDataModel[];
  regionData: DropdownFilterDataModel[];
  practiceData: DropdownFilterDataModel[];
  subPracticeData: DropdownFilterDataModel[];

  clientID: any = [];
  projectID: any = [];
  dataset: any = [];
  compare: boolean = false;

  currentYear = moment().year();
  currentMonth = moment().month();

  invoiceMinArray = Array(12);
  invoiceMaxArray = Array(12);
  orgYearData: any = [{ 'key': (new Date().getFullYear() - 2).toString() }, { 'key': (new Date().getFullYear() - 1).toString() }, { 'key': new Date().getFullYear().toString() }];

  isGrid: boolean = false;
  invoiedData: any = [];
  monthlyInvCurrentYear: any = Array(12);
  monthlyInvPrevYear: any = Array(12);
  monthlyAvgInvSelYear: any = Array(12);
  monthlyAvgInvPrevYear: any = Array(12);
  showInGrid: any = [];
  lastChanedDd = '';

  constructor(private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private gridService: GridService,
    private downloadFile: ExportFileService,
    private toasterService: ToastrService) { }

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
    // this.getOrgData();
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res && res.filters ? JSON.parse(res.filters) : null;
      if (filter) {
        this.org = filter && Object.keys(filter).length > 0 ? filter.org : this.org;
        this.orgData = filter && Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.region = filter && Object.keys(filter).length > 0 ? filter.region : this.region;
        this.regionData = filter && Object.keys(filter).length > 0 ? filter.regionData : this.regionData;
        this.practice = filter && Object.keys(filter).length > 0 ? filter.practice : this.practice;
        this.practiceData = filter && Object.keys(filter).length > 0 ? filter.practiceData : this.practiceData;
        this.subPractice = filter && Object.keys(filter).length > 0 ? filter.subPractice : this.subPractice;
        this.subPracticeData = filter && Object.keys(filter).length > 0 ? filter.subPracticeData : this.subPracticeData;
        this.client = filter && Object.keys(filter).length > 0 ? filter.client : this.client;
        this.clientData = filter && Object.keys(filter).length > 0 ? filter.clientData : this.clientData;
        this.project = filter && Object.keys(filter).length > 0 ? filter.project : this.project;
        this.projectData = filter && Object.keys(filter).length > 0 ? filter.projectData : this.projectData;
        this.orgMaxYear = filter && Object.keys(filter).length > 0 ? filter.orgMaxYear : this.orgMaxYear;
        this.minYear = filter && Object.keys(filter).length > 0 ? filter.minYear : this.minYear;
        this.maxYear = filter && Object.keys(filter).length > 0 ? filter.maxYear : this.maxYear;
        this.compare = filter && Object.keys(filter).length > 0 ? filter.compare : this.compare;
        this.isGrid = filter && Object.keys(filter).length > 0 ? filter.isGrid : this.isGrid;
        this.spinner = false;

        this.getInvoiceDataFromService(this.org, this.region, this.practice, this.subPractice, this.client, this.project);
      } else {
        this.getOrganizationData()
      }

    }, (errorResponse) => {
      this.spinner = false;
      this.getOrganizationData();
      //this.toasterService.error('Error Occured While Getting preserved filters data!');
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

      this.subPractice = this.subPracticeData = response.SubPractices;
      this.getClientData(org, region, practice, response.SubPractices);

    }, (errorResponse) => {
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
    }, (errorResponse) => {
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
      this.getInvoiceDataFromService(org, region, practice, subPractice, client, response.Projects);
      // this.getOrgProjectData(this.pushToArrayByName(this.orgData), this.pushToArrayByName(this.regionData), this.pushToArrayByName(this.practiceData), this.pushToArrayByName(this.subPracticeData), this.pushToArrayByName(this.clientData), this.pushToArrayByName(this.projectData), this.orgMinYear, this.orgMaxYear);
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting projects data!');
    });
  }

  getInvoiceDataFromService(org: any, region: any, practice: any, subPractice: any, client: any, project: any) {
    this.yearData.push(this.maxYear);
    this.yearData.push(this.minYear);
    const payLoad = {
      "years": this.yearData,
      "org": org ? org.map((item: any) => item.itemName) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "practice": practice ? practice.map((item: any) => item.itemName) : [],
      "subPractice": subPractice ? subPractice.map((item: any) => item.itemName) : [],
      "client": client ? client.map((item: any) => item.id) : [],
      "project": project ? project.map((item: any) => item.id) : []
    }
    this.spinner = true;
    this.yearData = [];
    this.resource.getInvoiceData(payLoad).subscribe((response) => {
      this.spinner = false;
      this.invoiedData = response.Invoices;
      this.inputDataForChart(this.invoiedData);
      this.setFilters();
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting filters data!');
    });
  }

  inputDataForChart(response: any) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    this.invoiceMinArray.fill(0);
    this.invoiceMaxArray.fill(0);
    this.monthlyInvCurrentYear.fill(0);
    this.monthlyInvPrevYear.fill(0);
    this.monthlyAvgInvSelYear.fill(0);
    this.monthlyAvgInvPrevYear.fill(0);
    let invSelectedYear = 0;
    let invPrevYear = 0;
    let noOfMonthSelYear = 0;
    let noOfMonthPrevYear = 0;

    const invData = Number(this.orgMaxYear) == currentYear ? this.invoiedData.filter((item: any) => Number(item.Mon) < currentMonth) : this.invoiedData;

    invData.forEach((item: any) => {
      if (item.Year === Number(this.orgMaxYear)) {
        invSelectedYear += item.USDAmount;
        noOfMonthSelYear = Number(item.Mon);
      } else {
        invPrevYear += item.USDAmount;
        noOfMonthPrevYear = Number(item.Mon);
      }
    });

    this.invoiedData.forEach((item: any) => {

      if (item.Year == currentYear && item.Mon >= currentMonth) {
        this.invoiceMaxArray[item.Mon - 1] = NaN;
        this.monthlyInvCurrentYear[item.Mon - 1] = NaN;
        this.monthlyAvgInvSelYear[item.Mon - 1] = NaN;
      }

      if (item.Year == this.maxYear) {
        this.invoiceMaxArray[item.Mon - 1] += item.USDAmount;
        this.monthlyInvCurrentYear[item.Mon - 1] += item.InvoiceCount;
        this.monthlyAvgInvSelYear[item.Mon - 1] = invSelectedYear/noOfMonthSelYear;
      }
      else {
        this.invoiceMinArray[item.Mon - 1] += item.USDAmount;
        this.monthlyInvPrevYear[item.Mon - 1] += item.InvoiceCount;
        this.monthlyAvgInvPrevYear[item.Mon - 1] = invPrevYear/noOfMonthPrevYear;
      }
    });

    if (this.orgMaxYear == this.currentYear) {
      this.invoiceMaxArray.fill(NaN, this.currentMonth, 12);
      this.monthlyInvCurrentYear.fill(NaN, this.currentMonth, 12);
      this.monthlyAvgInvSelYear.fill(NaN, this.currentMonth, 12);
    }

    if (this.compare == false) {
      this.dataset = [
        {
          label: this.maxYear + ' # of Invoice',
          yAxisID: 'line',
          backgroundColor: '#FFCC00',
          borderColor: '#FFCC00',
          type: 'line',
          fill: false,
          data: this.monthlyInvCurrentYear
        },
        {
          label: this.maxYear + ' Avg Invoice',
          yAxisID: 'bar',
          backgroundColor: '#1E90FF',
          borderColor: '#1E90FF',
          type: 'line',
          fill: false,
          data: this.monthlyAvgInvSelYear
        },
        {
          type: 'bar',
          yAxisID: 'bar',
          fill: false,
          label: this.maxYear + ' Invoice',
          data: this.invoiceMaxArray,
          backgroundColor: '#1E90FF',
          hoverBackgroundColor: '#1E90FF',
        }
      ];
    }
    else {
      document.getElementById('toggle').classList.add('active');
      this.dataset = [
        {
          label: this.maxYear + ' # of Invoice',
          yAxisID: 'line',
          backgroundColor: '#FFCC00',
          borderColor: '#FFCC00',
          type: 'line',
          fill: false,
          data: this.monthlyInvCurrentYear
        },
        {
          label: this.minYear + ' # of Invoice',
          yAxisID: 'line',
          backgroundColor: '#00ff44',
          borderColor: '#00ff44',
          type: 'line',
          fill: false,
          data: this.monthlyInvPrevYear
        },
        {
          label: this.maxYear + ' Avg Invoice',
          yAxisID: 'bar',
          backgroundColor: '#1E90FF',
          borderColor: '#1E90FF',
          type: 'line',
          fill: false,
          data: this.monthlyAvgInvSelYear
        },
        {
          label: this.minYear + ' Avg Invoice',
          yAxisID: 'bar',
          backgroundColor: '#87CEFA',
          borderColor: '#87CEFA',
          type: 'line',
          fill: false,
          data: this.monthlyAvgInvPrevYear
        },
        {
          type: 'bar', fill: false,
          label: this.maxYear + ' Invoice',
          data: this.invoiceMaxArray,
          backgroundColor: '#1E90FF',
          hoverBackgroundColor: '#1E90FF',
        },
        {
          type: 'bar', fill: false,
          label: this.minYear + ' Invoice',
          data: this.invoiceMinArray,
          backgroundColor: '#87CEFA',
          hoverBackgroundColor: '#87CEFA',
        }
      ]
    }
    if (this.isGrid == true) {
      document.getElementById('toggleGrid').classList.add('active');
      this.createGrid();
    } else {
      this.createChart();
    }
    // this.createChart();
  }

  updateHrsByResourceGrid() {
    this.maxYear = Number([this.orgMaxYear]);
    this.minYear = Number([this.orgMaxYear]) - 1;

    // this.getOrgData();
    this.getInvoiceDataFromService(this.org, this.region, this.practice, this.subPractice, this.client, this.project);
  }

  toggle(event: any) {
    this.dataset = [];
    if (event.target.classList.contains('active')) {
      this.compare = false;
      this.dataset = [
        {
          label: this.maxYear + ' # of Invoice',
          yAxisID: 'line',
          backgroundColor: '#FFCC00',
          borderColor: '#FFCC00',
          type: 'line',
          fill: false,
          data: this.monthlyInvCurrentYear
        },
        {
          label: this.maxYear + ' Avg Invoice',
          yAxisID: 'bar',
          backgroundColor: '#1E90FF',
          borderColor: '#1E90FF',
          type: 'line',
          fill: false,
          data: this.monthlyAvgInvSelYear
        },
        {
          type: 'bar', fill: false,
          label: this.maxYear + ' Invoice',
          data: this.invoiceMaxArray,
          backgroundColor: '#1E90FF',
          hoverBackgroundColor: '#1E90FF',
        }
      ]
    }
    else {
      this.compare = true;
      this.dataset = [
        {
          label: this.maxYear + ' # of Invoice',
          yAxisID: 'line',
          backgroundColor: '#FFCC00',
          borderColor: '#FFCC00',
          type: 'line',
          fill: false,
          data: this.monthlyInvCurrentYear
        },
        {
          label: this.minYear + ' # of Invoice',
          yAxisID: 'line',
          backgroundColor: '#00ff44',
          borderColor: '#00ff44',
          type: 'line',
          fill: false,
          data: this.monthlyInvPrevYear
        },
        {
          label: this.maxYear + ' Avg Invoice',
          yAxisID: 'bar',
          backgroundColor: '#1E90FF',
          borderColor: '#1E90FF',
          type: 'line',
          fill: false,
          data: this.monthlyAvgInvSelYear
        },
        {
          label: this.minYear + ' Avg Invoice',
          yAxisID: 'bar',
          backgroundColor: '#87CEFA',
          borderColor: '#87CEFA',
          type: 'line',
          fill: false,
          data: this.monthlyAvgInvPrevYear
        },
        {
          type: 'bar', fill: false,
          label: this.maxYear + ' Invoice',
          data: this.invoiceMaxArray,
          backgroundColor: '#1E90FF',
          hoverBackgroundColor: '#1E90FF',
        },
        {
          type: 'bar', fill: false,
          label: this.minYear + ' Invoice',
          data: this.invoiceMinArray,
          backgroundColor: '#87CEFA',
          hoverBackgroundColor: '#87CEFA',
        }
      ]
    }
    this.createChart();
    if (this.isGrid) {
      this.createGrid();
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
      this.getRegionData(this.org);
    }
    if (this.lastChanedDd === 'region') {
      this.getPracticeData(this.org, this.region);
    }
    if (this.lastChanedDd === 'practice') {
      this.getSubPracticeData(this.org, this.region, this.practice);
    }
    if (this.lastChanedDd === 'subpractice') {
      this.getClientData(this.org, this.region, this.practice, this.subPractice);
    }
    if (this.lastChanedDd === 'client') {
      this.getProjectData(this.org, this.region, this.practice, this.subPractice, this.client);
    }
    if (this.lastChanedDd === 'project') {
      this.getInvoiceDataFromService(this.org, this.region, this.practice, this.subPractice,
        this.client, this.project);
    }
  }

  toggleGrid(event: any): any {
    if (event.target.classList.contains('active')) {
      this.isGrid = false;
      this.createChart();
    } else {
      this.isGrid = true;
      this.createGrid();
    }
    this.setFilters();
  }


  createGrid(): any {
    let gridObj: any = [];
    this.showInGrid = [];
    this.invoiedData.forEach((item: any) => {
      if (item.Year == this.orgMaxYear) {
        gridObj.push(item);
      }
    });

    if (this.orgMaxYear == this.currentYear) {
      gridObj = gridObj.filter(eachRecord => eachRecord.Mon <= this.currentMonth);
    }

    this.showInGrid = this.compare ? this.invoiedData : gridObj;

    this.columnDefs = this.generateColumns(this.showInGrid);
    this.gridOptions.api.setRowData(this.showInGrid);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
    this.isPageLoaded.emit(true);
  }

  excelData: any = [];
  excelDataForTemp2: any = [];
  excelDataForTemp: any = [];

  downloadDetailsInExel() {

    const fileName = 'project_invoices_';

    this.excelData = this.excelDataForTemp = this.excelDataForTemp2 = [];

    const payLoad = {
      'years': [this.orgMaxYear, Number(this.orgMaxYear) - 1],
      'org': this.org ? this.org.map((item: any) => item.itemName) : [],
      'practice': this.practice ? this.practice.map((item: any) => item.itemName) : [],
      'project': this.project ? this.project.map((item: any) => item.id) : [],
      'region': this.region ? this.region.map((item: any) => item.itemName) : [],
      'subPractice': this.subPractice ? this.subPractice.map((item: any) => item.itemName) : [],
      'client': this.client ? this.client.map((item: any) => item.id) : [],
    }
    
    this.spinner = true;
    this.resource
      .getExcelDataForProjectInvoices(payLoad)
      .subscribe(
        (response) => {

          this.excelData = response.Invoices;
          if (Number(this.orgMaxYear) === this.currentYear) {
            if (!this.compare) {
              this.excelData = this.excelData.filter(eachRow => Number(eachRow.Year) == this.orgMaxYear);
              this.excelData = this.excelData.filter(eachRow => Number(eachRow.Mon) <= this.currentMonth)
            }
            else {
              this.excelDataForTemp2 = this.excelData.filter(eachRow => eachRow.Year != this.orgMaxYear);
              this.excelDataForTemp = this.excelData.filter(eachRow => eachRow.Year == this.orgMaxYear);
              this.excelDataForTemp = this.excelDataForTemp.filter(eachRow => Number(eachRow.Mon) <= this.currentMonth)
              this.excelData = this.excelDataForTemp2.concat(this.excelDataForTemp);
            }
          }
          else {
            if (!this.compare) {
              this.excelData = this.excelData.filter(eachRow => Number(eachRow.Year) == this.orgMaxYear);
            }
            else {
              this.excelDataForTemp2 = this.excelData.filter(eachRow => eachRow.Year != this.orgMaxYear);
              this.excelDataForTemp = this.excelData.filter(eachRow => eachRow.Year == this.orgMaxYear);
              this.excelData = this.excelDataForTemp2.concat(this.excelDataForTemp);
            }
          }
          if (this.excelData && this.excelData.length > 0) {
            this.downloadFile.exportAsExcelFile(this.excelData.map(({ Mon, ...item }) => item), fileName);
          } else {
            this.toasterService.error("Ooops! No data to export to excel");
          }
          this.spinner = false;
        },
        () => {
          this.spinner = false;
          this.toasterService.error("Unable to retrieve data for exporting to Excel Sheet!");
        }
      );
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
    this.maxYear = moment().year();
    this.minYear = moment().year() - 1;
    this.getOrganizationData();
  }

  invoiceChart: Chart;

  createChart() {
    if (this.invoiceChart) {
      this.invoiceChart.destroy();
    }
    this.invoiceChart = new Chart('invoiceChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: this.dataset,
      },
      options: {
        animation: {
          duration: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function (tooltipItem: any, data: any) {
              if (!data) {
                return false;
              } else if (data.datasets[tooltipItem.datasetIndex].yAxisID == 'line') {
                return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
                  tooltipItem.yLabel.toString();
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
            gridLines: { display: false, drawOnChartArea: false, color: 'none' },
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
                      return Number(n / ranges[i].divider).toFixed() + ranges[i].suffix;
                    }
                  }
                  return n.toFixed(2);
                } return '$' + formatNumber(value);
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
            },
            scaleLabel: {
              display: true,
              labelString: '# of invoices',
              fontSize: 16,
              fontFamily: 'inherit'
            }
          }]
        }
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
      'subPractice': this.subPractice,
      'subPracticeData': this.subPracticeData,
      'client': this.client,
      'clientData': this.clientData,
      'project': this.project,
      'projectData': this.projectData,
      'orgMaxYear': this.orgMaxYear,
      'compare': this.compare,
      'minYear': this.minYear,
      'maxYear': this.maxYear,
      'isGrid': this.isGrid

    }
    this.gridService.setFilters(obj);
  }
}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}
