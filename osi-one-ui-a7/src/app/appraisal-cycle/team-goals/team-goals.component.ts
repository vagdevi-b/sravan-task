import { Component, OnInit } from '@angular/core';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';
declare var $: any;

@Component({
  selector: 'app-team-goals',
  templateUrl: './team-goals.component.html',
  styleUrls: ['./team-goals.component.css']
})
export class TeamGoalsComponent implements OnInit {
  yearsList=[];
  teamGoalsList=[];
  selfGoalInfo;
  currentYearOrgInfo;
  year;
  reviewCycleList;
  epmsHdrId;
  myTeamLength=[];
  projectTeamLength=[];
  disableMyGoal;
  selectedYear=0;

  constructor(
    private _appraisalService: AppraisalService
  ) { }
  ngOnInit() {
    this.getAppraisalCycleYears();
    $('#loadModal').modal('show');
  }
  getAppraisalCycleYears(){
    const orgId=localStorage.getItem('orgId');
    this._appraisalService.getAppraisalCycleYears(orgId).subscribe(
      
      (response) => {
        $('#loadModal').modal('hide');
        this.yearsList = response;
        if(this.yearsList && this.yearsList.length===1){
          this.year=this.yearsList[0]['epmsHdrId'];
          this.selectedYear= this.yearsList[0]['year'];
          this.getReviewCyclesForApprisalYear(this.year);
        }else{
          const currentYear=new Date().getFullYear();
          this.selectedYear= currentYear;
          this.getCycleYearInfoByYear(currentYear);
        }
        
      },
      (error)=>{
        $('#loadModal').modal('hide');
      }
    );
  }

  getCycleYearInfoByYear(year):void{
    this.selectedYear= year;
    this.currentYearOrgInfo= this.yearsList.filter(obj=> year === obj['year']);
    //if(this.currentYearOrgInfo && this.currentYearOrgInfo[0]){
      this.year=this.currentYearOrgInfo[0]['epmsHdrId'];
      this.getReviewCyclesForApprisalYear(this.year);

    //}
  }
  onYearChange(year):void{
    this.year=year;
    const getYear = this.yearsList.filter(obj=> year === obj['epmsHdrId']);
    if(getYear && getYear[0]){
      this.selectedYear=getYear[0]['year'];
    }
    //this.currentYearOrgInfo= this.yearsList.filter(obj=> year === obj['year']);
    //if(this.currentYearOrgInfo && this.currentYearOrgInfo[0]){
      this.getReviewCyclesForApprisalYear(year);
    //}
    
  }
  onChangeCycleInfo(epmsHdrId):void{
      this.getTeamDeatilsByOrgId(epmsHdrId);
       this.getEmployeeSelfGoalDetails(epmsHdrId);
  }

  getReviewCyclesForApprisalYear(epmsHdrId){
    this._appraisalService.getReviewCycleForAppraisalYear(epmsHdrId).subscribe(response => {
      this.reviewCycleList = response;
      if(this.reviewCycleList){
        this.getEmployeeSelfGoalDetails(this.reviewCycleList[0]['epmsHdrId']);  
        this.getTeamDeatilsByOrgId(this.reviewCycleList[0]['epmsHdrId']);
        this.epmsHdrId= this.reviewCycleList[0]['epmsHdrId'];    
      }
      
    }) 
  }

  getTeamDataForApprisalYear(epmsHdrId){
    this.getTeamDeatilsByOrgId(epmsHdrId);
    this.getEmployeeSelfGoalDetails(epmsHdrId);
  }

  getTeamDeatilsByOrgId(epmsHdrId):void{
    $('#loadModal').modal('show');
    this.epmsHdrId=epmsHdrId;
    this._appraisalService.getTeamGoalsList(epmsHdrId).subscribe(
      (response) => {
        $('#loadModal').modal('hide');
        this.teamGoalsList=response;
        this.myTeamLength=this.teamGoalsList.filter(teamInfo=>!(teamInfo['isProjectResource']==='Yes'));
        this.projectTeamLength=this.teamGoalsList.filter(teamInfo=>(teamInfo['isProjectResource']==='Yes'));
      },
      (error)=>{
        $('#loadModal').modal('hide');
      }
    );
  }
  getEmployeeSelfGoalDetails(epmsHdrId) {
    $('#loadModal').modal('show');
    this._appraisalService.getEmployeeSelfGoalDetails(epmsHdrId).subscribe(
      (response) => {
        $('#loadModal').modal('hide');
        if(response.epmsHdrId){
          this.disableMyGoal = false;
        }else{
          this.disableMyGoal = true;
        }
        this.selfGoalInfo=response;
        this.selfGoalInfo['epmsHdrId']=epmsHdrId;
        this.epmsHdrId=epmsHdrId;
      },
      ()=>{
        $('#loadModal').modal('hide');
      }
    );
  }
  


}
