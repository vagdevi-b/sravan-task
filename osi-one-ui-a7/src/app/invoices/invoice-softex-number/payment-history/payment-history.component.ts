import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions, BsDatepickerConfig } from 'ngx-bootstrap';
import { InvoiceServices } from '../../../shared/services/invoice-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  reverse: boolean;
  invoicePaymentList: any[] = [];
  datePickerConfig: Partial<BsDatepickerConfig>;
  invoiceDetails: any;
  invoicePaymentStatus: any;
  totalPayment: any;
  showLoader: boolean = false;
  totalAmount: Number;

  constructor(
    public modal: NgbActiveModal,
    public inputData: ModalOptions,
    private invoiceService: InvoiceServices,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      dateInputFormat: 'YYYY-MM-DD'
    });
    console.log("INPUT_DATA", this.inputData['data'], "INPUT", this.inputData);
    this.invoiceDetails = this.inputData && this.inputData['data'] ? this.inputData['data'] : {};
    this.invoicePaymentStatus = this.invoiceDetails.invoiceStatus;
    this.getPaymentHistory(this.invoiceDetails);
  }

  getPaymentHistory(invoice: any): void {
    this.showLoader = true;
    this.invoiceService.getPaymentHistory(invoice).subscribe((response) => {
      this.showLoader = false;
      this.totalAmount = this.getTotalAmount(response);
      this.invoicePaymentList = response;
      console.log("PAYMENT_HISTORY", this.invoicePaymentList);
    }, (errorResponse) => {
      this.showLoader = false;
      this.toastrService.error("Error getting payment history");
    });
  }

  getTotalAmount(paymentDetails: any): Number {
    let total = 0;
    paymentDetails.forEach((item: any) => {
      total += item.amountReceived;
    });
    return total;
  }

  savePayment(): void {
    this.showLoader = true;
    this.invoiceService.savePaymentHistory(this.invoicePaymentList).subscribe((response: any) => {
      this.showLoader = false;
      this.modal.close(true);
      this.toastrService.success("Successfully saved payment history");
    }, (errorResponse: any) => {
      this.showLoader = false;
      this.toastrService.error("Error saving payment history");
    });
    console.log("INVOICE_PAYMENT_LIST", this.invoicePaymentList);
  }

  close(): void {
    this.modal.close();
  }

}
