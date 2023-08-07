import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesDashboardRoutingModule } from './sales-dashboard-routing.module';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { SalesDashboardComponent } from './sales-dashboard.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    SalesDashboardComponent,
    SalesReportComponent,
    AgingReportComponent
  ],
  imports: [
    CommonModule,
    SalesDashboardRoutingModule,
    SharedComponentsModule,
    NgMultiSelectDropDownModule
  ],
  exports: [
    SalesReportComponent,
    AgingReportComponent
  ]
})
export class SalesDashboardModule { }
