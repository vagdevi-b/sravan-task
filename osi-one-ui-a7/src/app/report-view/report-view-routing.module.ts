import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportViewComponent } from './report-view.component';

const routes: Routes = [
  {
    path: '', component: ReportViewComponent, data: {
      title: 'View Report'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportViewRoutingModule { }
