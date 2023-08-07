import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPlcustomerviewComponent } from './report-plcustomerview.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPlcustomerviewComponent, data: {
      title: 'Customer View'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPlcustomerviewRoutingModule { }
