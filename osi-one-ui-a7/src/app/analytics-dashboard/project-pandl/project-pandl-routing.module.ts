import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectPandlComponent } from './project-pandl.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectPandlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectPandlRoutingModule { }
