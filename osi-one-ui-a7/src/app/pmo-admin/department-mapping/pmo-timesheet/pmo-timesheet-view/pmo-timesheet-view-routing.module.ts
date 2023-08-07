import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmoTimesheetViewComponent } from './pmo-timesheet-view.component';

const routes: Routes = [
  {
    path: '',
    component: PmoTimesheetViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmoTimesheetViewRoutingModule { }
