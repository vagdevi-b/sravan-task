import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectPnlFiltertestComponent } from './project-pnl-filtertest.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectPnlFiltertestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectPnlFiltertestRoutingModule { }
