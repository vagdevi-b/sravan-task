import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppraisalListComponent } from './appraisal-list/appraisal-list.component';
import { EmployeeDevelopmentComponent } from './employee-goal-setting/employee-development/employee-development.component';
import { EmployeeGoalSettingComponent } from './employee-goal-setting/employee-goal-setting.component';
import { OrganizationalComponent } from './employee-goal-setting/organizational/organizational.component';
import { ProjectsComponent } from './employee-goal-setting/projects/projects.component';
import { InitiateReviewCycleComponent } from './initiate-review-cycle/initiate-review-cycle.component';
import { TalentMgmtAdminComponent } from './talent-mgmt-admin/talent-mgmt-admin.component';
import { TeamGoalsComponent } from './team-goals/team-goals.component';
import { ViewReviewCycleComponent } from './view-review-cycle/view-review-cycle.component';

const routes: Routes = [
  {
    path: "initiate",
    component: InitiateReviewCycleComponent,
    data: {
      title: 'Review Cycle'
    }
  },
  {
    path: "view/:id",
    component: ViewReviewCycleComponent,
    data: {
      title: 'Review Cycle'
    }
  },
  {
    path: "initiate/:id",
    component: InitiateReviewCycleComponent,
    data: {
      title: 'Review Cycle'
    }
  },
  {
    path: "goalsetting",
    component: EmployeeGoalSettingComponent,
    children: [
      {
        path: "",
        component: ProjectsComponent,
        data: {
          title: 'Projects'
        }
      },
      {
        path: "projects",
        component: ProjectsComponent,
        data: {
          title: 'Projects'
        }
      },
      {
        path: "careerdevelopment",
        component: EmployeeDevelopmentComponent,
        data: {
          title: 'Career'
        }
      },
      {
        path: "organization",
        component: OrganizationalComponent,
        data: {
          title: 'Organization'
        }
      }
    ],
    data: {
      title: 'Goal Setting'
    }
  },
  {
    path: "list",
    component: AppraisalListComponent
  },
  {
    path: "teamgoals",
    component: TeamGoalsComponent,
    data: {
      title: "Team Goals"
    }
  },
  {
    path: 'talent-management',
    component: TalentMgmtAdminComponent,
    data: {
      title: 'Talent Management'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraisalCycleRoutingModule { }
