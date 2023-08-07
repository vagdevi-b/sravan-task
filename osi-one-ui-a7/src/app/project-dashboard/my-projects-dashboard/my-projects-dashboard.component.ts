import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { GridOptions } from "ag-grid";
import { ExportFileService } from '../../shared/services/export-file.service';
import { CommonUtilities } from '../../shared/utilities';

declare var $: any;

@Component({
  selector: 'app-my-projects-dashboard',
  templateUrl: './my-projects-dashboard.component.html',
  styleUrls: ['./my-projects-dashboard.component.css']
})
export class MyProjectsDashboardComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();

  refreshDate: Date;
  myProjects = [];
  p: Number = 1;
  count: Number = 10;
  page: Number = 1;
  cnt: Number = 10;
  searchString: String = '';

  gridApi;
  gridColumnApi;
  gridOptions = <GridOptions>{};

  gridHeight = 0;

  paginationPageSize = 5;
  columnDefs = [];

  dbConfigReq: any;
  shouldGetDatafromCachedDb: any = true;
  myProjectsList: any[] = [];
  projectCount: Number = 0;
  showLoader: boolean = false;

  constructor(
    private resource: ResourceUtilizationService,
    private downloadFile: ExportFileService,
    private commonUtilities: CommonUtilities
  ) {
  }

  ngOnInit() {
    // this.getMyProjects();
    this.configMyProjectsIndexedDb();
    this.columnDefs = this.createColumnDefs();
  }

  configMyProjectsIndexedDb() {
    const userName = localStorage.getItem('userName');
    const dbName = `${userName.split(' ').join('_')}_my_projects`;
    this.dbConfigReq = window.indexedDB.open(dbName);

    this.dbConfigReq.onerror = () => {
      console.log('failed to open the db');
    }

    this.dbConfigReq.onsuccess = () => {
      if (this.shouldGetDatafromCachedDb) {
        const db = this.dbConfigReq.result;

        if (this.commonUtilities.isStoreAvailableInDB(db, 'refresh_Date')) {
          const refreshStore = db.transaction('refresh_Date').objectStore('refresh_Date');
          refreshStore.openCursor().onsuccess = (e) => {
            if (e.target.result) {
              this.refreshDate = e.target.result.value.refreshDate;
            }
          }
        }

        const resourceStore = db.transaction('my_project_list').objectStore('my_project_list');
        resourceStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { resourceList } = e.target.result.value;
            this.bindMyProjectData(resourceList);
            // this.gridOptions.api.sizeColumnsToFit();
          } else {
            this.getMyProjects();
          }

        }
      } else {
        this.getMyProjects();
      }
    }

    this.dbConfigReq.onupgradeneeded = (e) => {
      this.shouldGetDatafromCachedDb = false;
      const idb = e.target['result'];
      idb.createObjectStore('my_project_list', { keyPath: 'prjctId', autoIncrement: true });
      idb.createObjectStore('refresh_Date', { keyPath: 'dateId', autoIncrement: true });
    }
  }

  getMyProjects(addOrUpdateData?: string) {
    this.showLoader = true;

    this.resource.getMyProjects().subscribe(response => {
      this.showLoader = false;
      console.log("MY_PROJECT_DETAILS", response.Projects);
      this.bindMyProjectData(response.Projects);
      // this.gridOptions.api.sizeColumnsToFit();
      this.getRefreshDate();
      this.isPageLoaded.emit(true);
      //adding resourcelist to indexed db
      const db = this.dbConfigReq.result;
      let transaction = db.transaction('my_project_list', "readwrite")
      const store = transaction.objectStore('my_project_list');
      if (addOrUpdateData === 'update') {
        store.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const request = cursor.update({ prjctId: 0, resourceList: response.Projects });
            request.onsuccess = function () {
              console.log('contractors list data updated.');
            };
          }
        }
      } else {
        store.add({ prjctId: 0, resourceList: response.Projects });
      }
    }, (errorResponse) => {
      this.showLoader = false;
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
    }
  }

  getRefreshDate(addOrUpdateData?: string) {

    this.refreshDate = new Date();
    const db = this.dbConfigReq.result;
    let transaction = db.transaction('refresh_Date', "readwrite")
    const store = transaction.objectStore('refresh_Date');
    if (addOrUpdateData === 'update') {

      this.updateIndexedDbVal(store, { dateId: 0, refreshDate: this.refreshDate });
    } else {
      store.add({ dateId: 0, refreshDate: this.refreshDate });

    }
    this.isPageLoaded.emit(true);
  }

  bindMyProjectData(response) {
    this.myProjects = [];
    this.myProjectsList = [];
    response = response.filter((item: any) => item.status.toUpperCase() === 'ACTIVE');
    this.projectCount = response.length;
    const practices = Array.from(new Set(response.map((item: any) => {
      const practiceFrpmDept = item.projectDepartment.split('.');
      return practiceFrpmDept[2]
    })));
    // console.log("PRACTICES", practices);

    practices.forEach((prac: string) => {
      const x = { practice: "", projects: "" };
      x.practice = prac;
      x.projects = response.filter((resource: any) => {
        const practiceFrpmDept = resource.projectDepartment.split('.');
        return practiceFrpmDept[2] == prac;
      });
      this.myProjectsList.push(x);
    });
    this.myProjectsList.sort((a: any, b: any) => { return a.practice > b.practice ? 1 : a.practice < b.practice ? -1 : 0; });
    // console.log("MY_PROJECTS_LIST", this.myProjectsList);


    // response.forEach(x => {
    //   x.margin = (x.estimatedAmount - x.budgetCost).toFixed();
    //   x.margin_percentage = x.estimatedAmount != 0 ? (((x.estimatedAmount - x.budgetCost) / x.estimatedAmount) * 100).toFixed() : "0";
    //   this.myProjects.push(x);
    // });
    // this.gridOptions.api.setRowData(this.myProjects);
    // this.gridOptions.api.sizeColumnsToFit();
    this.isPageLoaded.emit(true);
  }

  refresh() {
    this.getMyProjects('update');
    this.getRefreshDate('update');
  }

  downloadDetailsInExel() {
    let downloadDetails = this.myProjects;
    let file_name = 'My_Project_Details';
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  private createColumnDefs() {
    const columnDefs = [
      {
        headerName: "Project",
        field: "projectName",
        // width: 250,
        // suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: "Project Manager",
        field: "projectManager",
        // width: 250,
        // suppressSizeToFit: true,
        filter: "agTextColumnFilter"
      },
      {
        headerName: "Project Department",
        field: "projectDepartment",
        // width: 250,
        // suppressSizeToFit: true,
        filter: "agTextColumnFilter"
      },
      // {
      //   headerName: "Status",
      //   field: "status",
      //   width: 100,
      //   filter: "agTextColumnFilter"
      // }, {
      //   headerName: "Start Date",
      //   field: "startDate",
      //   width: 100,
      //   filter: "agDateColumnFilter"
      // },
      // {
      //   headerName: "Completion Date",
      //   field: "completionDate",
      //   headerTooltip: "Completion Date",
      //   width: 100,
      //   filter: "agDateColumnFilter"
      // },
      // {
      //   headerName: "Est Hours",
      //   field: "estimatedHours",
      //   width: 100,
      //   valueFormatter: this.numberFormatter,
      //   filter: "agNumberColumnFilter",
      //   comparator: this.numberComparator,
      //   cellStyle: { 'text-align': 'right' }
      // },
      // {
      //   headerName: "Est Cost",
      //   field: "budgetCost",
      //   valueFormatter: this.currencyFormatter,
      //   width: 100,
      //   filter: "agNumberColumnFilter",
      //   comparator: this.numberComparator,
      //   cellStyle: { 'text-align': 'right' }
      // },
      // {
      //   headerName: "Est Revenue",
      //   field: "estimatedAmount",
      //   valueFormatter: this.currencyFormatter,
      //   width: 100,
      //   filter: "agNumberColumnFilter",
      //   comparator: this.numberComparator,
      //   cellStyle: { 'text-align': 'right' }
      // },
      // {
      //   headerName: "Est GM",
      //   field: "margin",
      //   valueFormatter: this.currencyFormatter,
      //   width: 100,
      //   resizable: true,
      //   filter: "agNumberColumnFilter",
      //   comparator: this.numberComparator,
      //   cellStyle: { 'text-align': 'right' }
      // },
      // {
      //   headerName: "Est GM %",
      //   field: "margin_percentage",
      //   width: 100,
      //   resizable: true,
      //   valueFormatter: this.percentageFormatter,
      //   filter: "agNumberColumnFilter",
      //   comparator: this.numberComparator,
      //   cellStyle: { 'text-align': 'right' }
      // }
    ];
    return columnDefs;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeight = function (params) {
    let lineCount = Math.floor(params.data.projectName.length / 32) + 1;
    let height = (12 * lineCount) + 24;
    return height;
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

  toggleList(type, practice, event) {
    console.log(event.target.classList.contains('glyphicon-plus'));
    if (event.target.classList.contains('glyphicon-plus')) {
      event.target.classList.remove('glyphicon-plus');
      event.target.classList.add('glyphicon-minus');
      $("#" + type + "_" + practice).removeClass('collapse');
    } else {
      event.target.classList.add('glyphicon-plus');
      event.target.classList.remove('glyphicon-minus');
      $("#" + type + "_" + practice).addClass('collapse');
    }
    this.isPageLoaded.emit(true);
  }

}
