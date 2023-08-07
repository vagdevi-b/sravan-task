import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmoTimesheetRoutingModule } from './pmo-timesheet-routing.module';
import { SharedComponentsModule } from '../../../shared/component/shared-components/shared-components.module';
import { PmoTimesheetComponent } from './pmo-timesheet.component';
import { PmoTimesheetSharedModule } from '../pmo-timesheet-shared/pmo-timesheet-shared.module';
import { LeaveRequestService } from '../../../shared/services/leaveRequest.service';

@NgModule({
  declarations: [
    PmoTimesheetComponent
  ],
  imports: [
    CommonModule,
    PmoTimesheetRoutingModule,
    SharedComponentsModule,
    PmoTimesheetSharedModule
  ],
  providers: [
    LeaveRequestService
  ]
})
export class PmoTimesheetModule { }
