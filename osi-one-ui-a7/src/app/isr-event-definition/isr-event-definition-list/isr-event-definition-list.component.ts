import { Component, OnInit } from '@angular/core';
import { IsrEventDefinitionsService } from "./../../shared/services/isr-event-definitions/isr-event-definitions.service";
import { IsrRegistrationsService } from "./../../shared/services/isr-registrations/isr-registrations.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: 'app-isr-event-definition-list',
  templateUrl: './isr-event-definition-list.component.html',
  styleUrls: ['./isr-event-definition-list.component.css']
})
export class IsrEventDefinitionListComponent implements OnInit {
constructor(
    private isrEventDefinitionsService: IsrEventDefinitionsService,
	private isrRegistrationsService: IsrRegistrationsService,
    private router: Router,
    private route: ActivatedRoute,
	private toastrService: ToastrService
  ) {}
  checkAllEntries: boolean = false;
  allIsrEventDefinitions: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  statusList: any[] = [];
  status: any = '';
  webinarName:any='';
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
callEventDefinition = false;
enableDeleteOption = false;
  ngOnInit() {
	  this.getCountries();
	  this.statusList = [
	  {
		  'status': 'PUBLISHED',
		  'desc': 'Published',
	  },{
		  'status': 'SAVED',
		  'desc': 'Saved',
	  }
	  ];
    this.responseData = this.route.snapshot.params;
	if(localStorage.getItem("webinarName")){
		this.webinarName = localStorage.getItem("webinarName");
		this.callEventDefinition = true;
	}if(localStorage.getItem("status")){
		this.status = localStorage.getItem("status");
		this.callEventDefinition = true;
	}
	//if(this.callEventDefinition){
		this.searchEventDefinitions();
	//}
    if (this.responseData) {
      this.showAlert = this.responseData.p1;
      this.successMessage = this.responseData.p2;
      let ref = this;
      setTimeout(function() {
        ref.showAlert = false;
      }, 5000);
    }
  }
  searchEventDefinitions(){
	  
	  if(this.webinarName===undefined){
		 this.webinarName = ''; 
	  }
	  if(this.status===undefined){
		 this.status = ''; 
	  }
	  localStorage.setItem("webinarName", this.webinarName);
	  localStorage.setItem("status", this.status);
	  
	  this.getIsrEventDefinitions(this.status);
  }

    getCountries() {
    this.isrRegistrationsService.getCountries().subscribe(data => {
      this.countries = data;
	  localStorage.setItem("countries", JSON.stringify(this.countries));
    });
  } 
    onRowSelected(eventDefinition) {
	this.isSelectedRow = eventDefinition;
    this.isAnyRowSelected=true;
      this.router.navigate(['/isr/edit-isr-event-definition/edit/' + this.isSelectedRow.eventDefId], { relativeTo: this.route });
  }
  
 viewIsrEventDefinition() {
	  this.isUpdatable = false;
    this.router.navigate(["/isr/view-isr-event-definition/view/" + this.isSelectedRow.eventDefId], {
      relativeTo: this.route
    });
  }

    isRowClicked(data) {
    this.isSelectedRow = data;
    this.isAnyRowSelected=true;
  }
  
  editIsrEventDefinition() {
	  this.isUpdatable = true;
    this.router.navigate(["/isr/edit-isr-event-definition/edit/" + this.isSelectedRow.eventDefId], {
      relativeTo: this.route
    });
  }


  createIsrEventDefinition() {
    this.router.navigate(["/isr/create-isr-event-definition"], {
      relativeTo: this.route
    });
  } 

   
  getIsrEventDefinitions(webinarName) {
    $('#eventDefinitionModal').modal('show');
	this.isrEventDefinitionsService.getIsrEventDefinitions(this.webinarName, this.status).subscribe(data => {
      this.allIsrEventDefinitions = data;
	  localStorage.setItem("allIsrEventDefinitions", JSON.stringify(this.allIsrEventDefinitions));
      if(data){
        this.total = this.allIsrEventDefinitions.length;
      }else{
        this.total = 0;
      }
    $('#eventDefinitionModal').modal('hide');
	  	  		 }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
  clearSearch(){
	this.webinarName= '';
	this.status= '';
  }  
  
    toggleChecked(item, event){
	  const checked = event.target.checked;
	  item.delete = checked;
	  this.enableDeleteOption = false;
	   for(let i=0; i< this.allIsrEventDefinitions.length;i++){
		  if(this.allIsrEventDefinitions[i].delete===true){
			this.enableDeleteOption = true;
		  }
	  }
  }
  allEventEntries(event) {
    const checked = event.target.checked;
    this.allIsrEventDefinitions.forEach(item => item.delete = checked);
	if(checked){
		this.enableDeleteOption = true;
	}else{
		this.enableDeleteOption = false;
	}
  }
  
  deleteEventDefinitions(){
	  let eventIds = "";
	  for(let i=0; i< this.allIsrEventDefinitions.length;i++){
		  if(this.allIsrEventDefinitions[i].delete===true){
			  if(eventIds===''){
				  eventIds = this.allIsrEventDefinitions[i].eventDefId;
			  }else{
				eventIds = eventIds+','+this.allIsrEventDefinitions[i].eventDefId;
			  }
		  }
	  }
	  if(eventIds!='' && eventIds!=undefined){
	  $('#eventDefinitionModal').modal('show');
	      this.isrEventDefinitionsService
      .deleteEventDefinitions(eventIds)
      .subscribe(response => {
		this.toastrService.success("Event Definitions deleted successfully");
		this.searchEventDefinitions();
		$('#eventDefinitionModal').modal('hide'); 
      },  (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  }
  }
}