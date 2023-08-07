import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestlistComponent } from './requestlist/requestlist.component';
import { ViewRequestComponent } from './view-request/view-request.component';

const routes: Routes = [
  {path:'',component:RequestlistComponent},
  {path:'viewrequest',component:ViewRequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule { }
