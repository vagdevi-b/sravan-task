import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenModule } from '../full-screen/full-screen.module';
import { FiltersComponent } from '../filters/filters.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { DataTablesModule } from 'angular-datatables';
import { QuickBoardComponent } from '../quick-board/quick-board.component';
import { PandlNavBarComponent } from '../pandl-nav-bar/pandl-nav-bar.component';
import {     SummaryQuickBoardComponent} from '../summary-quick-board/summary-quick-board.component';
import { ReportEmployeeTableComponent } from '../report-plemployee/report-employee-table/report-employee-table.component';

@NgModule({
  declarations: [
    FiltersComponent,
    QuickBoardComponent,
    SummaryQuickBoardComponent,
    ReportEmployeeTableComponent,
    PandlNavBarComponent
  ],
  imports: [
    CommonModule,
    FullScreenModule,
    SharedComponentsModule,
    DataTablesModule
  ],
  exports: [
    FullScreenModule,
    FiltersComponent,
    SharedComponentsModule,
    ReportEmployeeTableComponent,
    DataTablesModule,
    QuickBoardComponent,
    SummaryQuickBoardComponent,

    PandlNavBarComponent
  ]
})
export class PandlSharedModule { }
