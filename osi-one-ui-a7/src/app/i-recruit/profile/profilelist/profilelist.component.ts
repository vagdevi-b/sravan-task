import { Component, OnInit, ViewChild } from '@angular/core';
import { RequistionsService } from '../../../shared/services/requistions.service';
import { ProfiletableComponent } from '../profiletable/profiletable.component';
import { ToastrService } from "ngx-toastr";

declare var $: any;
@Component({
  selector: 'app-profilelist',
  templateUrl: './profilelist.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class ProfilelistComponent implements OnInit {
  
  searchType: any;
  IsSourceSelected: boolean = false;
  sourceData:any = [];
  searchItem:any;
  isSearchTextRequired:boolean=true;
  IsStatusSelected:boolean = false;
  statusData:any=[];
  Candidates:any = '';
  selectedType='';
  @ViewChild(ProfiletableComponent) profileTableComponent: ProfiletableComponent;
  constructor(private reqSvc: RequistionsService,private toastr:ToastrService) { }

  ngOnInit() {
  }

  getSearchType($event){
    //console.log($event.target.value);
    let searchType=$event.target.value;
    if(searchType === 'Request No'){
      this.searchItem='';
      this.searchType = searchType;
      this.IsSourceSelected = false;
      this.IsStatusSelected = false;
      this.isSearchTextRequired = true;
    }else if(searchType === 'AssignTo'){
      this.searchItem='';
      this.searchType = searchType;
      this.IsSourceSelected = false;
      this.IsStatusSelected = false;
      this.isSearchTextRequired = true;
    }else if(searchType === 'Status'){
      this.searchType = searchType;
      this.getStatuses();
      this.IsSourceSelected = false;
      this.IsStatusSelected = true;
      this.isSearchTextRequired = false;
    }else if(searchType === 'Source'){
      this.searchItem='';
      this.searchType = searchType;
      this.sourceData = this.profileTableComponent.getProfileSourceType();
      this.isSearchTextRequired = false;
      this.IsSourceSelected = true;
      this.IsStatusSelected = false;
    }else if(searchType === 'Name'){
      this.searchItem='';
      this.searchType = searchType;
      this.IsSourceSelected = false;
      this.IsStatusSelected = false;
      this.isSearchTextRequired = true;
    }else if(searchType === 'Mobile No'){
      this.searchItem='';
      this.searchType = searchType;
      this.IsSourceSelected = false;
      this.IsStatusSelected = false;
      this.isSearchTextRequired = true;
    }else if(searchType === 'Email'){
      this.searchItem='';
      this.searchType = searchType;
      this.IsSourceSelected = false;
      this.IsStatusSelected = false;
      this.isSearchTextRequired = true;
    }
  }

  getSourceType($event){
    //console.log($event.target.value);
    this.searchItem = $event.target.value;
  }
  

  getAllProfiles(){
    this.selectedType = '';
    this.Candidates = 'All Candidates';
    this.searchItem='';
    this.profileTableComponent.getProfiles();
  }
  getprofilesBySearch(){
    this.profileTableComponent.tableData = [];
    this.Candidates = `Candidates based on search criteria ${this.searchType} - ${this.searchItem}`;
    $('#loadingEditSubmitModal').modal('show');
    //console.log(this.searchType,this.searchItem);
    this.reqSvc.getprofilesBySearch(this.searchType,this.searchItem.trim()).subscribe(response => {
      if(response.length === 0 || response === null){
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');
      }else{
        this.profileTableComponent.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }
    },err => {
      $('#loadingEditSubmitModal').modal('hide');
      console.log(err);
    })
  }

  getStatuses(){
    this.reqSvc.getStatusesByType('PROFILE').subscribe(response => {
      //console.log(response);
      this.statusData = response;
    }, err => {
      console.log(err);
    })
  }
}
