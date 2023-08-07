import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoursByProjectRoutingModule } from './hours-by-project-routing.module';
import { HoursByProjectComponent } from './hours-by-project.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    HoursByProjectComponent
  ],
  imports: [
    CommonModule,
    HoursByProjectRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    HoursByProjectComponent
  ]
})
export class HoursByProjectModule { }
