import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPldataRoutingModule } from './report-pldata-routing.module';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { ReportPldataComponent } from './report-pldata.component';

@NgModule({
  declarations: [
    ReportPldataComponent
  ],
  imports: [
    CommonModule,
    ReportPldataRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPldataModule { }
