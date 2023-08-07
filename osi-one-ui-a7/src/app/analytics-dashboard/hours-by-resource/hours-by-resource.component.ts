import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid';
import { GridService } from '../../dashboard-grid/grid.service';
import { CommonUtilities } from '../../shared/utilities/common-utilities';
// import {DateFormatPipe} from 'angular2-moment';

declare var $: any;

@Component({
  selector: 'app-hours-by-resource',
  templateUrl: './hours-by-resource.component.html',
  styleUrls: ['./hours-by-resource.component.css']
})
export class HoursByResourceComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  refreshDate: Date;
  empOrg: any = '*';
  empXferOrg: any = '*';
  empPract: any = '*';
  empSubPract: any = '*';
  empName: any = '*';
  isInternal: boolean = true;
  spentDate: any = '24';
  empStatus: any = '*';
  isBillable: any = '*';

  gridApi: any;
  gridColumnApi: any;
  gridOptions: any = <GridOptions>{};
  gridHeight: any = 0;
  paginationPageSize: any = 10;
  columnDefs: any = [];

  hrsByResourceObj: any = [];
  empOrgData: any = [];
  empXferOrgData: any = [];
  empPracticeData: any = [];
  empSubPracticeData: any = [];
  employeeData: any = [];
  hrsByempData: any = [];
  spinner: boolean = false;
  dbConfigReq: any;
  shouldGetDatafromCachedDb: boolean = true;

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private downloadFile: ExportFileService,
    private gridService: GridService,
    private toasterService: ToastrService,
    private commonUtilities: CommonUtilities
  ) {
    this.setPreservedFilter();
  }

  ngOnInit() {
    // this.setPreservedFilter();
    this.isPageLoaded.emit(false);
    this.configHoursByResourceIndexedDb();
    // this.filterData();
    // this.getHrsByResourceData();
    // this.todayDate = JSON.parse(localStorage.getItem('todayDate'));
    // localStorage.removeItem('todayDate');
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res ? JSON.parse(res.filters) : null;
      this.empOrg = filter && Object.keys(filter).length > 0 ? filter.empOrg : this.empOrg;
      this.empXferOrg = filter && Object.keys(filter).length > 0 ? filter.xferOrg : this.empXferOrg;
      this.empPract = filter && Object.keys(filter).length > 0 ? filter.pract : this.empPract;
      this.empSubPract = filter && Object.keys(filter).length > 0 ? filter.subPract : this.empSubPract;
      this.spentDate = filter && Object.keys(filter).length > 0 ? filter.spentDate : this.spentDate;
      this.isBillable = filter && Object.keys(filter).length > 0 ? filter.isBillable : this.isBillable;
      this.empStatus = filter && Object.keys(filter).length > 0 ? filter.empStatus : this.empStatus;
      this.spinner = false;
      // this.configHoursByResourceIndexedDb();
    }, (errorResponse) => {
      this.spinner = false;
      //this.toasterService.error('Error Occured While Getting preserved filters data!');
    });
  }

  configHoursByResourceIndexedDb() {
    const userName = localStorage.getItem('userName');
    const dbName = `${userName.split(' ').join('_')}_hours_by_resource`;
    this.dbConfigReq = window.indexedDB.open(dbName);

    this.dbConfigReq.onerror = () => {
      console.log('failed to open the db');
    };

    this.dbConfigReq.onsuccess = () => {
      if (this.shouldGetDatafromCachedDb) {
        const db = this.dbConfigReq.result;
        const resourceStore = db.transaction('resource_list').objectStore('resource_list');
        resourceStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { resourceList } = e.target.result.value;
            this.bindFilterDropDownData(resourceList);
          } else {
            this.filterData();
          }

        };

        if(this.commonUtilities.isStoreAvailableInDB(db, 'refresh_Date')) {
        const refreshStore = db.transaction('refresh_Date').objectStore('refresh_Date');
        refreshStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
           this.refreshDate = e.target.result.value.refreshDate;
          } 
        };
      } 

        const empStore = db.transaction('emp_history').objectStore('emp_history');
        empStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { resourceList } = e.target.result.value;
            this.hrsByempData = resourceList.aggregations.filtered.by_employee.buckets;
            this.updateHrsByResourceGrid();
          } else {
            this.getHrsByResourceData(this.empOrgData, this.empXferOrgData, this.empPracticeData, this.empSubPracticeData, this.employeeData);
          }

        };

      } else {
        this.filterData();
      }
    };

    this.isPageLoaded.emit(true);
    this.dbConfigReq.onupgradeneeded = (e) => {
      this.shouldGetDatafromCachedDb = false;
      const idb = e.target['result'];
      idb.createObjectStore('resource_list', { keyPath: 'resourceId', autoIncrement: true });
      idb.createObjectStore('emp_history', { keyPath: 'empId', autoIncrement: true });
      idb.createObjectStore('refresh_Date', { keyPath: 'dateId', autoIncrement: true });
    };
  }

  filterData(addOrUpdateData?: string) {

    // ----------------------------------------- DROPDOWNS -----------------------------------------------------


    this.spinner = true;
    this.resource.getResourcesList().subscribe(response => {
      this.spinner = false;

      this.bindFilterDropDownData(response);

      // this.updateHrsByResourceGrid();
      this.getHrsByResourceData(this.empOrgData, this.empXferOrgData, this.empPracticeData, this.empSubPracticeData, this.employeeData, addOrUpdateData);


      //adding resourcelist to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('resource_list', 'readwrite');
      const store = transaction.objectStore('resource_list');
      if (addOrUpdateData === 'update') {
        // store.openCursor().onsuccess = (e) => {
        //   const cursor = e.target.result;
        //   if (cursor) {
        //     const request = cursor.update({ resourceId: 0, resourceList: response });
        //     request.onsuccess = function() {
        //       console.log('contractors list data updated.');
        //     };
        //   }
        // }
        this.updateIndexedDbVal(store, { resourceId: 0, resourceList: response });
      } else {
        store.add({ resourceId: 0, resourceList: response });
      }
      this.isPageLoaded.emit(true);
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting filter data!');
    });
  }

  bindFilterDropDownData(response) {
    this.empOrgData = response.org;
    this.empXferOrgData = response.xfer_org;
    this.empPracticeData = response.practice;
    this.employeeData = response.employee;
    this.empSubPracticeData = response.subpractice;

    this.empOrgData = this.empOrgData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.empXferOrgData = this.empXferOrgData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.empPracticeData = this.empPracticeData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.employeeData = this.employeeData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    this.empSubPracticeData = this.empSubPracticeData.sort(function sortAll(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
  }

  updateIndexedDbVal(store, dataToUpdate) {
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


  getHrsByResourceData(org, xferOrg, pract, subPract, employee, addOrUpdateData?: string) {
    this.es.getHoursByResourceData(org, xferOrg, pract, subPract, employee, this.isInternal, this.spentDate, this.isBillable, this.empStatus);
    this.spinner = true;
    this.es.getHrsByResourceData().subscribe((response) => {
      this.spinner = false;
      this.hrsByempData = response.aggregations.filtered.by_employee.buckets;
      this.bindHrsByResourceData();

      this.getRefreshDate();

      this.setFilters();

      //adding employee data to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('emp_history', 'readwrite');
      const store = transaction.objectStore('emp_history');
      if (addOrUpdateData === 'update') {
        // store.openCursor().onsuccess = (e) => {
        //   const cursor = e.target.result;
        //   if (cursor) {
        //     const request = cursor.update({ empId: 0, resourceList: response });
        //     request.onsuccess = function() {
        //       console.log('contractors list data updated.');
        //     };
        //   }
        // }
        this.isPageLoaded.emit(true);
        this.updateIndexedDbVal(store, { empId: 0, resourceList: response });
      } else {
        store.add({ empId: 0, resourceList: response });

      }


    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting hours by resource data!');
    });
  }

  getRefreshDate(addOrUpdateData?: string) {

    this.refreshDate = new Date();
    const db = this.dbConfigReq.result;
    const transaction = db.transaction('refresh_Date', 'readwrite');
    const store = transaction.objectStore('refresh_Date');
    if (addOrUpdateData === 'update') {

      this.updateIndexedDbVal(store, { dateId: 0, refreshDate: this.refreshDate });
    } else {
      store.add({ dateId: 0, refreshDate: this.refreshDate });

    }

  }

  bindHrsByResourceData() {
    this.hrsByResourceObj = [];
    // this.hrsByempData = response.aggregations.filtered.by_employee.buckets;
    this.hrsByempData.forEach((empItem: any) => {
      empItem.by_project.buckets.forEach((prjItem: any) => {
        var obj = {};
        obj['employee'] = empItem.key;
        obj['project'] = prjItem.key;
        obj['totalHours'] = prjItem.by_total_hours.value;
        prjItem.by_week.buckets.forEach((weekItem: any) => {

          // this.hrsByempObj.push({
          //   "project": empItem.key,
          //   "employee": empItem.key,
          //   "week": weekItem.key_as_string,
          //   "hours": weekItem.by_total_hours.value,
          //   "totalHours": empItem.by_total_hours.value
          // });

          const weekString = weekItem.key_as_string;
          obj[weekString] = weekItem.by_total_hours.value;

        });
        
        // obj['org'] = empItem.by_org.buckets[0].key;
        // obj['xferOrg'] = empItem.by_xferOrg.buckets[0].key;
        // obj['practice'] = empItem.by_practice.buckets[0].key;
        // obj['subPractice'] = empItem.by_sub_pract.buckets[0].key;
        // obj['taskType'] = empItem.by_taskType.buckets;
        this.hrsByResourceObj.push(obj);
      });
    });

    this.isPageLoaded.emit(true);

    this.columnDefs = this.generateColumns(this.hrsByResourceObj);
    this.gridOptions.api.setRowData(this.hrsByResourceObj);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
    this.setFilters();
  }

  exportDetailsInExcel(){
    const downloadDetails = this.hrsByResourceObj;
    const file_name = 'hours_by_resource_';
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
    // this.downloadFile.exportAsExcelFile(this.gridApi.params, file_name);
  }

  updateHrsByResourceGrid() {
    this.isPageLoaded.emit(false);
    this.hrsByResourceObj = [];

    const org: any[] = this.empOrg == '*' ? this.empOrgData : [this.empOrg];
    const xferOrg: any[] = this.empXferOrg == '*' ? this.empXferOrgData : [this.empXferOrg];
    const pract: any[] = this.empPract == '*' ? this.empPracticeData : [this.empPract];
    const subPract: any[] = this.empSubPract == '*' ? this.empSubPracticeData : [this.empSubPract];
    const employee: any[] = this.empName == '*' ? this.employeeData : [this.empName];
    const empStatus: any[] = this.empStatus == '*' ? ['Active', 'Terminated'] : [this.empStatus];
    const billable: any[] = this.isBillable == '*' ? ['BILLABLE', 'INTERNAL', 'NON BILLABLE'] : [this.isBillable];

    // this.getHrsByResourceData(org, xferOrg, pract, subPract, employee);
    const filterObj = {
      'empOrg': org,
      'xferOrg': xferOrg,
      'pract': pract,
      'subPract': subPract,
      'employee': employee,
      'spentDate': this.spentDate,
      'billable': billable,
      'empStatus': empStatus
    };
    const empStore = this.dbConfigReq.result.transaction('emp_history').objectStore('emp_history');

    empStore.openCursor().onsuccess = (e) => {
      const { resourceList } = e.target.result.value;
      const hrsByempData = resourceList.aggregations.filtered.by_employee.buckets;
      this.filterempData(hrsByempData, filterObj);
    };
  }


  filterempData(hrsByempData, { empOrg, xferOrg, pract, subPract, employee, billable, empStatus }) {
    const filteredData = hrsByempData.filter(item => employee.indexOf(item.key) > -1);
    const selectedWeeks = this.commonUtilities.lastWeeksMondayDates(this.spentDate, '-');
    filteredData.map(item => {
      item.by_org.buckets = item.by_org.buckets.filter(obj => empOrg.indexOf(obj.key) > -1);
      item.by_xferOrg.buckets = item.by_xferOrg.buckets.filter(obj => xferOrg.indexOf(obj.key) > -1);
      item.by_practice.buckets = item.by_practice.buckets.filter(obj => pract.indexOf(obj.key) > -1);
      item.by_sub_pract.buckets = item.by_sub_pract.buckets.filter(obj => subPract.indexOf(obj.key) > -1);
      item.by_taskType.buckets = item.by_taskType.buckets.filter(obj => billable.indexOf(obj.key) > -1);
      item.by_empStaus.buckets = item.by_empStaus.buckets.filter(obj => empStatus.indexOf(obj.key) > -1);
      item.by_project.buckets.map(prjItem => {
        prjItem.by_week.buckets = prjItem.by_week.buckets.filter(obj => selectedWeeks.indexOf(obj.key_as_string) > -1);
        prjItem.by_total_hours.value = this.getTotlaBillableHours(prjItem.by_week.buckets);
        return prjItem;
      });
      return item;
    });

    this.hrsByempData = filteredData.filter(item => {
      return item.by_org.buckets.length && item.by_xferOrg.buckets.length && item.by_practice.buckets.length &&
        item.by_sub_pract.buckets.length && item.by_taskType.buckets.length && item.by_empStaus.buckets.length;
    });
    this.bindHrsByResourceData();

  }

  getTotlaBillableHours(arr) {
    return arr.reduce((total, item) => (total + item.by_total_hours.value), 0);
  }


  // downloadDetailsInExel(name) {
  //   let downloadDetails = this.myProjects;
  //   let file_name = 'My_Project_Details';
  //   this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  // }

  refresh() {
    this.isPageLoaded.emit(false);
    this.empOrg = '*';
    this.empXferOrg = '*';
    this.empPract = '*';
    this.empSubPract = '*';
    this.empName = '*';
    this.isInternal = true;
    this.spentDate = '24';
    this.empStatus = '*';
    this.isBillable = '*';
    this.filterData('update');
    // this.todayDate = new Date();
    this.getRefreshDate('update');
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
        if (key.toUpperCase() == 'PROJECT' || key.toUpperCase() == 'EMPLOYEE' || key.toUpperCase() == 'TOTALHOURS') {
          mappedColumn['pinned'] = 'left';
          mappedColumn['width'] = 150;
        }

        if (key.toUpperCase() == 'ORG' || key.toUpperCase() == 'XFERORG' || key.toUpperCase() == 'PRACTICE' || key.toUpperCase() == 'SUBPRACTICE' || key.toUpperCase() == 'TASKTYPE') {
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeight = function (params) {
    const lineCount = Math.floor(params.data.project.length / 32) + 1;
    const height = (12 * lineCount) + 24;
    return height;
  };

  currencyFormatter(params) {
    if (params.value) {
      return '$' + params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  percentageFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%';
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
      'empOrg': this.empOrg,
      'xferOrg': this.empXferOrg,
      'pract': this.empPract,
      'subPract': this.empSubPract,
      'employee': this.empName,
      'spentDate': this.spentDate,
      'isBillable': this.isBillable,
      'empStatus': this.empStatus
    };
    this.gridService.setFilters(obj);
  }

}
