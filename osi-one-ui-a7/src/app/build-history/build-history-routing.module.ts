import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildHistoryComponent } from './build-history.component';
import { NewBuildComponent } from './new-build/new-build.component';

const routes: Routes = [
  {
    path: '',
    component: BuildHistoryComponent,
    data: {
      title: 'Build History'
    }
  },
  {
    path: 'new-build',
    component: NewBuildComponent,
    data: {
      title: 'Create Build'
    }
  },
  {
    path: 'edit-build/:buildId',
    component: NewBuildComponent,
    data: {
      title: 'Edit Build'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildHistoryRoutingModule { }
