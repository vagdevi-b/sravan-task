import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmoTimesheetHistoryComponent } from './pmo-timesheet-history.component';

const routes: Routes = [
  {
    path: '',
    component: PmoTimesheetHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmoTimesheetHistoryRoutingModule { }
