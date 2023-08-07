import { Component, OnInit } from '@angular/core';
import { ElasticsearchService } from '../shared/services/elasticsearchService';
import { Chart } from 'chart.js';
import { GridOptions } from "ag-grid-community";
import * as moment from 'moment'
import { ResourceUtilizationService } from '../shared/services/resource-utilization.service';
import { ExportFileService } from '../shared/services/export-file.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-show-record',
  templateUrl: './show-record.component.html',
  // styleUrls: ['./show-record.component.scss']
})
export class ShowRecordComponent implements OnInit {

  public searchString: string;
  public selectedRecord: string;
  public headerName: string = 'Sales';
  public projectName: string;
  page: Number = 1;
  cnt: Number = 10;
  public searchStringSec: string;
  public selectedRecordSec: string;
  pageSec: Number = 1;
  cntSec: Number = 10;
  public searchStringThird: string;
  public selectedRecordThird: string;
  pageThird: Number = 1;
  cntThird: Number = 10;
  disableOnAccural: boolean = false;
  customerInvoiceAmntPie = Chart;
  customerInvoiceAmntLabels = [];
  customerInvoiceAmntData = [];
  projectInvoices = {
    data: []
  };
  projectInvoicesSecTbl = {
    data: []
  };
  projectInvoicesThirdTbl = {
    data: []
  };

  gridApiProjects;
  gridColumnApiProjects;
  gridOptionsProjects = <GridOptions>{};
  columnDefsProjects = [];

  gridApiInvoices;
  gridColumnApiInvoices;
  gridOptionsInvoices = <GridOptions>{};
  columnDefsInvoices = [];
  defaultColDef = { resizable: true };

  gridApiAging;
  gridColumnApiAging;
  gridOptionsAging = <GridOptions>{};
  columnDefsAging = [];

  paginationPageSize = 5;


  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private downloadFile: ExportFileService,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    this.getData();
    this.columnDefsProjects = this.createColumnDefsProjects();
    this.columnDefsInvoices = this.createColumnDefsInvoices();
    this.columnDefsAging = this.createColumnDefsAging();
  }

  getData() {

    if (this.headerName == 'Sales') {
      $('#loadingInvoiceDetailsModal').modal('show');
      this.resource.getOSIProjectInvoicesData().subscribe(response => {
        response.forEach(element => {
          this.customerInvoiceAmntLabels.push(element.customerName);
          this.customerInvoiceAmntData.push(element.invoicedAmountUsd);
        });

        this.projectInvoices = {
          data: []
        };

        response.forEach(x => {
          const invoicedAmountUsd= x.invoicedAmountUsd ? x.invoicedAmountUsd : 0;
          const paidAmountUsd= x.paidAmountUsd ? x.paidAmountUsd : 0;
          const sentToCustomerUsd = x.amountSentToCustomerUsd ? x.amountSentToCustomerUsd : 0;
          this.projectInvoices.data.push({
            "prjId": x.projectId ? x.projectId : 0,
            "customer": x.customerName ? x.customerName : '',
            "project": x.projectName ? x.projectName : '',
            "project_manager": x.projectManager ? x.projectManager : '',
            "sales_person": x.salesPerson ? x.salesPerson : '',
            "bookingDate": x.bookingDate ? x.bookingDate : '',
            "account_manager": x.accountManager ? x.accountManager : '',
            "amount": x.bookedAmountUsd ? this.formatAmount(x.bookedAmountUsd) : 0,
            "invoiced_amount": this.formatAmount(invoicedAmountUsd),
            "open_balance": this.formatAmount(sentToCustomerUsd - paidAmountUsd),
            "sent_to_customer": this.formatAmount(sentToCustomerUsd),
            "approved": x.amtApprovedUsdToBeSentToCustomer ? this.formatAmount(x.amtApprovedUsdToBeSentToCustomer) : 0,
            "not_approved": x.amtNotApprovedUsdToBeSentToCustomer ? this.formatAmount(x.amtNotApprovedUsdToBeSentToCustomer) : 0,
            "paid": this.formatAmount(paidAmountUsd),
            "status": x.status
          })
        });
        this.projectInvoices.data = this.projectInvoices.data.sort(function sortAll(a, b) {
          return a.customer > b.customer ? 1
            : a.customer < b.customer ? -1
              : 0;
        });
        $('#loadingInvoiceDetailsModal').modal('hide');
        this.projectName = this.projectInvoices.data[0].project;
        this.selectedRecord = this.projectInvoices.data[0].project;
        this.columnDefsProjects = this.createColumnDefsProjects();
        this.gridOptionsProjects.api.setRowData(this.projectInvoices.data);
        this.getProjectInvoicesThirdTblData(this.projectInvoices.data[0].prjId);

      }, (errorResponse) => {
        $('#loadingInvoiceDetailsModal').modal('hide');
        this.toasterService.error( 'Unable to get project invoice data!');
      });

    } else {
      $('#loadingInvoiceDetailsModal').modal('show');
      this.resource.getosiSalesAgeingReportData().subscribe(response => {
        this.projectInvoicesSecTbl = {
          data: []
        };

        response.forEach(x => {
          this.projectInvoicesSecTbl.data.push({
            "prjId": x.projectId ? x.projectId : 0,
            "customer": x.customerName ? x.customerName : '',
            "project": x.projectName ? x.projectName : '',
            "current": x.current ? JSON.stringify(x.current) : 0,
            "oneToThirty": x.oneTo30 ? this.formatAmount(x.oneTo30) : 0,
            "thirtyOneToSixty": x.thirtyOneTo60 ? this.formatAmount(x.thirtyOneTo60) : 0,
            "sixtyOneToNinety": x.sixtyOneTo90 ? this.formatAmount(x.sixtyOneTo90) : 0,
            "aboveNinety": x.above90 ? this.formatAmount(x.above90) : 0,
            "total": x.total ? this.formatAmount(x.total) : 0
          })
        });
        this.projectInvoicesSecTbl.data = this.projectInvoicesSecTbl.data.sort(function sortAll(a, b) {
          return a.customer > b.customer ? 1
            : a.customer < b.customer ? -1
              : 0;
        });
        $('#loadingInvoiceDetailsModal').modal('hide');
        this.selectedRecord = this.projectInvoicesSecTbl.data[0].project;
        this.projectName = this.projectInvoicesSecTbl.data[0].project;
        this.getProjectInvoicesThirdTblData(this.projectInvoicesSecTbl.data[0].prjId);

      }, (errorResponse) => {
        $('#loadingInvoiceDetailsModal').modal('hide');
        this.toasterService.error( 'Unable to get sales aging report data!');
      });

    }
    // this.renderChart();

  }

  getProjectInvoicesThirdTblData(id) {

    $('#loadingInvoiceDetailsModal').modal('show');

    this.resource.getosiSalesPersonDashboardData(id).subscribe(response => {
      this.projectInvoicesThirdTbl = {
        data: []
      };
      response.forEach(x => {
        const invoicedAmountUsd= x.invoicedAmountUsd ? x.invoicedAmountUsd  : 0;
        const amountPaid= x.amountPaid ? x.amountPaid  : 0;
        this.projectInvoicesThirdTbl.data.push({
          "customer": x.customerName ? x.customerName : '',
          "project": x.projectName ? x.projectName : '',
          "PrjStatus": x.projectStatus ? x.projectStatus : '',
          "invNo": x.invoiceNumber ? x.invoiceNumber : 0,
          "invDate": x.invoiceDate ? x.invoiceDate : 'yyyy-mm-dd',
          "amountPaid": this.formatAmount(Number(amountPaid)),
          "paymentDates": x.paymentDates ? x.paymentDates : 'yyyy-mm-dd',
          "invDueDate": x.invoiceDueDate ? x.invoiceDueDate : 'yyyy-mm-dd',
          "invStatus": x.invoiceStatus ? x.invoiceStatus : '',
          "currency": x.currency ? x.currency : '',
          "invAmount": this.formatAmount(invoicedAmountUsd),
          "open_balance": this.formatAmount(invoicedAmountUsd - amountPaid),
          "paymentStatus": x.paymentStatus ? x.paymentStatus : '',
          "qBSync": x.interfacedToQuickBooks ? x.interfacedToQuickBooks : ''
        })
      });
      this.projectInvoicesThirdTbl.data = this.projectInvoicesThirdTbl.data.sort(function sortAll(a, b) {
        return a.invDate < b.invDate ? 1
          : a.invDate > b.invDate ? -1
            : 0;
      });

      $('#loadingInvoiceDetailsModal').modal('hide');

    }, (errorResponse) => {
      $('#loadingInvoiceDetailsModal').modal('hide');
      this.toasterService.error( 'Unable to get invoice details!');
    });
  }

  formatAmount(amt) {
    return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  downloadDetailsInExel(name) {
    let downloadDetails;
    let file_name;
    if(this.projectInvoices.data && name === 'Project_Details') {
      downloadDetails = this.projectInvoices.data;
      file_name = name;
    } else if (this.projectInvoicesThirdTbl.data && name === 'Invoice_Details') {
      downloadDetails = this.projectInvoicesThirdTbl.data;
      file_name = name + '_of_' + this.projectName;
    } else if (this.projectInvoicesSecTbl.data && name === 'Aging_Report') {
      downloadDetails = this.projectInvoicesSecTbl.data;
      file_name = name;
    }
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  onProjectSelected(params) {
    let selectedProject = this.gridApiProjects.getSelectedRows();
    this.projectName = selectedProject[0].project;
    this.OSIProjectInvoicesTable(selectedProject[0]);
  }

  onAgingSelected(params) {
    let selectedProject = this.gridApiAging.getSelectedRows();
    this.projectName = selectedProject[0].project
    this.OSIProjectInvoicesTable(selectedProject[0]);
  }

  OSIProjectInvoicesTable(data) {
    this.selectedRecord = data.project;
    this.projectInvoicesThirdTbl = {
      data: []
    };
    this.getProjectInvoicesThirdTblData(data.prjId);
  }


  onNavClick(params) {

    if (params === "accural") {
      this.projectInvoicesThirdTbl.data = [];
      this.searchStringThird = '';
      this.searchString = '';
      this.page = 1;
      this.cnt = 10;
      this.pageSec = 1;
      this.cntSec = 10;
      this.pageThird = 1;
      this.cntThird = 10;
      this.headerName = 'Age';
      this.disableOnAccural = true;
      this.getData();
    } else {
      this.projectInvoicesThirdTbl.data = [];
      this.searchStringThird = '';
      this.searchString = '';
      this.page = 1;
      this.cnt = 10;
      this.pageSec = 1;
      this.cntSec = 10;
      this.pageThird = 1;
      this.cntThird = 10;
      this.headerName = 'Sales';
      this.disableOnAccural = false;
      this.getData();
    }
  }
  // renderChart() {

  //   this.customerInvoiceAmntPie = new Chart('pieCustomerInvoice', {
  //     type: 'pie',
  //     data: {
  //       labels: this.customerInvoiceAmntLabels,
  //       datasets: [
  //         {
  //           label: 'PnL',
  //           data: this.customerInvoiceAmntData,
  //           backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
  //           hoverBackgroundColor: ["#ffc107", "#28a745", "#dc3545"],
  //           hoverBorderWidth: 0
  //         }
  //       ]
  //     },
  //     options: {
  //       animation: {
  //         duration: 10,
  //       },
  //       legend: {
  //         display: false,
  //         position: 'right',
  //         labels: {
  //           fontSize: 11,
  //           boxWidth: 10
  //         }
  //       }
  //     }
  //   });
  // }

  private createColumnDefsProjects() {
    const columnDefsProjects = [
      {
        headerName: "Customer",
        field: "customer",
        width: 200,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Project",
        field: "project",
        width: 200,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Project Manager",
        field: "project_manager",
        width: 180,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Account Manager",
        field: "account_manager",
        width: 180,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Sales Manager",
        field: "sales_person",
        width: 180,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Status",
        field: "status",
        width: 100,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Booking Date",
        field: "bookingDate",
        width: 130,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Booked",
        field: "amount",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Invoiced",
        field: "sent_to_customer",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Paid",
        field: "paid",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Open Balance",
        field: "open_balance",
        valueFormatter: this.currencyFormatter,
        width: 150,
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
    let lineCount = Math.floor(params.data.customer.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  private createColumnDefsInvoices() {
    const columnDefsInvoices = [
      {
        headerName: "Invoice No",
        field: "invNo",
        width: 220,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Invoice Date",
        field: "invDate",
        width: 120,
        filter: "agDateColumnFilter",
        sortable: true
      },
      {
        headerName: "Due Date",
        field: "invDueDate",
        width: 100,
        filter: "agDateColumnFilter",
        sortable: true
      },
      {
        headerName: "Status",
        field: "invStatus",
        width: 90,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Invoiced",
        field: "invAmount",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Amount Paid",
        field: "amountPaid",
        valueFormatter: this.currencyFormatter,
        width: 110,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Open Balance",
        field: "open_balance",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Payment Date",
        field: "paymentDates",
        width: 110,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Payment Status",
        field: "paymentStatus",
        width: 100,
        filter: "agTextColumnFilter",
        sortable: true
      }
    ];
    return columnDefsInvoices;
  }

  onGridReadyInvoices(params) {
    this.gridApiInvoices = params.api;
    this.gridColumnApiInvoices = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeightInvoices = function (params) {
    let lineCount = Math.floor(params.data.customer.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  private createColumnDefsAging() {
    const columnDefsAging = [
      {
        headerName: "Customer",
        field: "customer",
        width: 240,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Project",
        field: "project",
        width: 220,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },

      {
        headerName: "Current",
        field: "current",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Days(<30)",
        field: "oneToThirty",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Days(31-60)",
        field: "thirtyOneToSixty",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Days(61-90)",
        field: "sixtyOneToNinety",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Days(>90)",
        field: "aboveNinety",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Total",
        field: "total",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsAging;
  }

  onGridReadyAging(params) {
    this.gridApiAging = params.api;
    this.gridColumnApiAging = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeightAging = function (params) {
    let lineCount = Math.floor(params.data.customer.length / 32) + 1;
    return (12 * lineCount) + 24;
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

}