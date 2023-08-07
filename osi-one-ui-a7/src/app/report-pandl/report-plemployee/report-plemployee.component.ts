import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PandlService } from '../../shared/services/pandl.service';
import * as Feather from 'feather-icons';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { bold } from '@angular-devkit/core/src/terminal';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { ReportPlemployeeUtilisationLevelTableComponent } from './report-plemployee-utilisation-level-table/report-plemployee-utilisation-level-table.component';
import { EmployeePandLdataCards} from '../../shared/constants/employeetab-chart.contants';
import { CanvasChartComponent } from '../../shared/component/canvas-chart/canvas-chart.component';
declare var $: any;

@Component({
  selector: 'app-report-plemployee',
  templateUrl: './report-plemployee.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class ReportPlemployeeComponent implements OnInit, OnDestroy {
  @ViewChild('utilisationLevel') utilisationLevel: ReportPlemployeeUtilisationLevelTableComponent;
  @ViewChildren(CanvasChartComponent) canvasChart: QueryList<CanvasChartComponent>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  showFilters: boolean;
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  chartData: any[] = [];
  subscriptions: Subscription [] = [];
  cardsList = EmployeePandLdataCards;
  yearsdata: any[];
  currenYear: any[];
  constructor(private pAndLsvc: PandlService) { }

  ngOnInit() {
    if(localStorage.getItem('yearFilter')===null)
    {  this.getyeardata();}
      // }
      setTimeout(() => {
      this.subscriptions.push(this.pAndLsvc.getRunPandLDataTriggered().subscribe((data: Boolean) => {
        if (data) {
          this.chartData = [];
        }
      }));
      this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(response => {
        this.chartData = [];
        if (response) {
          this.chartData = response['P and L'];
          if(localStorage.getItem('triggerValue') && localStorage.getItem('triggerValue')!=sessionStorage.getItem('panelDataTriggered'))
          {    this.getChartsDataWithDefaultSearch();
            localStorage.setItem('triggerValue','0');
            sessionStorage.setItem('panelDataTriggered', '0')
         }
        } else {
          this.getChartsDataWithDefaultSearch();
        }
      }, err => {
        console.log(err);
      }));
    }, 500)
    
   
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
        $('#loadingEditSubmitModal').modal('hide');
      }, err => {
        console.log(err);
        $('#loadingEditSubmitModal').modal('hide');
      });
    }, 200)
    }



  getdata() {
    this.chartData = [];
    this.subscriptions.push(this.pAndLsvc.getRunPandLDataTriggered().subscribe((data: Boolean) => {
      if (data) {
        this.chartData = [];
      }
    }));
    this.subscriptions.push(this.pAndLsvc.getDataofPandL().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.chartData = [];
      if (data) {
        this.chartData = data['P and L'];
      }
    }, err => {
    }));
  }
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


  ngAfterViewInit() {
    Feather.replace();
  }
  

  downloadData(fromGrid: any) {
    if (fromGrid === 'utilizationByLevels') {
      this.pAndLsvc.exportToCsv(this.utilisationLevel.utilByLevelsGridData, 'employeeRevenueYearlyMonthly');
    } else {
      this.canvasChart.map(gwc => {
        if (gwc.widget.id === fromGrid) {
          switch (fromGrid) {
            case 'yearMonthId':
              this.pAndLsvc.exportToCsv(gwc.constructedData, 'employeeRevenueYearlyMonthly');
              break;
            case 'yearBreakdownChartId':
              this.pAndLsvc.exportToCsv(gwc.constructedData, 'employeeTotalHours');
              break;
            case 'revenuBreakdownByEmployeeId':
              this.pAndLsvc.exportToCsv(gwc.constructedData, 'revenueByEmployee');
              break;
            case 'hoursBreakdownByProjectId':
              this.pAndLsvc.exportToCsv(gwc.constructedData, 'projectTotalHours');
              break;
            case 'employeeUtilChartId':
              this.pAndLsvc.exportToCsv(gwc.constructedData, 'employeesUtil');
              break;
          }
        }
        
      })
    }
  }

  refresh(value?: any) {
    this.getdata();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
}

Chart['elements'].Rectangle.prototype.draw = function () {
  let ctx = this._chart.ctx;
  let view = this._view;
  let left, right, top, bottom, signX, signY, borderSkipped;
  let borderWidth = view.borderWidth;

  let borderRadius = 4;

  if (!view.horizontal) {
    left = view.x - view.width / 2;
    right = view.x + view.width / 2;
    top = view.y;
    bottom = view.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = view.borderSkipped || 'bottom';
  } else {
    left = view.base;
    right = view.x;
    top = view.y - view.height / 2;
    bottom = view.y + view.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = view.borderSkipped || 'left';
  }

  ctx.beginPath();
  ctx.fillStyle = view.backgroundColor;
  ctx.strokeStyle = view.borderColor;
  ctx.lineWidth = view.borderWidth;

  let barCorners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom]
  ];

  ctx.moveTo(barCorners[0][0], barCorners[0][1]);

  for (let i = 1; i < 4; i++) {
    let x = barCorners[1][0];
    let y = barCorners[1][1];
    let width = barCorners[2][0] - barCorners[1][0];
    let height = barCorners[0][1] - barCorners[1][1];


    if (borderRadius > width / 2) {
      borderRadius = width / 2;
    }
    if (borderRadius > height / 2) {
      borderRadius = height / 2;
    }



    ctx.moveTo(x + borderRadius, y);
    ctx.lineTo(x + width - borderRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    ctx.lineTo(x + width, y + height - borderRadius);
    ctx.lineTo(x + width, y + height, x + width - borderRadius, y + height);
    ctx.lineTo(x + borderRadius, y + height);
    ctx.lineTo(x, y + height, x, y + height - borderRadius);
    ctx.lineTo(x, y + borderRadius);
    ctx.quadraticCurveTo(x, y, x + borderRadius, y);

  }

  ctx.fill();

};