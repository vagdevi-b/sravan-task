import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-tabs-weightage',
  templateUrl: './change-tabs-weightage.component.html',
  styleUrls: ['./change-tabs-weightage.component.css']
})
export class ChangeTabsWeightageComponent implements OnInit {
  weightageForm: FormGroup;
  @Input() projectsWeightage;
  @Input() carrerWeightage;
  @Input() orgWeightage;
  @Input() carOrgWeightInfo;
  displayErrorMessage = false;

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private appraisalService: AppraisalService,
    private toasterService: ToastrService
  ) {
  }

  ngOnInit() {

    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();

    this.weightageForm = this.formBuilder.group({
      project: [this.projectsWeightage],
      career: [this.carrerWeightage],
      organization: [this.orgWeightage]
    });
  }
  close(): void {
    this.activeModal.close();
  }
  onChangeValue(): void {
    this.weightageForm.patchValue({
      project: 100 - (Number(this.careerValue.value) + Number(this.organizationValue.value))
    });
  }
  get projectValue(): any {
    return this.weightageForm.get('project');
  }
  get careerValue(): any {
    return this.weightageForm.get('career');
  }
  get organizationValue(): any {
    return this.weightageForm.get('organization');
  }
  updateWeightage(): void {
    this.displayErrorMessage = false;
    const projectValue = Number(this.projectValue.value) + Number(this.careerValue.value) + Number(this.organizationValue.value);
    if (projectValue !== 100) {
      this.displayErrorMessage = true;
    } else {
      this.carOrgWeightInfo['osiEpmsEmpDetails'][0]['weightage'] = this.careerValue.value;
      this.carOrgWeightInfo['osiEpmsEmpDetails'][1]['weightage'] = this.organizationValue.value;
      this.appraisalService.updateTabsWeight(this.carOrgWeightInfo).subscribe(
        (response) => {
          this.appraisalService.empOverallRating = response['empOverallRating'];
          this.appraisalService.empSelfRating = response['empSelfRating'];
          this.toasterService.success('Record Updated Successfully');
          this.activeModal.close(this.carOrgWeightInfo);
        },
        (error) => {
          const errorInfo = JSON.parse(error['_body']);
          this.toasterService.error(errorInfo['developerMessage']);
        }
      )

    }
  }

}
