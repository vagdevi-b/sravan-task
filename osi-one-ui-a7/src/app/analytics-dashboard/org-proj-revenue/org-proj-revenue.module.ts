import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgProjRevenueRoutingModule } from './org-proj-revenue-routing.module';
import { OrgProjRevenueComponent } from './org-proj-revenue.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    OrgProjRevenueComponent
  ],
  imports: [
    CommonModule,
    OrgProjRevenueRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    OrgProjRevenueComponent
  ]
})
export class OrgProjRevenueModule { }
