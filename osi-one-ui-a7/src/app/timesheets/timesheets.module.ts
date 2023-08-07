import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetsRoutingModule } from './timesheets-routing.module';
import { TimesheetMoveComponent } from './timesheet-move/timesheet-move.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    TimesheetMoveComponent
  ],
  imports: [
    CommonModule,
    TimesheetsRoutingModule,
    SharedComponentsModule
  ]
})
export class TimesheetsModule { }
