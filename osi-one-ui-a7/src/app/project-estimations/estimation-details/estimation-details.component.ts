import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { JsonObject, JsonArray } from "@angular-devkit/core";
import {NgForm} from '@angular/forms';
import * as _ from "underscore";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from '../../projects/project.service';
import { IProjects } from "../../shared/utilities/projectsData.model";
import { ISows } from "../../shared/utilities/sow.model";
import { NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { Base64 } from 'js-base64';

declare var $: any;
@Component({
  selector: 'app-estimation-details',
  templateUrl: './estimation-details.component.html',
  styleUrls: ['./estimation-details.component.css']
})
export class EstimationDetailsComponent implements OnInit {

  constructor(  
    private projectService: ProjectService,
	private activeModal:NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
	private toastrService: ToastrService,
	private orderPipe: OrderPipe) { }
employeeTitles: any[] = [];
projectsList: IProjects[] = [];
practices: any[] = [];
subPractices: any[] = [];
sowList: ISows[] = [];
projectId: number=0;
errorList: any[] = [];
file:any = "";
sowId: number=0;
osiEstimates: any = {};
osiEstimates1: any = {
	"osiEstimatesDetails" : []
};
isValidRequest = false;
organizations: any[] = [];
osiEstimatesDetails: any[] = [];
osiEstimatesDetailsYearOne: any[] = [];
osiEstimatesDetailsYearTwo: any[] = [];
osiEstimatesDetailsYearThree: any[] = [];
osiEstimatesDetailsYearFour: any[] = [];
osiEstimatesDetailsYearFive: any[] = [];
disableYearOne = false;
disableYearTwo = false;
disableYearThree = false;
disableYearFour = false;
disableYearFive = false;
sowYears: any[] = [];
disableUpload = true;
emptyRecord = true;
sowDetails: any = {
  "sowId" : 0,
	"sowNumber": '',
  "sowAmount": 0,
	"budgetCost": 0,
	"sowHours": 0,
	"sowMargin": 0,
	"sowStartDate": '',
	"sowEndDate": '',
	"sowCurrency": ''
};
  ngOnInit() {
	  this.getProjects();
	  this.getOrganizations();
	  this.getEmployeeTitles();
  }
  getProjects(){
     this.projectService.getProjects().subscribe(data => {
      this.projectsList = data;
	  this.resetValues();
	  console.log(this.projectsList);
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
    getSows(projectId){
	this.resetValues();
     this.projectService.getSows(projectId).subscribe(data => {
      this.sowList = data;
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  resetValues(){
	  this.disableUpload = true;
	  this.sowYears = [];
	  this.osiEstimates = {};
	  this.sowDetails={};
	  this.osiEstimatesDetailsYearOne = [];
	  this.osiEstimatesDetailsYearTwo = [];
	  this.osiEstimatesDetailsYearThree = [];
	  this.osiEstimatesDetailsYearFour = [];
	  this.osiEstimatesDetailsYearFive = [];
	  
  }
  getSowDetails(sow){
	  this.resetValues();
	   for(let i=0; i<this.sowList.length;i++){
		   let a = Number(this.sowId);
		  if(this.sowList[i].sowId===a){
			this.sowDetails = this.sowList[i];
			this.disableUpload = false;
		  }
	  }
	  let yearDif = parseInt(this.sowDetails.sowEndDate.substring(0,4))-parseInt(this.sowDetails.sowStartDate.substring(0,4));
	  if(yearDif>4){
		  yearDif=4;
	  }
	  for(let i=0;i<yearDif+1;i++){
		 this.sowYears.push({
			 "year" : parseInt(this.sowDetails.sowStartDate.substring(0,4))+i
		 }); 
	  }
	  ;
	  this.getProjectEstimationDetails(0);
	  $('#0').addClass('active');
  }
  getEmployeeTitles(){
	  this.projectService.getEmployeeTitles().subscribe(data => {
      this.employeeTitles = data;
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  getOrganizations(){
	  this.projectService.getOrganizations().subscribe(data => {
      this.organizations = data;
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
   getPractices(indx){
	  this.projectService.getPractices().subscribe(data => {
      this.practices[indx] = data;
	  this.practices[indx].push({
		  "practiceId": -1,
		  "practiceShortName": "NA"
	  });
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
  getSubPractices(practiceId, indx){
	  this.projectService.getSubPractices(practiceId).subscribe(data => {
      this.subPractices[indx] = data;
	    this.subPractices[indx].push({
		  "practiceId": -1,
		  "practiceShortName": "NA"
	  });
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  setPracticeAndSubPractice(estimationDetails){
	  let len = estimationDetails.length;
			 for(let i=0; i<len;i++){
				 this.getPractices(i);
				 let practiceId = estimationDetails.practiceId;
				 this.getSubPractices(practiceId, i);
			 }
  }
  getProjectEstimationDetails(year){
	 this.projectService.getEstimations(this.projectId, this.sowId, year).subscribe(data => {
		 /*if(data.osiEstimatesDetails!=undefined && data.osiEstimatesDetails.length>0){
			 this.setPracticeAndSubPractice(data.osiEstimatesDetails);
		}*/
		this.osiEstimates1 = data;
		 if(year===0){
			 this.osiEstimates = data;
			 if(this.osiEstimatesDetailsYearOne===null || this.osiEstimatesDetailsYearOne.length===0){
				this.osiEstimatesDetailsYearOne = this.osiEstimates1.osiEstimatesDetails;	 
			 }
			 this.disableYearOne = true;
			 this.disableYearTwo = false;
		     this.disableYearThree = false;
			 this.disableYearFour = false;
		     this.disableYearFive = false;
		 }else if(year===1){
			 if(this.osiEstimatesDetailsYearTwo===null || this.osiEstimatesDetailsYearTwo.length===0){
				this.osiEstimatesDetailsYearTwo = this.osiEstimates1.osiEstimatesDetails;
			 }
			 
			 this.disableYearOne = false;
			 this.disableYearTwo = true;
		     this.disableYearThree = false;
			 this.disableYearFour = false;
		     this.disableYearFive = false;
		 }else if(year===2){
			 if(this.osiEstimatesDetailsYearThree===null || this.osiEstimatesDetailsYearThree.length===0){
				this.osiEstimatesDetailsYearThree = this.osiEstimates1.osiEstimatesDetails;
			 }
			 this.disableYearOne = false;
			 this.disableYearTwo = false;
		     this.disableYearThree = true;
			 this.disableYearFour = false;
		     this.disableYearFive = false;
		 }else if(year===3){
			 if(this.osiEstimatesDetailsYearFour===null || this.osiEstimatesDetailsYearFour.length===0){
				this.osiEstimatesDetailsYearFour = this.osiEstimates1.osiEstimatesDetails;
			 }
			 this.disableYearOne = false;
			 this.disableYearTwo = false;
		     this.disableYearThree = false;
			 this.disableYearFour = true;
		     this.disableYearFive = false;
		 }else if(year===4){
			 if(this.osiEstimatesDetailsYearFive===null || this.osiEstimatesDetailsYearFive.length===0){
				this.osiEstimatesDetailsYearFive = this.osiEstimates1.osiEstimatesDetails;
			 }
			 this.disableYearOne = false;
			 this.disableYearTwo = false;
		     this.disableYearThree = false;
			 this.disableYearFour = false;
		     this.disableYearFive = true;
		 }
		 this.addEstimationRowIfEmpty(year);
    	 $('#eventDefinitionModal').modal('hide');	
		 $('.nav-pills a').removeClass('active');
        $('#'+year).addClass('active');
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
    });
  }
  
   selectFile(event) {
		let files = event.target.files;
    this.file = files.item(0);
  }
  
	uploadFile() {
		this.errorList = [];
			$('#eventDefinitionModal').modal('show');	
	  this.projectService
		.uploadFile(this.file, this.projectId, this.sowId)
		.subscribe(res => {
			this.errorList = res.errorList;
			if(this.errorList.length==0){
				$("#file").val('');
				this.toastrService.success("File uploaded successfully");
				$('#uploadEstimationsModal').modal('hide'); 
				this.osiEstimatesDetailsYearOne = [];
				this.osiEstimatesDetailsYearTwo = [];
				this.osiEstimatesDetailsYearThree = [];
				this.osiEstimatesDetailsYearFour = [];
				this.osiEstimatesDetailsYearFive = [];
				this.getProjectEstimationDetails(0);
			}
			$('#eventDefinitionModal').modal('hide');	
			$('#0').addClass('active');
		  console.log('result', res)
		}, err => {
			$("#file").val('');
			this.toastrService.error(err);
		  console.log('error', err);
		 $('#eventDefinitionModal').modal('hide');	
		})
	}
	uploadExcel(){
					$("#file").val('');
		$('#uploadEstimationsModal').modal({ show: true, backdrop: 'static' });
	}
	 
	closeUploadWindow(){
					$("#file").val('');
				$('#uploadEstimationsModal').modal('hide'); 
	}
	
	deleteEstimationRow(year, i) {
		if(year===0){
			this.osiEstimatesDetailsYearOne.splice(i, 1);			
		 }else if(year===1){
			this.osiEstimatesDetailsYearTwo.splice(i, 1);				
		 }else if(year===2){
			this.osiEstimatesDetailsYearThree.splice(i, 1);	
		 }else if(year===3){
			this.osiEstimatesDetailsYearFour.splice(i, 1);	
		 }else if(year===4){
			this.osiEstimatesDetailsYearFive.splice(i, 1);
		 }
		 this.addEstimationRowIfEmpty(year);
	}

	addEstimationRow(year){
		let estimateDetails = {
			"role" : "",
			"noOfResources": 1,
			"empOrgId": 0,
			"empLevel": "",
			"billRate": 0,
			"cost" : 0,
			"jan": 0,
			"feb": 0,
			"mar": 0,
			"apr": 0,
			"may": 0,
			"jun": 0,
			"jul": 0,
			"aug": 0,
			"sep": 0,
			"oct": 0,
			"nov": 0,
			"dec": 0,
		};
		 if(year===0){
			if(this.osiEstimatesDetailsYearOne===undefined || this.osiEstimatesDetailsYearOne===null){
				this.osiEstimatesDetailsYearOne = [];
			}
			this.osiEstimatesDetailsYearOne.push(estimateDetails);			
		 }else if(year===1){
			if(this.osiEstimatesDetailsYearTwo===undefined || this.osiEstimatesDetailsYearTwo===null){
				this.osiEstimatesDetailsYearTwo = [];
			}
			this.osiEstimatesDetailsYearTwo.push(estimateDetails);			
		 }else if(year===2){
			if(this.osiEstimatesDetailsYearThree===undefined || this.osiEstimatesDetailsYearThree===null){
				this.osiEstimatesDetailsYearThree = [];
			}
			this.osiEstimatesDetailsYearThree.push(estimateDetails);			
		 }else if(year===3){
			if(this.osiEstimatesDetailsYearFour===undefined || this.osiEstimatesDetailsYearFour===null){
				this.osiEstimatesDetailsYearFour = [];
			}
			this.osiEstimatesDetailsYearFour.push(estimateDetails);			
		 }else if(year===4){
			if(this.osiEstimatesDetailsYearFive===undefined || this.osiEstimatesDetailsYearFive===null){
				this.osiEstimatesDetailsYearFive = [];
			}
			this.osiEstimatesDetailsYearFive.push(estimateDetails);			
		 }
	}
	
	addEstimationRowIfEmpty(year){
		let estimateDetails = {
			"role" : "",
			"noOfResources": 1,
			"empOrgId": 0,
			"empLevel": "",
			"billRate": 0,
			"cost" : 0,
			"jan": 0,
			"feb": 0,
			"mar": 0,
			"apr": 0,
			"may": 0,
			"jun": 0,
			"jul": 0,
			"aug": 0,
			"sep": 0,
			"oct": 0,
			"nov": 0,
			"dec": 0,
		};
		 if(year===0){
			if(this.osiEstimatesDetailsYearOne===undefined || this.osiEstimatesDetailsYearOne===null){
				this.osiEstimatesDetailsYearOne = [];
			}
			if(this.osiEstimatesDetailsYearOne.length===0){
				this.osiEstimatesDetailsYearOne.push(estimateDetails);			
			}
		 }else if(year===1){
			if(this.osiEstimatesDetailsYearTwo===undefined || this.osiEstimatesDetailsYearTwo===null){
				this.osiEstimatesDetailsYearTwo = [];
			}
			if(this.osiEstimatesDetailsYearTwo.length===0){
						this.osiEstimatesDetailsYearTwo.push(estimateDetails);
			}			
		 }else if(year===2){
			if(this.osiEstimatesDetailsYearThree===undefined || this.osiEstimatesDetailsYearThree===null){
				this.osiEstimatesDetailsYearThree = [];
			}
			if(this.osiEstimatesDetailsYearThree.length===0){
				this.osiEstimatesDetailsYearThree.push(estimateDetails);			
			}
		 }else if(year===3){
			if(this.osiEstimatesDetailsYearFour===undefined || this.osiEstimatesDetailsYearFour===null){
				this.osiEstimatesDetailsYearFour = [];
			}
			if(this.osiEstimatesDetailsYearFour.length===0){
				this.osiEstimatesDetailsYearFour.push(estimateDetails);			
			}
		 }else if(year===4){
			if(this.osiEstimatesDetailsYearFive===undefined || this.osiEstimatesDetailsYearFive===null){
				this.osiEstimatesDetailsYearFive = [];
			}
			if(this.osiEstimatesDetailsYearFive.length===0){
				this.osiEstimatesDetailsYearFive.push(estimateDetails);			
			}
		 }
	}
	
 deleteAllEstimationDetails(year) {
	 if(year===0){
			    this.osiEstimatesDetailsYearOne = [];
		 }else if(year===1){
			    this.osiEstimatesDetailsYearTwo=[];		
		 }else if(year===2){
			    this.osiEstimatesDetailsYearThree=[];
		 }else if(year===3){
			this.osiEstimatesDetailsYearFour=[];
		 }else if(year===4){
			this.osiEstimatesDetailsYearFive=[];
		 }
	this.addEstimationRowIfEmpty(year);
  }
  saveEstimationDetails(){
	  $('#eventDefinitionModal').modal('show');
	  let totalEstimationDetails = [];
	  this.isValidRequest = true;
	  let sowStartYear = parseInt(this.sowDetails.sowStartDate.substring(0,4))
	  for(let i=0; i< this.osiEstimatesDetailsYearOne.length;i++){
		  this.osiEstimatesDetailsYearOne[i].yearmonth = sowStartYear;
		  this.resetNullValues(this.osiEstimatesDetailsYearOne[i], i);
		  if(this.emptyRecord){
			totalEstimationDetails.push(this.osiEstimatesDetailsYearOne[i]);  
		  }
	  }
	  if(this.osiEstimatesDetailsYearTwo!=null && this.osiEstimatesDetailsYearTwo.length>0){
		  for(let i=0; i< this.osiEstimatesDetailsYearTwo.length;i++){
			  this.osiEstimatesDetailsYearTwo[i].yearmonth = sowStartYear+1;
		this.resetNullValues(this.osiEstimatesDetailsYearTwo[i], i);
		  if(this.emptyRecord){
			totalEstimationDetails.push(this.osiEstimatesDetailsYearTwo[i]); 
		  }
	  }
	  }
	  if(this.osiEstimatesDetailsYearThree!=null && this.osiEstimatesDetailsYearThree.length>0){
		for(let i=0; i< this.osiEstimatesDetailsYearThree.length;i++){
			  this.osiEstimatesDetailsYearThree[i].yearmonth = sowStartYear+2;
			this.resetNullValues(this.osiEstimatesDetailsYearThree[i], i);
			if(this.emptyRecord){
				totalEstimationDetails.push(this.osiEstimatesDetailsYearThree[i]);  
			}
	  }
	  }
	  if(this.osiEstimatesDetailsYearFour!=null && this.osiEstimatesDetailsYearFour.length>0){
		  for(let i=0; i< this.osiEstimatesDetailsYearFour.length;i++){
			  this.osiEstimatesDetailsYearFour[i].yearmonth = sowStartYear+3;
			this.resetNullValues(this.osiEstimatesDetailsYearFour[i], i);
			if(this.emptyRecord){
			totalEstimationDetails.push(this.osiEstimatesDetailsYearFour[i]);  
			} 
	  }
	  }
	  if(this.osiEstimatesDetailsYearFive!=null && this.osiEstimatesDetailsYearFive.length>0){
		  for(let i=0; i< this.osiEstimatesDetailsYearFive.length;i++){
			  this.osiEstimatesDetailsYearFive[i].yearmonth = sowStartYear+4;
			  this.resetNullValues(this.osiEstimatesDetailsYearFive[i], i);
		  if(this.emptyRecord){
			totalEstimationDetails.push(this.osiEstimatesDetailsYearFive[i]);  
		  }
	  }
	  }
	 this.osiEstimates.projectId = this.projectId;  
	 this.osiEstimates.sowId = this.sowId;
	 this.osiEstimates.osiEstimatesDetails = totalEstimationDetails;
	 if(this.isValidRequest){
		 this.projectService
		  .saveEstimations(this.osiEstimates)
		  .subscribe(response => {
			  $('#eventDefinitionModal').modal('hide');
			  this.toastrService.success("Estimations saved successfully");
			 this.getProjectEstimationDetails(0);
		  },  (errorResponse) => {
			 $('#eventDefinitionModal').modal('hide');
			this.toastrService.error(errorResponse);
		  });
	 }else{
		 	 $('#eventDefinitionModal').modal('hide');
	 }
  }
  
  resetNullValues(thiz, indx){
	  	  this.isValidRequest = true;
	  thiz.billRate = thiz.billRate===null?0:thiz.billRate;
	  thiz.cost = thiz.cost===null?0:thiz.cost;
	  thiz.jan = thiz.jan===null?0:thiz.jan;
	  thiz.feb = thiz.feb===null?0:thiz.feb;
	  thiz.mar = thiz.mar===null?0:thiz.mar;
	  thiz.apr = thiz.apr===null?0:thiz.apr;
	  thiz.may = thiz.may===null?0:thiz.may;
	  thiz.jun = thiz.jun===null?0:thiz.jun;
	  thiz.jul = thiz.jul===null?0:thiz.jul;
	  thiz.aug = thiz.aug===null?0:thiz.aug;
	  thiz.sep = thiz.sep===null?0:thiz.sep;
	  thiz.oct = thiz.oct===null?0:thiz.oct;
	  thiz.nov = thiz.nov===null?0:thiz.nov;
	  thiz.dec = thiz.dec===null?0:thiz.dec;
	  thiz.noOfResources = thiz.noOfResources===null?1:thiz.noOfResources;
	  this.emptyRecord = true;
	  let hoursGtZero = (thiz.billRate>0 || thiz.cost>0 || thiz.jan>0 || thiz.feb>0 || thiz.mar>0 || thiz.apr>0 || thiz.may>0 || thiz.jun>0 || thiz.jul>0 || thiz.aug>0 || thiz.sep>0 || thiz.oct>0 || thiz.nov>0 || thiz.dec>0);
	  if(hoursGtZero
		  && !(thiz.role!=undefined && thiz.role!='' && thiz.empOrgId!='0' && thiz.empLevel!='')){
			  this.isValidRequest = false;
			 $('#eventDefinitionModal').modal('hide');
			this.toastrService.error("Role, Location and Job Codes are mandatory at row["+(indx+1)+"] in "+(thiz.yearmonth)+" Tab");
	  }else if(thiz.role!='' && thiz.role!=undefined && (thiz.empOrgId==='0' || thiz.empLevel==='')){
		    this.isValidRequest = false;
			 $('#eventDefinitionModal').modal('hide');
			this.toastrService.error("Please fill the remaining details at row["+(indx+1)+"] in "+(thiz.yearmonth)+" Tab");
	  }else if(thiz.empOrgId!='0' && (thiz.role==='' || thiz.role===undefined  || thiz.empLevel==='')){
		    this.isValidRequest = false;
			 $('#eventDefinitionModal').modal('hide');
			this.toastrService.error("Please fill the remaining details at row["+(indx+1)+"] in "+(thiz.yearmonth)+" Tab");
	  }else if(thiz.empLevel!='' && (thiz.empOrgId==='0' || thiz.role==='' || thiz.role===undefined)){
		    this.isValidRequest = false;
			 $('#eventDefinitionModal').modal('hide');
			this.toastrService.error("Please fill the remaining details at row["+(indx+1)+"] in "+(thiz.yearmonth)+" Tab");
	  }else if((thiz.role!=undefined && thiz.role!='' && thiz.empOrgId!='0' && thiz.empLevel!='') && !hoursGtZero){
		    this.isValidRequest = false;
			 $('#eventDefinitionModal').modal('hide');
			this.toastrService.error("Please fill the hours, Rate, Cost details at row["+(indx+1)+"] in "+(thiz.yearmonth)+" Tab");
	  }else if(!hoursGtZero && (thiz.empOrgId==='0' || thiz.role==='' || thiz.role===undefined  || thiz.empLevel==='')){
		  this.emptyRecord = false;
	  }
  }
  
  setValueAsZero(event){
	  if(event.target.value===''){
		  event.target.value =0;
	  }
  }
  
   setValueAsOne(event){
	  if(event.target.value===''){
		  event.target.value =1;
	  }
  }
}
