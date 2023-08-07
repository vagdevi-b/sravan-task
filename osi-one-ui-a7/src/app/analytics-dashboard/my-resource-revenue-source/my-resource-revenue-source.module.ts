import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyResourceRevenueSourceRoutingModule } from './my-resource-revenue-source-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { MyResourceRevenueSourceComponent } from './my-resource-revenue-source.component';

@NgModule({
  declarations: [
    MyResourceRevenueSourceComponent
  ],
  imports: [
    CommonModule,
    MyResourceRevenueSourceRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyResourceRevenueSourceComponent
  ]
})
export class MyResourceRevenueSourceModule { }
