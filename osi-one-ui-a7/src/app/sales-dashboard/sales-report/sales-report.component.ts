import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { ExportFileService } from '../../shared/services/export-file.service';
import { ToastrService } from 'ngx-toastr';
import { GridService } from '../../dashboard-grid/grid.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-sales-report',
  host: {
    '(document:click)': 'onClose($event)'
  },
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  refreshDate: Date;
  public projectName: string;
  dropdownSettings = {};

  org: any = [];
  client: any = [];
  project: any = [];
  region: any = [];
  practice: any = [];
  subPractices: any = [];

  orgData: DropdownFilterDataModel[];
  clientData: DropdownFilterDataModel[];
  projectData: DropdownFilterDataModel[];
  regionData: DropdownFilterDataModel[];
  practiceData: DropdownFilterDataModel[];
  subPracticeData: DropdownFilterDataModel[];

  public projectInvoices = {
    data: []
  };
  projectInvoicesThirdTbl = {
    data: []
  };

  gridApiProjects: any;
  gridColumnApiProjects: any;
  gridOptionsProjects = <GridOptions>{};
  columnDefsProjects = [];

  gridApiInvoices: any;
  gridColumnApiInvoices: any;
  gridOptionsInvoices = <GridOptions>{};
  columnDefsInvoices = [];
  defaultColDef = { resizable: true };

  paginationPageSize = 5;
  spinner: boolean = false;
  projectIds: any = [];

  invDetailData: any = [];
  lastChanedDd = '';

  constructor(
    private resource: ResourceUtilizationService,
    private downloadFile: ExportFileService,
    private toasterService: ToastrService,
    private gridService: GridService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      idField: "id",
      textField: "itemName",
      itemsShowLimit: 1,
      classes: "myclass custom-class"
    };
    this.setPreservedFilter();
    this.columnDefsInvoices = this.createColumnDefsInvoices();
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      this.spinner = false;
      const filter = res && res.filters ? JSON.parse(res.filters) : null;
      if (Object.keys(filter).length > 0) {
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

        this.getSalesReport(this.org, this.region, this.practice, this.subPractices, this.client, this.project);
      } else {
        this.getOrganizationData();
      }

    }, (errorResponse) => {
      this.spinner = false;
      this.getOrganizationData();
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
      this.subPractices = this.subPracticeData = response.SubPractices;
      this.getClientData(org, region, practice, response.SubPractices);

    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting sub practice data!');
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
      this.toasterService.error('Error Occured While Getting client data!');
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
      this.getSalesReport(org, region, practice, subPractice, client, response.Projects);
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting project data!');
    });
  }

  getSalesReport(org: any, region: any, practice: any, subPractice: any, client: any, project: any) {
    this.spinner = true;
    const payLoad = {
      "org": org ? org.map((item: any) => item.itemName) : [],
      "region": region ? region.map((item: any) => item.itemName) : [],
      "practice": practice ? practice.map((item: any) => item.itemName) : [],
      "subPractice": subPractice ? subPractice.map((item: any) => item.itemName) : [],
      "client": client ? client.map((item: any) => item.id) : [],
      "project": project ? project.map((item: any) => item.id) : []
    }
    this.resource.getSalesReport(payLoad).subscribe((response) => {
      this.spinner = false;
      this.bindProjectData(response.SalesReport);
      if (this.projectInvoices && this.projectInvoices.data.length > 0) {
        this.getProjectInvoices(this.projectInvoices.data[0].prjId);
      }
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting sales report data!');
    });
  }

  getProjectInvoices(id: any) {
    this.spinner = true;
    this.resource.getProjectInvoices(id).subscribe((response) => {
      this.spinner = false;
      this.bindInvoiceTableData(response.Invoices);
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting project invoice data!');
    });
  }

  bindProjectData(response: any) {
    this.projectInvoices.data = [];

    response.forEach((x: any) => {
      this.projectIds.push(x.projectId);
      const invoicedAmountUsd = x.invoicedAmountUsd ? x.invoicedAmountUsd : 0;
      const paidAmountUsd = x.paidAmountUsd ? x.paidAmountUsd : 0;
      const sentToCustomerUsd = x.amountSentToCustomerUsd ? x.amountSentToCustomerUsd : 0;
      this.projectInvoices.data.push({
        "prjId": x.projectId ? x.projectId : 0,
        "customer": x.customerName ? x.customerName : '',
        "project": x.projectName ? x.projectName : '',
        "project_manager": x.projectManager ? x.projectManager : '',
        "account_manager": x.accountManager ? x.accountManager : '',
        "sales_person": x.salesPerson ? x.salesPerson : '',
        "status": x.Status ? x.Status : '',
        "bookingDate": x.bookingDate ? x.bookingDate : '',
        "amount": x.bookedAmountUsd ? this.formatAmount(x.bookedAmountUsd) : 0,
        "sent_to_customer": this.formatAmount(sentToCustomerUsd),
        "paid": this.formatAmount(paidAmountUsd),
        "open_balance": this.formatAmount(invoicedAmountUsd - sentToCustomerUsd),
        "invoiced_amount": this.formatAmount(invoicedAmountUsd),
        "approved": x.amtApprovedUsdToBeSentToCustomer ? this.formatAmount(x.amtApprovedUsdToBeSentToCustomer) : 0,
        "not_approved": x.amtNotApprovedUsdToBeSentToCustomer ? this.formatAmount(x.amtNotApprovedUsdToBeSentToCustomer) : 0,
      })
    });
    this.projectInvoices.data = this.projectInvoices.data.sort((a, b) => {
      return a.customer > b.customer ? 1
        : a.customer < b.customer ? -1
          : 0;
    });
    this.spinner = false;
    this.isPageLoaded.emit(true);
    if (this.projectInvoices && this.projectInvoices.data.length > 0) {
      this.projectName = this.projectInvoices.data[0].project;
      this.columnDefsProjects = this.generateColumns(this.projectInvoices.data);
      this.gridOptionsProjects.api.setRowData(this.projectInvoices.data);
      this.gridOptionsProjects.api.sizeColumnsToFit();
      // this.getAllProjectsInvoiceData(this.projectIds.toString());
      // this.getProjectInvoicesThirdTblData(this.projectInvoices.data[0].prjId);
    }
  }

  bindInvoiceTableData(response: any) {
    this.projectInvoicesThirdTbl.data = [];
    response.forEach((x: any) => {
      const invoicedAmountUsd = x.invoicedAmountUsd ? x.invoicedAmountUsd : 0;
      const amountPaid = x.amountPaid ? x.amountPaid : 0;
      this.projectInvoicesThirdTbl.data.push({
        "customer": x.customerName ? x.customerName : '',
        "project": x.projectName ? x.projectName : '',
        "PrjStatus": x.projectStatus ? x.projectStatus : '',
        "invNo": x.invoiceNumber ? x.invoiceNumber : 0,
        "invDate": x.invoiceDate ? this.datePipe.transform(new Date(x.invoiceDate), 'yyyy-MM-dd') : 'yyyy-MM-dd',
        "invDueDate": x.invoiceDueDate ? this.datePipe.transform(new Date(x.invoiceDueDate), 'yyyy-MM-dd') : 'yyyy-MM-dd',
        "invStatus": x.invoiceStatus ? x.invoiceStatus : '',
        "invAmount": this.formatAmount(invoicedAmountUsd),
        "amountPaid": this.formatAmount(Number(amountPaid)),
        "open_balance": this.formatAmount(invoicedAmountUsd - amountPaid),
        "paymentDates": x.paymentDates ? this.datePipe.transform(new Date(x.paymentDates), 'yyyy-MM-dd') : 'yyyy-MM-dd',
        "paymentStatus": x.paymentStatus ? x.paymentStatus : '',
        "currency": x.currency ? x.currency : '',
        "qBSync": x.interfacedToQuickBooks ? x.interfacedToQuickBooks : ''
      })
    });
    this.projectInvoicesThirdTbl.data = this.projectInvoicesThirdTbl.data.sort((a, b) => {
      const dateA = new Date(a['invDate']);
      const dateB = new Date(b['invDate']);
      return -(dateA.getTime() - dateB.getTime());
    });
    this.gridOptionsInvoices.api.sizeColumnsToFit();
    this.isPageLoaded.emit(true);
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
      this.getDataForDropdown();
      this.lastChanedDd = '';
    } else if (eleFound != this.lastChanedDd) {
      this.getDataForDropdown();
      this.lastChanedDd = eleFound;
    }
  }

  getDataForDropdown(): void {
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
        this.getSalesReport(this.org, this.region, this.practice, this.subPractices,
          this.client, this.project);
        break;
    }
  }

  formatAmount(amt) {
    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  refresh() {
    this.getOrganizationData();
  }

  downloadDetailsInExel(name: string) {
    let downloadDetails: any;
    let file_name: string;
    if (this.projectInvoices.data && name === 'Project_Details') {
      downloadDetails = this.projectInvoices.data;
      file_name = name;
    } else if (this.projectInvoicesThirdTbl.data && name === 'Invoice_Details') {
      downloadDetails = this.projectInvoicesThirdTbl.data;
      file_name = name + '_of_' + this.projectName;
    }
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  onProjectSelected(params: any) {
    let selectedProject = this.gridApiProjects.getSelectedRows();
    this.projectName = selectedProject[0].project;
    this.getProjectInvoices(selectedProject[0].prjId);
  }

  generateColumns(data: any[]) {
    this.spinner = true;
    let columnDefinitions = [];

    data.map(object => {
      Object.keys(object).map(key => {
        const mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
          width: 150,
          sortable: true,
          filter: true
        }

        if (key.toUpperCase() == 'PRJID' || key.toUpperCase() == 'INVOICED_AMOUNT' ||
          key.toUpperCase() == 'APPROVED' || key.toUpperCase() == 'NOT_APPROVED') {
          mappedColumn['hide'] = true;
        }

        if (key.toUpperCase() == 'AMOUNT' || key.toUpperCase() == 'SENT_TO_CUSTOMER' ||
          key.toUpperCase() == 'PAID' || key.toUpperCase() == 'OPEN_BALANCE') {
          mappedColumn['valueFormatter'] = this.currencyFormatter;
          mappedColumn['comparator'] = this.numberComparator;
          mappedColumn['cellStyle'] = { 'text-align': 'right' };
        }

        if (key.toUpperCase() == 'PROJECT' || key.toUpperCase() == 'CUSTOMER') {
          mappedColumn['pinned'] = 'left'
          mappedColumn['width'] = 180
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
    this.spinner = false;
    return columnDefinitions;
  }

  onGridReadyProjects(params: any) {
    this.gridApiProjects = params.api;
    this.gridColumnApiProjects = params.columnApi;
  }

  getRowHeightProjects(params: any) {
    let lineCount = Math.floor(params.data.customer.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  private createColumnDefsInvoices() {
    const columnDefsInvoices = [
      {
        headerName: "Invoice No",
        field: "invNo",
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Invoice Date",
        field: "invDate",
        filter: "agDateColumnFilter",
        sortable: true
      },
      {
        headerName: "Due Date",
        field: "invDueDate",
        filter: "agDateColumnFilter",
        sortable: true
      },
      {
        headerName: "Status",
        field: "invStatus",
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Invoiced",
        field: "invAmount",
        valueFormatter: this.currencyFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Amount Paid",
        field: "amountPaid",
        valueFormatter: this.currencyFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Open Balance",
        field: "open_balance",
        valueFormatter: this.currencyFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Payment Date",
        field: "paymentDates",
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Payment Status",
        field: "paymentStatus",
        filter: "agTextColumnFilter",
        sortable: true
      }
    ];
    return columnDefsInvoices;
  }

  onGridReadyInvoices(params: any) {
    this.gridApiInvoices = params.api;
    this.gridColumnApiInvoices = params.columnApi;
  }

  getRowHeightInvoices(params: any) {
    let lineCount = Math.floor(params.data.customer.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  currencyFormatter(params: any) {
    if (params.value) {
      return "$" + params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  percentageFormatter(params: any) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "%";
    } else {
      return '';
    }
  }

  numberFormatter(params: any) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  numberComparator(num1: any, num2: any) {
    return num1 - num2;
  }

  setFilters() {
    const obj = {
      "org": this.org,
      "orgData": this.orgData,
      "region": this.region,
      "regionData": this.regionData,
      "practice": this.practice,
      "practiceData": this.practiceData,
      "subPractice": this.subPractices,
      "subPracticeData": this.subPracticeData,
      "client": this.client,
      "clientData": this.clientData,
      "project": this.project,
      "projectData": this.projectData
    }
    this.gridService.setFilters(obj);
  }

}

class DropdownFilterDataModel {
  id: any;
  itemName: any
}
