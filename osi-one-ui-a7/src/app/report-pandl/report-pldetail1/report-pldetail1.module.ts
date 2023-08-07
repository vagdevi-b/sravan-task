import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { PandlSharedModule } from '../pandl-shared/pandl-shared.module';
import { ReportPldetail1Component } from './report-pldetail1.component';
import { ReportPldetail1RoutingModule } from './report-pldetail1-routing.module';

@NgModule({
    declarations: [
        ReportPldetail1Component
    ],
    imports: [
        CommonModule,
        ReportPldetail1RoutingModule,
        SharedComponentsModule,
        PandlSharedModule
    ]
})
export class ReportPldetail1Module { }
