import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetMoveComponent } from './timesheet-move/timesheet-move.component';

const routes: Routes = [
  {
    path: "timesheetMove",
    component: TimesheetMoveComponent,
    data: {
      title: "Move Timesheets"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetsRoutingModule { }
