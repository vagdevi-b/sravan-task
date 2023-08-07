import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPlutilizationRoutingModule } from './report-plutilization-routing.module';
import { ReportPlutilizationComponent } from './report-plutilization.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';

@NgModule({
  declarations: [
    ReportPlutilizationComponent
  ],
  imports: [
    CommonModule,
    ReportPlutilizationRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPlutilizationModule { }
