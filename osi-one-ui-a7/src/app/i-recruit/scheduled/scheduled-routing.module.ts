import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduledlistComponent } from './scheduledlist/scheduledlist.component';

const routes: Routes = [
  {
    path:'', component:ScheduledlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledRoutingModule { }
