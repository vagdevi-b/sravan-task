import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportFilterComponent } from './report-filter.component';

const routes: Routes = [
  {
    path: '', 
    component: ReportFilterComponent, data: {
      title: 'Report Filter Columns'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFilterRoutingModule { }
