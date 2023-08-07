import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsrEventReportRoutingModule } from './isr-event-report-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { IsrEventReportComponent } from './isr-event-report.component';

@NgModule({
  declarations: [
    IsrEventReportComponent
  ],
  imports: [
    CommonModule,
    IsrEventReportRoutingModule,
    SharedComponentsModule
  ]
})
export class IsrEventReportModule { }
