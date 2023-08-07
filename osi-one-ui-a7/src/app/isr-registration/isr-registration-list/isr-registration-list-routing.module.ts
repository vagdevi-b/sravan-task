import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsrRegistrationListComponent } from './isr-registration-list.component';

const routes: Routes = [
  {
    path: '',
    component: IsrRegistrationListComponent,
    data: {
      title: 'Isr Registrations List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IsrRegistrationListRoutingModule { }
