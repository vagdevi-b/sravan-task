import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { JsonObject, JsonArray } from "@angular-devkit/core";
import * as _ from "underscore";
import { IsrRegistrationsService } from "./../../shared/services/isr-registrations/isr-registrations.service";
import { IsrRegistration } from "./isr-registration";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

declare var $: any;
@Component({
  selector: 'app-isr-registration',
  templateUrl: './isr-registration.component.html',
  styleUrls: ['./isr-registration.component.css']
})
export class IsrRegistrationComponent implements OnInit {

constructor(
    private isrRegistrationsService: IsrRegistrationsService,
    private router: Router,
    private route: ActivatedRoute,
	private toastrService: ToastrService
  ) {}
  
  isrRegistration = new IsrRegistration();
  countries: any[] = [];
  states: any[] = [];
  employeeList: any[] = [];
  errorMessage: any = null;
  successMessage: any;
  cities: any[] = [];
  header: any = "Add";
  isUpdatable: any = "Create";
  employeeLength: any = false;
  searchedText : any = "";
  ngOnInit() {
	  this.getCountries();
	  let isrRegId = this.route.params["_value"].isrRegId;
	  this.isUpdatable = this.route.params["_value"].isUpdatable;
	  if(isrRegId!=null && this.isUpdatable==='edit'){
		  this.header = "Edit"
		 this.getIsrRegistration(isrRegId);
	  }else if(isrRegId!=null && this.isUpdatable==='view'){
		  this.header = "View"
		  this.getIsrRegistration(isrRegId);
	  }else{
		  this.isrRegistration.isActive = true;
	  }
  }
  
   getActiveEmployees(employeeName){
	   	  			$('#eventDefinitionModal').modal('show');
    this.isrRegistrationsService.getActiveEmployees(employeeName).subscribe(data => {
      this.employeeList = data;
	  $('#eventDefinitionModal').modal('hide');
	  	  		 }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  } 
  
  selectedEmployee(empName: any, employeeId: any) {
    this.isrRegistration.employeeId = employeeId+' - '+empName;
	this.isrRegistration.employeeName = empName;
	$('#employeeList').modal('hide');
  }
  
   onCancel() {
    this.router.navigate(["/isr-registrations"], {
      relativeTo: this.route
    });
  }
   saveIsrRegistration() {
	$('#eventDefinitionModal').modal('show');
    this.isrRegistrationsService
      .saveIsrRegistration(this.isrRegistration)
      .subscribe(response => {
		  this.toastrService.success("ISR registration is saved successfully");
        this.router.navigate(["/isr-registrations"], {
          relativeTo: this.route
        });
        this.isrRegistration = new IsrRegistration();
		$('#eventDefinitionModal').modal('hide');
	  },   (errorResponse) => {
		$('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
     getCountries() {
    this.isrRegistrationsService.getCountries().subscribe(data => {
      this.countries = data;
    });
  } 
  
    getIsrRegistration(isrRegId) {
	$('#eventDefinitionModal').modal('show');
    this.isrRegistrationsService.getIsrRegistrationById(isrRegId).subscribe(data => {
      this.isrRegistration = data;
	  this.getStatesbyCountryCode(this.isrRegistration.countryCode);
	  if(this.isrRegistration.stateCode!=''){
	  this.getCititesbyStateName(this.isrRegistration.stateCode);
	  }
	  	 $('#eventDefinitionModal').modal('hide');
	   }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
  
  getStatesbyCountryCode(countryCode) {
    this.isrRegistrationsService.getStatesbyCountryCode(this.isrRegistration.countryCode).subscribe(data => {
      this.states = data;
	  }, (errorResponse) => {
        this.toastrService.error(errorResponse);
      });
  } 
  
  getCititesbyStateName(stateName) {
    this.isrRegistrationsService.getCititesbyStateName(this.isrRegistration.stateCode).subscribe(data => {
      this.cities = data;
	   }, (errorResponse) => {
        this.toastrService.error(errorResponse);
      });
  } 
  
  getEmployeeDetails(event): any {
    this.employeeLength = false;
    let empSearchString = this.isrRegistration.employeeId ? this.isrRegistration.employeeId : null;
    this.searchedText = empSearchString;
    if ((event.keytab == 13 || event.type == "blur") && empSearchString != "") {
      if (empSearchString) {
        this.isrRegistrationsService.getActiveEmployees(empSearchString).subscribe(data => {
      this.employeeList = data;
	  if (this.employeeList.length > 1 || this.employeeList.length === 0) {
            this.isrRegistration.employeeId = '';
            $('#employeeList').modal({ show: true });
          }
          else {
            this.selectedEmployee(this.employeeList[0].fullName, this.employeeList[0].employeeNumber);
          }
    }); 
      }
    } 
  }

}
