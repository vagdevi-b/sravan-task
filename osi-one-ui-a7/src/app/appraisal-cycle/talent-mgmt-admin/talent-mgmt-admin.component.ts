import {Component, OnInit, ViewChild} from '@angular/core';
import {TalentMgmtService} from '../../shared/services/talent-mgmt.service';
import {ToastrService} from 'ngx-toastr';
import {FormGroup} from '@angular/forms';
import {ShowHistoryComponentComponent} from '../employee-goal-setting/show-history-component/show-history-component.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '../../shared/services/loading.service';

@Component({
  selector: 'app-talent-mgmt-admin',
  templateUrl: './talent-mgmt-admin.component.html',
  styleUrls: ['./talent-mgmt-admin.component.css']
})
export class TalentMgmtAdminComponent {

  private readonly allStatusList: string[] = [
    'DRAFT',
    'PM DRAFT',
    'INITIATED',
    'EMP ACCEPTED',
    'RATING INITIATED',
    'EMP REVIEWED',
    'RM REVIEWED',
    'CLOSED'
  ];

  readonly inputControls = {
    ALL: 4,
    EMPLOYEE: 3,
    APPRAISAL_YEAR: 2,
    REVIEW_CYCLE: 1,
  };

  @ViewChild('goalsStatusUpdateForm')
  goalsStatusUpdateForm: FormGroup;

  employeeName: string;
  selectedEmployeeId: number;

  appraisalCycles: any[];
  appraisalCycleId: number;

  reviewCycles: any[];
  reviewCycleId: number;

  goalsSummary: any[];
  selectedProjectGoalsSummary: any;

  statusList: string[];
  selectedProjectStatus: string;

  statusUpdated = false;

  constructor(
    private talentMgmtService: TalentMgmtService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private loading: LoadingService
  ) {
  }

  employeeSelected(employeeId: number) {
    this.selectedEmployeeId = employeeId;
    this.getAppraisalCycles();
  }

  getAppraisalCycles() {
    this.loading.show();
    this.talentMgmtService.getAppraisalCycles(this.selectedEmployeeId)
      .subscribe(
        response => {
          this.loading.hide();
          if (!response || response.length === 0) {
            this.toastr.error('No appraisal cycles exist for the employee.');
          } else {
            this.appraisalCycleId = response[response.length - 1].epmsHdrId;
            this.getReviewCycles();
          }
          this.appraisalCycles = response;
        },
        error => {
          this.loading.hide();
          this.toastr.error(
            error.errorMessage
            || 'Error occurred while fetching the appraisal years.'
          );
        }
      );
  }

  getReviewCycles() {
    this.resetForm(this.inputControls.APPRAISAL_YEAR);

    if (!this.appraisalCycleId) {
      return;
    }

    this.loading.show();
    this.talentMgmtService.getReviewCycles(this.appraisalCycleId)
      .subscribe(
        response => {
          this.loading.hide();
          if (!response || response.length === 0) {
            this.toastr.error('No review cycles exist for the selected appraisal year.');
          }

          this.reviewCycles = response;

          if (this.reviewCycles.length === 1) {
            this.reviewCycleId = this.reviewCycles[0].epmsHdrId;
            this.getEmployeeGoalsSummary();
          }
        },
        error => {
          this.loading.hide();
          this.toastr.error(
            error.errorMessage
            || 'Error occurred while fetching the review cycles.'
          );
        }
      );
  }

  getEmployeeGoalsSummary() {
    this.resetForm(this.inputControls.REVIEW_CYCLE);

    if (!this.reviewCycleId || !this.selectedEmployeeId) {
      return;
    }

    this.loading.show();
    this.talentMgmtService
      .getEmployeeGoalsSummary(this.reviewCycleId, this.selectedEmployeeId)
      .subscribe(
        response => {
          this.loading.hide();
          if (!response || response.length === 0) {
            this.toastr.error('No projects exist for the selected review cycle.');
          }

          this.goalsSummary = response;
        },
        error => {
          this.loading.hide();
          this.toastr.error(
            error.errorMessage
            || 'Error occurred while fetching the goals summary.'
          );
        }
      );
  }

  projectSelected() {
    this.setStatusList(this.selectedProjectGoalsSummary.status);
    this.selectedProjectStatus = this.selectedProjectGoalsSummary.status;
  }

  setStatusList(status: string) {
    status = status.toUpperCase();

    const statusIndex = this.allStatusList
      .findIndex(each => each === status);

    if (statusIndex !== -1) {
      this.statusList = this.allStatusList
        .slice(0, statusIndex + 1);
    }
  }

  projectStatusChanged() {

    this.statusUpdated = this.selectedProjectStatus
      && (this.selectedProjectStatus !== this.selectedProjectGoalsSummary.status);
  }

  updateStatus() {
    if (
      this.goalsStatusUpdateForm.valid
      && this.statusUpdated
    ) {
      const payload = Object.assign({}, this.selectedProjectGoalsSummary);
      payload.status = this.selectedProjectStatus;
      this.loading.show();
      this.talentMgmtService.updateEmployeeGoalsStatus(payload)
        .subscribe(
          response => {
            this.loading.hide();
            this.toastr.success('Goals Status Updated Successfully');
            this.goalsStatusUpdateForm.reset();
            this.resetForm(this.inputControls.ALL);
          },
          error => {
            this.loading.hide();
            this.toastr.error(
              error.errorMessage || 'Error Occurred While Updating Goals Status'
            );
          }
        );
    }
  }

  resetForm(changeIndex: number) {
    this.statusUpdated = false;

    if (changeIndex === this.inputControls.ALL) {
      this.employeeName = undefined;
    }
    if (changeIndex >= this.inputControls.EMPLOYEE) {
      this.selectedEmployeeId = undefined;
    }
    if (changeIndex > this.inputControls.APPRAISAL_YEAR) {
      this.appraisalCycleId = undefined;
      this.appraisalCycles = undefined;
    }
    if (changeIndex > this.inputControls.REVIEW_CYCLE) {
      this.reviewCycleId = undefined;
      this.reviewCycles = undefined;
    }
    this.goalsSummary = undefined;
    this.selectedProjectGoalsSummary = undefined;
    this.statusList = undefined;
    this.selectedProjectStatus = undefined;
  }

  showHistory() {
    const modalReference = this.modalService.open(ShowHistoryComponentComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });

    modalReference.componentInstance.epmsEmpDetId = this.selectedProjectGoalsSummary.epmsEmpDetId;
  }

}
