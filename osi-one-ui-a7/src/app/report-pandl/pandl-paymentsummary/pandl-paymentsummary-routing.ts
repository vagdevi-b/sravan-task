import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PandlPaymentsummaryComponent } from './pandl-paymentsummary.component';

const routes: Routes = [
  {
    path: '',
    component: PandlPaymentsummaryComponent, data: {
      title: 'Payment Summary'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PandlPaymentSummaryRoutingModule { }
