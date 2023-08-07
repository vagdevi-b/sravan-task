import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPldetail2Component } from './report-pldetail2.component';

const routes: Routes = [
    {
        path: '',
        component: ReportPldetail2Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportPldetail2RoutingModule { }
