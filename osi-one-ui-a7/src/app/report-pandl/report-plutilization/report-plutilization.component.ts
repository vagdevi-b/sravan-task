import { Component, OnInit, ViewChild } from '@angular/core';
import { PandlService } from '../../shared/services/pandl.service';
import { Subscription } from 'rxjs';
import  *  as  Feather  from  'feather-icons';
import { GridWidgetComponent } from '../../shared/component/grid-widget/grid-widget.component';
import { UtilizationPandLDataCards } from '../../shared/constants/utilization-tab.constants';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-report-plutilization',
  templateUrl: './report-plutilization.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class ReportPlutilizationComponent implements OnInit {
  @ViewChild('gridWidget') gridWidget: GridWidgetComponent;
  cardsList = UtilizationPandLDataCards;
  gridData: any = [];
  empUtilGrid: any = [];
  projUtilGrid: any = [];
  yearMonthUtilGrid: any = [];
  empOrgUtilGrid: any = [];
  empOrgTotalUtil: any = 0;
  empUtilGridTotal = {
    "totalutilization": 0,
    "totalbillinghours": '',
    "totalnonbillinghours": '',
    "totalinternalhours": '',
    "totalholidayhours": '',
    "totalptohours": '',
    "totalspecialleavehours": ''
  };
  projectsUtilGridTotal = {
    "totalbillinghours": '',
    "totalnonbillinghours": '',
    "totalinternalhours": '',
    "totalholidayhours": '',
    "totalptohours": '',
    "totalspecialleavehours": ''
  };
  yearMonthUtilGridTotal = {
    "totalutilization": 0,
    "totalbillinghours": '',
    "totalnonbillinghours": '',
    "totalinternalhours": '',
    "totalholidayhours": '',
    "totalptohours": '',
    "totalspecialleavehours": ''
  };
  dtOptions: DataTables.Settings = {};
  showFilters: boolean;
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  spinner: boolean;
  subscriptions: Subscription[] = [];
  currenYear: any;
  yearsdata: any;
  chartData: any[];
  constructor(private pAndLsvc: PandlService) { }

  ngOnInit() {
    if(localStorage.getItem('yearFilter')===null)
    {  this.getyeardata();}
    this.subscriptions.push(this.pAndLsvc.getRunPandLDataTriggered().subscribe((data: Boolean) => {
      if (data) {
        this.chartData = [];
      }
    }));
    this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(response => {
      this.chartData = [];
      if (response) {
        this.chartData = response['P and L'];
        if(localStorage.getItem('triggerValue')&&localStorage.getItem('triggerValue')!=sessionStorage.getItem('panelDataTriggered'))
        {    
        this.getChartsDataWithDefaultSearch();
         localStorage.setItem('triggerValue','0');
         sessionStorage.setItem('panelDataTriggered', '0')
       }
      } else {
        this.getChartsDataWithDefaultSearch();
      }
    }, err => {
      console.log(err);
    }));
  }
  getyeardata() {
    this.yearsdata = [];
    this.pAndLsvc.getYearsList().subscribe(response => {
      if (response && response['Years']) {
        const yearsList = _.orderBy(response.Years, ['year'], ['desc']);
        this.yearsdata = yearsList;
        let filter=_.orderBy(this.yearsdata,['year'],['asce']);
        if (localStorage.getItem('yearFilter') === null) {
          this.currenYear = [filter.reduce((sum, currObj) =>currObj.year, 0)];
        }
      }
    }, err => {
      console.log(err);
    });
  }
  constructReqbody(){
if(localStorage.getItem('yearFilter')===null)
 {
  let obj = {
    "year" : this.currenYear,
    "projectOrg":[],
    "projectSubPrac":[],
    "projectPractice":[],
    "customer":[],
    "project":[],
    "employee":[],
    "employeeOrg":[],
    "employeeBu":[],
    "employeePractice":[],
    "employeeSubPrac":[],
    sowIds: []
  };
  return obj;}
  else
 {this.currenYear= JSON.parse(localStorage.getItem('yearFilter'));
   let obj =JSON.parse(localStorage.getItem('payload'))
  return obj;
 }
  }
  getChartsDataWithDefaultSearch(){
    setTimeout(() => {
      let body = this.constructReqbody();
    $('#loadingEditSubmitModal').modal('show');
      this.pAndLsvc.getRunPandLData(body).subscribe(data => {
        this.chartData = data['P and L'];
        $('#loadingEditSubmitModal').modal('hide');
      }, err => {
        console.log(err);
        $('#loadingEditSubmitModal').modal('hide');
      });
    }, 200)
    }

  getdata() {
    this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(data => {
    }, err => {
      console.log(err);
      $('#loadingEditSubmitModal').modal('hide');
    }));
  }

  // getdata(){

  //   this.gridData = [];
  //   this.empUtilGrid = [];
  //   this.projUtilGrid = [];
  //   this.empOrgUtilGrid = [];
  //   this.yearMonthUtilGrid = [];
  //   this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(data => {
  //     // console.log(data['P and L'], 'in grids');
  //     this.gridData = data['P and L'];
  //     $('#loadingEditSubmitModal').modal('show');
  //     this.getEmpUtilGridData();
  //     this.getProjUtilGridData();
  //     this.getEmpOrgUtilGridData();
  //     this.getYearMonthUtilGridData();
  //   }, err =>{
  //     console.log(err);
  //     $('#loadingEditSubmitModal').modal('hide');
  //   }));
  // }
  showfilters() {
    this.showFilters = true;
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden';
  }

  closingFilters(event) {
    // console.log(event);
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated';
    this.showFilters = event;
  }
  getPandLData(event) {
    // console.log(event);
    if (event) {
      this.getdata();
    }
  }

  ngAfterViewInit()  {
    Feather.replace();
  }



  refresh(value?: any) {
    this.gridWidget.loadData();
    // $('#loadingEditSubmitModal').modal('show');
    // this.empUtilGrid = [];
    // this.projUtilGrid = [];
    // this.empOrgUtilGrid = [];
    // this.yearMonthUtilGrid = [];
    // // this.getEmpUtilGridData();
    // // this.getProjUtilGridData();
    // // this.getEmpOrgUtilGridData();
    // // this.getYearMonthUtilGridData();
    // $('#loadingEditSubmitModal').modal('hide');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
}
