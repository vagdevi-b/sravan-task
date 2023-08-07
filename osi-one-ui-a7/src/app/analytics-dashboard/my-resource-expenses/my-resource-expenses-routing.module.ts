import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyResourceExpensesComponent } from './my-resource-expenses.component';

const routes: Routes = [
  {
    path: '',
    component: MyResourceExpensesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyResourceExpensesRoutingModule { }
