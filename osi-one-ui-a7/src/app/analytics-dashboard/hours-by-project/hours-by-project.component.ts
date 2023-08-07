import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridOptions } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { GridService } from '../../dashboard-grid/grid.service';
import { CommonUtilities } from '../../shared/utilities/common-utilities';
declare var $: any;

@Component({
  selector: 'app-hours-by-project',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './hours-by-project.component.html',
  styleUrls: ['./hours-by-project.component.css']
})
export class HoursByProjectComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();

  refreshDate: Date;
  spentDate: string = '12';
  empStatus: string = '*';
  isBillable: string = '*';

  hoursByProject: any = [];

  gridApi: any;
  gridColumnApi: any;
  gridOptions: any = <GridOptions>{};
  gridHeight: any = 0;
  paginationPageSize: number = 10;
  columnDefs: any = [];

  dropdownSettings: any = {};


  org: DropdownFilterDataModel[];
  client: DropdownFilterDataModel[];
  project: DropdownFilterDataModel[];
  region: DropdownFilterDataModel[];
  practice: DropdownFilterDataModel[];
  subPractices: DropdownFilterDataModel[];

  orgData: DropdownFilterDataModel[];
  clientData: DropdownFilterDataModel[];
  projectData: DropdownFilterDataModel[];
  regionData: DropdownFilterDataModel[];
  practiceData: DropdownFilterDataModel[];
  subPracticeData: DropdownFilterDataModel[];

  prjOrgData: any = [];
  prjPracticeData: any = [];
  prjSubPracticeData: any = [];
  prjXferOrgData: any = [];
  hrsByPrjData: any = [];
  hrsByPrjObj: any[] = [];
  weeks: any;
  spinner: boolean = false;
  employeeData: any = [];
  dbConfigReq: any;
  lastChanedDd = '';
  // shouldGetDatafromCachedDb: boolean = true;

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private downloadFile: ExportFileService,
    private gridService: GridService,
    private toasterService: ToastrService,
    private commonUtilities: CommonUtilities
  ) {
    // this.setPreservedFilter();
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
    // this.configHoursByProjectIndexedDb();
    // this.getOrganizationData();
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res ? JSON.parse(res.filters) : null;
      if (filter) {
        this.org = Object.keys(filter).length > 0 ? filter.org : this.org;
        this.orgData = Object.keys(filter).length > 0 ? filter.orgData : this.orgData;
        this.region = Object.keys(filter).length > 0 ? filter.region : this.region;
        this.regionData = Object.keys(filter).length > 0 ? filter.regionData : this.regionData;
        this.practice = Object.keys(filter).length > 0 ? filter.practice : this.practice;
        this.practiceData = Object.keys(filter).length > 0 ? filter.practiceData : this.practiceData;
        this.subPractices = Object.keys(filter).length > 0 ? filter.subPractice : this.subPractices;
        this.subPracticeData = Object.keys(filter).length > 0 ? filter.subPracticeData : this.subPracticeData;
        this.client = Object.keys(filter).length > 0 ? filter.client : this.client;
        this.clientData = Object.keys(filter).length > 0 ? filter.clientData : this.clientData;
        this.project = Object.keys(filter).length > 0 ? filter.project : this.project;
        this.projectData = Object.keys(filter).length > 0 ? filter.projectData : this.projectData;
        this.spentDate = filter && Object.keys(filter).length > 0 ? filter.spentDate : this.spentDate;
        this.isBillable = filter && Object.keys(filter).length > 0 ? filter.isBillable : this.isBillable;
        this.empStatus = filter && Object.keys(filter).length > 0 ? filter.status : this.empStatus;

        this.getHrsByProjectData(this.pushToArrayByName(this.org), this.pushToArrayByName(this.region), this.pushToArrayByName(this.practice),
          this.pushToArrayByName(this.subPractices), this.pushToArrayByName(this.client), this.pushToArrayByName(this.project));
      } else {
        this.getOrganizationData();
      }
    }, (errorResponse) => {
      this.spinner = false;
      this.getOrganizationData();
      // this.toasterService.error('Error Occured While Getting preserved filters data!');
    });
  }

  getOrganizationData() {
    this.spinner = true;
    this.resource.getProjectOrganizations().subscribe((response) => {
      this.spinner = false;

      this.org = this.orgData = response.Orgs;
      this.getRegionData(response.Orgs);
    }, () => {
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
    }, () => {
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
    }, () => {
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

      this.subPractices = this.subPracticeData = response.SubPractices;
      this.getClientData(org, region, practice, response.SubPractices);

    }, () => {
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
    }, () => {
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
      this.getHrsByProjectData(this.pushToArrayByName(org), this.pushToArrayByName(region), this.pushToArrayByName(this.practice), 
        this.pushToArrayByName(subPractice), this.pushToArrayByName(client), this.pushToArrayByName(this.project));
    }, () => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting projects data!');
    });
  }

  getHrsByProjectData(org: any, region: any, practice: any, subPractice: any, client: any, project: any) {
    this.es.getHoursByProjectData(org, region, practice, subPractice, client, project, this.spentDate, this.isBillable, this.empStatus);
    this.spinner = true;
    this.es.getHrsByProjectData().subscribe((response) => {
      this.spinner = false;
      this.hrsByPrjData = response.aggregations.filtered.by_project.buckets;
      this.bindHoursByProjectData();

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting hours by project data!');
    });
  }

  pushToArrayByName(data: any[]) {
    return data && data.length > 0 ? data.map((item: any) => item.itemName) : [];
  }

  bindHoursByProjectData() {
    this.hrsByPrjObj = [];
    this.hrsByPrjData.forEach((prjItem: any) => {
      prjItem.by_employee.buckets.forEach((empItem: any) => {
        var obj = {};
        obj['project'] = prjItem.key;
        obj['employee'] = empItem.key;
        obj['totalHours'] = empItem.by_total_hours.value;
        empItem.by_week.buckets.forEach((weekItem: any) => {

          const weekString = weekItem.key_as_string;
          // obj['week'] = weekItem.key_as_string;
          obj[weekString] = weekItem.by_total_hours.value;

        });
        this.hrsByPrjObj.push(obj);
      });
    });

    this.columnDefs = this.generateColumns(this.hrsByPrjObj);
    this.gridOptions.api.setRowData(this.hrsByPrjObj);
    this.gridOptions.api.sizeColumnsToFit();
    this.spinner = false;
    this.isPageLoaded.emit(true);
    this.setFilters();
  }

  exportDetailsInExcel(){
    const downloadDetails = this.hrsByPrjObj;
    const file_name = 'hours_by_project_';
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
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
    switch (this.lastChanedDd) {
      case 'org':
        this.getRegionData(this.org);
        break;
      case 'region':
        this.getPracticeData(this.org, this.region);
        break;
      case 'practice':
        this.getSubPracticeData(this.org, this.region, this.practice);
        break;
      case 'subpractice':
        this.getClientData(this.org, this.region, this.practice, this.subPractices);
        break;
      case 'client':
        this.getProjectData(this.org, this.region, this.practice, this.subPractices, this.client);
        break;
      case 'project':
      this.getHrsByProjectData(this.pushToArrayByName(this.org), this.pushToArrayByName(this.region), this.pushToArrayByName(this.practice), 
      this.pushToArrayByName(this.subPractices), this.pushToArrayByName(this.client), this.pushToArrayByName(this.project));
        break;
    }
  }

  updateHrsByPrjGrid() {
    this.hrsByPrjObj = [];

    this.getHrsByProjectData(this.pushToArrayByName(this.org), this.pushToArrayByName(this.region), this.pushToArrayByName(this.practice), 
    this.pushToArrayByName(this.subPractices), this.pushToArrayByName(this.client), this.pushToArrayByName(this.project));

  }

  refresh() {
    this.getOrganizationData();
  }

  generateColumns(data: any[]) {
    this.spinner = true;
    let columnDefinitions = [];

    data.map(object => {
      Object.keys(object).map(key => {
        const mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          width: 90
        }
        if (key.toUpperCase() == 'PROJECT' || key.toUpperCase() == 'EMPLOYEE' || key.toUpperCase() == 'TOTALHOURS') {
          mappedColumn['pinned'] = 'left'
          mappedColumn['width'] = 150
        }
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getRowHeight = function (params) {
    const lineCount = Math.floor(params.data.project.length / 32) + 1;
    const height = (12 * lineCount) + 24;
    return height;
  };

  setFilters(): any {
    const obj = {
      'org': this.org,
      'orgData': this.orgData,
      'region': this.region,
      'regionData': this.regionData,
      'practice': this.practice,
      'practiceData': this.practiceData,
      'subPractice': this.subPractices,
      'subPracticeData': this.subPracticeData,
      'client': this.client,
      'clientData': this.clientData,
      'project': this.project,
      'projectData': this.projectData,
      'spentDate': this.spentDate,
      'isBillable': this.isBillable,
      'status': this.empStatus
    }
    this.gridService.setFilters(obj);
  }

}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}