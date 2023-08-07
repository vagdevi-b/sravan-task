import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyResourceRevenueRoutingModule } from './my-resource-revenue-routing.module';
import { MyResourceRevenueComponent } from './my-resource-revenue.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyResourceRevenueComponent
  ],
  imports: [
    CommonModule,
    MyResourceRevenueRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyResourceRevenueComponent
  ]
})
export class MyResourceRevenueModule { }
