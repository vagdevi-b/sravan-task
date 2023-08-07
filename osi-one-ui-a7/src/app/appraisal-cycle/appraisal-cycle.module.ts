import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppraisalCycleRoutingModule } from './appraisal-cycle-routing.module';
import { AppraisalListComponent } from './appraisal-list/appraisal-list.component';
import { InitiateReviewCycleComponent } from './initiate-review-cycle/initiate-review-cycle.component';
import { ViewReviewCycleComponent } from './view-review-cycle/view-review-cycle.component';
import { ShowHistoryComponentComponent } from './employee-goal-setting/show-history-component/show-history-component.component';
import { TalentMgmtAdminComponent } from './talent-mgmt-admin/talent-mgmt-admin.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { TeamGoalsComponent } from './team-goals/team-goals.component';
import { TeamGoalsListComponent } from './team-goals/team-goals-list/team-goals-list.component';
import { AppraisalInfoComponent } from './team-goals/appraisal-info/appraisal-info.component';
import { AddGoalComponent } from './employee-goal-setting/add-goal/add-goal.component';
import { ChangeTabsWeightageComponent } from './employee-goal-setting/change-tabs-weightage/change-tabs-weightage.component';
import { ConfirmationPopupComponent } from './employee-goal-setting/confirmation-popup/confirmation-popup.component';
import { DeclineCommentsComponent } from './employee-goal-setting/decline-comments/decline-comments.component';
import { EmployeeDevelopmentComponent } from './employee-goal-setting/employee-development/employee-development.component';
import { EmployeeGoalSettingComponent } from './employee-goal-setting/employee-goal-setting.component';
import { EmpsRatingComponent } from './employee-goal-setting/goal-setting-header/emps-rating/emps-rating.component';
import { GoalSettingHeaderComponent } from './employee-goal-setting/goal-setting-header/goal-setting-header.component';
import { LoadTemplateComponent } from './employee-goal-setting/load-template/load-template.component';
import { OrganizationalComponent } from './employee-goal-setting/organizational/organizational.component';
import { ProjectResourceRmChangeComponent } from './employee-goal-setting/project-resource-rm-change/project-resource-rm-change.component';
import { ProjectWeightageComponent } from './employee-goal-setting/project-weightage/project-weightage.component';
import { ProjectsComponent } from './employee-goal-setting/projects/projects.component';
import { UpdateKpaInfoComponent } from './employee-goal-setting/update-kpa-info/update-kpa-info.component';
import { MyGoalsEmpdevelopmentComponent } from './my-goals-empdevelopment/my-goals-empdevelopment.component';
import { GoalSettingNavbarComponent } from './employee-goal-setting/goal-setting-navbar/goal-setting-navbar.component';
import { TalentMgmtService } from '../shared/services/talent-mgmt.service';

@NgModule({
  declarations: [
    AppraisalListComponent,
    InitiateReviewCycleComponent,
    ViewReviewCycleComponent,
    ShowHistoryComponentComponent,
    TalentMgmtAdminComponent,
    TeamGoalsComponent,
    TeamGoalsListComponent,
    AppraisalInfoComponent,
    EmployeeGoalSettingComponent,
    EmployeeDevelopmentComponent,
    OrganizationalComponent,
    ProjectsComponent,
    MyGoalsEmpdevelopmentComponent,
    UpdateKpaInfoComponent,
    ProjectWeightageComponent,
    ProjectResourceRmChangeComponent,
    LoadTemplateComponent,
    GoalSettingHeaderComponent,
    DeclineCommentsComponent,
    ConfirmationPopupComponent,
    ChangeTabsWeightageComponent,
    AddGoalComponent,
    EmpsRatingComponent,
    GoalSettingNavbarComponent
  ],
  imports: [
    CommonModule,
    AppraisalCycleRoutingModule,
    SharedComponentsModule
  ],
  entryComponents: [
    ShowHistoryComponentComponent,
    MyGoalsEmpdevelopmentComponent,
    UpdateKpaInfoComponent,
    ProjectWeightageComponent,
    ProjectResourceRmChangeComponent,
    LoadTemplateComponent,
    DeclineCommentsComponent,
    ConfirmationPopupComponent,
    ChangeTabsWeightageComponent,
    AddGoalComponent,
    EmpsRatingComponent
  ],
  providers: [
    TalentMgmtService
  ]
})
export class AppraisalCycleModule { }
