import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PandlPaymentsummaryComponent } from './pandl-paymentsummary.component';
import { PandlPaymentSummaryRoutingModule } from './pandl-paymentsummary-routing';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { PaymentsummaryTableComponent } from './paymentsummary-table/paymentsummary-table.component';
@NgModule({
  declarations: [ PandlPaymentsummaryComponent, PaymentsummaryTableComponent],
  imports: [
    CommonModule,
    PandlPaymentSummaryRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class PandlPaymentsummaryModule { }
