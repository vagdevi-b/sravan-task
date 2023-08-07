import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissingExchangeRatesComponent } from './missing-exchange-rates/missing-exchange-rates.component';

const routes: Routes = [
  {
    path: 'missingExchangeRates',
    component: MissingExchangeRatesComponent,
    data: {
      title: "View Missing Exchange Rates"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmoVerificationsRoutingModule { }
