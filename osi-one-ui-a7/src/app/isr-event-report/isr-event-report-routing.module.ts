import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsrEventReportComponent } from './isr-event-report.component';

const routes: Routes = [
  {
    path: '',
    component: IsrEventReportComponent,
    data: {
      title: 'Isr Event Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IsrEventReportRoutingModule { }
