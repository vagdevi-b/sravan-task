import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowRecordComponent } from './show-record.component';

const routes: Routes = [
  {
    path: '',
    component: ShowRecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowRecordRoutingModule { }
