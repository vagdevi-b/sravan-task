import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmoVerificationsRoutingModule } from './pmo-verifications-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { MissingExchangeRatesComponent } from './missing-exchange-rates/missing-exchange-rates.component';

@NgModule({
  declarations: [
    MissingExchangeRatesComponent
  ],
  imports: [
    CommonModule,
    PmoVerificationsRoutingModule,
    SharedComponentsModule
  ]
})
export class PmoVerificationsModule { }
