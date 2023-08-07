import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { ProjectRevenueSqlRoutingModule } from './project-revenue-sql-routing.module';
import { ProjectRevenueSqlComponent } from './project-revenue-sql.component';

@NgModule({
  declarations: [
    ProjectRevenueSqlComponent
  ],
  imports: [
    CommonModule,
    ProjectRevenueSqlRoutingModule,
    NgMultiSelectDropDownModule,
    SharedComponentsModule
  ],
  exports: [
    ProjectRevenueSqlComponent
  ]
})
export class ProjectRevenueSqlModule { }
