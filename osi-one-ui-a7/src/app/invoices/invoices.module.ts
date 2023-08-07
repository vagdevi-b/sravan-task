import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { DynamicInvoiceTemplateComponent } from './create-dynamic-invoice-template/dynamic-invoice-template.component';
import { EditDynamicInvoiceTemplateComponent } from './edit-dynamic-invoice-template/edit-dynamic-invoice-template.component';
import { ListsDynamicInvoiceTemplateComponent } from './lists-dynamic-invoice-template/lists-dynamic-invoice-template.component';
import { MissingTimesheetApproversComponent } from './missing-timesheet-approvers/missing-timesheet-approvers.component';
import { UndeliveredInvoicesComponent } from './undelivered-invoices/undelivered-invoices.component';
import { ViewDynamicInvoiceComponent } from './view-dynamic-invoice-template/view-dynamic-invoice.component';
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component';
import { FilterInvoicePipe } from './filter-invoice.pipe';

@NgModule({
  declarations: [
    DynamicInvoiceTemplateComponent,
    EditDynamicInvoiceTemplateComponent,
    ListsDynamicInvoiceTemplateComponent,
    MissingTimesheetApproversComponent,
    UndeliveredInvoicesComponent,
    ViewDynamicInvoiceComponent,
    ViewInvoicesComponent,
    FilterInvoicePipe
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    SharedComponentsModule
  ]
})
export class InvoicesModule { }
