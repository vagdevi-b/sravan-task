import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormArray, Form, Validators } from '@angular/forms';
import {AppraisalService} from '../../../shared/services/appraisal-cycle/appraisal.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit {
  fg: FormGroup;
  @Input() data;
  @Input() kpisList;
  kpisIdListId=[];
  cloneData;
  showErrorMsg=false;

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private fb: FormBuilder,
    private appraisalService: AppraisalService,
    private activeModal: NgbActiveModal
    ) { }
  ngOnInit() {

    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();

    this.fg = this.fb.group({
      goals: this.fb.array([])
    });
    this.cloneData=[...this.data];
    this.populateKpIInfo(this.data);
  const fa = (this.fg.get('goals')as FormArray);
  }
  addGoal() {
    const fa = (this.fg.get('goals') as FormArray);
    fa.push(this.fb.group({
      epmsEmpKraDetId: [],
      weightage: ['',Validators.required],
      empSelfRating: [],
      empPmRmRating: [],
      osiEpmsEmpDetails: [],
      isExpand: false,
      osiEpmsKra: this.addOsiEpmsKra(),
      osiEpmsEmpKpaDetails:  this.fb.array([])
    }));
  }
  deleteGoal(i: number) {
    const fa = (this.fg.get('goals') as FormArray);
    fa.removeAt(i);
    this.updateKpisDisableInfo()
    if (fa.length === 0) {
      // this.addNewAlias();
    }
  }
  populateKpIInfo(data) {
    if (this.data && this.data.length) {
      const fa = (this.fg.get('goals') as FormArray);
      data.forEach(goalInfo => {
        fa.push(
          this.populateGoalInfo(goalInfo)
        );
      });

    }
    this.updateKpisDisableInfo();
  }

  populateGoalInfo(goalInfo):any{
    return this.fb.group({
      epmsEmpKraDetId: [goalInfo['epmsEmpKraDetId'] ? goalInfo['epmsEmpKraDetId'] : null],
      weightage: [goalInfo['weightage'],Validators.required],
      empSelfRating: goalInfo['empSelfRating'],
      empPmRmRating: goalInfo['empPmRmRating'],
      osiEpmsEmpDetails: goalInfo['osiEpmsEmpDetails'],
      isExpand: false,
      creationDate: goalInfo['creationDate'],
      createdBy: goalInfo['createdBy'],
      osiEpmsKra:goalInfo['osiEpmsKra'] ? this.populateOsiEpmsKra(goalInfo['osiEpmsKra'] ) : {},
      osiEpmsEmpKpaDetails: goalInfo['osiEpmsEmpKpaDetails'] ? this.fb.array(this.populateOsiEpmsEmpKpaDetails(goalInfo['osiEpmsEmpKpaDetails'])) : this.fb.array([])
    })
  }
  addOsiEpmsKra():any{
    return this.fb.group({
      kraId : ['', Validators.required],
      name : [],
      osiEpmsCategories : []
  });
  }
  populateOsiEpmsKra(osiEpmsKra):any{
    return this.fb.group({
        kraId : [(osiEpmsKra['kraId'] ? osiEpmsKra['kraId'] : ''),Validators.required],
        name : osiEpmsKra['name'],
        creationDate: osiEpmsKra['creationDate'],
        createdBy: osiEpmsKra['createdBy'],
        osiEpmsCategories : osiEpmsKra['osiEpmsCategories']
    });
  }
  populateOsiEpmsEmpKpaDetails(osiEpmsEmpKpaDetails){
    const osiEpmsEmpKpaDetailsInfo=[];
    if(osiEpmsEmpKpaDetails){
      osiEpmsEmpKpaDetails.forEach(kpaInfo => {
        osiEpmsEmpKpaDetailsInfo.push(
          this.fb.group({
            epmsEmpKpaDetId : kpaInfo['epmsEmpKpaDetId'] ? kpaInfo['epmsEmpKpaDetId'] : null,
            kpa : kpaInfo['kpa'],
            kpi : kpaInfo['kpi'],
            trainingRequired :kpaInfo['trainingRequired'],
            targetDate : kpaInfo['targetDate'],
            empSelfRating : kpaInfo['empSelfRating'],
            empPmRmRating : kpaInfo['empPmRmRating'],
            empComments : kpaInfo['empComments'],
            rmPmComments : kpaInfo['rmPmComments'],
            remarks : kpaInfo['remarks'],
            creationDate: kpaInfo['creationDate'],
            createdBy: kpaInfo['createdBy'],
            osiEpmsEmpKraDetails : kpaInfo['osiEpmsEmpKraDetails']
          })        
        );
      });
    }
    return osiEpmsEmpKpaDetailsInfo;
  }

  setKpaName(event,index):void{
    const fa = (this.fg.get('goals') as FormArray);
    const formGroup= fa.at(index);
    const kprId=formGroup.get('osiEpmsKra').get('kraId').value;
    let verifygoalInfo;
    this.cloneData.forEach(goalInfo=>{
      if(goalInfo['osiEpmsKra']['kraId']===kprId){
        verifygoalInfo=goalInfo;
      }
    });
    if(verifygoalInfo){
      this.populateExistingGoalInfo(verifygoalInfo,index);
    }else{
      const goalInfo = this.kpisList.filter(kpiInfo=>{
        if(kpiInfo['kraId']===kprId){
          return kpiInfo;
        }
      });

      formGroup.patchValue({
        epmsEmpKraDetId: [],
        empSelfRating: [],
        empPmRmRating: [],
        osiEpmsEmpDetails:[] ,
        isExpand: false,
        creationDate: [],
        createdBy: [],
        osiEpmsEmpKpaDetails: [],
        osiEpmsKra:{
          name:goalInfo[0]['name'] ? goalInfo[0]['name'] : ''
        }
      });
    }
    this.updateKpisDisableInfo();
  }
  disableKpi(id):boolean{
    return this.kpisIdListId.includes(id);
  }
  updateKpisDisableInfo():void{
    this.kpisIdListId=[];
    const kpis=this.fg.get('goals').value;
    this.kpisIdListId =kpis.map(obj=>obj['osiEpmsKra']['kraId']);
  }
  populateExistingGoalInfo(goalInfo,index){
    const fa = (this.fg.get('goals') as FormArray);
    const patchGoalInfo= this.populateGoalInfo(goalInfo);
    fa.at(index).patchValue({
      ...patchGoalInfo.value
    })
    

  }
  close():void{
    const fa = (this.fg.get('goals') as FormArray);
    const formInfo=this.fg.value['goals'];
    this.showErrorMsg=false;
    let total=0;
    if(formInfo){
      formInfo.forEach(goalObj=>total=Number(total)+Number(goalObj['weightage']));
    }
    
    if(total==100){
      this.activeModal.close(this.fg.value);
    }else{
      this.showErrorMsg=true;
    }
  }
  onClickIcon():void{
    this.activeModal.close();
  }
  getkraId(index){
    return (this.fg.get('goals') as FormArray).at(index).get('osiEpmsKra').get('kraId');
  }
  getweightage(index){
    return (this.fg.get('goals') as FormArray).at(index).get('weightage');
  }

}


