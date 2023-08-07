import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportSavedComponent } from './report-saved.component';

const routes: Routes = [
  {
    path: '',
    component: ReportSavedComponent, data: {
      title: 'Saved Reports'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportSavedRoutingModule { }
