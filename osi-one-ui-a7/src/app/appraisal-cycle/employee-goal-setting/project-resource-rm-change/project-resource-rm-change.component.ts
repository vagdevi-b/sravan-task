import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-resource-rm-change',
  templateUrl: './project-resource-rm-change.component.html',
  styleUrls: ['./project-resource-rm-change.component.css']
})
export class ProjectResourceRmChangeComponent implements OnInit {
  @Input() projectList;
  @Input() projectWeightageInfo;
  @Input() allEmployeeList;
  @Input() reportingManagersList;
  @Input() employeeId;

  // projects in this with value true will only be displayed.
  @Input() displayableProjects;
  projectWeightageForm: FormGroup;
  displayErrorMessage = false;
  checkRmExistErrorInfo = false;

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    public appraisalService: AppraisalService,
    private toastr: ToastrService
  ) { }


  ngOnInit() {

    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();

    this.projectWeightageForm = this.formBuilder.group({
      projectWeightageList: this.formBuilder.array([])
    });
    if (this.projectList && this.projectList.length) {
      this.populateProjectList(this.projectList);
      this.getAllReviewManagersList();
    }

  }
  populateProjectList(projectList): void {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    projectList.forEach(projectInfo => {
      projectArray.push(
        this.formBuilder.group({
          ...projectInfo,
          viewAll: false,
          reportingManagersList: []
        })
      );
    });
  }
  getAllReviewManagersList(): void {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    projectArray.value.forEach((project, index) => {
      this.getRmPMList(project, index);
    });
  }

  getRmPMList(project, index) {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    // && project['rmPmId'] !== -1
    if (project['projectId'] && this.employeeId && project['rmPmId'] ) {
      this.appraisalService.getProjectManagers(project['projectId'], this.employeeId, project['rmPmId']).subscribe(response => {
        projectArray.at(index).patchValue({
          reportingManagersList: response || []
        });
      });
    } else {
      projectArray.at(index).patchValue({
        reportingManagersList: []
      });
    }

  }




  checkValue(event: any) {
    console.log(event);
  }
  onProjectStatusChange(event, index): void {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    const checkBoxStatus = event.target.checked;
    if (checkBoxStatus) {
      projectArray.at(index).patchValue({ isActive: 'Y' });
    } else {
      projectArray.at(index).patchValue({
        isActive: 'N',
        projectWeightage: 0
      });
    }
  }
  onChangeManager(event): void {
    const employeeId = event.target.value;
    if (employeeId) {
      const existingRmIds = this.reportingManagersList.map(rmInfo => {
        if (rmInfo && rmInfo['employeeId']) {
          rmInfo['employeeId'];
        }
      });
      if (!existingRmIds.includes(employeeId)) {
        const obj = this.allEmployeeList.filter(employee => employee['employeeId'] == employeeId);
        if (obj && obj.length) {
          this.reportingManagersList.push(obj[0]);
        }
      }
    }
  }
  onChangeViewAll(event, index): void {
    const isChecked = event.target.checked;
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    projectArray.at(index).patchValue({ viewAll: isChecked });
  }

  getProjectStatusValue(index) {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    return projectArray.at(index).get('isActive');
  }
  getViewAllValue(index) {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    return projectArray.at(index).get('viewAll');
  }
  getReviewManagersListByIndex(index) {
    const projectArray = this.projectWeightageForm.get('projectWeightageList') as FormArray;
    return projectArray.at(index).get('reportingManagersList');
  }

  close(): void {
    this.activeModal.close();
  }

  updateProjectWeightage(): void {
    this.checkRmExistErrorInfo = false;
    this.displayErrorMessage=false;
    let projectWeightageCheck = this.projectWeightageForm.value['projectWeightageList'] || [];
    this.projectWeightageInfo['osiEpmsEmpDetails'] = this.projectWeightageForm.value['projectWeightageList'] || [];
    projectWeightageCheck = projectWeightageCheck.filter(project => {
      if (project['isActive'] === 'Y') {
        return project;
      }
    });
    let total = 0;
    projectWeightageCheck.forEach(project => {
      project['projectWeightage'] = Number(project['projectWeightage']);
      total = total + project['projectWeightage'];
      if (!project['rmPmId'] && project['isActive'] === 'Y') {
        this.checkRmExistErrorInfo = true;
      }
    }
    );
    if (!projectWeightageCheck.length) {
      total = 100;
      this.checkRmExistErrorInfo = false;
    }
    if (total === 100 && !this.checkRmExistErrorInfo) {
      this.displayErrorMessage = false;
      this.projectWeightageInfo['osiEpmsEmpDetails'].map(project => {
        if (!project['rmPmId']) {
          project['rmPmId'] = -1;
        }
      });
      this.appraisalService.updateProjectWeight(this.projectWeightageInfo).subscribe(
        (response) => {
          this.toastr.success("Record Updated Successfully");
          this.activeModal.close(this.projectWeightageForm.value['projectWeightageList']);
        },
        (error) => {
          const errorInfo = JSON.parse(error['_body']);
          this.toastr.error(errorInfo['developerMessage']);
        }
      );
    } else {
      this.displayErrorMessage = true;
    }


  }

}
