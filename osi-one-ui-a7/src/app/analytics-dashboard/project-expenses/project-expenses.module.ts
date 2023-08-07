import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectExpensesRoutingModule } from './project-expenses-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { ProjectExpensesComponent } from './project-expenses.component';

@NgModule({
  declarations: [
    ProjectExpensesComponent
  ],
  imports: [
    CommonModule,
    ProjectExpensesRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    ProjectExpensesComponent
  ]
})
export class ProjectExpensesModule { }
