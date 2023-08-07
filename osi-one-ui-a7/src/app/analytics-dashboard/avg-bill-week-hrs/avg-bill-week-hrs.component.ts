import { Component, OnInit, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Options } from 'ng5-slider';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid';
import { CommonUtilities } from '../../shared/utilities/common-utilities';
import { GridService } from '../../dashboard-grid/grid.service';
import { ExportFileService } from '../../shared/services/export-file.service';
declare var $: any;

@Component({
  selector: 'app-avg-bill-week-hrs',
  templateUrl: './avg-bill-week-hrs.component.html',
  styleUrls: ['./avg-bill-week-hrs.component.css']
})
export class AvgBillWeekHrsComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  refreshDate: Date;

  orgData: any = [];
  practiceData: any = [];
  selectedOrg: any = [];
  checkboxData: any[] = [];
  empPract: any = '*';
  empType: any = '*';
  isGrid = false;
  year = moment().year() - 1;
  value = 25;
  options: Options = {
    floor: 1,
    ceil: 25,
    step: 1,
    // showTicks: true
  };
  selDate: any;
  selectedMinMonth: any;
  selectedMaxMonth: any;
  minValue = 1;
  maxValue: number = moment().month() + 1;

  spinner = false;
  showPreservedSpinner: boolean = false;
  empweeklydata: any[] = [];
  empData: any[] = [];

  chartAvgWeeklyBillableHrs: Chart;
  avgWeeklyBillablehrsLabel: any = [];
  dataset: any = [];
  weeks: any = [];
  data: any = [];
  id: any = [];
  charts: any = [];
  orgLength: any;
  employeeData: any = [];
  empTypeData: any = [];
  dbConfigReq: any;
  shouldGetDatafromCachedDb = true;
  hrsByResourceObj;
  columnDefs: any= [];
  gridOptions = <GridOptions>{};
  paginationPageSize = 10;

  gridApi: any;
  gridColumnApi: any;
  gridHeight: any = 0;
  // @ViewChild('agGrid', { static: true}) agGrid: GridOptions;

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private toasterService: ToastrService,
    private gridService: GridService,
    private downloadFile: ExportFileService,
    private commonUtilities: CommonUtilities
  ) {
    this.setPreservedFilter();
  }

  ngOnInit() {
    // this.setPreservedFilter();
    this.configAvgWeeklyBillHrsIndexedDb();
    // this.getOrgData();
  }

  setPreservedFilter() {
    this.showPreservedSpinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res ? JSON.parse(res.filters) : null;
      this.empType = filter && Object.keys(filter).length > 0 ? filter.empType : this.empType;
      this.empPract = filter && Object.keys(filter).length > 0 ? filter.practice : this.empPract;
      this.selectedOrg = filter && Object.keys(filter).length > 0 ? filter.org : this.selectedOrg;
      // this.employeeData = filter && Object.keys(filter).length > 0 ? filter.subPract : this.employeeData;
      this.value = filter && Object.keys(filter).length > 0 ? filter.sliderValue : this.value;
      this.showPreservedSpinner = false;

      if (this.selectedOrg && this.selectedOrg.length) {
        this.checkboxData = this.checkboxData.map(item => {
          item.checked = this.selectedOrg.indexOf(item.value) > -1;
          return item;
        });
        this.shouldCheckAllCheckBox();
      }
      // this.configAvgWeeklyBillHrsIndexedDb();
    }, (errorResponse) => {
      this.showPreservedSpinner = false;
      // this.toasterService.error('Error Occured While Getting preserved filters data!');
    });
  }

  configAvgWeeklyBillHrsIndexedDb() {
    const userName = localStorage.getItem('userName');
    const dbName = `${userName.split(' ').join('_')}_avg_weekly_bill_hrs`;
    this.dbConfigReq = window.indexedDB.open(dbName);

    this.dbConfigReq.onerror = () => {
      console.log('failed to open the db');
    };

    this.dbConfigReq.onsuccess = () => {
      if (this.shouldGetDatafromCachedDb) {
        const db = this.dbConfigReq.result;

        const resourceStore = db.transaction('filters_list').objectStore('filters_list');
        resourceStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { resourceList } = e.target.result.value;
            this.sortFilters(resourceList);
          } else {
            this.getOrgData();
          }

        };

        if (this.commonUtilities.isStoreAvailableInDB(db, 'refresh_Date')) {
          const refreshStore = db.transaction('refresh_Date').objectStore('refresh_Date');
          refreshStore.openCursor().onsuccess = (e) => {
            if (e.target.result) {
              this.refreshDate = e.target.result.value.refreshDate;
            }
          };
        }

        const empStore = db.transaction('avg_weekly_bill_hrs_data').objectStore('avg_weekly_bill_hrs_data');
        empStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { resourceList } = e.target.result.value;
            this.empData = resourceList.aggregations.filtered.by_employee.buckets;
            this.selectMonth();
          } else {
            this.getAvgWeeklyBillableHrs(this.selectedOrg, this.practiceData, this.value, this.employeeData, this.empTypeData);
          }

        };

      } else {
        this.getOrgData();
      }
    };
    this.isPageLoaded.emit(true);
    this.dbConfigReq.onupgradeneeded = (e) => {
      this.shouldGetDatafromCachedDb = false;
      const idb = e.target['result'];
      idb.createObjectStore('filters_list', { keyPath: 'filtersId', autoIncrement: true });
      idb.createObjectStore('avg_weekly_bill_hrs_data', { keyPath: 'avgBillHrsId', autoIncrement: true });
      idb.createObjectStore('refresh_Date', { keyPath: 'dateId', autoIncrement: true });
    };
  }

  getOrgData(addOrUpdate?: string) {
    // ----------------------------------------- Filter DATA -----------------------------------------------------
    this.spinner = true;
    this.resource.getResourcesList().subscribe(response => {
      this.spinner = false;

      this.sortFilters(response);

      // this.selectMonth(this.value);
      this.getAvgWeeklyBillableHrs(this.selectedOrg, this.practiceData, this.value, this.employeeData, this.empTypeData);

      //adding resourcelist to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('filters_list', 'readwrite');
      const store = transaction.objectStore('filters_list');
      if (addOrUpdate === 'update') {
        this.updateIdexedDbVal(store, { filtersId: 0, resourceList: response });
      } else {
        store.add({ filtersId: 0, resourceList: response });
      }

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting organization data!');
    });
  }

  sortFilters(response: any) {
    this.selectedOrg = [];
    this.orgData = [];
    this.checkboxData = [];
    this.orgData = response.org;
    this.practiceData = response.practice;
    this.employeeData = response.employee;
    this.empTypeData = response.employeeType;

    this.orgData = this.orgData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    this.practiceData = this.practiceData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    this.empTypeData = this.empTypeData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    this.orgLength = response.org.length;
    this.selectedOrg = this.selectedOrg.length > 0 ? this.selectedOrg : this.orgData;
    this.orgData.forEach((item) => {
      this.checkboxData.push({
        'name': item,
        'value': item,
        'checked': this.selectedOrg.indexOf(item) > -1 // true
      });
    });
    this.shouldCheckAllCheckBox();
  }

  shouldCheckAllCheckBox() {
    const checkedCheckboxes = this.checkboxData.filter(item => item.checked);
    const ele = document.getElementById('all') as HTMLInputElement;
    ele.checked = checkedCheckboxes.length == this.checkboxData.length; //true;
  }

  updateIdexedDbVal(store, dataToUpdate) {
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const request = cursor.update(dataToUpdate);
        request.onsuccess = function () {
          console.log('list data updated.');
        };
      }
    };
  }

  onCheckboxChange(value: any, isChecked: any) {
    if (isChecked) {
      if (value == '*') {
        this.selectedOrg = this.orgData;
        this.checkboxData.forEach(item => item.checked = isChecked);
      } else {
        let i = 0;
        this.checkboxData.forEach((item) => {
          if (item.checked == true) { i = i + 1; }
        });
        if (i == this.orgLength) {
          const ele = document.getElementById('all') as HTMLInputElement;
          ele.checked = true;
        }
        this.selectedOrg.push(value);
      }
    } else {
      if (value == '*') {
        this.selectedOrg = [];
        this.checkboxData.forEach(item => item.checked = isChecked);
      } else {
        this.checkboxData.forEach((item) => {
          if (item.checked == false) {
            const ele = document.getElementById('all') as HTMLInputElement;
            ele.checked = false;
          }
        });
        const index = this.selectedOrg.findIndex(x => x == value);
        this.selectedOrg.splice(index, 1);
      }
    }
    this.selectMonth();
    this.isPageLoaded.emit(true);
  }

  selectMonth() {
    this.empweeklydata = [];
    // this.selDate = this.value < 10 ? this.year + "0" + this.value : this.year.toString() + this.value.toString();

    const pract: any[] = this.empPract == '*' ? this.practiceData : [this.empPract];
    const empType: any[] = this.empType == '*' ? this.empTypeData : [this.empType];

    // this.getAvgWeeklyBillableHrs(this.selectedOrg, pract, this.value, this.employeeData, empType);

    const obj = {
      'empType': empType,
      'practice': pract,
      'org': this.selectedOrg,
      // 'employee' : this.employeeData,
      'sliderValue': this.value,
      'employee': this.employeeData
    };

    const empStore = this.dbConfigReq.result.transaction('avg_weekly_bill_hrs_data').objectStore('avg_weekly_bill_hrs_data');

    empStore.openCursor().onsuccess = (e) => {
      if (e.target.result) {
        const { resourceList } = e.target.result.value;
        const avgWeeklyBillHrs = resourceList.aggregations.filtered.by_employee.buckets;
        this.filterempData(avgWeeklyBillHrs, obj);
      }

    };
    this.isPageLoaded.emit(true);
  }


  filterempData(empData: any, { empType, practice, org, sliderValue, employee }) {
    const filteredData = empData.filter(item => employee.indexOf(item.key) > -1);
    const selectedWeeks = this.commonUtilities.lastWeeksMondayDates(sliderValue, '_');
    filteredData.map(item => {
      item.by_org.buckets = item.by_org.buckets.filter(obj => org.indexOf(obj.key) > -1);
      item.by_practice.buckets = item.by_practice.buckets.filter(obj => practice.indexOf(obj.key) > -1);
      item.by_empType.buckets = item.by_empType.buckets.filter(obj => empType.indexOf(obj.key) > -1);
      item.by_week.buckets = item.by_week.buckets.filter(obj => selectedWeeks.indexOf(obj.key_as_string) > -1);
      return item;
    });

    this.empData = filteredData.filter(item => {
      return item.by_org.buckets.length && item.by_empType.buckets.length &&
        item.by_practice.buckets.length && item.by_week.buckets.length;
    });
    this.bindAvgWeeklyBillHrsData();

  }

  getAvgWeeklyBillableHrs(org: any, practice: any, week: any, employee: any, empType: any, addOrUpdate?: any) {
    this.es.getAvgWeeklyBillableHrs('BILLABLE', org, practice, week, employee, empType);
    this.spinner = true;
    this.es.getAvgWeeklybillhrs().subscribe((response) => {
      this.spinner = false;

      this.empData = response.aggregations.filtered.by_employee.buckets;

      this.bindAvgWeeklyBillHrsData();

      this.getRefreshDate();

      //adding employee data to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('avg_weekly_bill_hrs_data', 'readwrite');
      const store = transaction.objectStore('avg_weekly_bill_hrs_data');
      if (addOrUpdate === 'update') {
        this.updateIdexedDbVal(store, { avgBillHrsId: 0, resourceList: response });
      } else {
        store.add({ avgBillHrsId: 0, resourceList: response });
      }


    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting average weekly billable hours data!');
    });
  }

  getRefreshDate(addOrUpdateData?: string) {

    this.refreshDate = new Date();
    const db = this.dbConfigReq.result;
    const transaction = db.transaction('refresh_Date', 'readwrite');
    const store = transaction.objectStore('refresh_Date');
    if (addOrUpdateData === 'update') {

      this.updateIdexedDbVal(store, { dateId: 0, refreshDate: this.refreshDate });
    } else {
      store.add({ dateId: 0, refreshDate: this.refreshDate });

    }

  }

  bindAvgWeeklyBillHrsData() {
    this.empweeklydata = [];
    this.empData.forEach((empItem: any) => {
      const obj = {};
      let total: any = 0;
      const weeks: any[] = [];
      obj['employee'] = empItem.key;
      empItem.by_week.buckets.forEach((weekItem: any, i: any) => {

        weeks.push(weekItem.key_as_string);
        const weekString = weekItem.key_as_string;
        total += Number(weekItem.by_hours_sum.value);

        obj['noOfWeeks'] = i;
        obj[weekString] = weekItem.by_hours_sum.value;

      });
      obj['avgHrs'] = (total / weeks.length).toFixed(2);
      obj['week'] = weeks;
      obj['total'] = total;
      this.empweeklydata.push(obj);
    });

    this.empweeklydata = this.empweeklydata.sort(function sortAll(a, b) {
      return a.employee > b.employee ? 1 : a.employee < b.employee ? -1 : 0;
    });

    this.weeks = new Set(this.empweeklydata.map((resource: any) => resource.week));
    this.avgWeeklyBillablehrsLabel = Array.from(this.weeks);

    this.empweeklydata.forEach((empItem) => {
      const test: any = {};
      test['label'] = empItem.employee + ' Agg_Hrs ' + empItem.avgHrs;
      const week = [];
      this.avgWeeklyBillablehrsLabel.forEach((item) => {
        week.push(empItem[item] ? empItem[item] : 0);
      });
      test['data'] = week;
      test['fill'] = false;
      this.data.push(test);
    });
    // this.createChart();
    this.setFilters();
    this.createChartsData();
  }

  refresh() {
    // this.selectedOrg = [];
    this.value = 25;
    this.empType = '*';
    this.empPract = '*';
    // this.selectedOrg = this.orgData;
    this.getOrgData('update');
    const ele = document.getElementById('all') as HTMLInputElement;
    ele.checked = true;
    this.getRefreshDate('update');
  }

  downloadDetailsInExel() {
    const downloadDetails = this.empweeklydata;
    const file_name = 'avg_weekly_bill_hrs_';
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  createChart() {
    if (this.chartAvgWeeklyBillableHrs) {
      this.chartAvgWeeklyBillableHrs.destroy();
    }

    this.chartAvgWeeklyBillableHrs = new Chart('canvasId', {
      type: 'line',
      data: {
        labels: this.avgWeeklyBillablehrsLabel,
        // datasets: this.data
        datasets: [
          {
            label: this.empweeklydata[0].employee,
            fill: false,
            data: [this.empweeklydata[0].Jan_27],
            borderColor: '#28a745',
            backgroundColor: '#28a745',
            hoverBackgroundColor: '#28a745',
            // hidden: true,
          }]
      },
      options: {
        aspectRatio: 7,
        animation: {
          duration: 10,
        },
        tooltips: {
          yAlign: top,
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' +
                tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'hrs';
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: { display: false },
          }],
          yAxes: [{
            stacked: false,
            gridLines: { display: false },
            ticks: {
              callback: function (value) {
                const ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' }
                ];
                function formatNumber(n) {
                  for (let i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n;
                }
                return formatNumber(value) + ' hrs';
              }
            }
          }],
        },
        legend: {
          display: true,
          labels: {
            fontSize: 13,
            boxWidth: 10
          }
        }
      }
    });
  }

  toggle(event: any) {
    if (event.target.classList.contains('active')) {
      this.isGrid = false;
      this.createChartsData();
    } else {
      this.isGrid = true;
      this.createGrid();
    }
    this.isPageLoaded.emit(true);
  }

  createGrid(): any {
    this.columnDefs = this.generateColumns(this.empweeklydata);
    this.gridOptions.api.setRowData(this.empweeklydata);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
  }

  generateColumns(data: any[]) {
    let columnDefinitions = [];

    data.map(object => {

      Object.keys(object).map(key => {
        const mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          width: 90
        };
        if (key.toUpperCase() == 'EMPLOYEE' || key.toUpperCase() == 'AVGHRS') {
          mappedColumn['pinned'] = 'left';
          mappedColumn['width'] = 150;
        }

        if (key.toUpperCase() == 'NOOFWEEKS' || key.toUpperCase() == 'WEEK') {
          mappedColumn['hide'] = true;
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
    const lineCount = Math.floor(params.data.length / 32) + 1;
    const height = (12 * lineCount) + 24;
    return height;
  };



  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }
  createChartsData() {
    this.spinner = true;
    const array = [];

    this.empweeklydata.forEach((empItem) => {
      const week = [];
      empItem.week.forEach((item) => {
        week.push(empItem[item] ? empItem[item] : 0);
      });


      const line = {
        type: 'line',
        data: {
          labels: empItem.week,
          // datasets: this.data
          datasets: [
            {
              label: empItem.employee,
              fill: false,
              data: week,
              borderColor: '#28a745',
              backgroundColor: '#28a745',
              hoverBackgroundColor: '#28a745',
              // hidden: true,
            }]
        },
        options: {
          aspectRatio: 12,
          animation: {
            duration: 10,
          },
          tooltips: {
            yAlign: top,
            callbacks: {
              label: function (tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ': ' +
                  tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'hrs';
              }
            }
          },
          scales: {
            xAxes: [{
              stacked: false,
              gridLines: {
                drawBorder: false,
                display: false
              },
            }],
            yAxes: [{
              stacked: false,
              gridLines: {
                drawBorder: false,
                display: false
              },
              ticks: {
                display: false,
                callback: function (value) {
                  const ranges = [
                    { divider: 1e6, suffix: 'M' },
                    { divider: 1e3, suffix: 'k' }
                  ];
                  function formatNumber(n) {
                    for (let i = 0; i < ranges.length; i++) {
                      if (n >= ranges[i].divider) {
                        return (n / ranges[i].divider).toString() + ranges[i].suffix;
                      }
                    }
                    return n;
                  }
                  return formatNumber(value) + ' hrs';
                }
              }
            }],
          },
          legend: {
            display: false,
            labels: {
              fontSize: 12,
              boxWidth: 10
            }
          }
        }
      };
      array.push(line);
      //  delete empItem.week;
      //  delete empItem.noOfWeeks;
    });

    this.spinner = false;

    this.createCharts(array);
  }

  createCharts(pieData) {
    this.isPageLoaded.emit(false);
    this.spinner = true;

    setTimeout(() => {
      this.empweeklydata.forEach((item, i) => {
        const ctx4 = document.getElementById(`canvas` + i);
        this.charts.push(new Chart(ctx4, pieData[i]));
      });
    });
    this.spinner = false;
    this.isPageLoaded.emit(true);
  }



  toggleList(event: any) {
    if (event.target.classList.contains('glyphicon-plus')) {
      event.target.classList.remove('glyphicon-plus');
      event.target.classList.add('glyphicon-minus');
      $('#collapseOne').removeClass('collapse');
    } else {
      event.target.classList.add('glyphicon-plus');
      event.target.classList.remove('glyphicon-minus');
      $('#collapseOne').addClass('collapse');
    }
    this.isPageLoaded.emit(true);
  }

  setFilters(): any {
    const obj = {
      'empType': this.empType,
      'practice': this.empPract,
      'org': this.selectedOrg,
      // 'employee' : this.employeeData,
      'sliderValue': this.value
    };
    this.gridService.setFilters(obj);
  }

}
