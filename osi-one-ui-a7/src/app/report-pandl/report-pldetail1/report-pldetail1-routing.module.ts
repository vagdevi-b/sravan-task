import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPldetail1Component } from './report-pldetail1.component';

const routes: Routes = [
    {
        path: '',
        component: ReportPldetail1Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportPldetail1RoutingModule { }
