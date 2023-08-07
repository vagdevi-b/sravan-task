import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmoTimesheetSubmissionRoutingModule } from './pmo-timesheet-submission-routing.module';
import { SharedComponentsModule } from '../../../../shared/component/shared-components/shared-components.module';
import { PmoTimesheetSubmissionComponent } from './pmo-timesheet-submission.component';

@NgModule({
  declarations: [
    PmoTimesheetSubmissionComponent
  ],
  imports: [
    CommonModule,
    PmoTimesheetSubmissionRoutingModule,
    SharedComponentsModule
  ]
})
export class PmoTimesheetSubmissionModule { }
