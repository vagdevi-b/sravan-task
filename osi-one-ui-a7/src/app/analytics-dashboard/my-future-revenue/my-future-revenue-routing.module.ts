import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyFutureRevenueComponent } from './my-future-revenue.component';

const routes: Routes = [
  {
    path: '',
    component: MyFutureRevenueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyFutureRevenueRoutingModule { }
