import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectPandlRoutingModule } from './project-pandl-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { ProjectPandlComponent } from './project-pandl.component';

@NgModule({
  declarations: [
    ProjectPandlComponent
  ],
  imports: [
    CommonModule,
    ProjectPandlRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    ProjectPandlComponent
  ]
})
export class ProjectPandlModule { }
