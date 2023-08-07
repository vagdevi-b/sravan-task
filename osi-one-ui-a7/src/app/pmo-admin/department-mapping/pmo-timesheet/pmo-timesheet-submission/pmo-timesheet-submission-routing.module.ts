import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmoTimesheetSubmissionComponent } from './pmo-timesheet-submission.component';

const routes: Routes = [
  {
    path: '',
    component: PmoTimesheetSubmissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmoTimesheetSubmissionRoutingModule { }
