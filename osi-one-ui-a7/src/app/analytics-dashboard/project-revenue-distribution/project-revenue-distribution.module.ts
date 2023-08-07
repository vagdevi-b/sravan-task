import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRevenueDistributionRoutingModule } from './project-revenue-distribution-routing.module';
import { ProjectRevenueDistributionComponent } from './project-revenue-distribution.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    ProjectRevenueDistributionComponent
  ],
  imports: [
    CommonModule,
    ProjectRevenueDistributionRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule

  ],
  exports: [
    ProjectRevenueDistributionComponent
  ]
})
export class ProjectRevenueDistributionModule { }
