import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyResourceExpensesRoutingModule } from './my-resource-expenses-routing.module';
import { MyResourceExpensesComponent } from './my-resource-expenses.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../..//shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyResourceExpensesComponent
  ],
  imports: [
    CommonModule,
    MyResourceExpensesRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyResourceExpensesComponent
  ]
})
export class MyResourceExpensesModule { }
