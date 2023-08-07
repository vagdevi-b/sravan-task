import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectRevenueSqlComponent } from './project-revenue-sql.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectRevenueSqlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRevenueSqlRoutingModule { }
