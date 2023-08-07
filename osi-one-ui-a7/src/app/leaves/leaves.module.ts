
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BsDatepickerModule, ModalModule } from "ngx-bootstrap";
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { LeavesComponent } from './leaves.component';

import { EditleaveComponent } from './approve-leave/editleave/editleave.component';
import { ApproveLeaveService } from '../shared/services/approveleave.service';
import { EmployeeLeaveService } from '../shared/services/employeeleave.service';
import { EditLeaveService } from '../shared/services/editleave.service';
import { LeaverequestComponent } from './viewleaves/leaverequest/leaverequest.component';
import { EditleaverequestComponent } from './viewleaves/editleaverequest/editleaverequest.component';
import { LeavesRoutingModule } from './leaves-routing.module';
import { ViewLeavesComponent } from './viewleaves/viewleaves.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';

import { CreateHolidayService } from './../shared/services/createHoliday.service';
import { LeaveRequestService } from './../shared/services/leaveRequest.service';
import { AppliedleavesComponent } from './approve-leave/appliedleaves/appliedleaves.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { EditLeaveAccuralsComponent } from './editLeaveAccruals/edit-LeaveAccruals';
import { ShowLeaveAccuralsComponent } from './editLeaveAccruals/showLeaveAccrual/show-LeaveAccruals';
import { LeaveAccuralsComponent } from './leaveaccurals/leaveaccurals.component';
import { ViewLeaveAccuralsComponent } from './viewleaveaccurals/viewleaveaccurals.component';
import { LeavehistoryComponent } from './viewleaves/leavehistory/leavehistory.component';
import { CancelLeaveService } from '../shared/services/cancelLeave.service';
import { LeavesService } from '../shared/services/leaves.service';
import { AccuralRuleService } from '../shared/services/accuralRule.service';

@NgModule({
    declarations: [
        LeavesComponent,
        ApproveLeaveComponent,
        LeavesComponent,
        LeaverequestComponent,
        AppliedleavesComponent,
        EditleaveComponent,
        ViewLeavesComponent,
        EditleaverequestComponent,
        LeavehistoryComponent,
        EditLeaveAccuralsComponent,
        ShowLeaveAccuralsComponent,
        LeaveAccuralsComponent,
        ViewLeaveAccuralsComponent

    ],
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        NgxPaginationModule,
        HttpClientModule,
        ModalModule.forRoot(),
        LeavesRoutingModule,
        SharedComponentsModule,
        SharedComponentsModule,
        BsDatepickerModule.forRoot()
    ],
    providers: [
        LeaveRequestService,
        CreateHolidayService,
        ApproveLeaveService,
        EmployeeLeaveService,
        EditLeaveService,
        CancelLeaveService,
        LeavesService,
        AccuralRuleService,
        ViewLeavesComponent
    ]
})
export class LeavesModule { }
