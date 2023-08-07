import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportFilterRoutingModule } from './report-filter-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { ReportFilterComponent } from './report-filter.component';

@NgModule({
  declarations: [
    ReportFilterComponent
  ],
  imports: [
    CommonModule,
    ReportFilterRoutingModule,
    SharedComponentsModule
  ]
})
export class ReportFilterModule { }
