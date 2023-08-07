import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamUtilizationRoutingModule } from './my-team-utilization-routing.module';
import { MyTeamUtilizationComponent } from './my-team-utilization.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyTeamUtilizationComponent
  ],
  imports: [
    CommonModule,
    MyTeamUtilizationRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyTeamUtilizationComponent
  ]
})
export class MyTeamUtilizationModule { }
