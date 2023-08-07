
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeavesComponent } from './leaves.component';


import { EditleaveComponent } from './approve-leave/editleave/editleave.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AppliedleavesComponent } from './approve-leave/appliedleaves/appliedleaves.component';
import { ViewLeavesComponent } from './viewleaves/viewleaves.component';
import { LeaverequestComponent } from './viewleaves/leaverequest/leaverequest.component';
import { EditleaverequestComponent } from './viewleaves/editleaverequest/editleaverequest.component';
import { EditLeaveAccuralsComponent } from './editLeaveAccruals/edit-LeaveAccruals';
import { ShowLeaveAccuralsComponent } from './editLeaveAccruals/showLeaveAccrual/show-LeaveAccruals';
import { LeaveAccuralsComponent } from './leaveaccurals/leaveaccurals.component';
import { ViewLeaveAccuralsComponent } from './viewleaveaccurals/viewleaveaccurals.component';
import { LeavehistoryComponent } from './viewleaves/leavehistory/leavehistory.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: "approve-leave",
                component: ApproveLeaveComponent,
                data: {
                    title: "Approve Leave"
                }
            },
            {
                path: "approve-leave/appliedleaves/:id",
                component: AppliedleavesComponent,
                data: {
                    title: "Approve Leave"
                }
            },
            {
                path: "approve-leave/editleave/:leaveId",
                component: EditleaveComponent,
                data: {
                    title: "Approve Leave Edit"
                }
            },
            {
                path: "viewleaves",
                component: ViewLeavesComponent,
                data: {
                    title: "View Leaves"
                }
            },
            {
                path: "leaverequest",
                component: LeaverequestComponent,
                data: {
                    title: "Leave Request"
                }
            },
            {
                path: "leavehistory",
                component: LeavehistoryComponent,
                data: {
                    title: "Leave History"
                }
            },


            {
                path: "viewleaves/editleaverequest/:leaveId",
                component: EditleaverequestComponent,
                data: {
                    title: "Edit Leave"
                }
            },

            {
                path: "editLeaveAccruals/:id",
                component: EditLeaveAccuralsComponent,
                data: {
                    title: "Edit Leave Accrual"
                }
            },

            {
                path: "showLeaveAccruals/:id",
                component: ShowLeaveAccuralsComponent,
                data: {
                    title: "Edit Leave Accrual"
                }
            },
            {
                path: "leaveaccurals",
                component: LeaveAccuralsComponent,
                data: {
                    title: "Leave Accurals"
                }
            },

            {
                path: "viewleaveaccurals",
                component: ViewLeaveAccuralsComponent,
                data: {
                    title: "View Leave Accural"
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeavesRoutingModule {
}