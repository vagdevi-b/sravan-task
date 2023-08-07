import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { JsonObject, JsonArray } from "@angular-devkit/core";
import {NgForm} from '@angular/forms';
import * as _ from "underscore";
import { IsrRegistrationsService } from "./../../shared/services/isr-registrations/isr-registrations.service";
import { IsrEventDefinitionsService } from "./../../shared/services/isr-event-definitions/isr-event-definitions.service";
import { IsrEventDefinition } from "./isr-event-definition";
import { ActivatedRoute, Router } from "@angular/router";
import { IsrEventTargetLocation } from "./isr-event-target-location";
import { IsrPriorEvent } from "./isr-prior-event";
import { IsrEventNotificationRule } from "./isr-event-notification-rule";
import { IsrEventEntry } from "./isr-event-entry";
import { NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { Base64 } from 'js-base64';

declare var $: any;
@Component({
  selector: 'app-isr-event-definition',
  templateUrl: './isr-event-definition.component.html',
  styleUrls: ['./isr-event-definition.component.css']
})
export class IsrEventDefinitionComponent implements OnInit {
	  @ViewChild("DatePickerContainer1") datePickerContainer1;
  @ViewChild("DatePickerContainer2") datePickerContainer2; 
constructor(
    private isrRegistrationsService: IsrRegistrationsService,
	private isrEventDefinitionsService: IsrEventDefinitionsService,
	  private activeModal:NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
	private toastrService: ToastrService,
	private orderPipe: OrderPipe
  ) {
	      this.isrEventDefinition.osiIsrEventEntries = orderPipe.transform(this.isrEventDefinition.osiIsrEventEntries, "contactFirst");
  }
    order: string = 'contactFirst';
  errorList: any[] = [];
  reverse: boolean = false;
  checkAllEntries: boolean = true;
  allIsrEventDefinitions: any[] = [];
  totalEventEntries: any[] = [];
  allPublishedEventDefinitions: any[] = [];
  isrEventDefinition = new IsrEventDefinition();
  countries: any[] = [];
  file:any = "";
  states: any[] = [];
  typesList: any[] = [];
  frequencyList: any[] = []; 
  searchText: any = '';
  webinarDateField: { year: number; month: number; day: number };
  osiIsrPriorEvents: any = [];
  callSalesforceService : boolean = false;
  priorEventData: any = {
	  "osiIsrPriorEvents": []
  };
  frequencyForFinalReminderList: any[] = [];
  disableDateField: boolean = true;
 osiIsrEventTargetLocation: IsrEventTargetLocation={
	 'eventTargetLocId': null,
	 'countryCode' : '',
	 'stateCode' : '',
	 'cityCode': ''
 };
   osiIsrEventEmailNotificationRule: IsrEventNotificationRule={
	 'eventEmailNotId': null,
	 'eventType' : '',
	 'subject' : '',
	 'remainderBeforeUnit': '',
	 'remainderBeforeValue': '',
	 'templateText': '' 
 };
osiIsrEventEmailNotificationRules: any[] = [];
osiIsrEventTargetLocations: any[] = [];
osiIsrEventEntries: any[] = [];
  disableOntargetLocation: boolean = true;
  disableOnnotificationRule: boolean = false;
  disableOneventEntry: boolean = false;
    headerName: any = '';
  employeeList: any[] = [];
  errorMessage: any;
  cities: any[] = [];
  webinarHr: any = '';
  webinarMin: any = '';
  header: any = "Add";
  isUpdatable: any = "Create";
  employeeLength: any = false;
  searchedText : any = "";
  isPublished: boolean = false;
  total: number = 0;
  crntpage: number;
  minPickerDate: any;
  hoursList: any[] = [];
  minsList: any[] = [];
  disableAddTarget: boolean = false;
  disableAddNotificationRule: boolean=false;
  duplicateNotificationRule: boolean = false;
  duplicateLocations: boolean = false;
  ngOnInit() {
	  this.minPickerDate = {
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate()
	};
	  this.getCountries(); 
		for(let i=0; i<24; i++){
			this.hoursList.push((("00" + i).slice(-2)));
		}
		for(let i=0; i<60; i++){
			this.minsList.push((("00" + i).slice(-2)));
		}
	   this.typesList = [
	  {
		  'name': 'CAMPAIGN_START',
		  'desc': 'Campaign Start',
		  'status': false
	  },{
		  'name': 'REMINDER',
		  'desc': 'Followups',
		  'status': false
	  },{
		  'name': 'FINAL_REMINDER',
		  'desc': 'Final Reminder',
		  'status': false
	  }
	  ];
	   this.frequencyList = [
	  {
		  'name': 'MONTHLY',
		  'desc': 'Monthly'
	  },{
		  'name': 'WEEKLY',
		  'desc': 'Weekly'
	  },{
		  'name': 'DAILY',
		  'desc': 'Daily'
	  },{
		  'name': 'HOURLY',
		  'desc': 'Hourly'
	  },{
		  'name': 'MINS',
		  'desc': 'Mins'
	  }
	  ];	
	this.frequencyForFinalReminderList = [
	  {
		  'name': 'DAILY',
		  'desc': 'Days Before'
	  },{
		  'name': 'HOURLY',
		  'desc': 'Hours Before'
	  },{
		  'name': 'MINS',
		  'desc': 'Mins Before'
	  }
	  ];		  
	  if(localStorage.getItem("countries")===undefined){
		  this.getCountries();
	  }else{
		  this.countries = JSON.parse(localStorage.getItem("countries"));
	  }
	  if(localStorage.getItem("allIsrEventDefinitions")===undefined){
		  this.allIsrEventDefinitions = JSON.parse(localStorage.getItem("allIsrEventDefinitions"));
		  this.allPublishedEventDefinitions = [];
			for(let i=0;this.allIsrEventDefinitions.length;i++){
			  if(this.allIsrEventDefinitions[i].status==='PUBLISHED'){
				this.allPublishedEventDefinitions.push(this.allIsrEventDefinitions[i]);
			  }
	  }
	  }else{
		  this.getIsrEventDefinitions();
	  }
	  
	  let eventDefId = this.route.params["_value"].eventDefId;
	  this.isUpdatable = this.route.params["_value"].isUpdatable;
	  if(eventDefId!=null && this.isUpdatable==='edit'){
		  this.header = "Edit"
		 this.getIsrEventDefinition(eventDefId);
	  }else if(eventDefId!=null && this.isUpdatable==='view'){
		  this.header = "View"
		  this.getIsrEventDefinition(eventDefId);
	  }else{
		  this.header = "Create";
		  this.isrEventDefinition.registrationRequired = true;
		  this.isrEventDefinition.manualLinkEnabled = true;
		 this.addTargetLocation();
		 this.addNotificationRule();
		 this.isrEventDefinition.osiIsrEventEmailNotificationRules[0].eventType='CAMPAIGN_START';
		 this.allPublishedEventDefinitions = [];
			for(let i=0;i<this.allIsrEventDefinitions.length;i++){
			  if(this.allIsrEventDefinitions[i].status!=undefined && this.allIsrEventDefinitions[i].status==='PUBLISHED'){
					this.allPublishedEventDefinitions.push(this.allIsrEventDefinitions[i]);  
			  }
			}
	  }
  }  
   onCancel() {
    this.router.navigate(["/isr-event-definitions"], {
      relativeTo: this.route
    });
  }
   saveIsrEventDefinition(saveOrPublish, fromWhere) {
	this.validateTargetLocationRow();
	this.validateNotificationRule();
	this.validateDuplicateLocations();
	this.validateDuplicateNotificationRules();
	if(!this.disableAddTarget && !this.disableAddNotificationRule && !this.duplicateLocations && !this.duplicateNotificationRule){
	$('#eventDefinitionModal').modal('show');
	this.isrEventDefinition.webinarDate = this.webinarDateField.year+'-'+(("00" + this.webinarDateField.month).slice(-2))+'-'+(("00" + this.webinarDateField.day).slice(-2));
	this.isrEventDefinition.webinarTime = (("00" + this.webinarHr).slice(-2))+':'+(("00" + this.webinarMin).slice(-2));
	this.isrEventDefinition.status = saveOrPublish;
	this.isrEventDefinition.osiIsrPriorEvents = [];
	for(let i=0; i<this.osiIsrPriorEvents.length;i++){
		  this.isrEventDefinition.osiIsrPriorEvents.push({
			  'childEventId': this.osiIsrPriorEvents[i]+''
		  });
	  }
	    if(this.isrEventDefinition.osiIsrEventEmailNotificationRules!=undefined){
	   for(let i=0; i<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; i++){
			 this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText = Base64.encode(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText);
		 }
		}
    this.isrEventDefinitionsService
      .saveIsrEventDefinition(this.isrEventDefinition)
      .subscribe(response => {
		  if(!fromWhere){
			  this.router.navigate(["/isr-event-definitions"], {
			  relativeTo: this.route
			});
			this.isrEventDefinition = new IsrEventDefinition();
			$('#eventDefinitionModal').modal('hide');
		  if(this.isrEventDefinition.status!='PUBLISHED'){
		  this.toastrService.success("Event Definition saved successfully");
		  }else{
			  this.toastrService.success("Event Definition published successfully");
		  }
		  }
		  this.isrEventDefinition = response;
		  
      },  (errorResponse) => {
		  if(this.isrEventDefinition.eventDefId===undefined || this.isrEventDefinition.eventDefId===null){
			  this.isrEventDefinitionsService.getEventDefinitionByName(this.isrEventDefinition.webinarName).subscribe(data => {
				  if(data!=undefined && data.eventDefId!=undefined){
					this.getIsrEventDefinition(data.eventDefId);
					this.onNavClick('targetLocation');
					 $("ul.nav-pills li.nav-item a").removeClass("active");
					$("#targetLocationId").addClass("active");
				  }
			  });
		  }
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	}
  }
  
     getCountries() {
		  $('#eventDefinitionModal').modal('show');	
    this.isrRegistrationsService.getCountries().subscribe(data => {
      this.countries = data;
	  localStorage.setItem("countries", JSON.stringify(this.countries));
    	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  } 
  getIsrEventDefinitions() {
	  	$('#eventDefinitionModal').modal('show');	
    this.isrEventDefinitionsService.getIsrEventDefinitions('', '').subscribe(data => {
      this.allIsrEventDefinitions = data;
	  this.allPublishedEventDefinitions = [];
			for(let i=0;i<this.allIsrEventDefinitions.length;i++){
			  if(this.allIsrEventDefinitions[i].status!=undefined && this.allIsrEventDefinitions[i].status==='PUBLISHED'){
					this.allPublishedEventDefinitions.push(this.allIsrEventDefinitions[i]);  
			  }
			}
	  	$('#eventDefinitionModal').modal('hide');	
    });
  }

    getIsrEventDefinition(eventDefId) {
			$('#eventDefinitionModal').modal('show');	
    this.isrEventDefinitionsService.getIsrEventDefinitionById(eventDefId).subscribe(data => {
      this.isrEventDefinition = data;
	  if(data.webinarTime){
		  let toArray =  data.webinarTime.split(":");
		this.webinarHr = toArray[0];
		this.webinarMin = toArray[1];
	  }
	   let webinarDate =  data.webinarDate.split("-");
	  	  this.webinarDateField = { year: parseInt(webinarDate[0]), month: parseInt(webinarDate[1]), day: parseInt(webinarDate[2]) };
	  for(let i=0; i<this.isrEventDefinition.osiIsrEventTargetLocations.length;i++){
		  this.getStatesbyCountryCode(this.isrEventDefinition.osiIsrEventTargetLocations[i].countryCode, i);
		  this.getCititesbyStateName(this.isrEventDefinition.osiIsrEventTargetLocations[i].stateCode, i);
	  }
	 this.osiIsrPriorEvents = this.isrEventDefinition.priorEvents;
	 if(this.isrEventDefinition.status==='PUBLISHED'){
		 this.isPublished = true;
	 }
	 if(this.isrEventDefinition.osiIsrEventTargetLocations.length==0 && !this.isPublished){
		 this.addTargetLocation();
	 }
	this.allPublishedEventDefinitions = [];
	for(let i=0;i<this.allIsrEventDefinitions.length;i++){
	  if(this.allIsrEventDefinitions[i].status!=undefined && this.allIsrEventDefinitions[i].status==='PUBLISHED'){
		  if(this.isrEventDefinition.eventDefId===undefined || this.allIsrEventDefinitions[i].eventDefId!=this.isrEventDefinition.eventDefId){
			this.allPublishedEventDefinitions.push(this.allIsrEventDefinitions[i]);  
		  }
	  }
	}
	
      setTimeout(function () {

        $('#eventDefinitionModal').modal('hide');	

      }, 2000);
	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
  onNavClick(params) {
    if (params === "targetLocation") {
      this.headerName = "Target Locations";
       this.disableOneventEntry = false;
	  this.disableOnnotificationRule = false;
	  this.disableOntargetLocation = true;
    } else if(params === "notificationRule"){
	  this.getEventNotificationRulesByEventDefId();
      this.headerName = "Notification Rules";
      this.disableOntargetLocation = false;
	  this.disableOneventEntry = false;
	  this.disableOnnotificationRule = true;
    }else{
	  this.getEventEntriesByEventDefId();
      this.headerName = "Event Entries";
      this.disableOntargetLocation = false;
	  this.disableOnnotificationRule = false;
	  this.disableOneventEntry = true;
    }
  }
  
  addTargetLocation(){
	  this.validateTargetLocationRow();
		this.validateDuplicateLocations();
           if(!this.disableAddTarget && !this.duplicateLocations){
			  this.osiIsrEventTargetLocation= new IsrEventTargetLocation();
              this.isrEventDefinition.osiIsrEventTargetLocations.push(this.osiIsrEventTargetLocation);
			  this.states[this.isrEventDefinition.osiIsrEventTargetLocations.length]=[];
			  this.cities[this.isrEventDefinition.osiIsrEventTargetLocations.length]=[]; 
		   }  
		}
 
   deleteTargetLocation(index) {
			this.isrEventDefinition.osiIsrEventTargetLocations.splice(index, 1);
			if(index>0){
				this.getStatesbyCountryCode(this.isrEventDefinition.osiIsrEventTargetLocations[index-1].countryCode, (index-1));
			}
			
	}
	deleteNotificationRule(index){
		this.isrEventDefinition.osiIsrEventEmailNotificationRules.splice(index, 1);
	}
	addNotificationRule(){
		this.validateNotificationRule();
		this.validateDuplicateNotificationRules();
		if(!this.disableAddNotificationRule && !this.duplicateNotificationRule){
			this.osiIsrEventEmailNotificationRule= new IsrEventNotificationRule();
			this.isrEventDefinition.osiIsrEventEmailNotificationRules.push(this.osiIsrEventEmailNotificationRule);
		}
	}
  getStatesbyCountryCode(countryCode, indx) {
	  if(countryCode!=undefined && countryCode!=''){
		  	  			$('#eventDefinitionModal').modal('show');
			this.isrRegistrationsService.getStatesbyCountryCode(countryCode).subscribe(data => {
			this.states[indx] = data;
			 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  	  $('#eventDefinitionModal').modal('hide');
	  }
  } 
  
  getCititesbyStateName(stateCode, indx) {
	  	
	  if(stateCode!=undefined && stateCode!=''){
		  		$('#eventDefinitionModal').modal('show');
			this.isrRegistrationsService.getCititesbyStateName(stateCode).subscribe(data => {
			  this.cities[indx] = data;
				 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  	  $('#eventDefinitionModal').modal('hide');
	  }
  } 
    
  getEventEntriesByEventDefId() {
	  	$('#eventDefinitionModal').modal('show');	
	  if(this.isrEventDefinition.eventDefId===undefined || this.isrEventDefinition.eventDefId===null){
		this.validateTargetLocationRow();
		this.validateNotificationRule();
		this.validateDuplicateLocations();
		this.validateDuplicateNotificationRules();
		if(!this.disableAddTarget && !this.disableAddNotificationRule && !this.duplicateLocations && !this.duplicateNotificationRule){
		this.isrEventDefinition.webinarDate = this.webinarDateField.year+'-'+(("00" + this.webinarDateField.month).slice(-2))+'-'+(("00" + this.webinarDateField.day).slice(-2));
		this.isrEventDefinition.webinarTime = (("00" + this.webinarHr).slice(-2))+':'+(("00" + this.webinarMin).slice(-2));
		this.isrEventDefinition.status = 'SAVED';
		this.isrEventDefinition.osiIsrPriorEvents = [];
		for(let i=0; i<this.osiIsrPriorEvents.length;i++){
			  this.isrEventDefinition.osiIsrPriorEvents.push({
				  'childEventId': this.osiIsrPriorEvents[i]+''
			  });
		  }
		  
		  if(this.isrEventDefinition.osiIsrEventEmailNotificationRules!=undefined){
		  for(let i=0; i<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; i++){
			 this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText = Base64.encode(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText);
		 }
	  }
	  this.isrEventDefinitionsService
      .saveIsrEventDefinition(this.isrEventDefinition)
      .subscribe(response => {
		  this.isrEventDefinition = response;
		  $('#eventDefinitionModal').modal('hide');
      },  (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  }
	  		  $('#eventDefinitionModal').modal('hide');
	  }
	if(this.isrEventDefinition.eventDefId!=undefined && this.isrEventDefinition.eventDefId!=null){
		$('#eventDefinitionModal').modal('show');
    this.isrEventDefinitionsService.getEventEntriesByEventDefId(this.isrEventDefinition.eventDefId).subscribe(data => {
      this.isrEventDefinition.osiIsrEventEntries = data;
	  this.totalEventEntries = data;
	   if(data){
        this.total = this.isrEventDefinition.osiIsrEventEntries.length;
      }else{
        this.total = 0;
      }
	  this.validateEventEntries();
	 $('#eventDefinitionModal').modal('hide');	
    }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  }
  } 
  
    getEventNotificationRulesByEventDefId() {
	if(this.isrEventDefinition.eventDefId!=undefined && this.isrEventDefinition.eventDefId!=null){
				$('#eventDefinitionModal').modal('show');	
    this.isrEventDefinitionsService.getEventNotificationRulesByEventDefId(this.isrEventDefinition.eventDefId).subscribe(data => {
      this.isrEventDefinition.osiIsrEventEmailNotificationRules = data;
	  if(this.isrEventDefinition.osiIsrEventEmailNotificationRules===undefined){
		  this.isrEventDefinition.osiIsrEventEmailNotificationRules = [];
	  }
	  if(this.isrEventDefinition.osiIsrEventEmailNotificationRules.length==0 && !this.isPublished){
		 this.addNotificationRule();
	 }else{
		 for(let i=0; i<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; i++){
			 this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText = Base64.decode(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText);
		 }
	 }
	  }, (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  	 $('#eventDefinitionModal').modal('hide');
	}
  } 
  
  public onClick(event, datePicker, str) {
    // close the datepicker when user clicks outside the element
    if (str === "d1") {
      if (!this.datePickerContainer1.nativeElement.contains(event.target)) {
        // check click origin
        datePicker.close();
      }
    } else if (str === "d2") {
      if (!this.datePickerContainer2.nativeElement.contains(event.target)) {
        // check click origin 
        datePicker.close();
      }

    }
  }
  
    close(type):void{
     $('#priorEventModal').modal('hide');
  }
  
  openPriorEvents(item){
	  this.priorEventData = item;
	 $('#priorEventModal').modal({ show: true, backdrop: 'static' });
  }
  
  validateDuplicateNotificationRules(){
	  this.duplicateNotificationRule = false;
	  if(this.isrEventDefinition.osiIsrEventEmailNotificationRules!=undefined){
		for(let i=0; i<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; i++){
			for(let j=1; j<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; j++){
				if(!this.duplicateNotificationRule && this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].eventType!='' && this.isrEventDefinition.osiIsrEventEmailNotificationRules[j].eventType!='' 
				&& i!=j && this.isrEventDefinition.osiIsrEventEmailNotificationRules[j].eventType === this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].eventType){
					this.toastrService.error('Duplicate Email Type is defined at row# '+(i+1)+' and '+(j+1));
					this.duplicateNotificationRule = true;
				}
			}
		}
	  }
  }
  
    validateDuplicateLocations(){
	  this.duplicateLocations = false;
		for(let i=0; i<this.isrEventDefinition.osiIsrEventTargetLocations.length; i++){
			for(let j=1; j<this.isrEventDefinition.osiIsrEventTargetLocations.length; j++){
				if(!this.duplicateLocations && this.isrEventDefinition.osiIsrEventTargetLocations[i].countryCode!='' && this.isrEventDefinition.osiIsrEventTargetLocations[j].countryCode!='' 
				&& i!=j && this.isrEventDefinition.osiIsrEventTargetLocations[j].countryCode === this.isrEventDefinition.osiIsrEventTargetLocations[i].countryCode 
				&& i!=j && this.isrEventDefinition.osiIsrEventTargetLocations[j].stateCode === this.isrEventDefinition.osiIsrEventTargetLocations[i].stateCode
				&& i!=j && this.isrEventDefinition.osiIsrEventTargetLocations[j].cityCode === this.isrEventDefinition.osiIsrEventTargetLocations[i].cityCode
				){
					this.toastrService.error('Duplicate rows(ocations) are defined at row# '+(i+1)+' and '+(j+1));
					this.duplicateLocations = true;
				}
			}
		}
  }
  
  validateNotificationRule(){
	  this.disableAddNotificationRule = false;
	  if(this.isrEventDefinition.osiIsrEventEmailNotificationRules!=undefined){
		for(let i=0; i<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; i++){
			if(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].eventType==undefined || this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].eventType==''){
				this.toastrService.error('Please define Event Type at line #'+(i+1));
				this.disableAddNotificationRule = true;
			 }else if(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].eventType!='CAMPAIGN_START' && (this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].remainderBeforeUnit==undefined || this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].remainderBeforeUnit=='')){
				this.toastrService.error('Please define Frequency Unit at line #'+(i+1));
				this.disableAddNotificationRule = true;
			}else if(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].eventType!='CAMPAIGN_START' && (this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].remainderBeforeValue==undefined || this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].remainderBeforeValue=='')){
				this.toastrService.error('Please enter Frequency Value at line #'+(i+1));
				this.disableAddNotificationRule = true;
			}else if(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].subject==undefined || this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].subject==''){
				this.toastrService.error('Please enter Subject at line #'+(i+1));
				this.disableAddNotificationRule = true;
			}else if(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText==undefined || this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText==''){
				this.toastrService.error('Please enter Email Content at line #'+(i+1));
				this.disableAddNotificationRule = true;
			}
		}
		}
  }
  validateTargetLocationRow(){
	  	  this.disableAddTarget = false;
		for(let i=0; i<this.isrEventDefinition.osiIsrEventTargetLocations.length; i++){
			if(this.isrEventDefinition.osiIsrEventTargetLocations[i].countryCode==undefined || this.isrEventDefinition.osiIsrEventTargetLocations[i].countryCode==''){
				this.toastrService.error('Please define location details at line #'+(i+1));
				this.disableAddTarget = true;
			}
		}
  }
   allEventEntries(event) {
    const checked = event.target.checked;
    this.isrEventDefinition.osiIsrEventEntries.forEach(item => item.sendNotification = checked);
  }
  validateEventEntries() {
	  this.checkAllEntries = false;
	  let checkedLength = 0;
	 if(this.isrEventDefinition.osiIsrEventEntries!=undefined){
    this.isrEventDefinition.osiIsrEventEntries.forEach(item => {
		if(item.sendNotification){
			checkedLength++;
		}
		});
	if(checkedLength===this.isrEventDefinition.osiIsrEventEntries.length){
		this.checkAllEntries = true;
	}
	 }
  }
  toggleChecked(item, event){
	  const checked = event.target.checked;
	  item.sendNotification = checked;
	  this.validateEventEntries();
  }
  publishEvent(){
	  let callPublish = false;
	  for(let i=0; i< this.isrEventDefinition.osiIsrEventEntries.length;i++){
		  if(this.isrEventDefinition.osiIsrEventEntries[i].sendNotification===true){
			callPublish = true;  
		  }
	  }
	  if(callPublish){
	  $('#eventDefinitionModal').modal('show');
	      this.isrEventDefinitionsService
      .publishEvent(this.isrEventDefinition)
      .subscribe(response => {
			  this.toastrService.success("Event Definition published successfully");
		 $('#eventDefinitionModal').modal('hide'); 
		   this.router.navigate(["/isr-event-definitions"], {
			  relativeTo: this.route
			});
			this.isrEventDefinition = new IsrEventDefinition();
      },  (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  }else{
		  this.toastrService.error('Please select at least one customer contact');
	  }
  }
  
    deleteEventEntries(){
	  let  callPublish = false;
	  for(let i=0; i< this.isrEventDefinition.osiIsrEventEntries.length;i++){
		  if(this.isrEventDefinition.osiIsrEventEntries[i].sendNotification===true){
			callPublish = true;  
		  }
	  }
	  if(callPublish){
	  $('#eventDefinitionModal').modal('show');
	      this.isrEventDefinitionsService
      .deleteEventEntries(this.isrEventDefinition)
      .subscribe(response => {
		this.toastrService.success("Event Entries deleted successfully");
		this.isrEventDefinition.osiIsrEventEntries = response.osiIsrEventEntries;  
		$('#eventDefinitionModal').modal('hide'); 
      },  (errorResponse) => {
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
	  }else{
		  this.toastrService.error('Please select at least one customer contact');
	  }
  }
  
  getEventEntriesFromSalesForce(){
	  $('#eventDefinitionModal').modal('show');
		  		  this.isrEventDefinitionsService
      .getEventEntriesFromSalesForce(this.isrEventDefinition)
      .subscribe(response => {
		  this.isrEventDefinition = response;
		  this.totalEventEntries = this.isrEventDefinition.osiIsrEventEntries;
		  this.validateEventEntries();
		  $('#eventDefinitionModal').modal('hide');
      },  (errorResponse) => {
		  if(this.isrEventDefinition.osiIsrEventEmailNotificationRules!=undefined){
			  for(let i=0; i<this.isrEventDefinition.osiIsrEventEmailNotificationRules.length; i++){
				 this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText = Base64.decode(this.isrEventDefinition.osiIsrEventEmailNotificationRules[i].templateText);
			 }
		  }
		 $('#eventDefinitionModal').modal('hide');
        this.toastrService.error(errorResponse);
      });
  }
  
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
  
    selectFile(event) {
		let files = event.target.files;
    this.file = files.item(0);
  }
  
	uploadFile() {
		this.errorList = [];
			$('#eventDefinitionModal').modal('show');	
	  this.isrEventDefinitionsService
		.uploadFile(this.file, this.isrEventDefinition.eventDefId)
		.subscribe(res => {
			this.errorList = res.errorList;
			if(this.errorList.length==0){
				this.file="";
				this.toastrService.success("File uploaded successfully");
				$('#uploadEventEntriesModal').modal('hide'); 
				this.isrEventDefinition.osiIsrEventEntries = res.osiIsrEventEntriesDTOList;
			}
				$('#eventDefinitionModal').modal('hide');	
		  console.log('result', res)
		}, err => {
			this.toastrService.error(err);
		  console.log('error', err);
		  $('#eventDefinitionModal').modal('hide');	
		})
	}
	uploadExcel(){
		$('#uploadEventEntriesModal').modal({ show: true, backdrop: 'static' });
	}
	
	closeUploadWindow(){
		this.file="";
				$('#uploadEventEntriesModal').modal('hide'); 
	}
}
