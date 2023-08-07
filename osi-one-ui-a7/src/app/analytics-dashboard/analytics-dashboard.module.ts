import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsDashboardRoutingModule } from './analytics-dashboard-routing.module';
import { AnalyticsDashboardComponent } from './analytics-dashboard.component';
import { HoursByProjectModule } from './hours-by-project/hours-by-project.module';
import { AnalyticsViewComponent } from './analytics-view/analytics-view.component';
import { AvgBillWeekHrsComponent } from './avg-bill-week-hrs/avg-bill-week-hrs.component';
import { HoursByResourceComponent } from './hours-by-resource/hours-by-resource.component';
import { MyFutureRevenueModule } from './my-future-revenue/my-future-revenue.module';
import { MyInvoicesModule } from './my-invoices/my-invoices.module';
import { MyResourceExpensesModule } from './my-resource-expenses/my-resource-expenses.module';
import { MyResourceRevenueModule } from './my-resource-revenue/my-resource-revenue.module';
import { MyResourceRevenueSourceModule } from './my-resource-revenue-source/my-resource-revenue-source.module';
import { MyRevenueChartComponent } from './my-revenue-chart/my-revenue-chart.component';
import { ProjectEstimatedVsActualComponent } from './project-estimated-vs-actual/project-estimated-vs-actual.component';
import { ChartService } from './project-revenue/services/chart.service';
import { TransformDataService } from './project-revenue/services/transform-data.service';
import { UtilsService } from './project-revenue/services/utils.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { Ng5SliderModule } from 'ng5-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    AnalyticsViewComponent,
    AvgBillWeekHrsComponent,
    HoursByResourceComponent,
    MyRevenueChartComponent,
    ProjectEstimatedVsActualComponent
  ],
  imports: [
    CommonModule,
    AnalyticsDashboardRoutingModule,
    HoursByProjectModule,
    MyFutureRevenueModule,
    MyInvoicesModule,
    MyResourceExpensesModule,
    MyResourceRevenueModule,
    MyResourceRevenueSourceModule,
    SharedComponentsModule,
    DragDropModule,
    NgbModule,
    Ng5SliderModule,
    NgMultiSelectDropDownModule
  ],
  exports: [
    AnalyticsViewComponent,
    AvgBillWeekHrsComponent,
    HoursByResourceComponent,
    MyRevenueChartComponent,
    ProjectEstimatedVsActualComponent
  ],
  providers: [
    ChartService,
    TransformDataService,
    UtilsService,
  ]
})
export class AnalyticsDashboardModule { }
