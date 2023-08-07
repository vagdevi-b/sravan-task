import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-initiate-review-cycle',
  templateUrl: './initiate-review-cycle.component.html',
  styleUrls: ['./initiate-review-cycle.component.css']
})
export class InitiateReviewCycleComponent implements OnInit {
  @ViewChild('DatePickContainer2') datePickContainer2;
  employeeList = [];
  dropdownList: any;
  allSelected: any;
  duplicateDropdownList: any;
  dropdownSettings: any = {};
  initAppraisalForm: FormGroup;
  searchedText='';
  userInfo;
  successMessage;
  errorMessage;
  remainEmpCheck=false;
  displaySuccess=false;
  displayError=false;
  organizationList=[];
  editResponse;
  isUpdate=false;
  frequencyList = [
  {
    name:'Q',
    description:'QUARTERLY'
  },
  {
    name:'H',
    description:'HALF YEARLY'
  },
  {
    name:'Y',
    description:'YEARLY'
  }
  ];
  currentYear= new Date().getFullYear();
  yearsList = []
  constructor(
    private formBuilder:FormBuilder,
    private _appraisalService:AppraisalService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router


  ) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'emp_id',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit:3,
      allowSearchFilter: true
    };
    this.initAppraisalForm = this.formBuilder.group(
      {
        orgId:['',Validators.required],
        year:['',Validators.required],
        frequency:['',Validators.required],
        empId:[''],
        empIdList:[''],
        allEmp:[''],
        remainEmpStatus:[''],
        employeeName:[''],
        status: ['DRAFT'],
        type: ['INITIATE'],
        startDate:[''],
        formStartDate:['',Validators.required]
      }
    );
    this.getOrganizationsList();
    this.getYearsList();
    const routeParams = this.activeRoute.snapshot.params;
    const id=routeParams['id'];
    if(id){
      this.getApprisalInfoById(id);
    }
  }
  getYearsList():void{
    this.yearsList.push(this.currentYear-1);
    this.yearsList.push(this.currentYear);
   /* for(let i=0;i<4;i++){
      this.currentYear = this.currentYear-1;
      this.yearsList.push(this.currentYear);
    }*/
  }
  getApprisalInfoById(id):void{
    this._appraisalService.getReviewCycleById(id).subscribe((response)=>{
      this.editResponse=response[0];
      this.isUpdate=true;
      (<HTMLInputElement> document.getElementById("remainEmpStatus")).disabled = true;
      this.remainEmpCheck = false;
      this.dispatchApprisalInfo(response[0]);
    });

  }
  dispatchApprisalInfo(response):void{
    const date = response['startDate'] ? new Date(response['startDate']) : '';
    let formatedDate;
    if(date){
      formatedDate={year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()};
    }
      this.initAppraisalForm.patchValue({
        orgId:response['orgId'],
        year:response['year'],
        frequency:response['frequency'],
        empId:response['empId'],
        empIdList:response['empIdList'],
        status:response['status'],
        startDate:formatedDate,
        formStartDate: formatedDate
      });
      this.yearsList = [];
      this.yearsList.push(response['year']);
      this.getEmployeesList(response['orgId']);
  } 

  onChangeOrg(event):void{
    const orgId = event.target.value;
    if(orgId){
        this.getEmployeesList(orgId);
    }else{
      this.employeeList=[];
    }

  }
  getEmployeesList(orgId):void{
    this._appraisalService.getEmployeeListByOrg(orgId,this.remainEmpCheck).subscribe(
      (response)=>{
        this.employeeList=response;
        let tmp = [];
        for(let i=0; i < response.length; i++) {
          tmp.push({ emp_id: response[i].employeeId, fullName: response[i].fullName});
        }
        this.dropdownList = tmp;
        // if(this.initAppraisalForm.)
        if(this.remainEmpCheck==false){
          this.duplicateDropdownList = tmp;
        }
        if(this.isUpdate){
          this.allSelected = tmp.filter(e => e.emp_id == this.editResponse['empId']);
          console.log(this.allSelected);
        }
      },
      (error)=>{
        if(orgId == ''){
          this.toastr.error("Please select the Organization");
        }else{
          const errorInfo=JSON.parse(error['_body']);
          this.toastr.error(errorInfo['developerMessage']);
        }
      
      }
    );
  }
  getOrganizationsList():void{
    this._appraisalService.getOrganizations().subscribe((response)=>{
      this.organizationList=response;
    });
  }
  onInitApprisal():void{
    const formObj=this.initAppraisalForm.value;
    if(!(formObj['empId'])){
      this.initAppraisalForm.patchValue({
        empId:-1
      });
    }
    if(!(formObj['empIdList'])){
      this.initAppraisalForm.patchValue({
        empIdList:-1
      });
    }

    if(formObj['formStartDate']){
      const date=`${formObj['formStartDate']['year']}-${formObj['formStartDate']['month']}-${formObj['formStartDate']['day']}`;
      formObj['startDate']=date;
      this.initAppraisalForm.patchValue({
        startDate:date
      });
    }
    
    if(!this.isUpdate){
      this.initAppraisalForm.value.empIdList = this.initAppraisalForm.value.empIdList.map(e => e.emp_id);
      this.initAppraisalForm.value.startDate = moment(this.initAppraisalForm.value.startDate).format('YYYY-MM-DD');
      this._appraisalService.initiateApprisal(this.initAppraisalForm.value,this.isUpdate,this.remainEmpCheck).subscribe(
        (response)=>{
          this.displaySuccess=true;
          this.displayError=false;
          this.initAppraisalForm.reset();
          this.toastr.success(response.message);
          this.router.navigateByUrl('reviewcycle/list');
        },
        (error)=>{
          this.displaySuccess=false;
          this.displayError=true;
         // this.errorMessage = <any>error;
          const errorInfo=JSON.parse(error['_body']);
          this.errorMessage =errorInfo['developerMessage'];
          this.toastr.error(errorInfo['developerMessage']);
        }
      );
    }else{
      this.editResponse['orgId']= formObj['orgId'];
      this.editResponse['year']= formObj['year'];
      this.editResponse['frequency']= formObj['frequency'];
      this.initAppraisalForm.value.empIdList = this.initAppraisalForm.value.empIdList.map(e => e.emp_id);
      this.editResponse['empId']= formObj['empId'];
      this.editResponse['empIdList']= this.initAppraisalForm.value.empIdList;
      this.editResponse['startDate']= formObj['startDate'];
      this.editResponse.startDate = moment(this.editResponse.startDate).format('YYYY-MM-DD');
      this._appraisalService.initiateApprisal(this.editResponse,this.isUpdate,this.remainEmpCheck).subscribe(
        (response)=>{
          this.displaySuccess=true;
          this.displayError=false;
          // this.successMessage = 'Review Cycle Updated Successfully';
          this.toastr.success(response.message);
          this.router.navigateByUrl('reviewcycle/list');
        },
        (error)=>{
          const errorInfo=JSON.parse(error['_body']);
          this.toastr.error(errorInfo['developerMessage']);
        }
      );
    }
  }

  getEmployeeSuggestion(event) {
    
    let mailId = event.target.value;
    if (event.keyCode == 13) {
      this.employeeList = [];
      this._appraisalService.getEmployeeSuggestion(mailId).subscribe
        (response => {
          this.employeeList = response;
          if (this.employeeList.length) {
            event.target.value = '';
            $('#mailList').modal({ show: true });
          }
        })
    }
  }

  selectedEmployee(selectedData) {
    this.initAppraisalForm.patchValue({
      empId:selectedData['employeeId'],
      employeeName:selectedData['fullName']
    });
    $('#mailList').modal('hide');
  }
  filteredEmployeeSearch(search) {
    this.searchedText = search;
    this.employeeList = [];

    this._appraisalService.getEmployeeSuggestion(this.searchedText).subscribe
      (response => {
        response.forEach(data => {
          this.employeeList.push(data);
        });
      })
    this.searchedText = ''
  }
  closeFix(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }
backToList(){
  this.router.navigateByUrl('/reviewcycle/list');
}
onItemSelect(item: any) {
  console.log(item);
}
onSelectAll(items: any) {
  console.log(items);
}
onItemDeSelect(items: any){
  console.log(items);
}

selectAllEmployees(event){
  if(event.target.checked){
   this.allSelected = this.dropdownList;
  }else{
    this.allSelected = this.initAppraisalForm.value.empIdList[""];
  }
}


remainingEmpCheckBox(event){
  if(event.target.checked){
    this.remainEmpCheck = true;
    this.initAppraisalForm.get('formStartDate').clearValidators();
    this.initAppraisalForm.get('formStartDate').updateValueAndValidity();
    this.getEmployeesList(this.initAppraisalForm.value.orgId); 
  }else{
    this.remainEmpCheck = false;
    this.dropdownList = this.duplicateDropdownList;
    this.initAppraisalForm.get('formStartDate').setValidators(Validators.required);
    this.initAppraisalForm.get('formStartDate').updateValueAndValidity();
    this.allSelected = this.initAppraisalForm.value.empIdList[""];
  }
}

}
