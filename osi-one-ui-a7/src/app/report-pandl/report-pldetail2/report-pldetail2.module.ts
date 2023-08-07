import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { ReportPldetail2Component } from './report-pldetail2.component';
import { ReportPldetail2RoutingModule } from './report-pldetail2-routing.module';

@NgModule({
    declarations: [
        ReportPldetail2Component
    ],
    imports: [
        CommonModule,
        ReportPldetail2RoutingModule,
        SharedComponentsModule,
        PandlSharedModule
    ]
})
export class ReportPldetail2Module { }
