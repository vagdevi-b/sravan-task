import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";

import { SidebarComponent } from "./page-layout/sidebar/sidebar.component";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { PandlPaymentsummaryModule } from "./report-pandl/pandl-paymentsummary/pandl-paymentsummary.module";

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'sales-dashboard',
    loadChildren: './show-record/show-record.module#ShowRecordModule'
  },

  {
    path: 'rm-dashboard',
    loadChildren: './resource-utilisation/resource-utilisation.module#ResourceUtilisationModule'
  },
  {
    path: 'rm-dashboard-ru',
    loadChildren: './resource-utilisation/rm-dashboard/rm-dashboard.module#RmDashboardModule'
  },
  {
    path: 'rm-dashboard-pnl',
    loadChildren: './resource-utilisation/rm-dashboard-pnl/rm-dashboard-pnl.module#RmDashboardPnlModule'
  },
  {
    path: 'pm-dashboard',
    loadChildren: './project-dashboard/project-dashboard.module#ProjectDashboardModule'
  },

  {
    path: 'analyticsdashboard',
    loadChildren: './dashboard-grid/dashboard-grid.module#DashboardGridModule'
  },

  {
    path: 'accounts-dashboard',
    loadChildren: './account-manager/account-manager.module#AccountManagerModule'
  },
  { path: 'pmoTimeSheetEntry', loadChildren: './pmo-admin/department-mapping/pmo-timesheet/pmo-timesheet.module#PmoTimesheetModule' },
  { path: 'pmotimesheetsubmission', loadChildren: './pmo-admin/department-mapping/pmo-timesheet/pmo-timesheet-submission/pmo-timesheet-submission.module#PmoTimesheetSubmissionModule' },
  { path: 'pmotimesheetview', loadChildren: './pmo-admin/department-mapping/pmo-timesheet/pmo-timesheet-view/pmo-timesheet-view.module#PmoTimesheetViewModule' },
  { path: 'pmotimesheethistory', loadChildren: './pmo-admin/department-mapping/pmo-timesheet/pmo-timesheet-history/pmo-timesheet-history.module#PmoTimesheetHistoryModule' },
  // { path: 'analyticsdashboard', component: AnalyticsDashboardComponent },
  {
    path: 'personaldashboard',
    loadChildren: './personal-dashboard/personal-dashboard.module#PersonalDashboardModule'
  },

  { path: 'sales', loadChildren: './sales-dashboard/sales-dashboard.module#SalesDashboardModule' },


  { path: 'myTeamUtilization', loadChildren: './analytics-dashboard/my-team-utilization/my-team-utilization.module#MyTeamUtilizationModule' },


  { path: 'myteamrevenue', loadChildren: './analytics-dashboard/my-team-revenue/my-team-revenue.module#MyTeamRevenueModule' },


  { path: 'projectRevenue', loadChildren: './analytics-dashboard/project-revenue/project-revenue.module#ProjectRevenueModule' },


  { path: 'projectpandl', loadChildren: './analytics-dashboard/project-pandl/project-pandl.module#ProjectPandlModule' },


  { path: 'filterprojectpandl', loadChildren: './analytics-dashboard/project-pnl-filtertest/project-pnl-filtertest.module#ProjectPnlFiltertestModule' },


  { path: 'orgprojrevenue', loadChildren: './analytics-dashboard/org-proj-revenue/org-proj-revenue.module#OrgProjRevenueModule' },

  { path: 'myinvoices', loadChildren: './analytics-dashboard/my-invoices/my-invoices.module#MyInvoicesModule' },


  { path: 'myresources', loadChildren: './analytics-dashboard/my-resources/my-resources.module#MyResourcesModule' },


  { path: 'projectRevenueSQL', loadChildren: './analytics-dashboard/project-revenue-sql/project-revenue-sql.module#ProjectRevenueSqlModule' },


  { path: 'my-resource-revenue-source', loadChildren: './analytics-dashboard/my-resource-revenue-source/my-resource-revenue-source.module#MyResourceRevenueSourceModule' },


  { path: 'project-revenue-distribution', loadChildren: './analytics-dashboard/project-revenue-distribution/project-revenue-distribution.module#ProjectRevenueDistributionModule' },

  { path: 'my-resource-revenue', loadChildren: './analytics-dashboard/my-resource-revenue/my-resource-revenue.module#MyResourceRevenueModule' },


  {
    path: 'hoursByProject',
    loadChildren: './analytics-dashboard/hours-by-project/hours-by-project.module#HoursByProjectModule'
  },


  {
    path: 'myFutureRevenue',
    loadChildren: './analytics-dashboard/my-future-revenue/my-future-revenue.module#MyFutureRevenueModule'
  },

  {
    path: 'invoice-update-softex',
    loadChildren: './invoices/invoice-softex-number/invoice-softex-number.module#InvoiceSoftexNumberModule'
  },

  { path: 'my-resource-expenses', loadChildren: './analytics-dashboard/my-resource-expenses/my-resource-expenses.module#MyResourceExpensesModule' },


  { path: 'project-expenses', loadChildren: './analytics-dashboard/project-expenses/project-expenses.module#ProjectExpensesModule' },
  { path: 'pandldata', loadChildren: './report-pandl/report-pldata/report-pldata.module#ReportPldataModule' },
  { path: 'pandldetail', loadChildren: './report-pandl/report-pldetail/report-pldetail.module#ReportPldetailModule' },
  { path: 'pandldetail1', loadChildren: './report-pandl/report-pldetail1/report-pldetail1.module#ReportPldetail1Module' },
  { path: 'pandldetail2', loadChildren: './report-pandl/report-pldetail2/report-pldetail2.module#ReportPldetail2Module' },
  {
    path: 'pandlproject',
    loadChildren: './report-pandl/report-plproject/report-plproject.module#ReportPlprojectModule',
  },
  {
    path: 'pandlutilization',
    loadChildren: './report-pandl/report-plutilization/report-plutilization.module#ReportPlutilizationModule',
  },
  {
    path: 'pandlemployee',
    loadChildren: './report-pandl/report-plemployee/report-plemployee.module#ReportPlemployeeModule'
  },
  {
    path: 'paymentsummary',
    loadChildren: './report-pandl/pandl-paymentsummary/pandl-paymentsummary.module#PandlPaymentsummaryModule'
  },
  //{ path: 'irecruit',  loadChildren: () => import('../app/i-recruit/i-recruit.module').then(m => m.IRecruitModule)},
  // {path: 'irecruit',loadChildren:'./i-recruit/i-recruit.module#IRecruitModule'},
  {
    path: 'irecruit/requests',
    loadChildren: './i-recruit/requests/requests.module#RequestsModule'
  },
  {
    path: 'irecruit/dashboard',
    loadChildren: './i-recruit/requests/requests.module#RequestsModule'
  },
  // {path:'irecruit/dashboard',loadChildren:'./i-recruit/dashboard/dashboard.module#DashboardModule'},
  //{path:'dashboard',loadChildren:'./dashboard/dashboard.module#DashboardModule'},
  {
    path: 'irecruit/evaluation',
    loadChildren: './i-recruit/evaluation/evaluation.module#EvaluationModule'
  },
  {
    path: 'irecruit/candidates',
    loadChildren: './i-recruit/profile/profile.module#ProfileModule'
  },
  {
    path: 'irecruit/schedule',
    loadChildren: './i-recruit/scheduled/scheduled.module#ScheduledModule'
  },
  {
    path: 'expenses',
    loadChildren: './expenses/expenses.module#ExpensesModule'
  },

  {
    path: 'leaves',
    loadChildren: './leaves/leaves.module#LeavesModule'
  },
  {
    path: "holidays",
    loadChildren: './leaves/holidays/holidays.module#HolidaysModule'
  },
  {
    path: 'invoice',
    loadChildren: './invoices/invoices.module#InvoicesModule'
  },
  {
    path: 'reports/allReports',
    loadChildren: './report/report.module#ReportModule'
  },
  {
    path: 'reports/runReports',
    loadChildren: './report/report.module#ReportModule'
  },
  {
    path: 'reports/savedReports',
    loadChildren: './report-saved/report-saved.module#ReportSavedModule',
  },
  {
    path: "deptmapping",
    loadChildren: './pmo-admin/department-mapping/department-mapping.module#DepartmentMappingModule'
  },
  {
    path: "myview",
    loadChildren: './report-pandl/report-plmyview/report-plmyview.module#ReportPlmyviewModule'
  }
  , {
    path: 'reports/columns',
    loadChildren: './report-filter/report-filter.module#ReportFilterModule',
  },

  {
    path: 'reports/PAndL',
    loadChildren: './report-pandl/report-pandl.module#ReportPandlModule'

  },
  {
    path: 'pandlcustomerview',
    loadChildren: './report-pandl/report-plcustomerview/report-plcustomerview.module#ReportPlcustomerviewModule'
  },
  {
    path: 'reports/viewReport',
    loadChildren: './report-view/report-view.module#ReportViewModule'
  },
  {
    path: "pmo-verifications",
    loadChildren: './pmo-verifications/pmo-verifications.module#PmoVerificationsModule',
  },
  {
    path: "timesheets",
    loadChildren: './timesheets/timesheets.module#TimesheetsModule'
  },
  {
    path: 'reviewcycle',
    loadChildren: './appraisal-cycle/appraisal-cycle.module#AppraisalCycleModule'
  },
  {
    path: 'projects',
    loadChildren: './projects/projects.module#ProjectsModule'
  },
  {
    path: 'build-history',
    loadChildren: './build-history/build-history.module#BuildHistoryModule'
  },
  {
    path: 'isr-registrations',
    loadChildren: './isr-registration/isr-registration-list/isr-registration-list.module#IsrRegistrationListModule'
  },
  {
    path: 'isr',
    loadChildren: './isr/isr.module#IsrModule'
  },
  {
    path: 'isr-event-definitions',
    loadChildren: './isr-event-definition/isr-event-definition-list/isr-event-definition-list.module#IsrEventDefinitionListModule'
  },
  {
    path: 'isr-event-report',
    loadChildren: './isr-event-report/isr-event-report.module#IsrEventReportModule'
  },
  {
    path: 'estimations',
    loadChildren: './project-estimations/project-estimations.module#ProjectEstimationsModule'
  },
  {
    path: 'resignation',
    loadChildren: './employee-resignation/emp-resignation.module#EmpResignationModule'
  },
  {
    path: "logout", component: SidebarComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forRoot(routes, { useHash: true })],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
