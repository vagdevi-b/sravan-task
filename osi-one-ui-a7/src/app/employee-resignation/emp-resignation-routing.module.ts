import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpResignationListComponent } from './emp-resignation-list/emp-resignation-list.component';
import { ResignationAcceptComponent } from './resignation-parent-components/resignation-accept/resignation-accept.component';
import { ResignationExitComponent } from './resignation-parent-components/resignation-exit/resignation-exit.component';
import { ResignationHrComponent } from './resignation-parent-components/resignation-hr/resignation-hr.component';
import { ResignationPdComponent } from './resignation-parent-components/resignation-pd/resignation-pd.component';
import { ResignationRetainComponent } from './resignation-parent-components/resignation-retain/resignation-retain.component';
import { ResignationRmComponent } from './resignation-parent-components/resignation-rm/resignation-rm.component';

const routes: Routes = [
    {
        path: 'exit',
        component: ResignationExitComponent
    },
    {
        path: 'list',
        component: EmpResignationListComponent
    },
    {
        path: 'rm',
        component: ResignationRmComponent
    },
    {
        path: 'accept',
        component: ResignationAcceptComponent
    },
    {
        path: 'retain',
        component: ResignationRetainComponent
    },
    {
        path: 'hr',
        component: ResignationHrComponent
    },
    {
        path: 'pd',
        component: ResignationPdComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpResignationRoutingModule { }
