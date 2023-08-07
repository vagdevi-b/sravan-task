import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';

@Component({
  selector: 'app-decline-comments',
  templateUrl: './decline-comments.component.html',
  styleUrls: ['./decline-comments.component.css']
})
export class DeclineCommentsComponent implements OnInit {
  declineComments:string;
  @Input() responseObj;
  @Input() type;

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private activeModal:NgbActiveModal,
    private toaster:ToastrService,
    private appraisalService:AppraisalService
  ) { }

  ngOnInit() {
    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();
  }

  close():void{
    this.activeModal.close();
  }

  updateCommentInfo(){
    if(this.declineComments) {
      if(this.type==="organization" || this.type==="career"){
        this.responseObj['osiEpmsEmpDetails'][0].comments = this.declineComments;
        this.appraisalService.savePerformanceAreas(this.responseObj).subscribe(
          (response) => {
            this.toaster.success("Record Updated Successfully");
            this.activeModal.close();
          },
          (error) => {
            const errorInfo = JSON.parse(error['_body']);
            this.toaster.error(errorInfo['developerMessage']);
          }
        );
      }
      if(this.type==="projects"){
        this.responseObj['osiEpmsEmpDetails'][0].comments = this.declineComments;
        this.appraisalService.saveProjectGoals(this.responseObj).subscribe(
          (response) => {
            this.toaster.success("Record Updated Successfully");
            this.activeModal.close(response);
          },
          (error) => {
            const errorInfo=JSON.parse(error['_body']);
            this.toaster.error(errorInfo['developerMessage']);
          }
        )
      }
    } else{
      this.toaster.error("Please Enter Comments");
    }
  }

}
