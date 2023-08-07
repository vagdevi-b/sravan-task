import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalDashboardRoutingModule } from './personal-dashboard-routing.module';
import { PersonalDashboardComponent } from './personal-dashboard.component';
import { TableWidgetComponent } from './table-widget/table-widget.component';
import { BaseWidgetComponent } from './base-widget/base-widget.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    PersonalDashboardComponent,
    TableWidgetComponent,
    BaseWidgetComponent
  ],
  imports: [
    CommonModule,
    PersonalDashboardRoutingModule,
    SharedComponentsModule
  ],
  entryComponents: [
    TableWidgetComponent
  ]
})
export class PersonalDashboardModule { }
