import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppraisalService } from '../../../../shared/services/appraisal-cycle/appraisal.service';

@Component({
  selector: 'app-emps-rating',
  templateUrl: './emps-rating.component.html',
  styleUrls: ['./emps-rating.component.css']
})
export class EmpsRatingComponent implements OnInit {
  @Input() empsRatingdata;
  @Input() employeeId;
  @Input() epmsHdrId;
  @Input() isFromSelfRating:boolean;
  osiEmpsRating:any={};
  
  constructor(
    private activeModal:NgbActiveModal,
    private apprisalService:AppraisalService
  ) { }

  ngOnInit() {
    this.getRatingInfo();
    // this.populateRatingdata();
  }
  getRatingInfo():void{
    this.apprisalService.getSelfandOverAllRating(this.employeeId, this.epmsHdrId).subscribe(response =>{
      this.empsRatingdata = response;
      this.populateRatingdata();
    })
  }

  populateRatingdata(){ 
     if (this.isFromSelfRating) {
        this.osiEmpsRating['sectionHeader'] = `Overall Self Rating :  ${this.empsRatingdata.empSelfRating.toFixed(2)}`;

        this.osiEmpsRating['careerRating'] = this.empsRatingdata.osiEpmsEmpDetails[0].weightage
          ? Number((this.empsRatingdata.osiEpmsEmpDetails[0].empSelfRating) * 100 / this.empsRatingdata.osiEpmsEmpDetails[0].weightage)
            .toFixed(2)
          : 0.00;

        this.osiEmpsRating['careerWeightage'] = this.empsRatingdata.osiEpmsEmpDetails[0].weightage;
        this.osiEmpsRating['orgWeightage'] = this.empsRatingdata.osiEpmsEmpDetails[1].weightage;

        this.osiEmpsRating['orgRating'] = this.empsRatingdata.osiEpmsEmpDetails[1].weightage
          ? Number((this.empsRatingdata.osiEpmsEmpDetails[1].empSelfRating) * 100 / this.empsRatingdata.osiEpmsEmpDetails[1].weightage)
            .toFixed(2)
          : 0.00;

        this.osiEmpsRating['delWeightage'] = 100-(this.empsRatingdata.osiEpmsEmpDetails[0].weightage+this.empsRatingdata.osiEpmsEmpDetails[1].weightage);
        this.osiEmpsRating['deliveryprojects'] = [];
        this.empsRatingdata.osiEpmsEmpDetails.forEach(item => {
          if(item.cateogryName === "DELIVERY"){
            this.osiEmpsRating['deliveryprojects'].push({
              projectName:item.projectName,
              rating:item.empSelfRating ? Number(item.empSelfRating*100/item.projectWeightage).toFixed(2) : 0.00,
              projectWeightage:item.projectWeightage
            });
          }
        })

     } else {
      // const empsRatingdata = (this.empsRatingdata.empRmRating) > 0 ? this.empsRatingdata.empRmRating : 0 ;
      this.osiEmpsRating['sectionHeader'] = `Overall Manager Rating : ${this.empsRatingdata.empRmRating.toFixed(2)}` ;

      this.osiEmpsRating['careerRating'] = this.empsRatingdata.osiEpmsEmpDetails[0].weightage
        ? Number((this.empsRatingdata.osiEpmsEmpDetails[0].empPmRmRating) * 100 / this.empsRatingdata.osiEpmsEmpDetails[0].weightage)
          .toFixed(2)
        : 0.00;

      this.osiEmpsRating['orgRating'] = this.empsRatingdata.osiEpmsEmpDetails[1].weightage
        ? Number((this.empsRatingdata.osiEpmsEmpDetails[1].empPmRmRating) * 100 / this.empsRatingdata.osiEpmsEmpDetails[1].weightage).toFixed(2)
        : 0.00;

      this.osiEmpsRating['careerWeightage'] = this.empsRatingdata.osiEpmsEmpDetails[0].weightage;
      this.osiEmpsRating['orgWeightage'] = this.empsRatingdata.osiEpmsEmpDetails[1].weightage;
      this.osiEmpsRating['delWeightage'] = 100-(this.empsRatingdata.osiEpmsEmpDetails[0].weightage+this.empsRatingdata.osiEpmsEmpDetails[1].weightage);
      this.osiEmpsRating['deliveryprojects'] = [];
      this.empsRatingdata.osiEpmsEmpDetails.forEach(item => {
        item['empPmRmRating'] = item['empPmRmRating'] ? item['empPmRmRating'] : 0;
        if(item.cateogryName === "DELIVERY"){
          this.osiEmpsRating['deliveryprojects'].push({
            projectName:item.projectName,
            rating:item.empPmRmRating ? Number(item.empPmRmRating*100/item.projectWeightage).toFixed(2) : 0.00,
            projectWeightage:item.projectWeightage
          });
        }
      })
     }
  }

  close():void{
    this.activeModal.close();
  }

}
