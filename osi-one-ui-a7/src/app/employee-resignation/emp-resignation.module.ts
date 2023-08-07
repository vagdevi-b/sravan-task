import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpResignationListComponent } from './emp-resignation-list/emp-resignation-list.component';
import { EmpResignationRoutingModule } from './emp-resignation-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { EmployeeResignationService } from '../shared/services/employee-resignation.service';
import { ResignationAcceptComponent } from './resignation-parent-components/resignation-accept/resignation-accept.component';
import { ResignationExitComponent } from './resignation-parent-components/resignation-exit/resignation-exit.component';
import { ResignationHrComponent } from './resignation-parent-components/resignation-hr/resignation-hr.component';
import { ResignationPdComponent } from './resignation-parent-components/resignation-pd/resignation-pd.component';
import { ResignationRetainComponent } from './resignation-parent-components/resignation-retain/resignation-retain.component';
import { ResignationRmComponent } from './resignation-parent-components/resignation-rm/resignation-rm.component';
import { AttachmentpopupComponent } from './resignation-child-components/attachmentpopup/attachmentpopup.component';
import { DiscussionComponent } from './resignation-child-components/discussion/discussion.component';
import { EmpDetailsComponent } from './resignation-child-components/emp-details/emp-details.component';
import { EmpResignationDetailsComponent } from './resignation-child-components/emp-resignation-details/emp-resignation-details.component';
import { NotepopupComponent } from './resignation-child-components/notepopup/notepopup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from '../shared/pipes/resignation-list-search.pipe';
import { AcceptresignationpopupComponent } from './resignation-child-components/acceptresignationpopup/acceptresignationpopup.component';
import { AttachmentrmComponent } from './resignation-child-components/attachmentrm/attachmentrm.component';
import { ConfirmationPopupComponent } from './resignation-child-components/confirmation-popup/confirmation-popup.component';
// import { EmpResignationComponent } from './emp-resignation/emp-resignation.component';
import { ResignationFilterComponent } from './resignation-child-components/resignation-filter/resignation-filter.component';
import { CancelRequestComponent } from './resignation-child-components/cancel-request/cancel-request.component';
import { EmpResignationBasicViewDetailsComponent } from './resignation-child-components/emp-resignation-basic-view-details/emp-resignation-basic-view-details.component';
import { RetainEmployeePopupComponent } from './resignation-child-components/retain-employee-popup/retain-employee-popup.component';


@NgModule({
  declarations: [EmpResignationListComponent, ResignationAcceptComponent,
    ResignationExitComponent, ResignationHrComponent, ResignationPdComponent,
    ResignationRetainComponent, ResignationRmComponent, EmpResignationDetailsComponent, EmpDetailsComponent,
    DiscussionComponent, NotepopupComponent, AttachmentpopupComponent,
    SearchPipe,
    AcceptresignationpopupComponent,
    AttachmentrmComponent,
    ConfirmationPopupComponent,
    ResignationFilterComponent,
    CancelRequestComponent,
    EmpResignationBasicViewDetailsComponent,
    RetainEmployeePopupComponent],
  imports: [
    CommonModule,
    EmpResignationRoutingModule,
    SharedComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [EmployeeResignationService],
  entryComponents: [NotepopupComponent, AttachmentpopupComponent, AcceptresignationpopupComponent, AttachmentrmComponent, ConfirmationPopupComponent, ResignationFilterComponent, CancelRequestComponent, EmpResignationBasicViewDetailsComponent, RetainEmployeePopupComponent]
})
export class EmpResignationModule { }
