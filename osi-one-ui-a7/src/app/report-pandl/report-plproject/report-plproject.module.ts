import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPlprojectRoutingModule } from './report-plproject-routing.module';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { ReportPlprojectComponent } from './report-plproject.component';

@NgModule({
  declarations: [
    ReportPlprojectComponent
  ],
  imports: [
    CommonModule,
    ReportPlprojectRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPlprojectModule { }
