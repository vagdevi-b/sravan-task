import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectPnlFiltertestRoutingModule } from './project-pnl-filtertest-routing.module';
import { ProjectPnlFiltertestComponent } from './project-pnl-filtertest.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ProjectPnlFiltertestComponent
  ],
  imports: [
    CommonModule,
    ProjectPnlFiltertestRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    ProjectPnlFiltertestComponent
  ]
})
export class ProjectPnlFiltertestModule { }
