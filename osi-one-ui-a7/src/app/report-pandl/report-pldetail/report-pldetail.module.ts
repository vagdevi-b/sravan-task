import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPldetailRoutingModule } from './report-pldetail-routing.module';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { ReportPldetailComponent } from './report-pldetail.component';

@NgModule({
  declarations: [
    ReportPldetailComponent
  ],
  imports: [
    CommonModule,
    ReportPldetailRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPldetailModule { }
