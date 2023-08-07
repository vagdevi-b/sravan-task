import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmoTimesheetViewRoutingModule } from './pmo-timesheet-view-routing.module';
import { SharedComponentsModule } from '../../../../shared/component/shared-components/shared-components.module';
import { PmoTimesheetViewComponent } from './pmo-timesheet-view.component';
import { PmoTimesheetSharedModule } from '../../pmo-timesheet-shared/pmo-timesheet-shared.module';

@NgModule({
  declarations: [
    PmoTimesheetViewComponent
  ],
  imports: [
    CommonModule,
    PmoTimesheetViewRoutingModule,
    SharedComponentsModule,
    PmoTimesheetSharedModule
  ]
})
export class PmoTimesheetViewModule { }
