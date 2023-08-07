import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentMappingComponent } from './department-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentMappingComponent,
    data: {
      title: "Department Mapping"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentMappingRoutingModule { }
