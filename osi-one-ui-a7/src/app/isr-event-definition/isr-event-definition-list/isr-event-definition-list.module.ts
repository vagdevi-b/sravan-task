import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsrEventDefinitionListRoutingModule } from './isr-event-definition-list-routing.module';
import { IsrEventDefinitionListComponent } from './isr-event-definition-list.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    IsrEventDefinitionListComponent
  ],
  imports: [
    CommonModule,
    IsrEventDefinitionListRoutingModule,
    SharedComponentsModule
  ]
})
export class IsrEventDefinitionListModule { }
