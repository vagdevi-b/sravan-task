import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportSavedRoutingModule } from './report-saved-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { ReportSavedComponent } from './report-saved.component';
import { LeaveRequestService } from '../shared/services/leaveRequest.service';

@NgModule({
  declarations: [
    ReportSavedComponent
  ],
  imports: [
    CommonModule,
    ReportSavedRoutingModule,
    SharedComponentsModule
  ],
  providers: [
    LeaveRequestService
  ]
})
export class ReportSavedModule { }
