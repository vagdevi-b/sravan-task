import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder,FormArray, Validators } from '@angular/forms';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-load-template',
  templateUrl: './load-template.component.html',
  styleUrls: ['./load-template.component.css']
})
export class LoadTemplateComponent implements OnInit {
  @Input() orgId;
  @Input() projectId;
  @Input() epmsHdrId;
  @Input() projectName;
  hasKpaInfo=false;
  projectInfo;
  projectForm: FormGroup;
  projectListForm: FormGroup;
  userId;
  practiceId="";
  gradeId: any;
  category="";
  employeeId="";
  employeeDetails;
  
  practiceList=[];
  gradesList=[];
  employeesList=[];

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private _appraisalService:AppraisalService
  ) { }

  ngOnInit() {

    this.isReadOnly = this._appraisalService.getIsGoalsPageReadOnly();

    this.category="guildelines";
    this.userId = localStorage.getItem('userId');
    this.employeeDetails = JSON.parse(localStorage.getItem('setGoals'));
    this.getGradesList();
    this.getPracticeList();
  }
  onCategoryChange():void{
    this.category==="projects" ? (this.gradeId="",this.practiceId="") : this.employeeId="";
    if(this.category==="projects"){
      this.getEmployees();
  }else{
    this.getLoadTemplateInfo();
  }
}
getEmployeeGoals():void{
  this._appraisalService.getProjectGoals(this.employeeId, this.epmsHdrId, this.projectId).subscribe(response => {
    if(response && response['osiEpmsEmpDetails'] && response['osiEpmsEmpDetails'][0]){
      this.dispatchProjectInfo(response['osiEpmsEmpDetails'][0]);
    }
  });
}
getEmployees():void{
  const {employeeId} = this.employeeDetails;
  this._appraisalService.getProjectEmployees(this.projectId ,this.epmsHdrId, employeeId).subscribe(response => {
    this.employeesList=response || [];
    if(!this.employeesList.length){
      this.toastr.error("Goals are not defined to any of the employee");
    }
  });

}

  dispatchProjectInfo(project): void {
    this.projectForm = this.formBuilder.group({
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
          epmsEmpKraDetId: null,
          weightage: kraInfo['weightage'],
          empSelfRating: 0,
          empPmRmRating: 0,
          osiEpmsEmpDetails: kraInfo['osiEpmsEmpDetails'],
          creationDate: kraInfo['creationDate'],
          createdBy: kraInfo['createdBy'],
          osiEpmsKra: kraInfo['osiEpmsKra'] ? this.populateOsiEpmsKra(kraInfo['osiEpmsKra']) : [],
          displayEmployeeTooltip: false,
          displayRmTooltip: false,
          osiEpmsEmpKpaDetails: kraInfo['osiEpmsEmpKpaDetails'] ? this.formBuilder.array(this.populateOsiEpmsEmpKpaDetails(kraInfo['osiEpmsEmpKpaDetails'])) : [],
          isExpand: false,
          viewComments:false
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
            epmsEmpKpaDetId: null,
            kpa: [kpaInfo['kpa'], Validators.required],
            kpi: kpaInfo['kpi'],
            trainingRequired: kpaInfo['trainingRequired'],
            targetDate: kpaInfo['targetDate'],
            empSelfRating: 0,
            empPmRmRating: 0,
            empComments:  '',
            displayEmployeeComments: false,
            displayRMPMComments: false,
            rmPmComments: '',
            remarks: '',
            osiEpmsEmpKraDetails: kpaInfo['osiEpmsEmpKraDetails'],
            isSelected: false,
            creationDate: kpaInfo['creationDate'],
            createdBy: kpaInfo['createdBy']
          })
        );
      });
    }

    return osiEpmsEmpKpaDetailsInfo;
  }
  get osiEpmsCategoriesProcess(): any {
    return this.projectForm.get('osiEpmsCategoriesProcess');
  }
  get osiEpmsCategoriesValues(): any {
    return this.projectForm.get('osiEpmsCategoriesValues');
  }
  get categoryProcessName(): any {
    return this.projectForm.get('osiEpmsCategoriesProcess').get('categoryName');
  }
  get categoryValuesName(): any {
    return this.projectForm.get('osiEpmsCategoriesValues').get('categoryName');
  }
  onClickDelivaryProcessHeader(empKpaIndex): void {
    const projectHeader = this.projectForm.get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray;
    const isExpand = projectHeader['controls'][empKpaIndex].get('isExpand').value;
    projectHeader['controls'][empKpaIndex].patchValue({
      isExpand: !isExpand
    });
  }
  onClickDelivaryHeader(empKpaIndex): void {
    const projectHeader = this.projectForm.get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray;
    const isExpand = projectHeader['controls'][empKpaIndex].get('isExpand').value;
    projectHeader['controls'][empKpaIndex].patchValue({
      isExpand: !isExpand
    });
  }

  onSaveTemplateInfo(): void {
    this.hasKpaInfo=false;
    event.preventDefault();
    const saveProjectObj = { ...this.projectForm.value };
    const categoryProcessKra = (this.projectForm.get('osiEpmsCategoriesProcess').get('osiEpmsEmpKraDetails') as FormArray).value;
    const categoryValuesKra = (this.projectForm.get('osiEpmsCategoriesValues').get('osiEpmsEmpKraDetails') as FormArray).value;
    this.verifySelectedKraInfo(categoryProcessKra);
    this.verifySelectedKraInfo(categoryValuesKra);
    if(this.hasKpaInfo){
      this.activeModal.close(saveProjectObj);
    }else{
      this.toastr.error("Please select at least one Performance areas from any Goal");
    }
  }

  verifySelectedKraInfo(kraInfo):void{
    if(kraInfo&&kraInfo.length){
      kraInfo.forEach(kra=>{
        if(kra['osiEpmsEmpKpaDetails'] && kra['osiEpmsEmpKpaDetails'].length){
            const getSelectedKpas=kra['osiEpmsEmpKpaDetails'].filter(kpa=>kpa['isSelected']);
            if(getSelectedKpas && getSelectedKpas.length){
              this.hasKpaInfo=true;
            }
        }
      });
    }
  }

  close():void{
    this.activeModal.close();
  }
  getPracticeList():void{
    this._appraisalService.getPracticeList().subscribe(
      response=>{
        this.practiceList=response;
      }
    );
  }
  getGradesList():void{
    this._appraisalService.getGradesList(this.orgId).subscribe(
      response=>{
        this.gradesList=response;
      }
    );
  }
  onPracticeIdChange():void{
    this.getLoadTemplateInfo();
  }
  onGradeChange():void{
    this.getLoadTemplateInfo();
  }
  getLoadTemplateInfo():void{
    let grade = this.gradeId;
    if(this.practiceId && this.gradeId) {
      if(grade === 'L0E0'){
        grade = 'L1E1';
      }
      this._appraisalService.getLoadTemplateInfo(this.practiceId, grade).subscribe(
        response=>{
          if(response){
            this.dispatchProjectInfo(response);
          }
        }
      );
    }else{
      this.projectForm=null;
    }
  }
}
