import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetStatusPipe } from '../../../shared/pipes/timesheet-status.pipe';

@NgModule({
  declarations: [
    TimesheetStatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimesheetStatusPipe
  ]
})
export class PmoTimesheetSharedModule { }
