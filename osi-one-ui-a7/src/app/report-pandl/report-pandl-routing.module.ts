import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPandlComponent } from './report-pandl.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPandlComponent,
    data: {
      title: 'P And L Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPandlRoutingModule { }
