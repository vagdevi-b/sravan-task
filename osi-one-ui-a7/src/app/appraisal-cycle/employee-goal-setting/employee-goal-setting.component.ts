import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeTabsWeightageComponent } from './change-tabs-weightage/change-tabs-weightage.component';
import { ProjectsComponent } from './projects/projects.component';

@Component({
  selector: 'app-employee-goal-setting',
  templateUrl: './employee-goal-setting.component.html',
  styleUrls: ['./employee-goal-setting.component.css']
})
export class EmployeeGoalSettingComponent implements OnInit {
  employeeDetails: any;
  userId: any;
  routerLink = 'projects';
  projectsWeightage;
  carrerWeightage = 0;
  orgWeightage = 0;
  carOrgWeightInfo;
  displayChangeWeightageBtn = false;

  constructor(
    private router: Router,
    public apprisalService: AppraisalService,
    private modalService: NgbModal
  ) {

  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (localStorage.getItem('setGoals')) {
      this.employeeDetails = JSON.parse(localStorage.getItem('setGoals'));
      this.displayChangeWeightageBtn = (!(this.employeeDetails['isProjectResource'] === 'Yes') && (this.employeeDetails['employeeId'] != this.userId));
      this.getTabsWiseWeightage(this.employeeDetails['employeeId'], this.employeeDetails['epmsHdrId']);

    }

  }
  navigateRoute(routeInfo, type): void {
    this.routerLink = type;
    this.router.navigate([routeInfo]);

  }

  getTabsWiseWeightage(employeeId, epmsHdrId): void {
    this.apprisalService.getTabsWiseWeightage(employeeId, epmsHdrId).subscribe(
      (response) => {
        this.carOrgWeightInfo = response;
        this.setTabsInfo(this.carOrgWeightInfo);

      }
    );
  }
  changeWeightage(): void {
    const modalReference = this.modalService.open(ChangeTabsWeightageComponent, {
      backdrop: 'static',
      keyboard: false
    });
    (<ChangeTabsWeightageComponent>modalReference.componentInstance).projectsWeightage = this.projectsWeightage;
    (<ChangeTabsWeightageComponent>modalReference.componentInstance).carrerWeightage = this.carrerWeightage;
    (<ChangeTabsWeightageComponent>modalReference.componentInstance).orgWeightage = this.orgWeightage;
    (<ChangeTabsWeightageComponent>modalReference.componentInstance).carOrgWeightInfo = this.carOrgWeightInfo;
    modalReference.result.then(
      (Info) => {
        this.carOrgWeightInfo = Info;
        this.setTabsInfo(this.carOrgWeightInfo);
      }
    )

  }
  setTabsInfo(carOrgWeightInfo): void {
    if (carOrgWeightInfo['osiEpmsEmpDetails'] && carOrgWeightInfo['osiEpmsEmpDetails'][0]) {
      this.carrerWeightage = carOrgWeightInfo['osiEpmsEmpDetails'][0]['weightage'];
    }
    if (carOrgWeightInfo['osiEpmsEmpDetails'] && carOrgWeightInfo['osiEpmsEmpDetails'][1]) {
      this.orgWeightage = carOrgWeightInfo['osiEpmsEmpDetails'][1]['weightage'];
    }
    this.projectsWeightage = 100 - (Number(this.carrerWeightage) + Number(this.orgWeightage));
   //  this.projectsWeightage = 0;
    if (this.projectsWeightage === 0) {
      this.router.navigate(['/reviewcycle/goalsetting/careerdevelopment']);
      this.routerLink = 'careerdevelopment';
    }
  }


}
