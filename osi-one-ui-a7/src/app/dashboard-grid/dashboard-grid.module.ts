import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardGridRoutingModule } from './dashboard-grid-routing.module';
import { DashboardGridComponent } from './dashboard-grid.component';
import { MyProjectsDashboardModule } from '../project-dashboard/my-projects-dashboard/my-projects-dashboard.module';
import { MyResourcesDashboardModule } from '../resource-utilisation/my-resources-dashboard/my-resources-dashboard.module';
import { RmDashboardPnlModule } from '../resource-utilisation/rm-dashboard-pnl/rm-dashboard-pnl.module';
import { RmDashboardModule } from '../resource-utilisation/rm-dashboard/rm-dashboard.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { ReportsModalComponent } from './reports-modal/reports-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HoursByProjectModule } from '../analytics-dashboard/hours-by-project/hours-by-project.module';
import { MyFutureRevenueModule } from '../analytics-dashboard/my-future-revenue/my-future-revenue.module';
import { MyInvoicesModule } from '../analytics-dashboard/my-invoices/my-invoices.module';
import { MyResourceExpensesModule } from '../analytics-dashboard/my-resource-expenses/my-resource-expenses.module';
import { MyResourceRevenueModule } from '../analytics-dashboard/my-resource-revenue/my-resource-revenue.module';
import { MyResourceRevenueSourceModule } from '../analytics-dashboard/my-resource-revenue-source/my-resource-revenue-source.module';
import { MyResourcesModule } from '../analytics-dashboard/my-resources/my-resources.module';
import { MyTeamRevenueModule } from '../analytics-dashboard/my-team-revenue/my-team-revenue.module';
import { MyTeamUtilizationModule } from '../analytics-dashboard/my-team-utilization/my-team-utilization.module';
import { OrgProjRevenueModule } from '../analytics-dashboard/org-proj-revenue/org-proj-revenue.module';
import { ProjectExpensesModule } from '../analytics-dashboard/project-expenses/project-expenses.module';
import { ProjectPandlModule } from '../analytics-dashboard/project-pandl/project-pandl.module';
import { ProjectPnlFiltertestModule } from '../analytics-dashboard/project-pnl-filtertest/project-pnl-filtertest.module';
import { ProjectRevenueModule } from '../analytics-dashboard/project-revenue/project-revenue.module';
import { ProjectRevenueDistributionModule } from '../analytics-dashboard/project-revenue-distribution/project-revenue-distribution.module';
import { ProjectRevenueSqlModule } from '../analytics-dashboard/project-revenue-sql/project-revenue-sql.module';
import { ChartService } from '../analytics-dashboard/project-revenue/services/chart.service';
import { AnalyticsDashboardModule } from '../analytics-dashboard/analytics-dashboard.module';
import { TransformDataService } from '../analytics-dashboard/project-revenue/services/transform-data.service';
import { UtilsService } from '../analytics-dashboard/project-revenue/services/utils.service';
import { Ng5SliderModule } from 'ng5-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProjectsPandlDashboardModule } from '../project-dashboard/projects-pandl-dashboard/projects-pandl-dashboard.module';
import { SalesDashboardModule } from '../sales-dashboard/sales-dashboard.module';

@NgModule({
  declarations: [
    DashboardGridComponent,
    ReportsModalComponent
  ],
  imports: [
    CommonModule,
    DashboardGridRoutingModule,
    RmDashboardPnlModule,
    RmDashboardModule,
    MyResourcesDashboardModule,
    MyProjectsDashboardModule,
    HoursByProjectModule,
    MyFutureRevenueModule,
    MyInvoicesModule,
    MyResourceExpensesModule,
    MyResourceRevenueModule,
    MyResourceRevenueSourceModule,
    MyResourcesModule,
    MyTeamRevenueModule,
    MyTeamUtilizationModule,
    OrgProjRevenueModule,
    ProjectExpensesModule,
    ProjectPandlModule,
    ProjectPnlFiltertestModule,
    ProjectRevenueModule,
    ProjectRevenueDistributionModule,
    ProjectRevenueSqlModule,
    AnalyticsDashboardModule,
    SharedComponentsModule,
    DragDropModule,
    NgbModule,
    Ng5SliderModule,
    NgMultiSelectDropDownModule,
    ProjectsPandlDashboardModule,
    SalesDashboardModule
  ],
  entryComponents: [
    ReportsModalComponent
  ],
  providers: [
    ChartService,
    TransformDataService,
    UtilsService,
  ]
})
export class DashboardGridModule { }
