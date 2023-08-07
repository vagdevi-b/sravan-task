import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { PandlService } from '../shared/services/pandl.service';
import * as Chart from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { any } from 'underscore';
import * as Feather from 'feather-icons';
import * as _ from 'lodash';

import { BehaviorSubject, Subscription } from "rxjs";
import {
  Router, NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import { SummaryPandLDataCards } from '../shared/constants/summary-tab.constants';

declare var $: any;
@Component({
  selector: 'app-report-pandl',
  templateUrl: './report-pandl.component.html',
  styleUrls: ['../../../src/assets/css/light.css']
})
export class ReportPandlComponent implements OnInit {
  cardsList = SummaryPandLDataCards;
  //@ViewChild('barCanvas') private barCanvas: ElementRef;
  //@ViewChild('barProjectOrg') private barProjectOrg: ElementRef;
  //@ViewChild('barEmpOrg') private barEmpOrg: ElementRef;
  barChart: any;
  barCanvas: Chart;
  barProjectOrg: Chart;
  barEmpOrg: Chart;
  barEmpRevenue:Chart;
  panelData: any = [];
  chartData: any = [];
  yearMonthLabels: any = [];
  yearMonthCostData: any = [];
  yearMonthRevenueData: any = [];
  empOrgLabels: any = [];
  empOrgCostData: any = [];
  empOrgRevenueData: any = [];
  projOrgLabels: any = [];
  projOrgCostData: any = [];
  projOrgRevenueData: any = [];
  empPracticeData:any=[];
  marginData:any=[];
  currenYear:any;
  totalrevenue: any = 0;
  totalcost: any = 0;
  margin: any = 0;
  totalbillinghours: any = 0;
  totalnonbillinghours: any = 0;
  totalinternalhours: any = 0;
  totalholidayhours: any = 0;
  totalptohours: any = 0;
  totalspecialleavehours: any = 0;
  utilization: any = 0;
  barEmpRevenueWidget: any = {};
  spinner: boolean = false;
  showLoading: boolean = false;
  example14settings: any = {
    scrollableHeight: '300px',
    scrollable: true
  };
  subscriptions: Subscription [] = [];

  showFilters: boolean = false;
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  @ViewChild('sourceCanvas') sourceCanvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('targetCanvas') targetCanvasRef: ElementRef<HTMLCanvasElement>;
  private isMaximizedSubject = new BehaviorSubject(false);
  isMaximized$ = this.isMaximizedSubject.pipe();
  mainEle = document.getElementsByClassName('content content-master');
  cardEle = document.getElementsByClassName('card');
  yearsdata: any[];
  constructor(private pandlsvc: PandlService, private router: Router,private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {
    if(localStorage.getItem('yearFilter')===null)
  {  this.getyeardata();
  localStorage.setItem('projectFilterData','')
  localStorage.setItem('projectFilter','')
  }
  
    setTimeout(() => {
    this.subscriptions.push(this.pandlsvc.getRunPandLDataTriggered().subscribe((data: Boolean) => {
      if (data) {
        this.chartData = [];
      }
    }));
    this.subscriptions.push(this.pandlsvc.getDataofPandL().subscribe(response => {
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
        localStorage.setItem('triggerValue','0');
        sessionStorage.setItem('valueTrigger','0');
        sessionStorage.setItem('valueTriggerProjects', '0')
        sessionStorage.setItem('panelDataTriggered', '0')
      }
    }, err => {
      console.log(err);
    }));
  }, 500)
  }
  ngAfterViewInit() {
    Feather.replace();
  }
  getyeardata() {
    this.yearsdata = [];
    this.pandlsvc.getYearsList().subscribe(response => {
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
    "sowIds":[],
    "yearMonth":[]
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
      this.pandlsvc.getRunPandLData(body).subscribe(data => {
        this.chartData = data['P and L'];
        $('#loadingEditSubmitModal').modal('hide');
      }, err => {
       
        console.log(err);
        $('#loadingEditSubmitModal').modal('hide');
      });
    }, 200)
    }

  showfilters() {
    this.showFilters = true;
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden';
    // document.getElementById("mySidebar").style.width = "185px";
    // document.getElementById("mySidebar").style.display = "block";
    // document.getElementById("main").style.marginLeft = "185px";
    // document.getElementById("main").style.marginTop= "-750px";
  }

  closingFilters(event) {
    // console.log(event);
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated';
    // document.getElementById("mySidebar").style.width = "0";
    // document.getElementById("main").style.marginLeft= "0";
    // document.getElementById("main").style.marginTop= "0";
    this.showFilters = event;
  }





  filterdata(item: any) {
    this.chartData = [];
    // console.log(item.target.value, 'infilter');
    this.chartData = this.panelData.filter(data => data.project === item.target.value);
  }


  refresh(value?:any) {
  }


  downloadData(fromChart) {
    switch (fromChart) {
      case 'yearMonthChart':
        let yearMonthData = [];
        for (let i = 0; i < this.yearMonthCostData.length; i++) {
          let obj = {
            "yearMonth": this.yearMonthLabels[i],
            "Cost": this.yearMonthCostData[i],
            "Revenue": this.yearMonthRevenueData[i]

          }
          yearMonthData.push(obj);
        }
        this.pandlsvc.exportToCsv(yearMonthData, 'yearmonthChartData');
        break;
      case 'empOrgChart':
        let empOrgData = [];
        for (let i = 0; i < this.empOrgCostData.length; i++) {
          let obj = {
            "Employee Organization": this.empOrgLabels[i],
            "Cost": this.empOrgCostData[i],
            "Revenue": this.empOrgRevenueData[i]

          }
          empOrgData.push(obj);
        }
        this.pandlsvc.exportToCsv(empOrgData, 'empOrgChartData');
        break;
      case 'projOrgChart':
        let projOrgData = [];
        for (let i = 0; i < this.projOrgCostData.length; i++) {
          let obj = {
            "Project Organization": this.projOrgLabels[i],
            "Cost": this.projOrgCostData[i],
            "Revenue": this.projOrgRevenueData[i]

          }
          projOrgData.push(obj);
        }
        this.pandlsvc.exportToCsv(projOrgData, 'projOrgChartData');
        break;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
  
}
// Chart['elements'].Rectangle.prototype.draw = function () {

//   let ctx = this._chart.ctx;
//   let view = this._view;

//   //////////////////// edit this to change how rounded the edges are /////////////////////
//   let borderRadius = 10;


//   let left = view.x - view.width / 2;
//   let right = view.x + view.width / 2;
//   let top = view.y;
//   let bottom = view.base;

//   ctx.beginPath();
//   ctx.fillStyle = view.backgroundColor;
//   ctx.strokeStyle = view.borderColor;
//   ctx.lineWidth = view.borderWidth;

//   let barCorners = [
//     [left, bottom],
//     [left, top],
//     [right, top],
//     [right, bottom]
//   ];

//   //start in bottom-left
//   ctx.moveTo(barCorners[0][0], barCorners[0][1]);

//   for (let i = 1; i < 4; i++) {
//     let x = barCorners[1][0];
//     let y = barCorners[1][1];
//     let width = barCorners[2][0] - barCorners[1][0];
//     let height = barCorners[0][1] - barCorners[1][1];


//     //Fix radius being too big for small values
//     if (borderRadius > width / 2) {
//       borderRadius = width / 2;
//     }
//     if (borderRadius > height / 2) {
//       borderRadius = height / 2;
//     }



//     // DRAW THE LINES THAT WILL BE FILLED - REPLACING lineTo with quadraticCurveTo CAUSES MORE EDGES TO BECOME ROUNDED
//     ctx.moveTo(x + borderRadius, y);
//     ctx.lineTo(x + width - borderRadius, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
//     ctx.lineTo(x + width, y + height - borderRadius);
//     ctx.lineTo(x + width, y + height, x + width - borderRadius, y + height);
//     ctx.lineTo(x + borderRadius, y + height);
//     ctx.lineTo(x, y + height, x, y + height - borderRadius);
//     ctx.lineTo(x, y + borderRadius);
//     ctx.quadraticCurveTo(x, y, x + borderRadius, y);

//   }

//   //ctx.parentElement.style.width = width +'px';
//   //FILL THE LINES
//   ctx.fill();
// };