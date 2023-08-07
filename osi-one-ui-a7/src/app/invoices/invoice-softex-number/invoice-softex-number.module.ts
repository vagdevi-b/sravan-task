import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceSoftexNumberRoutingModule } from './invoice-softex-number-routing.module';
import { InvoiceSoftexNumberComponent } from './invoice-softex-number.component';
import { EditSoftexNumberComponent } from './edit-softex-number/edit-softex-number.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { InvoiceStatusPipe } from '../../shared/pipes/invoice-status.pipe';

@NgModule({
  declarations: [
    InvoiceSoftexNumberComponent,
    EditSoftexNumberComponent,
    PaymentHistoryComponent,
    InvoiceStatusPipe
  ],
  imports: [
    CommonModule,
    InvoiceSoftexNumberRoutingModule,
    SharedComponentsModule
  ],
  entryComponents: [
    PaymentHistoryComponent,
    EditSoftexNumberComponent,
  ]
})
export class InvoiceSoftexNumberModule { }
