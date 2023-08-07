import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap';
import { InvoiceStatusPipe } from '../../../shared/pipes/invoice-status.pipe';
import { InvoiceServices } from '../../../shared/services/invoice-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-softex-number',
  templateUrl: './edit-softex-number.component.html',
  styleUrls: ['./edit-softex-number.component.css']
})
export class EditSoftexNumberComponent implements OnInit {

  reverse: boolean;
  title: string;
  invoiceNumber: any;
  invoiceStatus: any;
  softextNumber: any;

  invoiceDetail: any;
  invoiceId: any;
  showLoader: boolean = false;
  softexId: any;

  constructor(
    private modal: NgbActiveModal,
    private inputData: ModalOptions,
    private invoiceService: InvoiceServices,
    private toastrService: ToastrService,
    private invStatus: InvoiceStatusPipe
  ) { }

  ngOnInit() {
    console.log("INPUT_DATA", this.inputData['data'], "INPUT", this.inputData);
    this.title = this.inputData && this.inputData['title'] ? this.inputData['title'] : 'Add Softex Number';
    this.invoiceDetail = this.inputData && this.inputData['data'] ? this.inputData['data'] : {};
    this.invoiceId = this.invoiceDetail && this.invoiceDetail.invoiceId ? this.invoiceDetail.invoiceId : '';
    this.invoiceNumber = this.invoiceDetail && this.invoiceDetail.invoiceNumber ? this.invoiceDetail.invoiceNumber : '';
    this.invoiceStatus = this.invoiceDetail && this.invoiceDetail.invoiceStatus ? this.invStatus.transform(this.invoiceDetail.invoiceStatus) : '';
    this.softextNumber = this.invoiceDetail && this.invoiceDetail.softexNumber ? this.invoiceDetail.softexNumber : '';
    this.softexId = this.invoiceDetail && this.invoiceDetail.softexId ? this.invoiceDetail.softexId : '';
  }

  saveSoftex(): void {
    const payLoad = {
      invoiceNumber: this.invoiceNumber ? this.invoiceNumber : null,
      invoiceId: this.invoiceId ? this.invoiceId : null,
      softexNumber: this.softextNumber ? this.softextNumber : null,
      invoiceSoftexId: this.softexId ? this.softexId : null
    };
    this.showLoader = true;
    this.invoiceService.saveSoftexNumber(payLoad).subscribe((response: any) => {
      this.showLoader = false;
      this.modal.close(true);
      this.toastrService.success("Successfully saved softex number");
    }, (errorResponse: any) => {
      this.showLoader = false;
      this.toastrService.error("Error softex number data");
    });
  }

  close(): void {
    this.modal.close();
  }

}
