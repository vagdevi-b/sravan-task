import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {  ActivatedRoute } from '@angular/router';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';
declare var $: any;

@Component({
  selector: 'app-view-review-cycle',
  templateUrl: './view-review-cycle.component.html',
  styleUrls: ['./view-review-cycle.component.css']
})
export class ViewReviewCycleComponent implements OnInit {
  employeeList = [];
  initAppraisalForm: FormGroup;
  organizationList=[];
  editResponse;
  frequencyList = [
  {
    name:'Q',
    description:'Quarterly'
  },
  {
    name:'H',
    description:'Half Yearly'
  },
  {
    name:'Y',
    description:'Yearly'
  }
  ];
  currentYear= new Date().getFullYear();
  yearsList = []
  constructor(
    private formBuilder:FormBuilder,
    private _appraisalService:AppraisalService,
    private activeRoute: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.initAppraisalForm = this.formBuilder.group(
      {
        orgId:[''],
        year:[''],
        frequency:[''],
        empId:[''],
        employeeName:[''],
        status: ['DRAFT'],
        type: ['INITIATE']
      }
    );
    this.getOrganizationsList();
    this.getYearsList();
    const routeParams = this.activeRoute.snapshot.params;
    const id=routeParams['id'];
    if(id){
      this.getApprisalInfoById(id);
    }
    this.initAppraisalForm.disable();
  }
  getYearsList():void{
    this.yearsList.push(this.currentYear);
    for(let i=0;i<4;i++){
      this.currentYear = this.currentYear-1;
      this.yearsList.push(this.currentYear);
    }
  }
  getApprisalInfoById(id):void{
    this._appraisalService.getReviewCycleById(id).subscribe((response)=>{
      this.editResponse=response[0];
      this.dispatchApprisalInfo(response[0]);
    });

  }
  dispatchApprisalInfo(response):void{
      this.initAppraisalForm.patchValue({
        orgId:response['orgId'],
        year:response['year'],
        frequency:response['frequency'],
        empId:response['empId'],
      });
  } 
  getOrganizationsList():void{
    this._appraisalService.getOrganizations().subscribe((response)=>{
      this.organizationList=response;
    });
  }
}
