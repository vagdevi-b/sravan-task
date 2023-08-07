import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmoTimesheetHistoryRoutingModule } from './pmo-timesheet-history-routing.module';
import { PmoTimesheetHistoryComponent } from './pmo-timesheet-history.component';
import { SharedComponentsModule } from '../../../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    PmoTimesheetHistoryComponent
  ],
  imports: [
    CommonModule,
    PmoTimesheetHistoryRoutingModule,
    SharedComponentsModule
  ]
})
export class PmoTimesheetHistoryModule { }
