import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppraisalService } from '../../shared/services/appraisal-cycle/appraisal.service';
declare var $: any;
@Component({
  selector: 'app-appraisal-list',
  templateUrl: './appraisal-list.component.html',
  styleUrls: ['./appraisal-list.component.css']
})
export class AppraisalListComponent implements OnInit {
  rowDatas: any;
  loggedInUser: any;
  sortKey: any;
  isSelectedRow: any = null;
  headerName: string = "Review Cycle";
  getReportingEmployeeDetail: any;
  empType: string;
  empTypeId: number;
  total: number = 0;
  crntpage: number;
  leaveId: any;
  selected: boolean;
  leaveBalance: any;
  public rowData;
  editRepoteeLeave: boolean = true
  isManager: boolean;
  public user: any = {};
  isNotManager: boolean = true;
  responseData: any;
  isAnyRowSelected:boolean = false;
  isUpdatable = false
  flag = false;


  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  successMessage: any;
  errorMessage: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private appraisalService:AppraisalService
    ) {
    this.rowData = this.getApprisalDetails();

  }
  ngOnInit() {
    this.loggedInUser = localStorage.getItem('userId');    
    $('#loadingEditSubmitModal').modal('show');
  }


  sorting(key) {
    this.sortKey=key;
    this.flag=!this.flag;
    if (this.rowData) {
      if(this.flag){
        this.rowData.sort((a, b) => {
          if (a[key] > b[key]) return 1;
          if (a[key] < b[key]) return -1;
          return 0;
        });
      }else{
        this.rowData.sort((a, b) => {
          if (a[key] > b[key]) return 1;
          if (a[key] < b[key]) return -1;
          return 0;
        }).reverse();
      }
      

    }
  }


  getApprisalDetails(): any {
    this.appraisalService.getReviewCycleList().subscribe(
      (response)=>{
        this.rowData= response;
        $('#loadingEditSubmitModal').modal('hide');
      },
      ()=>{
        $('#loadingEditSubmitModal').modal('hide');
      }
    );
    
  }


  selectedRow() {
    this.isSelectedRow = null;
  }

  isRowClicked(data) {
    this.isSelectedRow = data;
    this.isAnyRowSelected=true;
  }

  onRowSelected(info) {
    this.isAnyRowSelected=true;
    this.router.navigate(['reviewcycle/initiate/' + info['epmsHdrId']]);
  }

  edit() {
    this.isUpdatable = true;
      this.router.navigate(['reviewcycle/initiate/' + this.isSelectedRow['epmsHdrId']]);
  }

  view() {
    if (this.isSelectedRow) {
      this.isUpdatable = false;
      this.router.navigate(['reviewcycle/view/' + this.isSelectedRow['epmsHdrId']]);
    }
  }
  initiateReviewCycle():void{
    this.headerName = 'Review Cycle';
    this.router.navigate(['/reviewcycle/initiate']);
  }
}
