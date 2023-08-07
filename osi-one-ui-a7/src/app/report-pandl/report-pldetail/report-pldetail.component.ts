import { Component, OnInit, ViewChild } from '@angular/core';
import { PandlService } from '../../shared/services/pandl.service';
import  *  as  Feather  from  'feather-icons';
import { Subscription } from 'rxjs';
import { DetailsPandLdataCards } from '../../shared/constants/details-tab.contants';
import { GridWidgetComponent } from '../../shared/component/grid-widget/grid-widget.component';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-report-pldetail',
  templateUrl: './report-pldetail.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class ReportPldetailComponent implements OnInit {
  @ViewChild('gridWidget') gridWidget: GridWidgetComponent;
  cardsList = DetailsPandLdataCards;
  showFilters: boolean;
  dtOptions: DataTables.Settings = {};
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  spinner: boolean = false;
  subscriptions: Subscription [] = [];
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

  ngAfterViewInit()  {
    Feather.replace();
  }

  getdata() {
    // this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(data => {
    //   // this.gridData = data['P and L'];
    //   // $('#loadingEditSubmitModal').modal('show');
    // }, err => {
    //   console.log(err);
    //   $('#loadingEditSubmitModal').modal('hide');
    // }));
  }


  showfilters() {
    this.showFilters = true;
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden';
  }

  closingFilters(event) {
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated';
    this.showFilters = event;
  }
  getPandLData(event) {
    // console.log(event);
    if (event) {
      this.getdata();
    }
  }



  refresh() {
    this.gridWidget.loadData();
  }



  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
}
