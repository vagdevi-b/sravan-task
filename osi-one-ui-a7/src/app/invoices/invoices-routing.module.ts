import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicInvoiceTemplateComponent } from './create-dynamic-invoice-template/dynamic-invoice-template.component';
import { EditDynamicInvoiceTemplateComponent } from './edit-dynamic-invoice-template/edit-dynamic-invoice-template.component';
import { ListsDynamicInvoiceTemplateComponent } from './lists-dynamic-invoice-template/lists-dynamic-invoice-template.component';
import { MissingTimesheetApproversComponent } from './missing-timesheet-approvers/missing-timesheet-approvers.component';
import { UndeliveredInvoicesComponent } from './undelivered-invoices/undelivered-invoices.component';
import { ViewDynamicInvoiceComponent } from './view-dynamic-invoice-template/view-dynamic-invoice.component';
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component';

const routes: Routes = [
  {
    path: "undeliveredInvoices",
    component: UndeliveredInvoicesComponent,
    data: {
      title: "View Undelivered Invoices"
    }
  },
  {
    path: 'missingTimesheetApprovers',
    component: MissingTimesheetApproversComponent,
    data: {
      title: 'View Missing Timesheet Approvers'
    }
  },
  {
    path: "createDynamicInvoiceTemplate",
    component: DynamicInvoiceTemplateComponent,
    data: {
      title: "Create Invoice Template"
    }
  },
  {
    path: "listOfDynamicInvoiceTemplate",
    component: ListsDynamicInvoiceTemplateComponent,
    data: {
      title: "List Invoice Template"
    }
  },
  {
    path: "editDynamicInvoiceTemplate/:invoiceId",
    component: EditDynamicInvoiceTemplateComponent,
    data: {
      title: "Edit Invoice Template"
    }
  },
  {
    path: "viewDynamicInvoiceTemplate/:invoiceId",
    component: ViewDynamicInvoiceComponent,
    data: {
      title: "View Invoice Template"
    }
  },
  {
    path: 'ViewInvoices',
    component: ViewInvoicesComponent,
    data: {
      title: 'View Invoice'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
