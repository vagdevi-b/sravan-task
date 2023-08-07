import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmoTimesheetComponent } from './pmo-timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: PmoTimesheetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmoTimesheetRoutingModule { }
