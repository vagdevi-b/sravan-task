import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequistionsService } from '../../../shared/services/requistions.service';
declare var $: any;
@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class ViewRequestComponent implements OnInit {
  requistionForm: FormGroup;
  reqData: any;
  bu: any;
  noOfPos: any;
  jobDescription: any;
  jobTitle: any;
  location: any;
  maxExp: any;
  minExp: any;
  skills: any;
  shiftTimmings: any;
  billability: any;
  clientName: any;
  level: any;
  jobDesc: string = '';
  readMore: boolean = false;
  skillsarray: any = [];
  defaultJobType = 'Full Time';
  defaultReqType = 'New Position';
  startDate: any;
  targetDate: any;
  requisitionType: any;
  clientInterviewReq:any;
  approver1:any;
  approver2:any;
  jobType:any;
  approver1Date:any;
  approver2Date:any;
  isAdditionalSkills:boolean = false;
  additionalSkills:any=[];
  constructor(private reqSvc: RequistionsService, private fb: FormBuilder,public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.reqData = this.reqSvc.requistionData;
    console.log(this.reqData);
    this.createReqFormInst();
    this.getRequistionDetails(this.reqData.Id);
  }

  getRequistionDetails(Id) {
    this.reqSvc.getRequistionsById(Id).subscribe(response => {
      console.log(response);
      this.setRequistionDetails(response);
    }, err => {
      console.log(err);
    })
  }

  createReqFormInst() {
    this.requistionForm = this.fb.group({
      approver1: new FormControl(''),
      approver2: new FormControl(''),
      bu: new FormControl(''),
      clientName: new FormControl(''),
      noOfPos: new FormControl(''),
      jobTitle: new FormControl(''),
      location: new FormControl(''),
      jobType: new FormControl(''),
      maxExp: new FormControl(''),
      minExp: new FormControl(''),
      skills: new FormControl(''),
      shiftTimmings: new FormControl(''),
      billability: new FormControl(''),
      level: new FormControl(''),
      additionalComments: new FormControl(''),
      startDate: new FormControl(''),
      targetDate: new FormControl(''),
      requisitionType: new FormControl(''),
      clientInterviewReq: new FormControl(''),
      priority:new FormControl(''),
      position:new FormControl('')
    })
  }
  setRequistionDetails(data) {

    this.requistionForm.patchValue({
      
      bu: data.bu + ' / ' + data.externalRefSubpractice,
      clientName: data.clientName,
      noOfPos: data.noofPositions,
      jobTitle: data.jobTitle,
      jobType: data.jobTypes === null ? this.defaultJobType : data.jobTypes,
      location: data.location,
      maxExp: data.maxExp,
      minExp: data.minExp,
      skills: data.skills,
      shiftTimmings: data.shiftTimmings,
      billability: data.billability === 'Billable'? data.billability:'Practice',
      level: data.level + data.grade,
      additionalComments: data.comments,
      startDate: data.billingStartDate,
      targetDate: data.targetDate,
      requisitionType: data.requisitionType === null?this.defaultReqType: data.requisitionType,
      clientInterviewReq: data.isClientReviewRequired,
      approver1: data.approver1,
      approver2: data.approver2,
      priority:data.priority,
      position:data.position
    })
    let jobdet = document.getElementById('jobDet');
    this.jobDesc = data.jobDescription;
    console.log(this.requistionForm.value);
    //this.requistionForm.controls['bu'].setValue(data.bu + ' / ' + data.externalRefSubpractice, { onlySelf: true });
    this.requistionForm.controls['jobTitle'].setValue(data.jobTitle === null ? data.position : data.jobTitle, { onlySelf: true });
    this.requistionForm.controls['jobType'].setValue(data.jobTypes === null ? this.defaultJobType : data.jobTypes, { onlySelf: true });
    this.requistionForm.controls['location'].setValue(data.location, { onlySelf: true });
    //this.requistionForm.controls['billability'].setValue(data.billability, {onlySelf: true});
    this.requistionForm.controls['shiftTimmings'].setValue(data.shiftTimmings, { onlySelf: true });
    this.requistionForm.controls['level'].setValue(data.level + data.grade, { onlySelf: true });
    //this.requistionForm.controls['requisitionType'].setValue(data.requisitionType, { onlySelf: true });
    this.requistionForm.controls['targetDate'].setValue(data.targetDate, { onlySelf: true })
    this.requistionForm.controls['startDate'].setValue(data.billingStartDate, { onlySelf: true });
    this.requistionForm.controls['clientInterviewReq'].setValue(data.isClientReviewRequired, { onlySelf: true });
    // this.noOfPos = data.noofPositions;
    this.bu = data.bu + ' / ' + data.externalRefSubpractice;
    this.jobTitle = data.jobTitle === null ? data.position : data.jobTitle;
    this.location = data.location;
    // this.maxExp = data.maxExp;
    // this.minExp = data.minExp;
    if(data.additionalSkills === null){
      this.isAdditionalSkills = false;
    }else{
      this.isAdditionalSkills = true;
      let skills1 = data.additionalSkills.replace('[', '');
    let skills2 = skills1.replace(']', '');
    this.additionalSkills = skills2.split(',');

    }
    this.skills = data.skills;
    this.jobType = data.jobTypes === null ? this.defaultJobType : data.jobTypes;
    this.shiftTimmings = data.shiftTimmings;
    this.level = data.level + data.grade;
    this.startDate = data.billingStartDate;
    this.targetDate = data.targetDate;
    this.requisitionType = data.requisitionType === null?this.defaultReqType: data.requisitionType;
    this.approver1 = data.approver1,
    this.approver2 = data.approver2;
    this.approver1Date = data.approver1Date;
    this.approver2Date = data.approver2Date;
    // this.billability = data.billability;
    // this.clientName = data.clientName;
    console.log(this.skills);
    // this.skills.replace('"', '');
    let skills1 = this.skills.replace('[', '');
    let skills2 = skills1.replace(']', '');
    let skills3 = skills2.replace('""', '');
    
    this.skillsarray = [];
    this.skillsarray = skills3.split(',');
    // for(let i=1;i<this.skillsarray.length-1;i++){
    //   this.skillsarray[i].replace('[','');
    // }
    console.log(this.skillsarray);
  }
  getJobbDesc() {
    if (this.jobDesc && this.jobDesc.length > 30) {
      return this.jobDesc.slice(0, 300) + '.....';

    } else {
      return this.jobDesc;
    }
  }
  closePopup(){
    this.activeModal.close(false);
  }
}
