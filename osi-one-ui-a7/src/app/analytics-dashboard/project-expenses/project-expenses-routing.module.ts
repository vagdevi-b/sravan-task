import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectExpensesComponent } from './project-expenses.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectExpensesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectExpensesRoutingModule { }
