import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRevenueRoutingModule } from './project-revenue-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { ProjectRevenueComponent } from './project-revenue.component';
import { ChartComponent } from './chart/chart.component';
import { ChartSelectComponent } from './chart-select/chart-select.component';

@NgModule({
  declarations: [
    ProjectRevenueComponent,
    ChartComponent,
    ChartSelectComponent
  ],
  imports: [
    CommonModule,
    ProjectRevenueRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    ProjectRevenueComponent,
    ChartComponent,
    ChartSelectComponent
  ]
})
export class ProjectRevenueModule { }
