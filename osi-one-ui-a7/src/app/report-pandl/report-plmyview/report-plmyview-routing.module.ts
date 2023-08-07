import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPlmyviewComponent } from './report-plmyview.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPlmyviewComponent,
    data: {
      title: "My viwe"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPlmyviewRoutingModule { }
