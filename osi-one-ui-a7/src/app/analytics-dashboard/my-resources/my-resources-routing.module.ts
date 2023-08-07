import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyResourcesComponent } from './my-resources.component';

const routes: Routes = [
  {
    path: '',
    component: MyResourcesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyResourcesRoutingModule { }
