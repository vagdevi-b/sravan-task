import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResignationService } from '../../shared/services/employee-resignation.service';
import { PandlService } from '../../shared/services/pandl.service';
import { ResignationFilterComponent } from '../resignation-child-components/resignation-filter/resignation-filter.component';
declare var $: any;

@Component({
  selector: 'app-emp-resignation-list',
  templateUrl: './emp-resignation-list.component.html',
  styleUrls: ['./emp-resignation-list.component.css']
  // styleUrls: ['../../../../src/assets/css/emp-resignation.css'],
})
export class EmpResignationListComponent implements OnInit {
  showfilters: boolean = false;
  callPandL: boolean = true;
  @ViewChild('DatePickContainer2') datePickContainer2;
  @ViewChild('DatePickContainer4') datePickContainer4;

  spinner: boolean = false;
  name = "";

  empdetails = [];
  rowData: any = [];
  arr1: any = [];
  filedatapopulate: any;
  rowData1: any;
  filtername = "Open";
  Filter: any = [{ name: "Open", value: "Open" },
  { name: "Pending With HR", value: "hrDiscussionStatus" },
  { name: "Pending with PD", value: "pdDiscussionStatus" },
  { name: "Retained", value: "Retained" },
  { name: "Accepted", value: "Accepted" },
  { name: "Cancelled", value: "Cancelled" },
  { name: "Exit", value: "Exit" },
  { name: "View All", value: "viewAll" }];
  Status: any = [{ name: "Initiated", value: "Initiated" },
  { name: "Inprogress", value: "Inprogress" },
  { name: "Accepted", value: "Accepted" },
  { name: "Retained", value: "Retained" },
  { name: "Exit", value: "Exit" }];
  userIdinfo: string;
  orgs: any = [];
  businessUnits: any = [];
  currentlySelectedOrg: any;
  currentlySelectedBu: any;
  currentlySelectedPractice: any;
  practiceData: any;
  subPractice: any;
  selectedData: any = [];
  openStatus: any = [];
  rowData2: any;
  sla_values: any = [];
  paginationdata1: any;
  listResponse: any;
  pageSize: number = 10;
  pageNumber: number = 1;
  pager: any = [];
  payloadFilter: any;
  resetSelection: string = "Open";



  constructor(private modalService: NgbModal, public fb: FormBuilder, public route: Router, private employeeResignationService: EmployeeResignationService, private pandlsvc: PandlService) {
  }

  ngOnInit() {
    this.userIdinfo = localStorage.getItem('userId');
    this.payloadFilter = { status: ['Initiated', 'Inprogress'] }
    this.getallresignationlist(this.payloadFilter);

    this.getallresignationreason();
    this.resetSelection = "Open";
  }


  getallresignationlist(payloadFilter: any) {
    $('#loadingEditSubmitModal').modal('show');
    this.employeeResignationService.getallresignationdata(payloadFilter, this.pageNumber - 1, this.pageSize).subscribe(response => {
      this.listResponse = response.data;
      this.setPageinationDetails(this.pageNumber);
      this.rowData = response.data.content.filter((item: any) =>
        item.employeeId != Number(this.userIdinfo)
      );
      this.openStatus = [];
      // this.rowData1 = JSON.parse(JSON.stringify(response.data.content.filter((item: any) =>
      //   item.employeeId != Number(this.userIdinfo)
      // )));
      // this.rowData2 = JSON.parse(JSON.stringify(response.data.content.filter((item: any) =>
      //   item.employeeId != Number(this.userIdinfo)
      // )));
      $('#loadingEditSubmitModal').modal('hide');
    });
  }

  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.sla_values = response.osiLookupValueses;


