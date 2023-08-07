import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPlemployeeRoutingModule } from './report-plemployee-routing.module';
import { ReportPlemployeeComponent } from './report-plemployee.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { ReportEmployeeTableComponent } from './report-employee-table/report-employee-table.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReportPlemployeeUtilisationLevelTableComponent } from './report-plemployee-utilisation-level-table/report-plemployee-utilisation-level-table.component';

@NgModule({
  declarations: [
    ReportPlemployeeComponent,
    // ReportEmployeeTableComponent,
    ReportPlemployeeUtilisationLevelTableComponent
  ],
  imports: [
    CommonModule,
    ReportPlemployeeRoutingModule,
    SharedComponentsModule,
    PandlSharedModule,
    ScrollingModule
  ]
})
export class ReportPlemployeeModule { }
