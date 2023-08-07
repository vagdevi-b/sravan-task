import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyResourceRevenueSourceComponent } from './my-resource-revenue-source.component';

const routes: Routes = [
  {
    path: '',
    component: MyResourceRevenueSourceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyResourceRevenueSourceRoutingModule { }
