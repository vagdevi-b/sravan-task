import { Component, OnInit } from "@angular/core";
import { InvoiceServices } from "./../../shared/services/invoice-services.service";
import { Router, ActivatedRoute } from "@angular/router";


declare var $: any;
@Component({
  selector: "app-lists-dynamic-invoice-template",
  templateUrl: "./lists-dynamic-invoice-template.component.html",
  styleUrls: ["./lists-dynamic-invoice-template.component.css"]
})
export class ListsDynamicInvoiceTemplateComponent implements OnInit {
  constructor(
    private invoiceServices: InvoiceServices,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  allListItems: any[] = [];
  responseData;
  showAlert;
  successMessage;
  errorMessage;
  searchText;
  total: number = 0;
  crntpage: number;
 


  ngOnInit() {
    this.getInvoiceList();
    this.responseData = this.route.snapshot.params;
    if (this.responseData) {
      this.showAlert = this.responseData.p1;
      this.successMessage = this.responseData.p2;
      let ref = this;
      setTimeout(function() {
        ref.showAlert = false;
      }, 5000);
    }
  }

  viewInvoice(invoiceId) {
    this.router.navigate(["../viewDynamicInvoiceTemplate/" + invoiceId], {
      relativeTo: this.route
    });
  }

  editInvoice(invoiceId) {
    this.router.navigate(["../editDynamicInvoiceTemplate/" + invoiceId], {
      relativeTo: this.route
    });
  }

  invoiceToDelete: number = null;
  deleteConfirmation(id) {
    $("#delete_invoice").modal({ show: true, backdrop: "static" });
    this.invoiceToDelete = id;
  }

  deleteInvoice() {
    this.invoiceServices.deleteInvoiceLayout(this.invoiceToDelete).subscribe(
      data => {
        if(data.status=='success'){
          this.showAlert = true;
          this.successMessage = "Invoice layout deleted Successfully";
          let ref = this;
          setTimeout(function() {
            ref.showAlert = false;
            this.successMessage = "";
          }, 5000);
        }

      },
      err => {
        console.log("Not able to delete the invoice template.")
      },
      () => {
        this.getInvoiceList()
        this.invoiceToDelete = null;
      }
    );
  }

  createNewInvoice() {
    this.router.navigate(["/invoice/createDynamicInvoiceTemplate"], {
      relativeTo: this.route
    });
  }

  getInvoiceList() {
    this.invoiceServices.listOfInvoiceTemplate().subscribe(data => {
      this.allListItems = data;
      if(data){
        this.total = this.allListItems.length;
      }else{
        this.total = 0;
      }
    });
  }
}
