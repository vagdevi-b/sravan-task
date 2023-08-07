import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsrEventDefinitionListComponent } from './isr-event-definition-list.component';

const routes: Routes = [
  {
    path: '',
    component: IsrEventDefinitionListComponent,
    data: {
      title: 'Event Definitions List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IsrEventDefinitionListRoutingModule { }
