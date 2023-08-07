import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPlcustomerviewRoutingModule } from './report-plcustomerview-routing.module';
import { ReportPlcustomerviewComponent } from './report-plcustomerview.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';

@NgModule({
  declarations: [
    ReportPlcustomerviewComponent
  ],
  imports: [
    CommonModule,
    ReportPlcustomerviewRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPlcustomerviewModule { }
