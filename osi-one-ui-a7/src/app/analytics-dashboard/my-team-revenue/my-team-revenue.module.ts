import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamRevenueRoutingModule } from './my-team-revenue-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { MyTeamRevenueComponent } from './my-team-revenue.component';

@NgModule({
  declarations: [
    MyTeamRevenueComponent
  ],
  imports: [
    CommonModule,
    MyTeamRevenueRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyTeamRevenueComponent
  ]
})
export class MyTeamRevenueModule { }
