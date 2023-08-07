import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpsRatingComponent } from './emps-rating/emps-rating.component';
import { AppConstants } from '../../../shared/app-constants';
@Component({
  selector: 'app-goal-setting-header',
  templateUrl: './goal-setting-header.component.html',
  styleUrls: ['./goal-setting-header.component.css']
})
export class GoalSettingHeaderComponent implements OnInit {
  @Input() employeeDetails: any;
  empsOverllRatingdata: any;
  userId: any;
  empsSelfRatingdata: any;
  isProjectResource = false;
  @Output() changeWeightageEvent = new EventEmitter();


  constructor(
    public apprisalService: AppraisalService,
    private router: Router,
    private modalService: NgbModal,
  ) {

  }

  ngOnInit() {
    this.employeeDetails = JSON.parse(localStorage.getItem('setGoals'));
    this.userId = localStorage.getItem('userId');
    if (this.employeeDetails) {
      this.isProjectResource = this.employeeDetails['isProjectResource'] === 'Yes' ? true : false;
    }
    const status = this.employeeDetails['epmsStatus'];
    this.apprisalService.epmsStatus = this.apprisalService.getStatusDescription(status);
    this.apprisalService.empOverallRating = this.employeeDetails['overallRating'] === 0 ? this.employeeDetails['overallRating'] : this.employeeDetails['overallRating'].toFixed(2);
    this.apprisalService.empSelfRating = this.employeeDetails['empSelfRating'] === 0 ? this.employeeDetails['empSelfRating'] : this.employeeDetails['empSelfRating'].toFixed(2);


    // this.getempsRating();
    this.getEmployeeStatusCountInfo();
  }

  getEmployeeStatusCountInfo() {
    const { employeeId, epmsHdrId } = this.employeeDetails;

    this.apprisalService.getEmployeeStatusInfo(employeeId, epmsHdrId).subscribe(response => {
      if (response && response.length) {
        const acceptedCountInfo = response.filter(statusInfo => statusInfo['status'] === AppConstants.STATUS_CODE_LIST['EMP_ACCEPTED']);
        this.apprisalService.acceptedCount = acceptedCountInfo.length || 0;
        this.apprisalService.totalCount = response.length || 0;
      };
    });
  }

  getempsRating() {
    const { employeeId, epmsHdrId } = this.employeeDetails;
    this.apprisalService.getSelfandOverAllRating(employeeId, epmsHdrId).subscribe(response => {
      this.empsOverllRatingdata = response;
    })
  }

  navigatepreviouspage() {
    this.router.navigateByUrl('/reviewcycle/teamgoals');
  }
  changeWeightage(): any {
    this.changeWeightageEvent.emit();
  }

  onClickOverallRating() {
    const { employeeId, epmsHdrId } = this.employeeDetails;

    const modalReference = this.modalService.open(EmpsRatingComponent);
    //  (<EmpsRatingComponent>modalReference.componentInstance).empsRatingdata = this.empsOverllRatingdata;
    (<EmpsRatingComponent>modalReference.componentInstance).isFromSelfRating = false;
    (<EmpsRatingComponent>modalReference.componentInstance).employeeId = employeeId;
    (<EmpsRatingComponent>modalReference.componentInstance).epmsHdrId = epmsHdrId;
  }

  onClickSelfRating() {
    const { employeeId, epmsHdrId } = this.employeeDetails;
    const modalReference = this.modalService.open(EmpsRatingComponent);
    // (<EmpsRatingComponent>modalReference.componentInstance).empsRatingdata = this.empsOverllRatingdata;
    (<EmpsRatingComponent>modalReference.componentInstance).isFromSelfRating = true;
    (<EmpsRatingComponent>modalReference.componentInstance).employeeId = employeeId;
    (<EmpsRatingComponent>modalReference.componentInstance).epmsHdrId = epmsHdrId;
  }

}
