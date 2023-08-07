import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyFutureRevenueRoutingModule } from './my-future-revenue-routing.module';
import { MyFutureRevenueComponent } from './my-future-revenue.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyFutureRevenueComponent
  ],
  imports: [
    CommonModule,
    MyFutureRevenueRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyFutureRevenueComponent
  ]
})
export class MyFutureRevenueModule { }
