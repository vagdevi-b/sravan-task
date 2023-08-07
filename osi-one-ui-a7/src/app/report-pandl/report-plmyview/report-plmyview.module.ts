import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPlmyviewRoutingModule } from './report-plmyview-routing.module';
import { ReportPlmyviewComponent } from './report-plmyview.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';

@NgModule({
  declarations: [
    ReportPlmyviewComponent
  ],
  imports: [
    CommonModule,
    ReportPlmyviewRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPlmyviewModule { }
