import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appraisal-info',
  templateUrl: './appraisal-info.component.html',
  styleUrls: ['./appraisal-info.component.css']
})
export class AppraisalInfoComponent implements OnInit {
  @Input() yearsList;
  @Input() year;
  @Input() selfGoalInfo;
  @Input() selectedYear;
  @Output() yearchange = new EventEmitter();
  @Output() reviewCyclechange = new EventEmitter();
  @Input() reviewCycleList;
  @Input() epmsHdrId;
  apprisalYear;

  constructor(
     private appraisalService: AppraisalService,
    private router:Router,
    private toaster:ToastrService

  ) { }

  ngOnInit() {
  }

  onCycleYearChange(event){
    const year = event.target.value;
    if(year){
     this.yearchange.emit(Number(year));
    // this.apprisalYear =Number(year);
    }
  }


  onreviewCycleChange(event){
    this.epmsHdrId= event.target.value;
    if(this.epmsHdrId){
      this.reviewCyclechange.emit(Number(this.epmsHdrId));
    }
  }
  
  navigateMyGoals():void{
    if(this.selfGoalInfo && this.selfGoalInfo['employeeId'] && this.selfGoalInfo['epmsStatus']){
      this.selfGoalInfo['selectedYear']=this.selectedYear;
      localStorage.setItem('setGoals',JSON.stringify(this.selfGoalInfo));
      this.appraisalService.setIsGoalsPageReadOnly(false);
      this.router.navigate(['reviewcycle/goalsetting/']);
    }else{
      this.toaster.error('You are not part of this review cycle.');
    }
    
  }
}
