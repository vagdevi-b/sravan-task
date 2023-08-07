import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyResourcesRoutingModule } from './my-resources-routing.module';
import { MyResourcesComponent } from './my-resources.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyResourcesComponent
  ],
  imports: [
    CommonModule,
    MyResourcesRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    MyResourcesComponent
  ]
})
export class MyResourcesModule { }
