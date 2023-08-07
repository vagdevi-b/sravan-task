import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddprofileComponent } from './addprofile/addprofile.component';
import { ProfilelistComponent } from './profilelist/profilelist.component';

const routes: Routes = [
  {path:'',component:ProfilelistComponent},
  {path:'addprofile' ,component:AddprofileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
