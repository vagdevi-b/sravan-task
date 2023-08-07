import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { CommonUtilities } from '../../shared/utilities';
declare var $: any;

@Component({
  selector: 'app-my-resources-dashboard',
  templateUrl: './my-resources-dashboard.component.html',
  styleUrls: ['./my-resources-dashboard.component.css']
})
export class MyResourcesDashboardComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  constructor(
    private resource: ResourceUtilizationService,
    private commonUtilities: CommonUtilities
  ) { }
  refreshDate: Date;
  myResourceList = [];
  myContracters = [];
  myOffShoreResources = [];

  resourcesCount: Number = 0;
  contractorsCount: Number = 0;
  offShoreCount: Number = 0;

  hoveredEmployee = {
    "empName": '',
    "department": "",
    "position": "",
    "supervisor": "",
    "startDate": ""
  };
  tooltipOpacity: Number = 0;
  clientX = 0;
  clientY = 0;
  dbConfigReq: any;
  shouldGetResourceDatafromCachedDb: boolean = true;
  showLoader: boolean = false;

  ngOnInit() {
    this.isPageLoaded.emit(false);
    this.configMyResourcesData();
  }

  configMyResourcesData() {
    const userName = localStorage.getItem('userName');
    const dbName = `${userName.split(' ').join('_')}_employees_my_resource`;
    this.dbConfigReq = window.indexedDB.open(dbName);

    this.dbConfigReq.onerror = () => {
      console.log('failed to open the db');
    }

    this.dbConfigReq.onsuccess = () => {
      if (this.shouldGetResourceDatafromCachedDb) {
        const db = this.dbConfigReq.result;
        const employeesStore = db.transaction('employees_list').objectStore('employees_list');
        employeesStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { data } = e.target.result.value;
            this.bindMyResources(data);
          } else {
            this.getMyResources();
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

        const contracorsStore = db.transaction('contractors_list').objectStore('contractors_list');
        contracorsStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { data } = e.target.result.value;
            this.bindContractors(data);
          } else {
            this.getMyContractors();
          }
        }


        const interOrgStore = db.transaction('inter_org_employees_list').objectStore('inter_org_employees_list');
        interOrgStore.openCursor().onsuccess = (e) => {
          if (e.target.result) {
            const { data } = e.target.result.value;
            this.bindInterOrgResources(data);
          } else {
            this.getInterOrgResources();
          }
        }


      } else {
        this.getEmployeeResourceData();
      }
    }
    this.isPageLoaded.emit(true);
    this.dbConfigReq.onupgradeneeded = (e) => {
      this.shouldGetResourceDatafromCachedDb = false;
      const idb = e.target['result'];
      idb.createObjectStore('employees_list', { keyPath: 'empId', autoIncrement: true });
      idb.createObjectStore('contractors_list', { keyPath: 'contractorId', autoIncrement: true });
      idb.createObjectStore('inter_org_employees_list', { keyPath: 'interOrgId', autoIncrement: true });
      idb.createObjectStore('refresh_Date', { keyPath: 'dateId', autoIncrement: true });
    }
  }

  getEmployeeResourceData(addOrUpdate?) {
    this.getMyResources(addOrUpdate);
    this.getMyContractors(addOrUpdate);
    this.getInterOrgResources(addOrUpdate);
  }

  getMyResources(addOrUpdate?) {

    this.showLoader = true;
    this.resource.getMyResources().subscribe(response => {
      this.showLoader = false;
      this.bindMyResources(response.Employees);

      //adding employee list to indexed db
      const db = this.dbConfigReq.result;
      const transaction = db.transaction('employees_list', "readwrite")
      const store = transaction.objectStore('employees_list');
      console.log('store00----', store);
      if (addOrUpdate === 'update') {
        // store.openCursor().onsuccess = (e) => {
        //   const cursor = e.target.result;
        //   if (cursor) {
        //     const request = cursor.update({ empId: 0, data: response });
        //     request.onsuccess = function() {
        //       console.log('employee list data updated.');
        //     };
        //   }
        // }
        this.updateIndexedDbValue(store, { empId: 0, data: response.Employees });
      } else {
        store.add({ empId: 0, data: response.Employees });
      }


    }, (error) => {
      this.showLoader = false;
    });

  }

  bindMyResources(response) {
    this.myResourceList = [];
    let resourcePracticeList = new Set(response.map((resource: any) => resource.practice));
    this.resourcesCount = response.length;
    resourcePracticeList.forEach((prac: string) => {
      let x = { practice: "", resources: "" };
      x.practice = prac;
      x.resources = response.filter(resource => {
        return resource.practice == prac;
      });
      this.myResourceList.push(x);
    });
    console.log(this.myResourceList);
  }

  updateIndexedDbValue(store, dataToUpdate) {
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const request = cursor.update(dataToUpdate);
        request.onsuccess = function () {
          console.log('data updated successfully.');
        };
      }
    }
  }

  getMyContractors(addOrUpdate?: any) {
      this.showLoader = true;
    this.resource.getMyContractors().subscribe(response => {
      this.showLoader = false;
      this.bindContractors(response.Contractors);

      //adding employee list to indexed db
      const db = this.dbConfigReq.result;
      let transaction = db.transaction('contractors_list', "readwrite")
      const store = transaction.objectStore('contractors_list');
      if (addOrUpdate === 'update') {
        // store.openCursor().onsuccess = (e) => {
        //   const cursor = e.target.result;
        //   if (cursor) {
        //     const request = cursor.update({ contractorId: 0, data: response });
        //     request.onsuccess = function () {
        //       console.log('contractors list data updated.');
        //     };
        //   }
        // }
        this.updateIndexedDbValue(store, { contractorId: 0, data: response.Contractors });
      } else {
        store.add({ contractorId: 0, data: response.Contractors });
      }


    }, (error) => {
      this.showLoader = false;
    });
  }

  getRefreshDate(addOrUpdateData?: string) {

    this.refreshDate = new Date();
    const db = this.dbConfigReq.result;
    let transaction = db.transaction('refresh_Date', "readwrite")
    const store = transaction.objectStore('refresh_Date');
    if (addOrUpdateData === 'update') {

      this.updateIndexedDbValue(store, { dateId: 0, refreshDate: this.refreshDate });
    } else {
      store.add({ dateId: 0, refreshDate: this.refreshDate });

    }

  }

  bindContractors(response) {
    this.myContracters = [];
    let resourcePracticeList = new Set(response.map((resource: any) => resource.practice));
    this.contractorsCount = response.length;
    resourcePracticeList.forEach((prac: string) => {
      let x = { practice: "", resources: "" };
      x.practice = prac;
      x.resources = response.filter(resource => {
        return resource.practice == prac;
      });
      this.myContracters.push(x);
    });
    console.log(this.myContracters);
  }

  getInterOrgResources(addOrUpdate?: any) {
      this.showLoader = true;
    this.resource.getMyInterOrgResources().subscribe(response => {
      this.showLoader = false;
      this.bindInterOrgResources(response.Interns);

      this.getRefreshDate();
      //adding employee list to indexed db
      const db = this.dbConfigReq.result;
      let transaction = db.transaction('inter_org_employees_list', "readwrite")
      const store = transaction.objectStore('inter_org_employees_list');
      if (addOrUpdate === 'update') {
        // store.openCursor().onsuccess = (e) => {
        //   const cursor = e.target.result;
        //   if (cursor) {
        //     const request = cursor.update({ interOrgId: 0, data: response });
        //     request.onsuccess = function () {
        //       console.log('inter org resource list data updated.');
        //     };
        //   }
        // }

        this.updateIndexedDbValue(store, { interOrgId: 0, data: response.Interns });
      } else {
        store.add({ interOrgId: 0, data: response.Interns });
      }


    }, (error) => {
      this.showLoader = false;
    });
  }

  bindInterOrgResources(response) {
    this.myOffShoreResources = [];
    let resourcePracticeList = new Set(response.map((resource: any) => resource.practice));
    this.offShoreCount = response.length;
    resourcePracticeList.forEach((prac: string) => {
      let x = { practice: "", resources: "" };
      x.practice = prac;
      x.resources = response.filter(resource => {
        return resource.practice == prac;
      });
      this.myOffShoreResources.push(x);
    });
    console.log(this.myOffShoreResources);
  }

  onRefresh() {
    console.log('this.dbConfigReq----', this.dbConfigReq);
    this.getEmployeeResourceData('update');
    this.getRefreshDate('update');
  }

  onMouseEnter(emp) {
    this.hoveredEmployee = emp;
    this.tooltipOpacity = 1;
  }

  onMouseMove(event) {
    this.clientX = event.clientX - 400;
    this.clientY = event.clientY - 50;
  }

  onMouseMoveOffshore(event) {
    this.clientX = event.clientX - 900;
    this.clientY = event.clientY - 50;
  }

  onMouseLeave() {
    this.hoveredEmployee = {
      "empName": '',
      "department": "",
      "position": "",
      "supervisor": "",
      "startDate": ""
    };
    this.tooltipOpacity = 0;
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
