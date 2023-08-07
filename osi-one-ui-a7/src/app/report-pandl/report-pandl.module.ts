import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportPandlRoutingModule } from './report-pandl-routing.module';
import { ReportPandlComponent } from './report-pandl.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from './pandl-shared/pandl-shared.module';
import { QuickBoardComponent } from './quick-board/quick-board.component';
import { SummaryQuickBoardComponent } from './summary-quick-board/summary-quick-board.component';

@NgModule({
  declarations: [
    ReportPandlComponent,
    // SummaryQuickBoardComponent
  ],
  imports: [
    CommonModule,
    ReportPandlRoutingModule,
    SharedComponentsModule,
    PandlSharedModule
  ]
})
export class ReportPandlModule { }
