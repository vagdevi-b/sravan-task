import { Component, OnInit } from '@angular/core';
import { IsrRegistrationsService } from "./../../shared/services/isr-registrations/isr-registrations.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-isr-registration-list',
  templateUrl: './isr-registration-list.component.html',
  styleUrls: ['./isr-registration-list.component.css'] 
})
export class IsrRegistrationListComponent implements OnInit {
constructor(
    private isrRegistrationsService: IsrRegistrationsService,
    private router: Router,
    private route: ActivatedRoute,
	private toastrService: ToastrService
  ) {}

  allIsrRegistrations: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  employeeId:any='';
  employeeName:any='';
  countryCode:any='';
  stateName:any='';
  cityCode:any='';
  responseData;
  showAlert;
  successMessage;
  errorMessage;
  searchText;
  total: number = 0;
  crntpage: number;
 isSelectedRow: any = null;
isAnyRowSelected:boolean = false;
isUpdatable = false;
callRegistration = false;

  ngOnInit() {
	  this.getCountries() ;
    this.responseData = this.route.snapshot.params;
	if(localStorage.getItem("employeeId")){
		this.employeeId = localStorage.getItem("employeeId");
		this.callRegistration = true;
	}
	if(localStorage.getItem("employeeName")){
		this.employeeName = localStorage.getItem("employeeName");
		this.callRegistration = true;
	}
	if(localStorage.getItem("countryCode")){
		this.countryCode = localStorage.getItem("countryCode");
		this.callRegistration = true;
		this.getStatesbyCountryCode(this.countryCode);
	}
	if(localStorage.getItem("stateName")){
		this.stateName = localStorage.getItem("stateName");
		this.getCititesbyStateName(this.stateName);
		this.callRegistration = true;
	}
	if(localStorage.getItem("cityCode")){
		this.cityCode = localStorage.getItem("cityCode");
		this.callRegistration = true;
	}
	this.searchRegistrations();
    if (this.responseData) {
      this.showAlert = this.responseData.p1;
      this.successMessage = this.responseData.p2;
      let ref = this;
      setTimeout(function() {
        ref.showAlert = false;
      }, 5000);
    }
  }
  searchRegistrations(){
	  
	  if(this.employeeId===undefined){
		 this.employeeId = ''; 
	  }if(this.employeeName==undefined){
		 this.employeeName = ''; 
	  }
	  if(this.countryCode==undefined){
		 this.countryCode = ''; 
	  }if(this.stateName==undefined){
		 this.stateName = ''; 
	  }
		if(this.cityCode==undefined){
		 this.cityCode = ''; 
	  }
	  localStorage.setItem("employeeId", this.employeeId);
	  localStorage.setItem("employeeName", this.employeeName);
	  localStorage.setItem("countryCode", this.countryCode);
	  localStorage.setItem("stateName", this.stateName);
	  localStorage.setItem("cityCode", this.cityCode);
	  this.getIsrRegistrations(this.employeeId, this.employeeName, this.countryCode, this.stateName, this.cityCode);
  }

    onRowSelected(registration) {
	this.isSelectedRow = registration;
    this.isAnyRowSelected=true;
      this.router.navigate(['/isr/edit-isr-registration/edit/' + this.isSelectedRow.isrRegId], { relativeTo: this.route });
  }
  
 viewIsrRegistration() {
	  this.isUpdatable = false;
    this.router.navigate(["/isr/view-isr-registration/view/" + this.isSelectedRow.isrRegId], {
      relativeTo: this.route
    });
  }

    isRowClicked(data) {
    this.isSelectedRow = data;
    this.isAnyRowSelected=true;
  }
  
  editIsrRegistration() {
	  this.isUpdatable = true;
    this.router.navigate(["/isr/edit-isr-registration/edit/" + this.isSelectedRow.isrRegId], {
      relativeTo: this.route
    });
  }


  createIsrRegistration() {
    this.router.navigate(["/isr/create-isr-registration"], {
      relativeTo: this.route
    });
  } 

  getIsrRegistrations(employeeId, employeeName, countrCode, stateCode, cityCode) {
	   $('#eventDefinitionModal').modal('show');
    this.isrRegistrationsService.getIsrRegistrations(employeeId, employeeName, countrCode, stateCode, cityCode).subscribe(data => {
      this.allIsrRegistrations = data;
      if(data){
        this.total = this.allIsrRegistrations.length;
      }else{
        this.total = 0;
      }
	  $('#eventDefinitionModal').modal('hide');
     }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
   getCountries() {
    $('#eventDefinitionModal').modal('show');
	this.isrRegistrationsService.getCountries().subscribe(data => {
      this.countries = data;
     $('#eventDefinitionModal').modal('hide');
     }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  } 
  
  getStatesbyCountryCode(countryCode) {
    this.isrRegistrationsService.getStatesbyCountryCode(this.countryCode).subscribe(data => {
      this.states = data;
     }, (errorResponse) => {
        this.toastrService.error(errorResponse);
      });
  } 
  
  getCititesbyStateName(stateName) {
    this.isrRegistrationsService.getCititesbyStateName(this.stateName).subscribe(data => {
      this.cities = data;
     }, (errorResponse) => {
        this.toastrService.error(errorResponse);
      });
  } 
  clearSearch(){
	this.employeeId= '';
	this.employeeName ='';
	this.countryCode = '';
	this.stateName= '';
	this.cityCode ='';
	this.allIsrRegistrations=[];
  }
}
