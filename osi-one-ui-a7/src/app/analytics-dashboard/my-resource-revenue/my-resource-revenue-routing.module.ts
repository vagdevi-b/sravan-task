import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyResourceRevenueComponent } from './my-resource-revenue.component';

const routes: Routes = [
  {
    path: '',
    component: MyResourceRevenueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyResourceRevenueRoutingModule { }
