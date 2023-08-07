import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';

declare var $: any;

@Component({
  selector: 'app-my-goals-empdevelopment',
  templateUrl: './my-goals-empdevelopment.component.html',
  styleUrls: ['./my-goals-empdevelopment.component.css']
})
export class MyGoalsEmpdevelopmentComponent implements OnInit {
  @Input() isFrom;
  @Output() empsGoalsTobeAddedtoEmployee;
  @Input() myGoalsData;
  @Input() epmsHdrId;
  @Input() categoryId;
  @Input() passedValue;
  myGoalsdevelopment: FormGroup;
  myGoalsimprovement: FormGroup;
  myGoalsOrg: FormGroup;
  myGoalsBU: FormGroup;
  empimprovementGoals = [];
  empdevelopmentGoals = [];
  myGoalsdevHeader = '';
  myGoalsimpHeader = '';
  kradetails = [];
  employeeDetails;
  developmentData;
  category = 'mygoals';
  employeesList = [];
  employeeId = '';
  defineGoalsData: any;
  myGoalsBUHeader = '';
  myGoalsOrgHeader = '';
  hideTeamGolas : Boolean;
  hideMyGoals : Boolean;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private appraisalService: AppraisalService
  ) { }

  ngOnInit() {
    console.log(this.passedValue);
    this.employeeDetails = JSON.parse(localStorage.getItem('setGoals'));
    this.devGoals();
    this.impGoals();
    this.OrgGoals();
    this.BUGoals();
    this.getPMGoalsList();
    this.onChangeCategory();

  }
  onChangeCategory(): void {
    if (this.category === 'teamgoals') {
      this.employeeId = '';
      this.getEmployeeList();
    } else {
      const loggedUserId = localStorage.getItem('userId');
      this.removeDelvelopmentGoalInfo();
      this.removeImprovementGoalInfo();
      this.removeOrgGoalInfo();
      this.removeBUGoalInfo();
      this.getMyGoalsList(loggedUserId);
    }
  }

  getEmployeeGoals(): void {
    this.getMyGoalsList(this.employeeId);
  }
  getEmployeeList(): void {
    const { employeeId } = this.employeeDetails;
    $('.myGoalsLoadModal').modal('show');
    let categoryId=this.categoryId;
    if(this.categoryId == 2 || this.categoryId == 3){
      categoryId=0;
    }
    this.appraisalService.getOrgCareerEmployeeGoalsInfo(categoryId, this.epmsHdrId, employeeId).subscribe(response => {
      $('.myGoalsLoadModal').modal('hide');
      this.removeDelvelopmentGoalInfo();
      this.removeImprovementGoalInfo();
      this.removeOrgGoalInfo();
      this.removeBUGoalInfo();
      this.employeesList = response;
      if(this.category === 'teamgoals' && this.employeesList.length < 1){
        this.hideTeamGolas = true;
      }else
      {
        this.hideTeamGolas = false;
      }
    },
      (error) => {
        this.handleErrors(error);
      });

  }

  removeDelvelopmentGoalInfo(): void {
    while (this.mydevGoals.length !== 0) {
      this.mydevGoals.removeAt(0);
    }
  }
  removeImprovementGoalInfo(): void {
    while (this.myimpGoals.length !== 0) {
      this.myimpGoals.removeAt(0);
    }
  }
  removeOrgGoalInfo(): void {
    while (this.myOrgGoals.length !== 0) {
      this.myOrgGoals.removeAt(0);
    }
  }
  removeBUGoalInfo(): void {
    while (this.myBUGoals.length !== 0) {
      this.myBUGoals.removeAt(0);
    }
  }
  getMyGoalsList(userId): void {
    $('.myGoalsLoadModal').modal('show');
    this.appraisalService.getEmployeeDevelopmentInfo(userId, this.epmsHdrId, this.isFrom).subscribe(response => {
      $('.myGoalsLoadModal').modal('hide');
      if (response.osiEpmsEmpDetails[0] && response.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[0] && response.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[0].osiEpmsEmpKpaDetails.length > 0) {
        this.myGoalsData = response;
        this.appraisalService.setDefaultRating(this.myGoalsData);
        this.hideMyGoals = true;
        if(this.category === 'mygoals'){
          this.hideTeamGolas = false;
        }
        this.getPMGoalsList();
      }else if (response.osiEpmsEmpDetails[1] && response.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[0] && response.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[0].osiEpmsEmpKpaDetails.length > 0) {
        this.myGoalsData = response;
        this.hideMyGoals = true;
        if(this.category === 'mygoals'){
          this.hideTeamGolas = false;
        }
        this.getPMGoalsList();
      } else {
        this.hideMyGoals = false;
        this.hideTeamGolas = true;
        this.toastr.error('No Goals Available');
      }
    },
      (error) => {
        this.handleErrors(error);
      });
  }
  handleErrors(error): void {
    setTimeout(() => {
      $('.myGoalsLoadModal').modal('hide');
    }, 2000);
    const errorInfo = JSON.parse(error['_body']);
    this.toastr.error(errorInfo['developerMessage']);
  }

  getPMGoalsList() {
    const loggedUserId = localStorage.getItem('userId');
    const epmsHdrId = this.employeeDetails.epmsHdrId;
   // if (this.isFrom === 'both') {
      this.developmentData = this.myGoalsData;
      if (this.developmentData !== undefined) {
        this.populateDevGoals();
        this.populateImpGoals();
        this.populateOrgGoals();
        this.populateBUGoals();
      }

  //  } else {
      // this.developmentData = this.myGoalsData;
      // this.populateDevGoals();
      // this.populateImpGoals();
      // this.populateOrgGoals();
      // this.populateBUGoals();
  //  }

  }

  devGoals() {
    this.myGoalsdevelopment = this.formBuilder.group({
      devEmpKpaDetails: this.formBuilder.array([])
    });
  }

  impGoals() {
    this.myGoalsimprovement = this.formBuilder.group({
      impEmpKpaDetails: this.formBuilder.array([])
    });
  }
  OrgGoals() {
    this.myGoalsOrg = this.formBuilder.group({
      orgEmpKpaDetails: this.formBuilder.array([])
    });
  }

  BUGoals() {
    this.myGoalsBU = this.formBuilder.group({
      buEmpKpaDetails: this.formBuilder.array([])
    });
  }

  get mydevGoals(): FormArray {
    return this.myGoalsdevelopment.get('devEmpKpaDetails') as FormArray;
  }

  get myimpGoals(): FormArray {
    return this.myGoalsimprovement.get('impEmpKpaDetails') as FormArray;
  }

  get myOrgGoals(): FormArray {
    return this.myGoalsOrg.get('orgEmpKpaDetails') as FormArray;
  }

  get myBUGoals(): FormArray {
    return this.myGoalsBU.get('buEmpKpaDetails') as FormArray;
  }

  populateOrgGoals() {
    this.removeOrgGoalInfo();
    this.myGoalsOrgHeader ="";
    if (this.developmentData) {
      if (this.developmentData.osiEpmsEmpDetails[1] && this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[0]) {
        this.kradetails.push(this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[1].osiEpmsKra);
        this.myGoalsOrgHeader = this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[0].osiEpmsKra.name;
        this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[0].osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          this.myOrgGoals.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
              kpa: kpaInfo['kpa'],
              kpi: kpaInfo['kpi'],
              trainingRequired: 0,
              targetDate: kpaInfo['targetDate'],
              empSelfRating: 0,
              empPmRmRating: 0,
              empComments: null,
              rmPmComments: null,
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaParentDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isSelectedForOrg: false,
              isEmployeeAccepted: false
            })
          );
        });
      }
    }
  }

  populateBUGoals() {
    this.removeBUGoalInfo();
    this.myGoalsBUHeader ="";
    if (this.developmentData) {
      if (this.developmentData.osiEpmsEmpDetails[1] && this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[1]) {
        this.kradetails.push(this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[1].osiEpmsKra);
        this.myGoalsBUHeader = this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[1].osiEpmsKra.name;
        this.developmentData.osiEpmsEmpDetails[1].osiEpmsEmpKraDetails[1].osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          this.myBUGoals.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
              kpa: kpaInfo['kpa'],
              kpi: kpaInfo['kpi'],
              trainingRequired: 0,
              targetDate: kpaInfo['targetDate'],
              empSelfRating: 0,
              empPmRmRating: 0,
              empComments: null,
              rmPmComments: null,
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaParentDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isSelectedForBU: false,
              isEmployeeAccepted: false
            })
          );
        });
      }
    }
  }

  populateDevGoals() {
    this.removeDelvelopmentGoalInfo();
    this.myGoalsdevHeader ="";
    if (this.developmentData) {
      if (this.developmentData.osiEpmsEmpDetails[0] && this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[0]) {
        this.kradetails.push(this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[0].osiEpmsKra);
        this.myGoalsdevHeader = this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[0].osiEpmsKra.name;
        this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[0].osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          this.mydevGoals.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
              kpa: kpaInfo['kpa'],
              kpi: kpaInfo['kpi'],
              trainingRequired: 0,
              targetDate: kpaInfo['targetDate'],
              empSelfRating: 0,
              empPmRmRating: 0,
              empComments: null,
              rmPmComments: null,
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaParentDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isSelectedForDevelopement: false,
              isEmployeeAccepted: false
            })
          );
        });
      }
    }
  }

  populateImpGoals() {
    this.removeImprovementGoalInfo();
    this.myGoalsimpHeader ="";
    if (this.developmentData) {
      if (this.developmentData.osiEpmsEmpDetails[0] && this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[1]) {
        this.kradetails.push(this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[1].osiEpmsKra);
        this.myGoalsimpHeader = this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[1].osiEpmsKra.name
        this.developmentData.osiEpmsEmpDetails[0].osiEpmsEmpKraDetails[1].osiEpmsEmpKpaDetails.forEach(kpaInfo => {
          this.myimpGoals.push(
            this.formBuilder.group({
              epmsEmpKpaDetId: kpaInfo['epmsEmpKpaDetId'],
              kpa: kpaInfo['kpa'],
              kpi: kpaInfo['kpi'],
              trainingRequired: 0,
              targetDate: kpaInfo['targetDate'],
              empSelfRating: 0,
              empPmRmRating: 0,
              empComments: null,
              rmPmComments: null,
              remarks: kpaInfo['remarks'],
              epmsEmpKpaParentDetId: kpaInfo['epmsEmpKpaParentDetId'],
              osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
              isSelectedForImprovement: false,
              isEmployeeAccepted: false
            })
          );
        });
      }

    }
  }


  onClickSaveButton(passedValue) {

    const saveObj = JSON.parse(JSON.stringify(this.developmentData));
    saveObj['osiEpmsEmpDetails'] = [this.developmentData['osiEpmsEmpDetails'][0]];
    saveObj['osiEpmsEmpDetails'][0].osiEpmsCategoriesProcess = null;
    saveObj['osiEpmsEmpDetails'][0].osiEpmsCategoriesValues = null;
    saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails = [];
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
      "osiEpmsKra": this.kradetails[0],
      "osiEpmsEmpKpaDetails": []
    };
    const impInfoObject = JSON.parse(JSON.stringify(devInfoObject));
    impInfoObject.osiEpmsKra = this.kradetails[1];
    const devData = JSON.parse(JSON.stringify(this.mydevGoals.value));
    const impData = JSON.parse(JSON.stringify(this.myimpGoals.value));
    const OrgData = JSON.parse(JSON.stringify(this.myOrgGoals.value));
    const BUData = JSON.parse(JSON.stringify(this.myBUGoals.value));
    const formData_Imp = [];
    const formData_Dev = [];
    const formData_Org = [];
    const formData_BU = [];
    let formData_total = [];
    if (devData.length > 0) {
      devData.forEach(item => {
        if (item.isSelectedForDevelopement) {
          formData_Dev.push(item);
        }
      });
    }
    if (impData.length > 0) {
      impData.forEach(item => {
        if (item.isSelectedForImprovement) {
          formData_Imp.push(item);
        }
      });
    }
    if (OrgData.length > 0) {
      OrgData.forEach(item => {
        if (item.isSelectedForOrg) {
          formData_Org.push(item);
        }
      });
    }
    if (BUData.length > 0) {
      BUData.forEach(item => {
        if (item.isSelectedForBU) {
          formData_BU.push(item);
        }
      });
    }

    formData_total = [...formData_Dev, ...formData_Imp, ...formData_Org, ...formData_BU];
    if (passedValue === 'org') {

      if (formData_total.length > 0) {
        devInfoObject.osiEpmsEmpKpaDetails = [...formData_total];
        impInfoObject.osiEpmsEmpKpaDetails = [];
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
        this.activeModal.close(saveObj);
      } else {
        this.toastr.error('Please select at least one Goal');
      }

    } else if (passedValue === 'BU') {
      if (formData_total.length > 0) {
        devInfoObject.osiEpmsEmpKpaDetails = [];
        impInfoObject.osiEpmsEmpKpaDetails = [...formData_total];
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
        this.activeModal.close(saveObj);
      } else {
        this.toastr.error('Please select at least one Goal');
      }
    } else if (passedValue === 'dev') {
      if (formData_total.length > 0) {
        devInfoObject.osiEpmsEmpKpaDetails = [...formData_total];
        impInfoObject.osiEpmsEmpKpaDetails = [];
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
        this.activeModal.close(saveObj);
      } else {
        this.toastr.error('Please select at least one Goal');
      }
    } else if (passedValue === 'improve') {
      if (formData_total.length > 0) {
        devInfoObject.osiEpmsEmpKpaDetails = [];
        impInfoObject.osiEpmsEmpKpaDetails = [...formData_total];
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
        this.activeModal.close(saveObj);
      } else {
        this.toastr.error('Please select at least one Goal');
      }
    } else {
      if (formData_Dev.length > 0 || formData_Imp.length > 0) {
        devInfoObject.osiEpmsEmpKpaDetails = [...formData_Dev];
        impInfoObject.osiEpmsEmpKpaDetails = [...formData_Imp];
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(devInfoObject);
        saveObj['osiEpmsEmpDetails'][0].osiEpmsEmpKraDetails.push(impInfoObject);
        //   this.toastr.success('Goals are added to the Employee');
        this.activeModal.close(saveObj);
      } else {
        this.toastr.error('Please select at least one Goal');
      }
    }
  }


  close(): void {
    this.activeModal.close();
  }

}
