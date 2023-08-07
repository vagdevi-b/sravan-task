import { Component, OnInit, Input } from '@angular/core';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGoalComponent } from '../add-goal/add-goal.component';
import { ProjectWeightageComponent } from '../project-weightage/project-weightage.component';
import { AppConstants } from '../../../shared/app-constants';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadTemplateComponent } from '../load-template/load-template.component';
import { UpdateKpaInfoComponent } from '../update-kpa-info/update-kpa-info.component';
import { DeclineCommentsComponent } from '../decline-comments/decline-comments.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ProjectResourceRmChangeComponent } from '../project-resource-rm-change/project-resource-rm-change.component';
import { ShowHistoryComponentComponent } from '../show-history-component/show-history-component.component';
import { removeSpace } from '../../../shared/validators/trim-space';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  employeeDetails;
  projectList = [];
  projectWeightageInfo: any
  projectInfo;
  projectForm: FormGroup;
  projectListForm: FormGroup;
  delivaryProcesscategoriesList = [];
  delivarycategoriesValuesList = [];
  reportingManagersList = [];
  ratingList = [];
  gradeList = [];
  userId;
  orgId;
  epmsEmpDetId;
  enableEmployeeRating = false;
  enableWeightage = false;
  projectResourceWeightage = false;
  STATUS_CODE_INFO = AppConstants.STATUS_CODE_LIST;
  checkKpasLength = false;
  delivaryCheckKpasLength = false;
  processCheckKpasLength = false;
  ratingsMessage = '';
  displayRatingsErrorMsg = false;
  displayProcessRatingsErrorMsg = false;
  displayDeliveryRatingsErrorMsg = false;
  displayCommentsErrorMsg = false;
  displayProcessCommentsErrorMsg = false;
  displayDeliveryCommentsErrorMsg = false;
  addGoalsErrorsMsg = false;
  addProcessGoalsErrorsMsg = false;
  addDelivaryGoalsErrorsMsg = false;
  allEmployeeList = [];
  viewAll = false;
  projectrmPmId = 0;
  dispalyProcessWeightErrMsg = false;
  dispalyDelivaryWeightErrMsg = false;
  showHideInitiateRating = false;
  projectId = '';
  commentsInfo;
  checkYearInfo = false;
  deliveryErrorMessageClass = [];
  processErrorMessageClass = [];
  projectName = '';
  isProjectResource = false;
  isManagerRatingEnabled = true;
  projectWeight: any;
  projectTabDisable: Boolean;

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  // If a project is selected, ratings will be stored here
  projectSelfRating: number;
  projectManagerRating: number;

  /**
   * key will be project id, value will be boolean
   *
   * project will be displayed in project select dropdown or change weightage
   * modal only if this object contains corresponding projectId
   *
   * Reporting manager or employee can see all projects
   * but project supervisor can only see only project(s) that he/she is managing
   * for the employee
   */
  displayableProjects: any = {};

  constructor(
    private appraisalService: AppraisalService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private toastr: ToastrService, private router: Router

  ) { }

  ngOnInit() {

    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();

    this.appraisalService.breadcrumbText = 'Projects';
    this.userId = localStorage.getItem('userId');
    this.projectListForm = this.formBuilder.group({
      projectId: ['']
    });

    this.employeeDetails = JSON.parse(localStorage.getItem('setGoals'));
    if (this.employeeDetails) {
      this.isProjectResource = this.employeeDetails['isProjectResource'] === 'Yes' ? true : false;
    }

    this.checkYearInfo = Number(this.employeeDetails['selectedYear']) < 2020 ? true : false;
    this.enableEmployeeRating = (this.userId === this.employeeDetails['employeeId'].toString());
    this.orgId = this.employeeDetails['orgId'];

    this.enableWeightage = (this.userId !== this.employeeDetails['employeeId'].toString()) && (this.employeeDetails['isProjectResource'] === 'No');
    this.projectResourceWeightage = (this.userId !== this.employeeDetails['employeeId'].toString()) && (this.employeeDetails['isProjectResource'] === 'Yes');
    $('#loadModal').modal('show');
    // this.getProjectsList();
    // this.getDelivaryProcessCategories();
    // this.getDelivaryValuesCategories();
    // this.getRatingList();
    // this.getGradeList();
    const promise1 = Promise.resolve(this.getProjectsList());
    const promise2 = Promise.resolve(this.getDelivaryProcessCategories());
    const promise3 = Promise.resolve(this.getDelivaryValuesCategories());
    const promise4 = Promise.resolve(this.getRatingList());
    const promise5 = Promise.resolve(this.getGradeList());
    const promise6 = Promise.resolve(this.ViewAllEmployees());

    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6]).then(function (values) {
      $('#loadModal').modal('hide');
    }).then(function () {
      $('#loadModal').modal('hide');
    });

  }


  getGradeList() {

    this.appraisalService.getGradesList(this.orgId).subscribe(response => {
      this.gradeList = response;
    });
  }


  getProjectsList() {
    const { epmsHdrId, employeeId } = this.employeeDetails;
    const rmProjects = [];
    this.appraisalService.getProjectsList(employeeId, epmsHdrId).subscribe(response => {
      this.projectWeightageInfo = response;
      // this.projectWeight = this.projectWeightageInfo.osiEpmsEmpDetails[0].projectWeightage;
      response['osiEpmsEmpDetails'].forEach(project => {
        if (this.userId === project.rmPmId) {
          rmProjects.push(project);
        }
      });
      // ===== IF RM HAVE NO PROJECTS WE WILL SHOW ALL THE PROJECTS LINKED TO THE EMPLOYEE ====== // 
      if (rmProjects.length > 0 && this.userId != this.employeeDetails.supervisorId && this.userId != this.employeeDetails.employeeId) {
        this.projectList = rmProjects;
      } else {
        this.projectList = response['osiEpmsEmpDetails'];
      }
      this.filterProjectsForProjectManager();
      const activeProjects = this.projectList.filter(project => project['isActive'] === 'Y');
      if (activeProjects && activeProjects.length === 1 && activeProjects[0]['isActive'] === 'Y') {
        const projectId = activeProjects[0]['projectId'];
        this.projectId = activeProjects[0]['projectId'];
        this.projectName = activeProjects[0]['projectName'];
        this.projectListForm.patchValue({
          projectId: projectId
        });
        $('#loadModal').modal('show');
        const promise1 = Promise.resolve(this.getProjectInfo(projectId));
        const promise2 = Promise.resolve(this.getReviewManagersList(projectId));
        const promise3 = Promise.resolve(this.getRatingList());
        Promise.all([promise1, promise2, promise3]).then(function (values) {
          $('#loadModal').modal('hide');
        });
      }
    });
  }

  /**
   * If a project/proxy manager accesses the goals page of an employee,
   * then he/she will see the projects where they are project or proxy manager
   * in the projects select dropdown
   * */
  filterProjectsForProjectManager() {

    const loggedInEmpId = Number(this.userId);
    let filteredProjects = this.projectList;

    if (
      loggedInEmpId !== this.employeeDetails.supervisorId
      && loggedInEmpId !== this.employeeDetails.employeeId
    ) {
      filteredProjects = this.projectList
        .filter(each => (each.rmPmId === loggedInEmpId || each.proxyRmPmId === loggedInEmpId));
    }

    for (const each of filteredProjects) {
      this.displayableProjects[each.projectId] = true;
    }
  }

  addProjectWeightage() {
    const { employeeId } = this.employeeDetails;
    const modalReference = this.modalService.open(ProjectWeightageComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    (<ProjectWeightageComponent>modalReference.componentInstance).projectList = this.projectList;
    (<ProjectWeightageComponent>modalReference.componentInstance).projectWeightageInfo = this.projectWeightageInfo;
    (<ProjectWeightageComponent>modalReference.componentInstance).allEmployeeList = this.allEmployeeList;
    (<ProjectWeightageComponent>modalReference.componentInstance).reportingManagersList = this.reportingManagersList;
    (<ProjectWeightageComponent>modalReference.componentInstance).employeeId = employeeId;
    modalReference.result.then((Info) => {
      if (Info && Info['type'] === 'save') {
        this.projectListForm.patchValue({
          projectId: ''
        });
        this.projectList = Info['projectList'];
        this.projectForm = null;
      }
    });
  }
  changeRmInfoOnly() {
    const { employeeId } = this.employeeDetails;
    const modalReference = this.modalService.open(ProjectResourceRmChangeComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false
    });
    (<ProjectResourceRmChangeComponent>modalReference.componentInstance).projectList = this.projectList;
    (<ProjectResourceRmChangeComponent>modalReference.componentInstance).projectWeightageInfo = this.projectWeightageInfo;
    (<ProjectResourceRmChangeComponent>modalReference.componentInstance).allEmployeeList = this.allEmployeeList;
    (<ProjectResourceRmChangeComponent>modalReference.componentInstance).reportingManagersList = this.reportingManagersList;
    (<ProjectResourceRmChangeComponent>modalReference.componentInstance).employeeId = employeeId;
    (<ProjectResourceRmChangeComponent>modalReference.componentInstance).displayableProjects = this.displayableProjects;
    modalReference.result.then((Info) => {
      this.projectListForm.patchValue({
        projectId: ''
      });
      this.projectForm = null;
      if (Info) {
        this.projectList = Info;
      }
    });
  }


  getRatingList() {
    this.appraisalService.getRatingsList().subscribe(response => {
      this.ratingList = response;
    });
  }
  onProjectChange(event): void {
    const projectId = event.target.value;
    this.projectId = projectId;

    if (projectId) {
      $('#loadModal').modal('show');
      const promise1 = Promise.resolve(this.getProjectInfo(projectId));
      const promise2 = Promise.resolve(this.getReviewManagersList(projectId));
      const promise3 = Promise.resolve(this.getRatingList());
      Promise.all([promise1, promise2, promise3]).then(function (values) {
        $('#loadModal').modal('hide');
      });

      // this.getProjectInfo(projectId);
      // this.getReviewManagersList(projectId);
      // this.getRatingList();
    }
  }
  getReviewManagersList(projectId): void {
    const { employeeId } = this.employeeDetails;
    const project = this.projectList.filter(project => project.projectId == projectId)
    this.appraisalService.getProjectManagers(projectId, employeeId, project[0]['rmPmId']).subscribe(response => {
      this.reportingManagersList = response;
    });
  }

  getProjectInfo(projectId) {
    const { epmsHdrId, employeeId } = this.employeeDetails;
    this.appraisalService.getProjectGoals(employeeId, epmsHdrId, projectId).subscribe(response => {
      this.projectInfo = response;
      this.appraisalService.setDefaultRating(this.projectInfo);
      this.projectrmPmId = response.osiEpmsEmpDetails[0].rmPmId;
      this.projectName = response.osiEpmsEmpDetails[0].projectName;
      this.epmsEmpDetId = response.osiEpmsEmpDetails[0].epmsEmpDetId;
      this.appraisalService.empOverallRating = this.projectInfo['empOverallRating'];
      this.appraisalService.empSelfRating = this.projectInfo['empSelfRating'];
      this.appraisalService.epmsStatus = this.appraisalService.getStatusDescription(this.projectInfo['status']);

      if (this.projectInfo.osiEpmsEmpDetails) {
        const { empSelfRating, empPmRmRating, projectWeightage } = this.projectInfo.osiEpmsEmpDetails[0];
        this.projectSelfRating = empSelfRating * 100 / projectWeightage;
        this.projectManagerRating = empPmRmRating * 100 / projectWeightage;
      }

      // using double equals because userId is string and projectrmPmId is number
      // tslint:disable-next-line:triple-equals
      if (this.userId != this.projectrmPmId) {
        this.isManagerRatingEnabled = !(response.osiEpmsEmpDetails[0]['status'] === this.STATUS_CODE_INFO['EMP_REVIEWED']);
      }
      if (
        response.osiEpmsEmpDetails[0]['status'] === this.STATUS_CODE_INFO['RM_INITIATED']
      ) {
        this.projectInfo['empSelfRating'] = 0;
      }

      this.dispatchProjectInfo(this.projectInfo);
      if (this.userId == this.projectrmPmId) {
        this.showHideInitiateRating = true;
      }
    });
  }

  onClickInitiateRating() {
    const request = { "epmsEmpDetId": this.epmsEmpDetId }
    this.appraisalService.initiateRatings(request).subscribe(response => {
      this.toastr.success("Status changed Successfully");
      if (response && response['projectId']) {
        this.getProjectInfo(response['projectId']);
      }
    });
  }

  dispatchProjectInfo(projectInfo): void {
    this.projectForm = this.formBuilder.group({
      epmsEmpHdrId: projectInfo['epmsEmpHdrId'],
      epmsHdrId: projectInfo['epmsHdrId'],
      employeeId: projectInfo['employeeId'],
      empRole: projectInfo['empRole'],
      status: projectInfo['status'],
      employeeGradeId: this.employeeDetails['gradeId'],
      // status: 'RM REVIEWED',
      // isGoalEnabled: true,
      // isSelfRatingEnabled: true,
      // isManagerRatingEnabled: true,
      // isSaveButtonEnabled: true,
      // isAcceptButtonEnabled: true,
      // isManagerRatingShow: true,
      // isSelfRatingShow: true,
      isResubmitShow: projectInfo['isResubmitShow'],
      isGoalEnabled: projectInfo['isGoalEnabled'],
      isSelfRatingEnabled: projectInfo['isSelfRatingEnabled'],
      isManagerRatingEnabled: projectInfo['isManagerRatingEnabled'],
      isSaveButtonEnabled: projectInfo['isSaveButtonEnabled'],
      isAcceptButtonEnabled: projectInfo['isAcceptButtonEnabled'],
      isManagerRatingShow: projectInfo['isManagerRatingShow'],
      isSelfRatingShow: projectInfo['isSelfRatingShow'],
      empSelfRating: projectInfo['empSelfRating'],
      empRmRating: projectInfo['empRmRating'],
      empOverallRating: projectInfo['empOverallRating'],
      empAcceptanceFlag: projectInfo['empAcceptanceFlag'],
      parentEpmsHdrId: projectInfo['parentEpmsHdrId'],
      creationDate: projectInfo['creationDate'],
      createdBy: projectInfo['createdBy'],
      categoryType: 'Project',
      osiEpmsEmpDetails: this.populateOsiEpmsEmpDetails(projectInfo['osiEpmsEmpDetails'])
    });

  }
  populateOsiEpmsEmpDetails(osiEpmsEmpDetails) {
    const project = osiEpmsEmpDetails[0];
    return this.formBuilder.group({
      epmsEmpDetId: project['epmsEmpDetId'],
      categoryId: project['categoryId'],
      weightage: project['weightage'],
      projectId: project['projectId'],
      status: project['status'],
      // status: 'RM REVIEWED',

      projectName: project['projectName'],
      startDate: project['startDate'],
      endDate: project['endDate'],
      actualStartDate: project['actualStartDate'],
      actualEndDate: project['actualEndDate'],
      employeeGradeId: project['employeeGradeId'] == null ? this.employeeDetails['gradeId'] : project['employeeGradeId'],
      employeeJobId: project['employeeJobId'],
      rmPmId: project['rmPmId'],
      proxyRmPmId: project['proxyRmPmId'],
      comments: project['comments'],
      projectWeightage: project['projectWeightage'],
      empSelfRating: project['empSelfRating'] ? project['empSelfRating'] : 0,
      empPmRmRating: project['empPmRmRating'] ? project['empPmRmRating'] : 0,
      parentEpmsEmpDetId: project['parentEpmsEmpDetId'],
      isActive: project['isActive'],
      creationDate: project['creationDate'],
      createdBy: project['createdBy'],
      osiEpmsEmpHdr: project['osiEpmsEmpHdr'],
      osiEpmsCategoriesProcess: project['osiEpmsCategoriesProcess'] ? this.populateOsiEpmsCategoriesProcess(project['osiEpmsCategoriesProcess']) : null,
      osiEpmsCategoriesValues: project['osiEpmsCategoriesValues'] ? this.populateOsiEpmsCategoriesProcess(project['osiEpmsCategoriesValues']) : null
    });

  }

  populateOsiEpmsCategoriesProcess(categoriesProcess) {
    return this.formBuilder.group({
      categoryId: categoriesProcess['categoryId'],
      categoryName: categoriesProcess['categoryName'],
      parentCategoryId: categoriesProcess['parentCategoryId'],
      creationDate: categoriesProcess['creationDate'],
      createdBy: categoriesProcess['createdBy'],
      osiEpmsKra: categoriesProcess['osiEpmsKra'] ? this.populateOsiEpmsKra(categoriesProcess['osiEpmsKra']) : [],
      osiEpmsEmpKraDetails: categoriesProcess['osiEpmsEmpKraDetails'] ? this.formBuilder.array(this.populateOsiEpmsEmpKraDetails(categoriesProcess['osiEpmsEmpKraDetails'])) : []
    })

  }

  populateOsiEpmsEmpKraDetails(osiEpmsEmpKraDetails): any {
    const kraDetails = [];
    if (osiEpmsEmpKraDetails) {
      osiEpmsEmpKraDetails.forEach((kraInfo, index) => {
        const formGroup = this.formBuilder.group({
          epmsEmpKraDetId: kraInfo['epmsEmpKraDetId'],
          weightage: kraInfo['weightage'],
          empSelfRating: kraInfo['empSelfRating'] ? kraInfo['empSelfRating'] : 0,
          empPmRmRating: this.isManagerRatingEnabled ? kraInfo['empPmRmRating'] : 0,
          osiEpmsEmpDetails: kraInfo['osiEpmsEmpDetails'],
          creationDate: kraInfo['creationDate'],
          createdBy: kraInfo['createdBy'],
          osiEpmsKra: kraInfo['osiEpmsKra'] ? this.populateOsiEpmsKra(kraInfo['osiEpmsKra']) : [],
          displayEmployeeTooltip: false,
          displayRmTooltip: false,
          osiEpmsEmpKpaDetails: kraInfo['osiEpmsEmpKpaDetails'] ? this.formBuilder.array(this.populateOsiEpmsEmpKpaDetails(kraInfo['osiEpmsEmpKpaDetails'])) : [],
          isExpand: false,
          viewComments: false,
          isEmployeeAccepted: kraInfo['isEmployeeAccepted'] ? kraInfo['isEmployeeAccepted'] : false
        })
        kraDetails.push(formGroup);
      });
    }

    return kraDetails;
  }
  populateOsiEpmsKra(osiEpmsKra): any {
    return this.formBuilder.group({
      kraId: osiEpmsKra['kraId'],
      name: osiEpmsKra['name'],
      creationDate: osiEpmsKra['creationDate'],
      createdBy: osiEpmsKra['createdBy'],
      osiEpmsCategories: osiEpmsKra['osiEpmsCategories']
    });
  }
  populateOsiEpmsEmpKpaDetails(osiEpmsEmpKpaDetails) {
    const osiEpmsEmpKpaDetailsInfo = [];
    if (osiEpmsEmpKpaDetails) {
      osiEpmsEmpKpaDetails.forEach(kpaInfo => {
        osiEpmsEmpKpaDetailsInfo.push(
          this.formBuilder.group({
            epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
            kpa: [kpaInfo['kpa'], [Validators.required, removeSpace]],
            kpi: kpaInfo['kpi'],
            trainingRequired: kpaInfo['trainingRequired'],
            targetDate: kpaInfo['targetDate'],
            empSelfRating: kpaInfo['empSelfRating'],
            empPmRmRating: this.isManagerRatingEnabled ? kpaInfo['empPmRmRating'] : 0,
            additionalNotes: kpaInfo['additionalNotes'] || '',
            progress: kpaInfo['progress'] || 0,
            empComments: kpaInfo['empComments'] || '',
            displayEmployeeComments: false,
            displayRMPMComments: false,
            rmPmComments: kpaInfo['rmPmComments'] || '',
            remarks: kpaInfo['remarks'],
            osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
            isEditable: false,
            creationDate: kpaInfo['creationDate'],
            createdBy: kpaInfo['createdBy'],
            isEmployeeAccepted: kpaInfo['isEmployeeAccepted'] ? kpaInfo['isEmployeeAccepted'] : false
          })
        );
      });
    }

    return osiEpmsEmpKpaDetailsInfo;
  }
  get osiEpmsCategoriesProcess(): any {
    return this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess');
  }
  get osiEpmsCategoriesValues(): any {
    return this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues');
  }
  get categoryProcessName(): any {
    return this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('categoryName');
  }
  get categoryValuesName(): any {
    return this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('categoryName');
  }
  onClickDelivaryProcessHeader(empKpaIndex): void {
    const projectHeader = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const isExpand = projectHeader['controls'][empKpaIndex].get('isExpand').value;
    projectHeader['controls'][empKpaIndex].patchValue({
      isExpand: !isExpand
    });
  }

  onClickHideOrViewDelivaryProcessComments(empKpaIndex): void {
    const projectHeader = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const viewComments = projectHeader['controls'][empKpaIndex].get('viewComments').value;
    projectHeader['controls'][empKpaIndex].patchValue({
      viewComments: !viewComments
    });
  }

  onClickDelivaryHeader(empKpaIndex): void {
    const projectHeader = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const isExpand = projectHeader['controls'][empKpaIndex].get('isExpand').value;
    projectHeader['controls'][empKpaIndex].patchValue({
      isExpand: !isExpand
    });
  }
  onClickHideOrViewDelivaryValuesComments(empKpaIndex): void {
    const projectHeader = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const viewComments = projectHeader['controls'][empKpaIndex].get('viewComments').value;
    projectHeader['controls'][empKpaIndex].patchValue({
      viewComments: !viewComments
    });
  }

  onClickDelivaryAndProcessAddGoal(): void {
    const modalReference = this.modalService.open(AddGoalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    const osiEpmsDelivaryProcess = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const allGoalsList = osiEpmsDelivaryProcess.value;
    (<AddGoalComponent>modalReference.componentInstance).data = allGoalsList;
    (<AddGoalComponent>modalReference.componentInstance).kpisList = this.delivaryProcesscategoriesList;
    modalReference.result.then((Info) => {
      this.updateosiDelivaryProcessEpmsGoalsInfo(Info)
    });


  }
  onClickDelivaryAddGoal(): void {
    const modalReference = this.modalService.open(AddGoalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    const osiEpmsCategoriesProcess = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const allGoalsList = osiEpmsCategoriesProcess.value;
    (<AddGoalComponent>modalReference.componentInstance).data = allGoalsList;
    (<AddGoalComponent>modalReference.componentInstance).kpisList = this.delivarycategoriesValuesList;
    modalReference.result.then((Info) => {
      this.updateosiEpmsDelivaryGoalsInfo(Info)
    });
  }
  updateosiEpmsDelivaryGoalsInfo(Info): any {
    const updatedGoals = Info['goals'];
    const osiEpmsCategoriesProcess = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    while (osiEpmsCategoriesProcess.length !== 0) {
      osiEpmsCategoriesProcess.removeAt(0)
    }
    const bindedInfo = this.populateOsiEpmsEmpKraDetails(updatedGoals);
    if (bindedInfo.length) {
      bindedInfo.map(updatedGoalInfo => osiEpmsCategoriesProcess.push(updatedGoalInfo));
    }
  }
  updateosiDelivaryProcessEpmsGoalsInfo(Info): any {
    const updatedGoals = Info['goals'];
    const osiEpmsCategoriesProcess = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    while (osiEpmsCategoriesProcess.length !== 0) {
      osiEpmsCategoriesProcess.removeAt(0)
    }
    const bindedInfo = this.populateOsiEpmsEmpKraDetails(updatedGoals);
    if (bindedInfo.length) {
      bindedInfo.map(updatedGoalInfo => osiEpmsCategoriesProcess.push(updatedGoalInfo));
    }
  }



  getDelivaryProcessCategories() {
    const CategoryName = 'Delivery Process';
    this.appraisalService.getCategoryInfo(CategoryName).subscribe(response => {
      this.delivaryProcesscategoriesList = response['osiEpmsKra']
    });
  }
  getDelivaryValuesCategories() {
    const CategoryName = 'Delivery Values';
    this.appraisalService.getCategoryInfo(CategoryName).subscribe(response => {
      this.delivarycategoriesValuesList = response['osiEpmsKra']
    });
  }
  addDelivaryProcessKpaInfo(index): void {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(index).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.push(
      this.formBuilder.group({
        epmsEmpKpaDetId: [],
        kpa: ['', [Validators.required, removeSpace]],
        kpi: [],
        trainingRequired: [],
        targetDate: [],
        empSelfRating: [0],
        empPmRmRating: [0],
        empComments: [],
        rmPmComments: [],
        additionalNotes: [],
        progress: [0],
        remarks: [],
        displayEmployeeComments: false,
        displayRMPMComments: false,
        osiEpmsEmpKraDetails: [],
        isEditable: [true],
        isEmployeeAccepted: false
      })
    );
  }
  addDelivaryKpaInfo(index): void {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(index).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.push(
      this.formBuilder.group({
        epmsEmpKpaDetId: [],
        kpa: ['', [Validators.required, removeSpace]],
        kpi: [],
        trainingRequired: [],
        targetDate: [],
        empSelfRating: [0],
        empPmRmRating: [0],
        empComments: [],
        rmPmComments: [],
        additionalNotes: [],
        progress: [0],
        remarks: [],
        displayEmployeeComments: false,
        displayRMPMComments: false,
        osiEpmsEmpKraDetails: [],
        isEditable: [true],
        isEmployeeAccepted: false
      })
    );
  }
  onClickFinalBtn(type): void {
    const modalReference = this.modalService.open(ConfirmationPopupComponent, {
      backdrop: 'static',
      keyboard: false
    });
    const message = 'Are you sure you want to';
    let btnType = '';
    switch (type) {
      case 'SUBMITTED':
        btnType = 'Submit';
        break;
      case 'SAVED':
        btnType = 'Save';
        break;
      case 'ACCEPT':
        btnType = 'Accept';
        break;
      case 'EMP ACCEPTED':
        btnType = 'Accept';
        break;
      default:
        btnType = type;
    }
    (<ConfirmationPopupComponent>modalReference.componentInstance).message = message;
    (<ConfirmationPopupComponent>modalReference.componentInstance).btnType = btnType;
    modalReference.result.then((Info) => {
      if (Info) {
        if (Info === "yes") {
          this.saveProjectInfo(type);
        }
      }
    });

  }
  saveProjectInfo(type): void {
    this.processErrorMessageClass = [];
    this.deliveryErrorMessageClass = [];

    this.checkKpasLength = false;
    this.processCheckKpasLength = false;
    this.delivaryCheckKpasLength = false;
    const projectStatus = this.projectForm.value['osiEpmsEmpDetails']['status'];
    const rmPmId = this.projectForm.value['osiEpmsEmpDetails']['rmPmId'];
    this.displayRatingsErrorMsg = false;
    this.displayCommentsErrorMsg = false;
    this.displayProcessCommentsErrorMsg = false;
    this.displayDeliveryCommentsErrorMsg = false;
    this.displayProcessRatingsErrorMsg = false;
    this.displayDeliveryRatingsErrorMsg = false;
    this.addGoalsErrorsMsg = false;
    this.dispalyProcessWeightErrMsg = false;
    this.dispalyDelivaryWeightErrMsg = false;
    this.addDelivaryGoalsErrorsMsg = false;
    this.addProcessGoalsErrorsMsg = false;
    const saveProjectObj = { ...this.projectForm.value };
    const osiEpmsEmpDetails = [];
    const empsEpaDetails = saveProjectObj['osiEpmsEmpDetails'];
    osiEpmsEmpDetails.push(saveProjectObj['osiEpmsEmpDetails']);
    saveProjectObj['osiEpmsEmpDetails'] = osiEpmsEmpDetails;
    saveProjectObj['saveOrSubmit'] = type;

    const checkCategoryProcessGoalsKras = empsEpaDetails['osiEpmsCategoriesProcess']['osiEpmsEmpKraDetails'];
    const checkCategoryDelivaryGoalsKras = empsEpaDetails['osiEpmsCategoriesValues']['osiEpmsEmpKraDetails'];


    if (checkCategoryProcessGoalsKras && checkCategoryProcessGoalsKras.length) {

      let processWeightValue = 0;
      checkCategoryProcessGoalsKras.forEach((kraInfo, index) => {
        const kpiErrorObjInfo = {
          kraInfoIndex: index,
          noKpa: false,
          noEmpRating: false,
          noRmRating: false,
          noEmpComments: false,
          noRmComments: false
        };
        if (!kraInfo['osiEpmsEmpKpaDetails'].length) {
          this.processCheckKpasLength = true;
          kpiErrorObjInfo['noKpa'] = true;
        }
        processWeightValue = Number(processWeightValue) + Number(kraInfo['weightage']);
        if (type === 'SUBMITTED') {

          if (kraInfo['osiEpmsEmpKpaDetails']) {
            kraInfo['osiEpmsEmpKpaDetails'].forEach(kpaInfo => {
              if (this.STATUS_CODE_INFO['RATING_INITIATED'] === projectStatus) {
                if (this.appraisalService.isRatingInvalid(kpaInfo['empSelfRating'])) {
                  this.displayProcessRatingsErrorMsg = true;
                  kpiErrorObjInfo['noEmpRating'] = true;
                }
                else if (!kpaInfo['empComments'].trim()) {
                  kpiErrorObjInfo['noEmpComments'] = true;
                  this.displayProcessCommentsErrorMsg = true;
                }
              }
              else if (this.STATUS_CODE_INFO['EMP_REVIEWED'] === projectStatus) {
                if (this.appraisalService.isRatingInvalid(kpaInfo['empPmRmRating'])) {
                  this.displayProcessRatingsErrorMsg = true;
                  kpiErrorObjInfo['noRmRating'] = true;
                }
                else if (!kpaInfo['rmPmComments'].trim()) {
                  kpiErrorObjInfo['noRmComments'] = true;
                  this.displayProcessCommentsErrorMsg = true;
                }
              }
            });
          }
        }
        this.processErrorMessageClass.push(kpiErrorObjInfo);
      });
      if (processWeightValue !== 100) {
        this.dispalyProcessWeightErrMsg = true;
      }

    } else {
      if (this.STATUS_CODE_INFO['RATING_INITIATED'] === projectStatus ||
        this.STATUS_CODE_INFO['PM_DRAFT'] === projectStatus ||
        this.userId == rmPmId
      ) {
        this.addProcessGoalsErrorsMsg = true;
      }

    }

    if (checkCategoryDelivaryGoalsKras && checkCategoryDelivaryGoalsKras.length) {
      let delivaryWeightValue = 0;
      checkCategoryDelivaryGoalsKras.forEach((kraInfo, index) => {
        const kpiErrorObjInfo = {
          kraInfoIndex: index,
          noKpa: false,
          noEmpRating: false,
          noRmRating: false,
          noEmpComments: false,
          noRmComments: false
        };
        if (!kraInfo['osiEpmsEmpKpaDetails'].length) {
          this.delivaryCheckKpasLength = true;
        }
        delivaryWeightValue = Number(delivaryWeightValue) + Number(kraInfo['weightage']);
        if (type === 'SUBMITTED') {
          if (kraInfo['osiEpmsEmpKpaDetails']) {
            kraInfo['osiEpmsEmpKpaDetails'].forEach(kpaInfo => {
              if (this.STATUS_CODE_INFO['RATING_INITIATED'] === projectStatus) {
                if (this.appraisalService.isRatingInvalid(kpaInfo['empSelfRating'])) {
                  kpiErrorObjInfo['noEmpRating'] = true;
                  this.displayDeliveryRatingsErrorMsg = true;
                }
                else if (!(kpaInfo['empComments']).trim()) {
                  kpiErrorObjInfo['noEmpComments'] = true;
                  this.displayDeliveryCommentsErrorMsg = true;
                }
              }
              else if (this.STATUS_CODE_INFO['EMP_REVIEWED'] === projectStatus) {
                if (this.appraisalService.isRatingInvalid(kpaInfo['empPmRmRating'])) {
                  kpiErrorObjInfo['noRmRating'] = true;
                  this.displayDeliveryRatingsErrorMsg = true;
                }
                else if (!(kpaInfo['rmPmComments']).trim()) {
                  kpiErrorObjInfo['noRmComments'] = true;
                  this.displayDeliveryCommentsErrorMsg = true;
                }
              }
            });
          }
        }
        this.deliveryErrorMessageClass.push(kpiErrorObjInfo);
      });
      if (delivaryWeightValue !== 100) {
        this.dispalyDelivaryWeightErrMsg = true;
      }

    } else {
      if (this.STATUS_CODE_INFO['RATING_INITIATED'] === projectStatus ||
        this.STATUS_CODE_INFO['PM_DRAFT'] === projectStatus ||
        this.userId == rmPmId
      ) {
        this.addDelivaryGoalsErrorsMsg = true;
      }
    }

    if (
      !this.dispalyProcessWeightErrMsg &&
      !this.dispalyDelivaryWeightErrMsg &&
      !this.addDelivaryGoalsErrorsMsg &&
      !this.addProcessGoalsErrorsMsg &&
      !this.processCheckKpasLength &&
      !this.delivaryCheckKpasLength &&
      !this.displayRatingsErrorMsg &&
      !this.displayCommentsErrorMsg &&
      !this.displayProcessCommentsErrorMsg &&
      !this.displayDeliveryCommentsErrorMsg &&
      !this.displayProcessRatingsErrorMsg &&
      !this.displayDeliveryRatingsErrorMsg
    ) {


      if (type === "DECLINED") {
        const modalReference = this.modalService.open(DeclineCommentsComponent, {
          backdrop: 'static',
          keyboard: false
        });
        (<DeclineCommentsComponent>modalReference.componentInstance).responseObj = saveProjectObj;
        (<DeclineCommentsComponent>modalReference.componentInstance).type = "projects";
        modalReference.result.then((response) => {
          if (response && response['osiEpmsEmpDetails'] && response['osiEpmsEmpDetails'][0]) {
            this.getProjectInfo(response['osiEpmsEmpDetails'][0]['projectId']);
            this.getEmployeeStatusCountInfo();
          }
        });
      } else {
        $('#loadModal').modal('show');
        this.appraisalService.saveProjectGoals(saveProjectObj).subscribe(
          (response) => {
            $('#loadModal').modal('hide');
            this.toastr.success("Record Updated Successfully");
            if (response && response['osiEpmsEmpDetails'] && response['osiEpmsEmpDetails'][0]) {
              this.getProjectInfo(response['osiEpmsEmpDetails'][0]['projectId']);
              this.getEmployeeStatusCountInfo();
            }
          },
          (error) => {
            console.log("Error");
            console.log(error);
            const errorInfo = JSON.parse(error['_body']);
            this.toastr.error(errorInfo['developerMessage']);
          }
        )
      }

      if (this.processErrorMessageClass && this.processErrorMessageClass.length) {
        this.processErrorMessageClass.forEach((errorInfo, index) => {
          this.onClickDelivaryProcessHeader(index);
        });
      }

    } else {
      if (this.dispalyProcessWeightErrMsg) {
        this.toastr.error("Delivery Process Goals should be 100%.");
      }
      if (this.dispalyDelivaryWeightErrMsg) {
        this.toastr.error("Delivery Values Goals should be 100%.");
      }
      if (this.addProcessGoalsErrorsMsg) {
        this.toastr.error("Please add Delivery Process Goals.");
      }

      if (this.addDelivaryGoalsErrorsMsg) {
        this.toastr.error("Please add Delivery Values Goals.");
      }

      if (this.processCheckKpasLength) {
        this.toastr.error("Delivery Process Goal should contain at least one Performance area.");
      }

      if (this.delivaryCheckKpasLength) {
        this.toastr.error("Delivery Values Goal should contain at least one Performance area.");
      }

      if (this.displayProcessCommentsErrorMsg || this.displayProcessRatingsErrorMsg) {
        this.toastr.error("Delivery Process Ratings And Comments required.");
      }
      if (this.displayDeliveryCommentsErrorMsg || this.displayDeliveryRatingsErrorMsg) {
        this.toastr.error("Delivery Values Ratings And Comments required.");
      }
    }
  }
  getEmployeeStatusCountInfo() {
    const { employeeId, epmsHdrId } = this.employeeDetails;

    this.appraisalService.getEmployeeStatusInfo(employeeId, epmsHdrId).subscribe(response => {
      if (response && response.length) {
        const acceptedCountInfo = response.filter(statusInfo => statusInfo['status'] === AppConstants.STATUS_CODE_LIST['EMP_ACCEPTED']);
        this.appraisalService.acceptedCount = acceptedCountInfo.length || 0;
        this.appraisalService.totalCount = response.length || 0;
      };
    });
  }

  updatecategoryProcessViewEditMode(kraIndex, kpaIndex) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.at(kpaIndex).patchValue({
      isEditable: false
    });

  }
  deleteosiEpmsCategoriesValuesKra(kraIndex, kpaIndex) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.removeAt(kpaIndex);
  }
  updatecategoryProcessEditMode(kraIndex, kpaIndex) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.at(kpaIndex).patchValue({
      isEditable: true
    });

  }

  updatecategoryDelivaryViewEditMode(kraIndex, kpaIndex) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.at(kpaIndex).patchValue({
      isEditable: false
    });

  }
  deleteosiEpmsDelivaryValuesKra(kraIndex, kpaIndex) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.removeAt(kpaIndex);
  }
  updatecategoryDelivaryEditMode(kraIndex, kpaIndex) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    kraInfo.at(kpaIndex).patchValue({
      isEditable: true
    });

  }
  displayCategoryProcessEmpComments(kraIndex, kpaIndex, type) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    const displayEmpComments = kraInfo.at(kpaIndex).get('displayEmployeeComments').value;
    kraInfo.at(kpaIndex).patchValue({
      displayEmployeeComments: !displayEmpComments
    });

    // if (type === 'close') {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayEmployeeComments: false
    //   });
    // } else {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayEmployeeComments: true
    //   });
    // }

  }
  displayCategoryProcessRmEmpComments(kraIndex, kpaIndex, type) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    const displayRMPMComments = kraInfo.at(kpaIndex).get('displayRMPMComments').value;
    kraInfo.at(kpaIndex).patchValue({
      displayRMPMComments: !displayRMPMComments
    });
    // if (type === 'close') {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayRMPMComments: false
    //   });
    // } else {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayRMPMComments: true
    //   });
    // }

  }
  displayCategoryValuesEmpComments(kraIndex, kpaIndex, type) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    const displayEmpComments = kraInfo.at(kpaIndex).get('displayEmployeeComments').value;
    kraInfo.at(kpaIndex).patchValue({
      displayEmployeeComments: !displayEmpComments
    });
    // if (type === 'close') {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayEmployeeComments: false
    //   });
    // } else {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayEmployeeComments: true
    //   });
    // }

  }
  displayCategoryValuesRmEmpComments(kraIndex, kpaIndex, type) {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    const displayRMPMComments = kraInfo.at(kpaIndex).get('displayRMPMComments').value;
    kraInfo.at(kpaIndex).patchValue({
      displayRMPMComments: !displayRMPMComments
    });
    // if (type === 'close') {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayRMPMComments: false
    //   });
    // } else {
    //   kraInfo.at(kpaIndex).patchValue({
    //     displayRMPMComments: true
    //   });
    // }

  }

  navigatepreviouspage() {
    this.router.navigateByUrl('/reviewcycle/teamgoals');
  }
  ViewAllEmployees(): void {
    const { employeeId } = this.employeeDetails;
    if (!this.allEmployeeList.length) {
      this.appraisalService.getAllEmployeesList(employeeId).subscribe(
        (response) => {
          this.allEmployeeList = response || [];
        },
        (error) => {
          const errorInfo = JSON.parse(error['_body']);
          this.toastr.error(errorInfo['developerMessage']);
        }
      );
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
  onClickLoadTemplate(): void {
    const { epmsHdrId } = this.employeeDetails;
    const modalReference = this.modalService.open(LoadTemplateComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false
    });
    (<LoadTemplateComponent>modalReference.componentInstance).orgId = this.orgId;
    (<LoadTemplateComponent>modalReference.componentInstance).projectId = this.projectId;
    (<LoadTemplateComponent>modalReference.componentInstance).epmsHdrId = epmsHdrId;
    (<LoadTemplateComponent>modalReference.componentInstance).projectName = this.projectName;

    modalReference.result.then((Info) => {
      if (Info) {
        if (Info['osiEpmsCategoriesProcess'] && Info['osiEpmsCategoriesProcess']['osiEpmsEmpKraDetails']) {
          this.updateTemplateCategoryProcessInfo(Info['osiEpmsCategoriesProcess'], 'osiEpmsCategoriesProcess');
        }
        if (Info['osiEpmsCategoriesValues'] && Info['osiEpmsCategoriesValues']['osiEpmsEmpKraDetails']) {
          this.updateTemplateCategoryProcessInfo(Info['osiEpmsCategoriesValues'], 'osiEpmsCategoriesValues');
        }
      }
    });
  }
  updateTemplateCategoryProcessInfo(osiEpmsCategoriesProcessValues, categoryType): void {
    const processKra = osiEpmsCategoriesProcessValues['osiEpmsEmpKraDetails'];
    processKra.forEach(templateKrs => {
      const kpasSelected = templateKrs['osiEpmsEmpKpaDetails'].filter(kpa => kpa['isSelected']);
      const categoryProcessKraDetails = this.projectForm.get('osiEpmsEmpDetails').get(categoryType).get('osiEpmsEmpKraDetails') as FormArray;
      if (kpasSelected && kpasSelected.length) {
        const checkKraExist = categoryProcessKraDetails.value.filter((kra, index) => {
          if (templateKrs['osiEpmsKra']['kraId'] === kra['osiEpmsKra']['kraId']) {
            return kra;
          }
        });
        if (checkKraExist && checkKraExist.length) {

          const templateKpas = (templateKrs['osiEpmsEmpKpaDetails'] && templateKrs['osiEpmsEmpKpaDetails'].filter(kpa => kpa['isSelected'])) || [];
          const existingKpas = checkKraExist[0]['osiEpmsEmpKpaDetails'] || [];
          const existingKpaNames = new Set(existingKpas.map(kpaInfo => kpaInfo.kpa));
          const mergeredKpas = [...existingKpas, ...templateKpas.filter(kpa => !existingKpaNames.has(kpa.kpa))];
          this.populateUpdatedKpas(mergeredKpas, checkKraExist, categoryType);
        } else {
          templateKrs['osiEpmsEmpKpaDetails'] = (templateKrs['osiEpmsEmpKpaDetails'] && templateKrs['osiEpmsEmpKpaDetails'].filter(kpa => kpa['isSelected'])) || [];
          this.populateProcessLoadTemplateKra(templateKrs, categoryType);
        }
      }
    });

  }

  populateProcessLoadTemplateKra(kraInfo, categoryType): void {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get(categoryType).get('osiEpmsEmpKraDetails') as FormArray;
    categoryValueKraDetails.push(
      this.formBuilder.group({
        epmsEmpKraDetId: kraInfo['epmsEmpKraDetId'],
        weightage: kraInfo['weightage'],
        empSelfRating: kraInfo['empSelfRating'] ? kraInfo['empSelfRating'] : 0,
        empPmRmRating: kraInfo['empPmRmRating'] ? kraInfo['empPmRmRating'] : 0,
        osiEpmsEmpDetails: kraInfo['osiEpmsEmpDetails'],
        creationDate: kraInfo['creationDate'],
        createdBy: kraInfo['createdBy'],
        osiEpmsKra: kraInfo['osiEpmsKra'] ? this.populateOsiEpmsKra(kraInfo['osiEpmsKra']) : [],
        displayEmployeeTooltip: false,
        displayRmTooltip: false,
        osiEpmsEmpKpaDetails: kraInfo['osiEpmsEmpKpaDetails'] ? this.formBuilder.array(this.populateOsiEpmsEmpKpaDetails(kraInfo['osiEpmsEmpKpaDetails'])) : [],
        isExpand: false,
        viewComments: false,
        isEmployeeAccepted: false
      })
    );
  }
  populateUpdatedKpas(kpaList, existingKra, categoryType): void {
    const categoryProcessKraDetails = this.projectForm.get('osiEpmsEmpDetails').get(categoryType).get('osiEpmsEmpKraDetails') as FormArray;
    let indexValue = 0
    const checkKraExist = categoryProcessKraDetails.value.filter((kra, index) => {
      if (existingKra[0]['osiEpmsKra']['kraId'] === kra['osiEpmsKra']['kraId']) {
        indexValue = index;
        return kra;
      }
    });
    const kraInfo = categoryProcessKraDetails.at(indexValue).get('osiEpmsEmpKpaDetails') as FormArray;
    while (kraInfo.length !== 0) {
      kraInfo.removeAt(0)
    }
    kpaList.forEach((kpa) => {
      kraInfo.push(this.addKpaInfo(kpa))
    });

  }
  addKpaInfo(kpaInfo): any {
    return this.formBuilder.group({
      epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
      kpa: [kpaInfo['kpa'], [Validators.required, removeSpace]],
      kpi: kpaInfo['kpi'],
      trainingRequired: kpaInfo['trainingRequired'],
      targetDate: kpaInfo['targetDate'],
      empSelfRating: kpaInfo['empSelfRating'] ? kpaInfo['empSelfRating'] : 0,
      empPmRmRating: kpaInfo['empPmRmRating'] ? ['empPmRmRating'] : 0,
      empComments: kpaInfo['empComments'] || '',
      displayEmployeeComments: false,
      additionalNotes: kpaInfo['additionalNotes'] || '',
      progress: kpaInfo['progress'] || 0,
      displayRMPMComments: false,
      rmPmComments: kpaInfo['rmPmComments'] || '',
      remarks: kpaInfo['remarks'],
      osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
      isEditable: false,
      creationDate: kpaInfo['creationDate'],
      createdBy: kpaInfo['createdBy'],
      isEmployeeAccepted: false
    })
  }
  updateKpaInfo(kraIndex, kpaIndex): void {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    const additionalNotes = kraInfo.at(kpaIndex).get('additionalNotes').value;
    const progress = kraInfo.at(kpaIndex).get('progress').value;
    const status = this.projectForm.value['osiEpmsEmpDetails']['status'];
    const epmsEmpKpaDetId = kraInfo.at(kpaIndex).get('epmsEmpKpaDetId').value;
    const modalReference = this.modalService.open(UpdateKpaInfoComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'

    });
    (<UpdateKpaInfoComponent>modalReference.componentInstance).additionalNotes = additionalNotes;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).progress = progress;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).status = status;

    (<UpdateKpaInfoComponent>modalReference.componentInstance).epmsEmpKpaDetId = epmsEmpKpaDetId;
    if (this.userId == this.employeeDetails.employeeId && this.projectForm.value['osiEpmsEmpDetails']['status'] !== this.STATUS_CODE_INFO['CLOSED']) {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = false;
    } else {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = true;
    }

    modalReference.result.then((Info) => {
      if (Info) {
        kraInfo.at(kpaIndex).patchValue({
          additionalNotes: (Info['additionalNotes'] ? Info['additionalNotes'] : ''),
          progress: Info['progress']
        });
      }
    });
  }

  updateCategoryValuesKpaInfo(kraIndex, kpaIndex): void {
    const categoryValueKraDetails = this.projectForm.get('osiEpmsEmpDetails').get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const kraInfo = categoryValueKraDetails.at(kraIndex).get('osiEpmsEmpKpaDetails') as FormArray;
    const additionalNotes = kraInfo.at(kpaIndex).get('additionalNotes').value;
    const progress = kraInfo.at(kpaIndex).get('progress').value;
    const epmsEmpKpaDetId = kraInfo.at(kpaIndex).get('epmsEmpKpaDetId').value;
    const status = this.projectForm.value['osiEpmsEmpDetails']['status'];
    const modalReference = this.modalService.open(UpdateKpaInfoComponent, {
      backdrop: 'static',
      keyboard: false, size: 'lg'
    });
    (<UpdateKpaInfoComponent>modalReference.componentInstance).additionalNotes = additionalNotes;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).progress = progress;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).epmsEmpKpaDetId = epmsEmpKpaDetId;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).status = status;
    if (this.userId == this.employeeDetails.employeeId && this.projectForm.value['osiEpmsEmpDetails']['status'] !== this.STATUS_CODE_INFO['CLOSED']) {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = false;
    } else {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = true;
    }
    modalReference.result.then((Info) => {
      if (Info) {
        kraInfo.at(kpaIndex).patchValue({
          additionalNotes: (Info['additionalNotes'] ? Info['additionalNotes'] : ''),
          progress: Info['progress']
        });
      }
    });
  }
  onClickShowHistory(): void {
    const modalReference = this.modalService.open(ShowHistoryComponentComponent, {
      backdrop: 'static',
      keyboard: false, size: 'lg'
    });
    const projectId = this.projectListForm.get('projectId').value;
    (<ShowHistoryComponentComponent>modalReference.componentInstance).epmsEmpDetId = this.epmsEmpDetId;
  }


}
