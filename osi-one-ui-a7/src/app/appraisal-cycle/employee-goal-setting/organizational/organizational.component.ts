import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { AppConstants } from '../../../shared/app-constants';
import { NgbActiveModal, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MyGoalsEmpdevelopmentComponent } from '../../my-goals-empdevelopment/my-goals-empdevelopment.component';
import { UpdateKpaInfoComponent } from '../update-kpa-info/update-kpa-info.component';
import { DeclineCommentsComponent } from '../decline-comments/decline-comments.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ShowHistoryComponentComponent } from '../show-history-component/show-history-component.component';
import { removeSpace } from '../../../shared/validators/trim-space';
declare var $: any;

@Component({
  selector: 'app-organizational',
  templateUrl: './organizational.component.html',
  styleUrls: ['./organizational.component.css']
})
export class OrganizationalComponent implements OnInit {
  employeeDetails;
  ratingList = [1, 2, 3, 4, 5];
  trainingRequired = [{ name: "Yes", value: 1 },
  { name: "No", value: 0 }]
  empsOrgdevelopment: FormGroup;
  empsOrgimprovement: FormGroup;
  developmentAreasList = [];
  imporvementAreasList = [];
  osiEpmsEmpDetails: any;
  osiLoggedUserGoals = [];
  empStatus = "";
  sectionHeader_imp = "";
  sectionHeader_dev = "";
  weightage = "";
  epmsEmpDetId = "";
  reviewedByName = "";
  kradetails;
  STATUS_CODE_INFO = AppConstants.STATUS_CODE_LIST;
  displayRatingsErrorMsg = false;
  isSubmittedOrAccepted = false;
  displayCommentsErrorMsg = false;
  checkKpasLength = false;
  isGoalEnabled = false;
  showHideInitiateRating = false;
  isFromMyGoals = false;
  loggedUserId;
  categoryId;
  responseObj = {};
  commentsInfo;
  hasORGLevelDuplicateKpas = false;
  hasBULevelDuplicateKpas = false;
  checkYearInfo = false;
  isManagerRatingEnabled = true;
  supervisorId;
  passedValue: any;

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public appraisalService: AppraisalService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private config: NgbDatepickerConfig

  ) {
    const date = new Date();
    config.minDate = { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
  }

  ngOnInit() {

    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();

    this.appraisalService.breadcrumbText = 'Organization';
    this.loggedUserId = localStorage.getItem('userId');
    this.employeeDetails = JSON.parse(localStorage.getItem('setGoals'));
    this.supervisorId = this.employeeDetails['supervisorId'];
    this.checkYearInfo = Number(this.employeeDetails['selectedYear']) < 2020 ? true : false;
    this.preformanceAreas();
    this.performanceAreas_Imp();
    this.getEmpsEmpDetails();
    this.getKraDetails();
    this.getRatingList();
  }

  getEmpsEmpDetails() {
    $('#loadModal').modal('show');
    const { epmsHdrId, employeeId } = this.employeeDetails;
    const loginId = localStorage.getItem('userId');
    this.appraisalService.getOrgEmployeeDevelopmentInfo(employeeId, epmsHdrId).subscribe(response => {
      this.responseObj = JSON.parse(JSON.stringify(response));
      this.osiEpmsEmpDetails = response;
      this.appraisalService.setDefaultRating(this.osiEpmsEmpDetails);
      this.isGoalEnabled = response.isGoalEnabled;
      this.appraisalService.empOverallRating = this.osiEpmsEmpDetails['empOverallRating'];
      this.appraisalService.empSelfRating = this.osiEpmsEmpDetails['empSelfRating'];
      const status = this.osiEpmsEmpDetails['status'];
      this.appraisalService.epmsStatus = this.appraisalService.getStatusDescription(status);
      this.empStatus = response['osiEpmsEmpDetails'] ? response['osiEpmsEmpDetails'][0].status : "null";
      this.reviewedByName = response['osiEpmsEmpDetails'] ? response['osiEpmsEmpDetails'][0].reviewedByName : "null";
      this.weightage = response['osiEpmsEmpDetails'] ? response['osiEpmsEmpDetails'][0].weightage : "null";
      this.epmsEmpDetId = response['osiEpmsEmpDetails'] ? response['osiEpmsEmpDetails'][0].epmsEmpDetId : "null";
      if (loginId != this.supervisorId) {
        this.isManagerRatingEnabled = !(this.empStatus === this.STATUS_CODE_INFO['EMP_REVIEWED']);
      }

      if (loginId == response['osiEpmsEmpDetails'][0].rmPmId) {
        this.showHideInitiateRating = true;
      }
      this.populateData(response);
    },
      (error) => {
        const errorInfo = JSON.parse(error['_body']);
        this.toastr.error(errorInfo['developerMessage']);
      }
    );
    $('#loadModal').modal('hide');
  }

  populateIndividualData(response) {
    const commonIDsOrg = [];
    const commonIDsBU = [];
    const objOrg = response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails[0].osiEpmsEmpKpaDetails;
    const objBu = response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails[1].osiEpmsEmpKpaDetails;

    const formArrayValuesOrg = this.empsOrgdevelopment.value.osiEpmsEmpKpaDetails;
    const formArrayValuesBU = this.empsOrgimprovement.value.osiEpmsEmpImpKpaDetails;
    objOrg.forEach(element => {
      commonIDsOrg.push(element.kpa);
    });
    objBu.forEach(element => {
      commonIDsBU.push(element.kpa);
    });
    formArrayValuesOrg.forEach(element => {
      commonIDsOrg.push(element.kpa);
    });
    formArrayValuesBU.forEach(element => {
      commonIDsBU.push(element.kpa);
    });
    const resultOrg = commonIDsOrg.filter((e, i, a) => a.indexOf(e) !== i);
    const resultBU = commonIDsBU.filter((e, i, a) => a.indexOf(e) !== i);
    if (this.passedValue === 'org') {
      if (resultOrg.length < 1) {
        this.developmentAreasList = response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails ? response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails[0] : [];
        this.populateOsiEpmsEmpKpaDetails_Development(this.developmentAreasList);
        this.toastr.success('Goals are added to the Employee');
      } else {
        this.toastr.warning('Goals are already existed to the Employee');
      }
    }
    if (this.passedValue === 'BU') {
      if (resultBU.length < 1) {
        this.imporvementAreasList = response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails ? response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails[1] : [];
        this.populateOsiEpmsEmpKpaDetails_Improvement(this.imporvementAreasList);
        this.toastr.success('Goals are added to the Employee');
      } else {
        this.toastr.warning('Goals are already existed to the Employee');
      }
    }
    this.commentsInfo = response['osiEpmsEmpDetails'][0].comments || '';
  }


  populateData(response) {
    this.developmentAreasList = response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails ? response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails[0] : [];
    this.imporvementAreasList = response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails ? response['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails[1] : [];
    this.commentsInfo = response['osiEpmsEmpDetails'][0].comments || '';
    this.populateOsiEpmsEmpKpaDetails_Development(this.developmentAreasList);
    this.populateOsiEpmsEmpKpaDetails_Improvement(this.imporvementAreasList);
  }

  getRatingList() {
    this.appraisalService.getRatingsList().subscribe(response => {
      this.ratingList = response;
    },
      (error) => {
        const errorInfo = JSON.parse(error['_body']);
        this.toastr.error(errorInfo['developerMessage']);
      }
    );
  }

  getKraDetails() {
    const CategoryName = 'ORGANIZATION';
    this.appraisalService.getCategoryInfo(CategoryName).subscribe(response => {
      this.kradetails = response['osiEpmsKra'];
      this.categoryId = response['categoryId'];
      this.sectionHeader_dev = this.kradetails[0].name;
      this.sectionHeader_imp = this.kradetails[1].name;
    },
      (error) => {
        const errorInfo = JSON.parse(error['_body']);
        this.toastr.error(errorInfo['developerMessage']);
      }
    );
  }

  onClickInitiateRating() {
    const request = { "epmsEmpDetId": this.epmsEmpDetId }
    this.appraisalService.initiateRatings(request).subscribe(response => {
      this.toastr.success("Status changed Successfully");
      this.preformanceAreas();
      this.performanceAreas_Imp();
      this.getEmpsEmpDetails();
    },
      (error) => {
        const errorInfo = JSON.parse(error['_body']);
        this.toastr.error(errorInfo['developerMessage']);
      }
    );
  }

  onClickmyGoals() {
    if (this.isGoalEnabled) {
      const loggedUserId = localStorage.getItem('userId');
      const epmsHdrId = this.employeeDetails.epmsHdrId;
      const modalReference = this.modalService.open(MyGoalsEmpdevelopmentComponent, {
        backdrop: 'static',
        keyboard: false
      });
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance).isFrom = "ORGANIZATION";
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance).epmsHdrId = epmsHdrId;
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance).categoryId = this.categoryId;
      modalReference.result.then((data) => {
        if (data) {
          this.isFromMyGoals = true;
          this.populateData(data);
        }
      });
    }
  }

  onCloneGoals(passedValue) {
    if (this.isGoalEnabled) {
      const loggedUserId = localStorage.getItem('userId');
      const epmsHdrId = this.employeeDetails.epmsHdrId;
      const modalReference = this.modalService.open(MyGoalsEmpdevelopmentComponent, {
        backdrop: 'static',
        keyboard: false,
      });
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance).isFrom = 'both';
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance).epmsHdrId = epmsHdrId;
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance).categoryId = this.categoryId;
      (<MyGoalsEmpdevelopmentComponent>modalReference.componentInstance)['passedValue'] = passedValue;
      modalReference.result.then((data) => {
        if (data) {
          this.isFromMyGoals = true;
          this.passedValue = passedValue;
          this.populateIndividualData(data);
        }
      });
    }
  }

  preformanceAreas() {
    this.empsOrgdevelopment = this.formBuilder.group({
      osiEpmsEmpKpaDetails: this.formBuilder.array([])

    });
  }

  performanceAreas_Imp() {
    this.empsOrgimprovement = this.formBuilder.group({
      osiEpmsEmpImpKpaDetails: this.formBuilder.array([])

    });
  }

  get empKparatingInfo(): FormArray {
    return this.empsOrgdevelopment.get('osiEpmsEmpKpaDetails') as FormArray;
  }

  get empKparatingInfoforImp(): FormArray {
    return this.empsOrgimprovement.get('osiEpmsEmpImpKpaDetails') as FormArray;
  }

  //=== Adding and Deleting Performance Areas for Development ====//
  onClickAddPreformanceAreas() {
    this.empKparatingInfo.push(this.formBuilder.group({
      epmsEmpKpaDetId: [],
      kpa: ['', [Validators.required, removeSpace]],
      kpi: [''],
      targetDate: ['', Validators.required],
      empSelfRating: [],
      empPmRmRating: [],
      empComments: [''],
      rmPmComments: [''],
      remarks: [''],
      epmsEmpKpaParentDetId: [],
      trainingRequired: 0,
      osiEpmsEmpKraDetails: null,
      isEditable: true,
      displayEmployeeComments: false,
      displayManagerComments: false,
      additionalNotes: [''],
      progress: 0,
      formatedate: [''],
      isEmployeeAccepted: false
    }));
  }

  updatePerfomanceFields(index) {
    this.empKparatingInfo.at(index).patchValue({
      isEditable: false,
    });

  }

  updatePerformanceAreasEditMode(index) {
    this.empKparatingInfo.at(index).patchValue({
      isEditable: true,
    });
  }

  deletePerfomanceFields(index) {
    this.empKparatingInfo.removeAt(index);
  }

  displayEmpComments(kpaIndex, state) {
    this.empKparatingInfo.at(kpaIndex).patchValue({
      displayEmployeeComments: !this.empKparatingInfo.at(kpaIndex).get('displayEmployeeComments').value
    });
  }

  displayEmpPMComments(kpaIndex, state) {
    if (this.empStatus === this.STATUS_CODE_INFO['EMP_REVIEWED'] || this.empStatus === this.STATUS_CODE_INFO['RM_REVIEWED']) {
      this.empKparatingInfo.at(kpaIndex).patchValue({
        displayManagerComments: !this.empKparatingInfo.at(kpaIndex).get('displayManagerComments').value
      });
    }
  }

  displayEmpComments_imp(kpaIndex, state) {
    this.empKparatingInfoforImp.at(kpaIndex).patchValue({
      displayEmployeeComments: !this.empKparatingInfoforImp.at(kpaIndex).get('displayEmployeeComments').value
    });
  }

  displayEmpPMComments_imp(kpaIndex, state) {
    if (this.empStatus === this.STATUS_CODE_INFO['EMP_REVIEWED'] || this.empStatus === this.STATUS_CODE_INFO['RM_REVIEWED']) {
      this.empKparatingInfoforImp.at(kpaIndex).patchValue({
        displayManagerComments: !this.empKparatingInfoforImp.at(kpaIndex).get('displayManagerComments').value
      });
    }
  }

  //=== Adding and Deleting Performance Areas for Improvements ====//
  onClickAddPreformanceAreasforImp() {
    this.empKparatingInfoforImp.push(this.formBuilder.group({
      epmsEmpKpaDetId: [],
      kpa: ['', [Validators.required, removeSpace]],
      kpi: [''],
      targetDate: ['', Validators.required],
      empSelfRating: [],
      empPmRmRating: [],
      empComments: [''],
      rmPmComments: [''],
      epmsEmpKpaParentDetId: [],
      remarks: [''],
      trainingRequired: 0,
      osiEpmsEmpKraDetails: null,
      isEditable: true,
      displayEmployeeComments: false,
      displayManagerComments: false,
      additionalNotes: [''],
      progress: 0,
      formatedate: [''],
      isEmployeeAccepted: false
    }));
  }

  deletePerfomanceFields_imp(index) {
    this.empKparatingInfoforImp.removeAt(index);
  }

  updatePerfomanceFields_imp(index) {
    this.empKparatingInfoforImp.at(index).patchValue({
      isEditable: false,
    });
  }

  updatePerformanceAreasEditMode_imp(index) {
    this.empKparatingInfoforImp.at(index).patchValue({
      isEditable: true,
    });
  }

  populateOsiEpmsEmpKpaDetails_Development(osiEpmsEmpKpaDetails) {
    if (osiEpmsEmpKpaDetails) {
      if (this.isFromMyGoals) {
        osiEpmsEmpKpaDetails.osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          const convertedDate = this.getNgbDateModal(kpaInfo);
          this.empKparatingInfo.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: [],
              kpa: [kpaInfo['kpa'], [Validators.required, removeSpace]],
              kpi: kpaInfo['kpi'],
              trainingRequired: kpaInfo['trainingRequired'],
              targetDate: [convertedDate, [Validators.required]],
              empSelfRating: kpaInfo['empSelfRating'],
              empPmRmRating: this.isManagerRatingEnabled ? kpaInfo['empPmRmRating'] : 0,
              empComments: kpaInfo['empComments'],
              rmPmComments: kpaInfo['rmPmComments'],
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isEditable: true,
              displayEmployeeComments: false,
              displayManagerComments: false,
              additionalNotes: kpaInfo['additionalNotes'] || '',
              progress: kpaInfo['progress'] || 0,
              formatedate: convertedDate,
              isEmployeeAccepted: kpaInfo['isEmployeeAccepted']
            })
          );
        });
      } else {
        osiEpmsEmpKpaDetails.osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          const convertedDate = this.getNgbDateModal(kpaInfo);
          this.empKparatingInfo.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
              kpa: [kpaInfo['kpa'], [Validators.required, removeSpace]],
              kpi: kpaInfo['kpi'],
              trainingRequired: kpaInfo['trainingRequired'],
              targetDate: [convertedDate, [Validators.required]],
              empSelfRating: kpaInfo['empSelfRating'],
              empPmRmRating: this.isManagerRatingEnabled ? kpaInfo['empPmRmRating'] : 0,
              empComments: kpaInfo['empComments'],
              rmPmComments: kpaInfo['rmPmComments'],
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaParentDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isEditable: false,
              displayEmployeeComments: false,
              displayManagerComments: false,
              additionalNotes: kpaInfo['additionalNotes'] || '',
              progress: kpaInfo['progress'] || 0,
              formatedate: convertedDate,
              isEmployeeAccepted: kpaInfo['isEmployeeAccepted']
            })
          );
        });
      }

    }
  }

  populateOsiEpmsEmpKpaDetails_Improvement(osiEpmsEmpKpaDetails) {
    if (osiEpmsEmpKpaDetails) {
      if (this.isFromMyGoals) {
        osiEpmsEmpKpaDetails.osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          const convertedDate = this.getNgbDateModal(kpaInfo);
          this.empKparatingInfoforImp.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: [],
              kpa: [kpaInfo['kpa'], [Validators.required, removeSpace]],
              kpi: kpaInfo['kpi'],
              trainingRequired: kpaInfo['trainingRequired'],
              targetDate: [convertedDate, [Validators.required]],
              empSelfRating: kpaInfo['empSelfRating'],
              empPmRmRating: this.isManagerRatingEnabled ? kpaInfo['empPmRmRating'] : 0,
              empComments: kpaInfo['empComments'],
              rmPmComments: kpaInfo['rmPmComments'],
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isEditable: true,
              displayEmployeeComments: false,
              displayManagerComments: false,
              additionalNotes: kpaInfo['additionalNotes'] || '',
              progress: kpaInfo['progress'] || 0,
              formatedate: convertedDate,
              isEmployeeAccepted: kpaInfo['isEmployeeAccepted']
            })
          );
        });
      } else {
        osiEpmsEmpKpaDetails.osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          const convertedDate = this.getNgbDateModal(kpaInfo);
          this.empKparatingInfoforImp.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
              kpa: [kpaInfo['kpa'], [Validators.required, removeSpace]],
              kpi: kpaInfo['kpi'],
              trainingRequired: kpaInfo['trainingRequired'],
              targetDate: [convertedDate, [Validators.required]],
              empSelfRating: kpaInfo['empSelfRating'],
              empPmRmRating: this.isManagerRatingEnabled ? kpaInfo['empPmRmRating'] : 0,
              empComments: kpaInfo['empComments'],
              rmPmComments: kpaInfo['rmPmComments'],
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaParentDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isEditable: false,
              displayEmployeeComments: false,
              displayManagerComments: false,
              additionalNotes: kpaInfo['additionalNotes'] || '',
              progress: kpaInfo['progress'] || 0,
              formatedate: convertedDate,
              isEmployeeAccepted: kpaInfo['isEmployeeAccepted']
            })
          );
        });
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
    },
      (error) => {
        const errorInfo = JSON.parse(error['_body']);
        this.toastr.error(errorInfo['developerMessage']);
      }
    );
  }
  onClickFinalBtn(type): void {
    const modalReference = this.modalService.open(ConfirmationPopupComponent);
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
          this.saveempDevelopementAreas(type);
        }
      }
    });

  }


  saveempDevelopementAreas(status): any {
    const saveEmpsDevlopmentObj = this.osiEpmsEmpDetails;
    this.displayRatingsErrorMsg = false;
    this.displayCommentsErrorMsg = false;
    this.checkKpasLength = false;
    this.hasORGLevelDuplicateKpas = false;
    this.hasBULevelDuplicateKpas = false;
    const projectStatus = this.osiEpmsEmpDetails['osiEpmsEmpDetails'][0].status;
    saveEmpsDevlopmentObj['osiEpmsEmpDetails'] = [this.osiEpmsEmpDetails['osiEpmsEmpDetails'][0]];
    saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0].osiEpmsCategoriesProcess = null;
    saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0].osiEpmsCategoriesValues = null;
    saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails = [];
    saveEmpsDevlopmentObj['saveOrSubmit'] = status;
    const devInfoObject = {
      "epmsEmpKraDetId": null,
      "weightage": 0,
      "empSelfRating": null,
      "empPmRmRating": null,
      "creationDate": null,
      "createdBy": 1,
      "lastUpdateDate": null,
      "lastUpdatedBy": 1,
      "osiEpmsEmpDetails": null,
      "isEmployeeAccepted": false,
      "osiEpmsKra": this.kradetails[0],
      "osiEpmsEmpKpaDetails": []
    };
    const impInfoObject = JSON.parse(JSON.stringify(devInfoObject));
    const formData = JSON.parse(JSON.stringify(this.empKparatingInfo.value));
    impInfoObject.osiEpmsKra = this.kradetails[1];
    //== validations for devevlopment starts  ===//
    if (formData.length > 0) {
      formData.forEach(item => {
        if (item && item.targetDate) {
          const { year, month, day } = item.targetDate;
          item.targetDate = year + "-" + month + "-" + day;
        }

        // status based validations
        if (status === 'SUBMITTED') {
          // validates employee self ratings and comments
          if (this.STATUS_CODE_INFO['RATING_INITIATED'] === projectStatus) {
            if (this.appraisalService.isRatingInvalid(item['empSelfRating'])) {
              this.displayRatingsErrorMsg = true;
            }
            else if (!item['empComments']) {
              this.displayCommentsErrorMsg = true;
            }
          }
          // validates RM or PM ratings and comments
          else if (this.STATUS_CODE_INFO['EMP_REVIEWED'] === projectStatus) {
            if (this.appraisalService.isRatingInvalid(item['empPmRmRating'])) {
              this.displayRatingsErrorMsg = true;
            }
            else if (!item['rmPmComments']) {
              this.displayCommentsErrorMsg = true;
            }
          }
        }
        // ===============================//
      });
      devInfoObject.osiEpmsEmpKpaDetails = [...formData];
      saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
      if (!this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]) {
        this.responseObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
      }
      if (
        saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'].length
        &&
        saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]['osiEpmsEmpKpaDetails']
      ) {
        this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]['osiEpmsEmpKpaDetails'] = saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]['osiEpmsEmpKpaDetails'];
      }

    } else {
      this.checkKpasLength = true;
    }

    //== validations for evelopment ends  == //

    const formData_imp = JSON.parse(JSON.stringify(this.empKparatingInfoforImp.value));
    // ==== validations for improvement starts ==//
    if (formData_imp.length > 0) {
      formData_imp.forEach(item => {
        if (item && item.targetDate) {
          const { year, month, day } = item.targetDate;
          item.targetDate = year + "-" + month + "-" + day;
        }

        // status based validations
        if (status === 'SUBMITTED') {
          if (this.STATUS_CODE_INFO['RATING_INITIATED'] === projectStatus) {
            if (this.appraisalService.isRatingInvalid(item['empSelfRating'])) {
              this.displayRatingsErrorMsg = true;
            }
            else if (!item['empComments']) {
              this.displayCommentsErrorMsg = true;
            }
          }
          else if (this.STATUS_CODE_INFO['EMP_REVIEWED'] === projectStatus) {
            if (this.appraisalService.isRatingInvalid(item['empPmRmRating'])) {
              this.displayRatingsErrorMsg = true;
            }
            else if (!item['rmPmComments']) {
              this.displayCommentsErrorMsg = true;
            }
          }
        }
        // ===============================//
      })
      impInfoObject.osiEpmsEmpKpaDetails = [...formData_imp]
      saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
      if (!this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]) {
        this.responseObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
      }
      if (saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'].length
        &&
        saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]
      ) {
        this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]['osiEpmsEmpKpaDetails'] = saveEmpsDevlopmentObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]['osiEpmsEmpKpaDetails'];
      }

      this.responseObj['saveOrSubmit'] = saveEmpsDevlopmentObj['saveOrSubmit'];
    } else {
      this.checkKpasLength = true;
    }

    if (this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]
      && this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]['osiEpmsEmpKpaDetails']) {
      const empOrgLevelKpaDetails = this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][0]['osiEpmsEmpKpaDetails'];
      const empOrgLevelKpaNames = empOrgLevelKpaDetails.map(kpaInfo => kpaInfo['kpa']);
      const getORGLevelDuplicateKpaNames = this.appraisalService.checkKpaNamesDuplicates(empOrgLevelKpaNames);
      if (getORGLevelDuplicateKpaNames && getORGLevelDuplicateKpaNames.length) {
        this.hasORGLevelDuplicateKpas = true;
      }
    }
    if (this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]
      && this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]['osiEpmsEmpKpaDetails']
    ) {
      const empBULevelKpaDetails = this.responseObj['osiEpmsEmpDetails'][0]['osiEpmsEmpKraDetails'][1]['osiEpmsEmpKpaDetails'];
      const empBULevelKpaNames = empBULevelKpaDetails.map(kpaInfo => kpaInfo['kpa']);
      const getBULevelDuplicateKpaNames = this.appraisalService.checkKpaNamesDuplicates(empBULevelKpaNames);
      if (getBULevelDuplicateKpaNames && getBULevelDuplicateKpaNames.length) {
        this.hasBULevelDuplicateKpas = true;
      }
    }



    //=== validations for imrovement ends  ==//
    if (!this.checkKpasLength && !this.displayCommentsErrorMsg && !this.displayRatingsErrorMsg && !this.hasBULevelDuplicateKpas && !this.hasORGLevelDuplicateKpas) {
      if (status === "DECLINED") {
        this.responseObj['categoryType'] = "Organization";
        const modalReference = this.modalService.open(DeclineCommentsComponent);
        (<DeclineCommentsComponent>modalReference.componentInstance).responseObj = this.responseObj;
        (<DeclineCommentsComponent>modalReference.componentInstance).type = "organization";
        modalReference.result.then(() => {
          this.preformanceAreas();
          this.performanceAreas_Imp();
          this.getEmpsEmpDetails();
          this.getEmployeeStatusCountInfo();
        });
      } else {
        this.responseObj['categoryType'] = "Organization";
        this.appraisalService.savePerformanceAreas(this.responseObj).subscribe(
          (response) => {
            this.isFromMyGoals = false;
            this.toastr.success("Record Updated Successfully");
            this.preformanceAreas();
            this.performanceAreas_Imp();
            this.getEmpsEmpDetails();
            this.getEmployeeStatusCountInfo();
          },
          (error) => {
            const errorInfo = JSON.parse(error['_body']);
            this.toastr.error(errorInfo['developerMessage']);
          }
        )
      }

    } else {
      if (this.checkKpasLength) {
        this.toastr.error('Each objective section should contain at least one Performance Area.');
      }
      if (this.hasORGLevelDuplicateKpas) {
        this.toastr.error("Duplicate Performance Area found in Org Level. ");
      }
      if (this.hasBULevelDuplicateKpas) {
        this.toastr.error("Duplicate Performance Area found in BU Level. ");
      }

      if (this.displayCommentsErrorMsg || this.displayRatingsErrorMsg) {
        this.toastr.error("Ratings And Comments required.");
      }

    }
  }

  updateDevKpaInfo(index): void {
    const additionalNotes = this.empKparatingInfo.at(index).get('additionalNotes').value;
    const progress = this.empKparatingInfo.at(index).get('progress').value;
    const epmsEmpKpaDetId = this.empKparatingInfo.at(index).get('epmsEmpKpaDetId').value;
    const modalReference = this.modalService.open(UpdateKpaInfoComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false
    });
    (<UpdateKpaInfoComponent>modalReference.componentInstance).additionalNotes = additionalNotes;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).progress = progress;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).epmsEmpKpaDetId = epmsEmpKpaDetId;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).status = this.empStatus;
    if (this.loggedUserId == this.employeeDetails.employeeId && this.empStatus !== this.STATUS_CODE_INFO['CLOSED']) {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = false;
    } else {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = true;
    }
    modalReference.result.then((Info) => {
      if (Info) {
        this.empKparatingInfo.at(index).patchValue({
          additionalNotes: (Info['additionalNotes'] ? Info['additionalNotes'] : ''),
          progress: Info['progress']
        });
      }
    });
  }

  updateImpKpaInfo(index): void {
    const additionalNotes = this.empKparatingInfoforImp.at(index).get('additionalNotes').value;
    const progress = this.empKparatingInfoforImp.at(index).get('progress').value;
    const epmsEmpKpaDetId = this.empKparatingInfoforImp.at(index).get('epmsEmpKpaDetId').value;
    const modalReference = this.modalService.open(UpdateKpaInfoComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false
    });
    (<UpdateKpaInfoComponent>modalReference.componentInstance).additionalNotes = additionalNotes;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).progress = progress;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).epmsEmpKpaDetId = epmsEmpKpaDetId;
    (<UpdateKpaInfoComponent>modalReference.componentInstance).status = this.empStatus;
    if (this.loggedUserId == this.employeeDetails.employeeId && this.empStatus !== this.STATUS_CODE_INFO['CLOSED']) {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = false;
    } else {
      (<UpdateKpaInfoComponent>modalReference.componentInstance).isFromManager = true;
    }

    modalReference.result.then((Info) => {
      if (Info) {
        this.empKparatingInfoforImp.at(index).patchValue({
          additionalNotes: (Info['additionalNotes'] ? Info['additionalNotes'] : ''),
          progress: Info['progress']
        });
      }
    });
  }
  getNgbDateModal(kpaInfo): any {
    const date = kpaInfo['targetDate'] ? new Date(kpaInfo['targetDate']) : null;
    const convertedDate = date ? { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() } : null;
    return convertedDate;
  }
  onClickShowHistory(): void {
    const modalReference = this.modalService.open(ShowHistoryComponentComponent, {
      backdrop: 'static',
      keyboard: false, size: 'lg'
    });
    (<ShowHistoryComponentComponent>modalReference.componentInstance).epmsEmpDetId = this.epmsEmpDetId;
  }

}
