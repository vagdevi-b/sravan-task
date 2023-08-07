import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyInvoicesRoutingModule } from './my-invoices-routing.module';
import { MyInvoicesComponent } from './my-invoices.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyInvoicesComponent
  ],
  imports: [
    CommonModule,
    MyInvoicesRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyInvoicesComponent
  ]
})
export class MyInvoicesModule { }
