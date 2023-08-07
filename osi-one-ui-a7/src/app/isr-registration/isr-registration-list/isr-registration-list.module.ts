import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsrRegistrationListRoutingModule } from './isr-registration-list-routing.module';
import { IsrRegistrationListComponent } from './isr-registration-list.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    IsrRegistrationListComponent
  ],
  imports: [
    CommonModule,
    IsrRegistrationListRoutingModule,
    SharedComponentsModule
  ]
})
export class IsrRegistrationListModule { }
