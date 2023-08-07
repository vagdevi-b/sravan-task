import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsrEventDefinitionComponent } from '../isr-event-definition/isr-event-definition/isr-event-definition.component';
import { IsrRegistrationComponent } from '../isr-registration/isr-registration/isr-registration.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-isr-registration',
        component: IsrRegistrationComponent,
        data: {
          title: 'Create ISR Registration'
        }
      },
      {
        path: 'edit-isr-registration/:isUpdatable/:isrRegId',
        component: IsrRegistrationComponent,
        data: {
          title: 'Edit ISR Registration'
        }
      },
      {
        path: 'view-isr-registration/:isUpdatable/:isrRegId',
        component: IsrRegistrationComponent,
        data: {
          title: 'View ISR Registration'
        }
      },
      {
        path: 'create-isr-event-definition',
        component: IsrEventDefinitionComponent,
        data: {
          title: 'Create Event Definition'
        }
      },
      {
        path: 'edit-isr-event-definition/:isUpdatable/:eventDefId',
        component: IsrEventDefinitionComponent,
        data: {
          title: 'Edit Event Definition'
        }
      },
      {
        path: 'view-isr-event-definition/:isUpdatable/:eventDefId',
        component: IsrEventDefinitionComponent,
        data: {
          title: 'View Event Definition'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IsrRoutingModule { }
