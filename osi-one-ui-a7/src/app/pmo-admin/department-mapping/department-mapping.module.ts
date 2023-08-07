import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentMappingRoutingModule } from './department-mapping-routing.module';
import { DepartmentMappingComponent } from './department-mapping.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    DepartmentMappingComponent
  ],
  imports: [
    CommonModule,
    DepartmentMappingRoutingModule,
    SharedComponentsModule
  ]
})
export class DepartmentMappingModule { }