      // response.osiLookupValueses.sort((a, b) => a.lookupDesc - b.lookupDesc);
      localStorage.setItem('reasons_response', JSON.stringify(response.osiLookupValueses.sort((a, b) => a.lookupSeqNum - b.lookupSeqNum)));
    });

  }

  navigateToInitiate(isEdit: boolean) {
    this.route.navigate(['resignation/rm']);
    const resignationRoutes = {
      IntiatedScreen: `resignation/rm`,
    }
    this.route.navigate([resignationRoutes.IntiatedScreen], {
      state: {
        Edit: isEdit
      }
    });
  }



  navigateToRM(row: any, isEdit: boolean = true) {
    const resignationRoutes = {
      IntiatedScreen: `resignation/rm`,
    }
    this.route.navigate([resignationRoutes.IntiatedScreen], {
      state: {
        data: row,
        Edit: isEdit
      }
    });
  }

  navigateToPDAccept(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {
      IntiatedScreen: `resignation/accept`,
    }
    this.route.navigate([resignationRoutes.IntiatedScreen], {
      state: {
        data: row,
        Edit: isAccepted
      }
    });
  }

  navigateToPDInprogress(row: any, isAccepted: boolean = true) {
    const resignationRoutes = {
      IntiatedScreen: `resignation/pd`,
    }
    this.route.navigate([resignationRoutes.IntiatedScreen], {
      state: {
        data: row,
        Edit: isAccepted
      }
    });
  }

  navigateToHR(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {
      RetainedScreen: `resignation/hr`,
    }
    this.route.navigate([resignationRoutes.RetainedScreen], {
      state: {
        data: row,
        Edit: isAccepted
      }
    });
  }
  navigateToPD(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {

      InprogressScreen: `resignation/pd`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }
  navigateToViewRMRetained(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {

      InprogressScreen: `resignation/rm`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }

  navigateToViewRMInprogress(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {

      InprogressScreen: `resignation/rm`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }
  navigateToRMAccept(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {
      IntiatedScreen: `resignation/rm`,
    }
    this.route.navigate([resignationRoutes.IntiatedScreen], {
      state: {
        data: row,
        Edit: isAccepted
      }
    });
  }

  navigateToViewRMInitiated(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {
      InprogressScreen: `resignation/rm`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }

  navigateToViewHRRetained(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {

      InprogressScreen: `resignation/retain`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }

  navigateToViewPDRetained(row: any, isAccepted: boolean = false) {
    const resignationRoutes = {

      InprogressScreen: `resignation/retain`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }
  navigateToViewHRInprogress(row: any, isAccepted: boolean = true) {
    const resignationRoutes = {

      InprogressScreen: `resignation/hr`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }

  navigateToViewHRInitiated(row: any, isAccepted: boolean = true) {
    const resignationRoutes = {

      InprogressScreen: `resignation/hr`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row,
        Edit: isAccepted

      }
    });
  }

  navigateToRetain(row: any) {
    const resignationRoutes = {

      InprogressScreen: `resignation/retain`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row
      }
    });
  }
  navigateToAccept(row: any) {
    const resignationRoutes = {

      InprogressScreen: `resignation/accept`,
    }
    this.route.navigate([resignationRoutes.InprogressScreen], {
      state: {
        data: row
      }
    });
  }


  // navigateToExit(row: any) {
  //   const resignationRoutes = {

  //     InprogressScreen: `resignation/exit`,
  //   }
  //   this.route.navigate([resignationRoutes.InprogressScreen], {
  //     state: {
  //       data: row
  //     }
  //   });
  // }


  myClick(obj) {

    let isEdit = true;
    let isAccepted = true;
    let isNotAccepted = false;
    let isRM = false;
    let isView = false;
    let isAccept = false;
    let isHR = false;

    if (obj.status != "Retained" && obj.status != "Relieving" && obj.status != "Exit" && obj.status != "Close" && obj.status != "Accepted" && obj.status != "Inprogress" && obj.status != "Cancelled") {
      if (obj.loggedInEmployeeRole == "RM") {
        this.navigateToRM(obj, isEdit);
      }
      else if (obj.loggedInEmployeeRole == "HR") {
        this.navigateToHR(obj, isHR);
      }
      else if (obj.loggedInEmployeeRole == "PD") {
        this.navigateToPD(obj, isAccepted);
      }
    } else {
      if (obj.loggedInEmployeeRole == "PD" && obj.status == "Retained") {
        this.navigateToViewPDRetained(obj, isView);
      } else if (obj.loggedInEmployeeRole == "PD" && obj.status == "Accepted") {
        this.navigateToPDAccept(obj, isAccept);
      } else if (obj.loggedInEmployeeRole == "PD" && obj.status == "Inprogress") {
        this.navigateToPDInprogress(obj, isAccepted);
      } else if (obj.loggedInEmployeeRole == "PD" && obj.status == "Cancelled") {
        this.navigateToPDInprogress(obj, isAccepted);
      } else if (obj.loggedInEmployeeRole == "RM" && obj.status == "Accepted") {
        this.navigateToRMAccept(obj, isEdit);
      } else if (obj.loggedInEmployeeRole == "RM" && obj.status == "Retained") {
        this.navigateToViewRMRetained(obj, isAccepted);
      } else if (obj.loggedInEmployeeRole == "RM" && obj.status == "Inprogress") {
        this.navigateToViewRMInprogress(obj, isEdit);
      } else if (obj.loggedInEmployeeRole == "RM" && obj.status == "Initiated") {
        this.navigateToViewRMInitiated(obj, isHR);
      } else if (obj.loggedInEmployeeRole == "RM" && obj.status == "Cancelled") {
        this.navigateToViewRMInitiated(obj, isEdit);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Inprogress") {
        this.navigateToViewHRInprogress(obj, isEdit);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Initiated") {
        this.navigateToViewHRInprogress(obj, isHR);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Cancelled") {
        this.navigateToViewHRInprogress(obj, isHR);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Accepted" && obj.hrDiscussionStatus === true) {
        this.navigateToAccept(obj);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Accepted" && obj.hrDiscussionStatus === false) {
        this.navigateToHR(obj);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Retained" && obj.hrDiscussionStatus === true) {
        this.navigateToViewHRRetained(obj, isView);
      } else if (obj.loggedInEmployeeRole == "HR" && obj.status == "Retained" && obj.hrDiscussionStatus === false) {
        this.navigateToHR(obj, isView);
      } else if (obj.status == "Exit" && obj.loggedInEmployeeRole == "RM") {
        this.navigateToViewRMRetained(obj, isAccepted);
      } else if (obj.status == "Exit" && obj.loggedInEmployeeRole == "HR") {
        this.navigateToViewHRInprogress(obj, isHR);
      } else if (obj.status == "Exit" && obj.loggedInEmployeeRole == "PD") {
        this.navigateToPDInprogress(obj, isAccepted);
      }
    }
  }


  filterHrSla(e) {
    this.filtername = e || "";
    if (e) {
      this.paginationdata1 = e;
      this.rowData = this.rowData2.filter((item) => {
        return item.hrDiscussionStatus === false;
      });
    }
  }
  filterPdSla(e) {
    this.filtername = e || "";
    if (e) {
      this.paginationdata1 = e;
      this.rowData = this.rowData2.filter((item) => {
        return item.pdDiscussionStatus === false;
      });
    }
  }
  getOpenStatus(e: any) {
    this.paginationdata1 = e
    let filterObject = {}
    if (e == "Open") {
      this.filtername = e;
      filterObject = { status: ['Initiated', 'Inprogress'] };
    } else if (e == "viewAll") {
      this.filtername = e;
    } else if (e == "Accepted") {
      this.filtername = e;
      filterObject = { status: [e] };
    } else if (e == "Retained") {
      this.filtername = e;
      filterObject = { status: [e] };
    } else if (e == "Cancelled") {
      this.filtername = e;
      filterObject = { status: [e] };
    } else if (e == "Exit") {
      this.filtername = e;
      filterObject = { status: [e] };
    } else if (e == "hrDiscussionStatus") {
      this.filtername = e;
      filterObject = { hrDiscussionStatus: false };
    } else if (e == "pdDiscussionStatus") {
      this.filtername = e;
      filterObject = { pdDiscussionStatus: false };
    }
    this.payloadFilter = { ...filterObject }
    this.pageNumber = 1;
    this.getallresignationlist(this.payloadFilter);
  }
  // closeFix(event, datePicker) {

  // }
  // filterList() {

  // }



  closeFix(event, datePicker) {

    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin

      datePicker.close();

    }

  }

  closeFix1(event, datePicker) {
    if (!this.datePickContainer4.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  openFilter() {
    const modalReference = this.modalService.open(ResignationFilterComponent);
    modalReference.result.then((res: any) => {
      if (res.status === "success") {
        this.rowData = res.filterdata;
      }
      if (res.reset === "NO") {
        this.resetSelection = "Open";
        this.getOpenStatus("Open");
      }
    });
  }


  setPage(page): void {
    this.pageNumber = page;
    this.getallresignationlist(this.payloadFilter);
  }

  setPageinationDetails(page: number = 1): void {
    this.pager = this.employeeResignationService.getPager(
      this.listResponse.totalElements, this.listResponse.totalPages,
      this.pageSize, page);
  }

  getClassName(e: any) {
    if (e.loggedInEmployeeRole === "RM" || e.loggedInEmployeeRole === "PD") {
      if (e.pdSla < 0) {
        return "red"
      } else if (e.pdSla <= 3 || e.pdSla == 0) {
        return "amber"
      } else if (e.pdSla > 3) {
        return "green"
      }
    } else if (e.loggedInEmployeeRole === "HR") {
      if (e.hrSla < 0) {
        return "red"
      } else if (e.hrSla == 1 || e.hrSla == 0) {
        return "amber"
      } else if (e.hrSla == 3 || e.hrSla == 2) {
        return "green"
      }
    }

  }
}

