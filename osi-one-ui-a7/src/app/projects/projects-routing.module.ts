import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmActivitiesComponent } from './pm-activities/pm-activities.component';

const routes: Routes = [
  {
    path: "addactivities",
    component: PmActivitiesComponent,
    data: {
      title: "Project Manager Activities"
    }
  },
  {
    path: "addactivities/:projectId/:projectStartDate",
    component: PmActivitiesComponent,
    data: {
      title: "Project Manager Activities",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
