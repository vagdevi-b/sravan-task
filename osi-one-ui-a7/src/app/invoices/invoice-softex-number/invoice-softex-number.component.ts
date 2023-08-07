import { Component, OnInit, Injector } from '@angular/core';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';
import { InvoiceServices } from '../../shared/services/invoice-services.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap';
import { EditSoftexNumberComponent } from './edit-softex-number/edit-softex-number.component';

const INVOICE_STATUS = 'status_alias4';

@Component({
  selector: 'app-invoice-softex-number',
  templateUrl: './invoice-softex-number.component.html',
  styleUrls: ['./invoice-softex-number.component.css']
})

export class InvoiceSoftexNumberComponent implements OnInit {

  reverse: boolean;
  invoiceNumber: any;
  searchOrgName: any = '';
  searchCustomerName: any = '';
  searchProjectName: any = '';
  status: any = '';

  osiOrganizations: any = [];
  osiCustomers: any = [];
  invoiceProjects: any = [];
  invoiceStatusCodeList: any = [];

  invoiceList: any[] = [];
  listedItems: any[] = [];
  invoiceTotalSummary: InvoiceTotalSummary;
  showLoader: boolean = false;

  constructor(
    private appraisalService: AppraisalService,
    private invoiceService: InvoiceServices,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    private injector: Injector,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.dropdownData();
  }

  dropdownData(): void {
    this.getOrganizations();
    this.getCustomers();
    this.getStatusCode();
  }

  getOrganizations(): void {
    this.showLoader = true;
    this.appraisalService.getOrganizations().subscribe((response: any) => {
      this.showLoader = false;
      this.osiOrganizations = response;
    }, (errorResponse) => {
      this.showLoader = false;
      this.toastrService.error("Error getting organizations");
    });
  }

  getCustomers(): void {
    this.showLoader = true;
    this.invoiceService.getAllCustomersForService().subscribe((response: any) => {
      this.showLoader = false;
      this.osiCustomers = response;
    }, (errorResponse) => {
      this.showLoader = false;
      this.toastrService.error("Error getting customers");
    });
  }

  getStatusCode(): void {
    this.showLoader = true;
    this.invoiceService.getLookupbyName(INVOICE_STATUS).subscribe((response: any) => {
      this.showLoader = false;
      this.invoiceStatusCodeList = response;
    }, (errorResponse) => {
      this.showLoader = false;
      this.toastrService.error("Error getting invoice status");
    });
  }

  getProjectByOrganization(): void {
    const payLoad = {
      organizationId: this.searchOrgName ? this.searchOrgName : null,
      customerId: this.searchCustomerName ? this.searchCustomerName : null
    }
    this.showLoader = true;
    this.invoiceService.getProjectByOrgCust(payLoad).subscribe((response: any) => {
      this.showLoader = false;
      this.searchProjectName = '';
      this.invoiceProjects = response;
    }, (errorResponse) => {
      this.showLoader = false;
      this.toastrService.error("Error getting invoice status");
    });
  }

  searchInvoicesSummaryList(): void {
    if (this.invoiceNumber || this.searchCustomerName || this.searchProjectName) {
      const payLoad = {
        invoiceNumber: this.invoiceNumber ? this.invoiceNumber : null,
        organizationId: this.searchOrgName ? this.searchOrgName : null,
        customerId: this.searchCustomerName ? this.searchCustomerName : null,
        projectId: this.searchProjectName ? this.searchProjectName : null,
        status: this.status ? this.status : null,
        invoiceListFlag: true
      }
      this.showLoader = true;
      this.invoiceService.getInvoiceDetails(payLoad).subscribe((response: any) => {
        this.showLoader = false;
        this.invoiceList = response;
        this.listedItems = response;
      }, (errorResponse) => {
        this.showLoader = false;
        this.toastrService.error("Error getting invoice data");
      });
    } else {
      this.toastrService.warning(`Select either customer, project or invoice number!!!`);
    }
  }

  getInvTotalSummary(payLoad: any): void {
    this.showLoader = true;
    this.invoiceService.getTotalInvSummary(payLoad).subscribe((response: any) => {
      this.showLoader = false;
      this.invoiceTotalSummary = response;
    }, (errorResponse) => {
      this.showLoader = false;
      this.toastrService.error("Error getting invoice status");
    });
  }

  getPaymentsDetails(invoice: any): void {
    if (invoice.invoiceBalance && invoice.invoiceBalance > 0) {
      const modalRef = this.modalService.open(PaymentHistoryComponent, {
        centered: true,
        backdrop: 'static',
        windowClass: 'CustomModalClass',
        injector: Injector.create([{
          provide: ModalOptions,
          useValue: {
            data: invoice
          }
        }], this.injector)
      });
      modalRef.result.then((res) => {
        if (res) {
          this.searchInvoicesSummaryList();
        }
      });
    } else {
      this.toastrService.warning(`Paid amount is ${invoice.invoiceBalance} ${invoice.projectCurrencyCode}`);
    }
  }

  editSoftexNumber(invoice: any): void {
    const title = invoice && invoice.softexNumber ? 'Edit Softex Number' : 'Add Softex Number';
    const modalRef = this.modalService.open(EditSoftexNumberComponent, {
      centered: true,
      backdrop: 'static',
      // windowClass: 'CustomModalClass',
      injector: Injector.create([{
        provide: ModalOptions,
        useValue: {
          data: invoice,
          title: title
        }
      }], this.injector)
    });
    modalRef.result.then((res) => {
      if (res) {
        this.searchInvoicesSummaryList();
      }
    });
  }

  sort(key: any): void {
    if (this.invoiceList.length > 0) {
      if (this.reverse) {
        if (key === 'invoiceGeneratedDate' || key === 'dueDate') {
          this.reverse = false
          this.invoiceList.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return -(dateA.getTime() - dateB.getTime());
          });
        } else {
          this.reverse = false
          this.invoiceList.sort((a, b) => {
            return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
          });
        }
      } else {
        if (key === 'invoiceGeneratedDate' || key === 'dueDate') {
          this.reverse = true
          this.invoiceList.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return dateA.getTime() - dateB.getTime();
          });
        } else {
          this.reverse = true
          this.invoiceList.sort((a, b) => {
            return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
          });
        }
      }
    }
  }

  changePagedItems(list: any): void {
    this.invoiceList = list;
  }
}

interface InvoiceTotalSummary {
  invoiceTotalAmount?: string;
  invoiceTotalPaidAmount?: string;
  projectCurrencyCode?: string;
  totalInvoiceRecords?: number;
}