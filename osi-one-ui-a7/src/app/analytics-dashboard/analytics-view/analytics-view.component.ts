import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { Chart } from 'chart.js';
import * as moment from 'moment'
import { Options } from 'ng5-slider';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GridService } from '../../dashboard-grid/grid.service';
import { CommonUtilities } from '../../shared/utilities';
import { ExportFileService } from '../../shared/services/export-file.service';
declare var $: any;

@Component({
  selector: 'app-analytics-view',
  templateUrl: './analytics-view.component.html',
  styleUrls: ['./analytics-view.component.css']
})
export class AnalyticsViewComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  refreshDate : Date;
  datePickerConfig: Partial<BsDatepickerConfig>;
  orgData: any = [];
  selectedOrg: any = [];
  horizontalBarChart: Chart;
  horizontalBarLabels: any = [];
  horizontalBarBlockData: any = [];
  invoicedRevByCustomerData: any = [];
  checkboxData: any[] = [];
  formattedGridInvRevByCustimerData: any = [];
  columnDefs:any = [];
  paginationPageSize = 10;
  gridApi;
  gridColumnApi;

  year = moment().year();
  value: number = 1;
  options: Options = {
    floor: 1,
    ceil: 12,
    step: 1,
    // showTicks: true
  };
  selDate: any;
  selectedMinMonth: any;
  selectedMaxMonth: any;
  minValue: number = 1;
  maxValue: number = moment().month() + 1;

  spinner: boolean = false;
  isDataLoading: boolean = false;
  isResourceListLoading: boolean = false;
  currentDate: Date = new Date();
  orgLength: any;
  employeeData: any = [];
  daysInYear: any = ((Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate()) - Date.UTC(this.currentDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000) - 1;
  // dateRange: any = [new Date(this.currentDate.setDate(this.currentDate.getDate() - this.daysInYear)), new Date()];
  startDate: any;
  endDate: any;
  dbConfigReq: any;
  shouldGetDatafromCachedDb: boolean = true;
  fromMonth: any;
  toMonth: any;
  invRevByCustData: any = [];
  gridOptions = <GridOptions>{};
  shouldShowGrid: boolean = false;

  constructor(
    config: NgbDatepickerConfig,
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private gridService: GridService,
    private toasterService: ToastrService,
    private commonUtilities: CommonUtilities,
    private downloadFile: ExportFileService
  ) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      dateInputFormat: 'MMM/YYYY'
    });
    this.startDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - this.daysInYear));
    this.endDate = new Date();
    this.setPreservedFilter();
    this.fromMonth = this.startDate ? this.startDate.getFullYear().toString() + ((this.startDate.getMonth() + 1) < 10 ? '0' + (this.startDate.getMonth() + 1) : (this.startDate.getMonth() + 1)) : '';
    this.toMonth = this.endDate ? this.endDate.getFullYear().toString() + ((this.endDate.getMonth() + 1) < 10 ? '0' + (this.endDate.getMonth() + 1) : (this.endDate.getMonth() + 1)) : '';
  }

  ngOnInit() {
    // this.setPreservedFilter();
    // this.getOrgData();
    // this.getInvRevenueByCust();
    this.isPageLoaded.emit(false);
      this.configInvRevenueByCustIndexedDb();
  }

  setPreservedFilter() {
    this.isDataLoading = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res ? JSON.parse(res.filters) : null;
      this.startDate = filter && Object.keys(filter).length > 0 ? filter.startDate : this.startDate;
      this.endDate = filter && Object.keys(filter).length > 0 ? filter.endDate : this.endDate;
      this.selectedOrg = filter && Object.keys(filter).length > 0 ? filter.org : this.selectedOrg;
      // this.employeeData = filter && Object.keys(filter).length > 0 ? filter.subPract : this.employeeData;
      this.isDataLoading = false;
      if(this.selectedOrg && this.selectedOrg.length) {
        this.checkboxData = this.checkboxData.map(item => {
          item.checked = this.selectedOrg.indexOf(item.value) > -1
          return item;
        })
        this.shouldCheckAllCheckBox();
      }
      // this.configInvRevenueByCustIndexedDb();
    }, (errorResponse) => {
      this.isDataLoading = false;
      // this.toasterService.error('Error Occured While Getting preserved filters data!');
    });
  }

  configInvRevenueByCustIndexedDb() {
    const userName = localStorage.getItem('userName');
    const dbName = `${userName.split(' ').join('_')}_inv_revenue_by_customer`;
    this.dbConfigReq = window.indexedDB.open(dbName);

    this.dbConfigReq.onerror = () => {
      console.log('failed to open the db');
    }

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

        }

        if(this.commonUtilities.isStoreAvailableInDB(db, 'refresh_Date')) {
          const refreshStore = db.transaction('refresh_Date').objectStore('refresh_Date');
          refreshStore.openCursor().onsuccess = (e) => {
            if (e.target.result) {
             this.refreshDate = e.target.result.value.refreshDate;
            }
          }
        }
        

        const empStore = db.transaction('inv_rev_by_cust_data').objectStore('inv_rev_by_cust_data');
        empStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { resourceList } = e.target.result.value;
            this.invRevByCustData = resourceList.aggregations.filtered.by_customer.buckets;
            this.selectMonth();
          } else {
            this.getInvRevenueByCust(this.selectedOrg, this.fromMonth, this.toMonth, this.employeeData);
          }

        }

      } else {
        this.getOrgData();
      }
    }
    this.dbConfigReq.onupgradeneeded = (e) => {
      this.shouldGetDatafromCachedDb = false;
      const idb = e.target['result'];
      idb.createObjectStore('filters_list', { keyPath: 'filtersId', autoIncrement: true });
      idb.createObjectStore('inv_rev_by_cust_data', { keyPath: 'invRevByCustId', autoIncrement: true });
      idb.createObjectStore('refresh_Date', { keyPath: 'dateId', autoIncrement: true });
    }
  }

  getOrgData(addorUpdateData?: string) {
    // ----------------------------------------- ORGANIZATION DATA -----------------------------------------------------
    this.isResourceListLoading = true;
    this.resource.getResourcesList().subscribe(response => {
    this.isResourceListLoading = false;      
    this.isPageLoaded.emit(true);
      this.sortFilters(response);

      // this.selectMonth();
      this.getInvRevenueByCust(this.selectedOrg, this.fromMonth, this.toMonth, this.employeeData, addorUpdateData);

      //adding resourcelist to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('filters_list', 'readwrite')
      const store = transaction.objectStore('filters_list');
      if (addorUpdateData === 'update') {
        this.updateIdexedDbVal(store, { filtersId: 0, resourceList: response });
      } else {
        store.add({ filtersId: 0, resourceList: response });
      }


    }, (errorResponse) => {
      this.isResourceListLoading = false;
      this.toasterService.error('Error Occured While Getting organization data!');
    });
  }

  sortFilters(response: any) {
    this.checkboxData = [];
    this.orgData = response.org;
    this.employeeData = response.employee;
    this.orgData = this.orgData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.orgLength = response.org.length;
    this.selectedOrg = this.orgData;
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
        const index = this.selectedOrg.findIndex(x => x == value)
        this.selectedOrg.splice(index, 1);
      }
    }
    this.selectMonth()
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
    }
  }

  getInvRevenueByCust(org: any, min: any, max: any, employee: any, addorUpdateData?: string) {
    this.es.getInvoincedRevenueByCustomer('INVOICED', org, min, max, employee);
    this.isDataLoading = true;
    this.es.getInvRevenueByCust().subscribe((response) => {
      this.isDataLoading = false;    
      this.isPageLoaded.emit(true);
      this.invRevByCustData = response && response.aggregations ? response.aggregations.filtered.by_customer.buckets : [];

      this.getRefreshDate();
      //adding employee data to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('inv_rev_by_cust_data', 'readwrite')
      const store = transaction.objectStore('inv_rev_by_cust_data');

      if (addorUpdateData === 'update') {
        this.updateIdexedDbVal(store, { invRevByCustId: 0, resourceList: response });
      } else {
        store.add({ invRevByCustId: 0, resourceList: response });
      }

      this.selectMonth();
      // this.bindInvoicedRevenueByCustomer();


    }, (errorResponse) => {
      this.isDataLoading = false;
      this.toasterService.error('Error Occured While Getting invoiced revenue by customer data!');
    });
  }

  getRefreshDate(addOrUpdateData?: string) {

    this.refreshDate = new Date();
    const db = this.dbConfigReq.result;
    const transaction = db.transaction('refresh_Date', 'readwrite')
    const store = transaction.objectStore('refresh_Date');
    if (addOrUpdateData === 'update') {
      this.updateIdexedDbVal(store, { dateId: 0, refreshDate: this.refreshDate });
    } else {
      store.add({ dateId: 0, refreshDate: this.refreshDate });

    }

  }

  bindInvoicedRevenueByCustomer() {
    this.invoicedRevByCustomerData = [];
    this.horizontalBarBlockData = [];
    this.horizontalBarLabels = [];
    this.invoicedRevByCustomerData = this.invRevByCustData;
    this.invoicedRevByCustomerData = this.invoicedRevByCustomerData.sort((a: any, b: any) => {
      return a.by_revenue.value > b.by_revenue.value ? -1 : a.by_revenue.value < b.by_revenue.value ? 1 : 0;
    });
    // this.invoicedRevByCustomerData = this.invoicedRevByCustomerData.filter((item, index) => {
    //   return index < 60;
    // });
    this.invoicedRevByCustomerData = this.invoicedRevByCustomerData.filter((item, index) => {
      return item.by_yearMonth.buckets && item.by_yearMonth.buckets.length;
    });
    // this.invoicedRevByCustomerData.forEach((item) => {
    //   this.horizontalBarLabels.push(item.key);
    //   this.horizontalBarBlockData.push(item.by_revenue.value);
    // });
    
    const monthlyRev = [];

    this.invoicedRevByCustomerData.forEach((item) => {
      const obj = {};
      let totalRevenue = 0;
      item.by_yearMonth.buckets.forEach((monthItem) => {
        totalRevenue += monthItem.revenue.value;
      });
      obj['customer'] = item.key
      obj['revenue'] = totalRevenue;
      monthlyRev.push(obj);
    });
  this.formattedGridInvRevByCustimerData = monthlyRev;
    monthlyRev.forEach((item) => {
      this.horizontalBarLabels.push(item.customer);
      this.horizontalBarBlockData.push(item.revenue);
    });

    this.setFilters();
    if (this.shouldShowGrid) {
      this.createGrid();
    } else {
      this.createChart();
    }
  }

  selectMonth() {
    const fromMonth = this.startDate ? this.startDate.getFullYear().toString() + ((this.startDate.getMonth() + 1) < 10 ? '0' + (this.startDate.getMonth() + 1) : (this.startDate.getMonth() + 1)) : '';
    const toMonth = this.endDate ? this.endDate.getFullYear().toString() + ((this.endDate.getMonth() + 1) < 10 ? '0' + (this.endDate.getMonth() + 1) : (this.endDate.getMonth() + 1)) : '';

    // this.selectedMinMonth = this.minValue < 10 ? this.year + "0" + this.minValue : this.year.toString() + this.minValue;
    // this.selectedMaxMonth = this.maxValue < 10 ? this.year + "0" + this.maxValue : this.year.toString() + this.maxValue;


    const obj = {
      'fromMonth': fromMonth,
      'toMonth': toMonth,
      'org': this.selectedOrg,
      'employee': this.employeeData
    };

    const empStore = this.dbConfigReq && this.dbConfigReq.readyState == 'done' && this.dbConfigReq.result ? this.dbConfigReq.result.transaction('inv_rev_by_cust_data').objectStore('inv_rev_by_cust_data') : null;
    
    if (empStore) {
      empStore.openCursor().onsuccess = (e) => {
        const { resourceList } = e.target.result.value;
        const invRevByCust = resourceList.aggregations.filtered.by_customer.buckets;
        this.filterempData(invRevByCust, obj);
      }
    }

    // this.getInvRevenueByCust(this.selectedOrg, fromMonth, toMonth, this.employeeData);
  }


  filterempData(empData: any, { fromMonth, toMonth, org, employee }) {
    const filteredData = empData;
    filteredData.map(item => {
      item.by_org.buckets = item.by_org.buckets.filter(obj => org.indexOf(obj.key) > -1);
      item.by_yearMonth.buckets = item.by_yearMonth.buckets.filter(obj => obj.key <=toMonth && obj.key >= fromMonth);
      return item;
    });

    this.invRevByCustData = filteredData.filter(item => {
      return item.by_org.buckets.length
    });
    this.bindInvoicedRevenueByCustomer();

  }


  refresh() {
    const date: Date = new Date();
    // this.selectedOrg = [];
    this.startDate = new Date(date.setDate(date.getDate() - this.daysInYear));
    this.endDate = new Date();
    this.getOrgData('update');
    const ele = document.getElementById('all') as HTMLInputElement;
    ele.checked = true;
    this.getRefreshDate('update');
  }

  createChart() {
    if (this.horizontalBarChart) {
      this.horizontalBarChart.destroy();
    }
    this.spinner = true;

    this.horizontalBarChart = new Chart('invoicedRevenueByCustomer', {
      type: 'horizontalBar',
      data: {
        labels: this.horizontalBarLabels,
        datasets: [
          {
            label: 'Customer',
            data: this.horizontalBarBlockData,
            backgroundColor: '#1d618a',
            hoverBackgroundColor: '#1d618a',
            maxBarThickness: 10,
            // categoryPercentage: 0.4,
            // hidden: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 4,
        animation: {
          duration: 1,
          onComplete: function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            // ctx.fontSize = '10px';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index] > 0 ? dataset.data[index].toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
                ctx.fillText(data, bar._model.x + 25, bar._model.y + 5);

              });
            });
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label +
                ': ' + tooltipItem.xLabel.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          },
          // backgroundColor: 'rgb(213, 213, 195)'
          backgroundColor: '#fffcdc',
          titleFontColor: 'black',
          bodyFontColor: 'black',
          borderColor: 'rgba(75, 75, 75, 1)',
          borderWidth: 1

        },
        scales: {
          xAxes: [{
            // maxBarThickness: 10,
            // categoryPercentage: 0.5,
            // barPercentage: 0.7,
            stacked: false,
            gridLines: { display: true },
            ticks: {
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
                  return '  ' + n + '  ';
                }
                return formatNumber(value);
              },
              autoSkip: false,
              beginAtZero: true,
              // maxTicksLimit: 5,
              // max: 60
            }
          }],
          yAxes: [{
            // maxBarThickness: 10,
            // categoryPercentage: 0.5,
            stacked: false,
            ticks: {
              beginAtZero: true,
              // maxTicksLimit: 5,
              // max: 60
            },
            gridLines: {
              offsetGridLines: false
            }
          }],
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
              weight: 'bold'
            }
          }
        },
        legend: {
          onClick: null,
          display: false,
          position: 'top',
          align: 'end',
          labels: {
            fontSize: 11,
            boxWidth: 11
          }
        }
      }
    });

    this.spinner = false;    
    this.isPageLoaded.emit(true);
  }


  createGrid() {
    this.columnDefs = this.generateColumns(this.formattedGridInvRevByCustimerData);
    this.gridOptions.api.setRowData(this.formattedGridInvRevByCustimerData);
     this.gridOptions.api.sizeColumnsToFit();
  }

  generateColumns(data: any[]) {
    this.spinner = true;
    let columnDefinitions = [];

    data.map(object => {
      Object.keys(object).map(key => {
        const mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          width: 395
        }
        // if (key.toUpperCase() == 'PROJECT' || key.toUpperCase() == 'EMPLOYEE' || key.toUpperCase() == 'TOTALHOURS') {
        //   mappedColumn['pinned'] = 'left'
        //   mappedColumn['width'] = 150
        // }
        columnDefinitions.push(mappedColumn);
      })
    })
    //Remove duplicate columns
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    )
    this.spinner = false;
    return columnDefinitions;
  }

  getRowHeight = function (params) {
    const lineCount = Math.floor(params.data.customer.length / 32) + 1;
    const height = (12 * lineCount) + 24;
    return height;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  onToggleTableVsChartChange(evt) {
    this.shouldShowGrid = !evt.target.classList.contains('active');
    if(this.shouldShowGrid) {
      this.createGrid(); 
    } else {
      this.createChart();
    }
  }

  exportDetailsInExcel() {
    const downloadDetails = this.formattedGridInvRevByCustimerData;
    const file_name = 'invoice_revenue_by_customer';
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
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
  }

  setFilters(): any {
    const obj = {
      'startDate': this.startDate,
      'endDate': this.endDate,
      'org': this.selectedOrg,
      // 'employee' : this.employeeData
    }
    this.gridService.setFilters(obj);
  }

}
