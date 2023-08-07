import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { PandlService } from '../../services/pandl.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PandlEmployeeTabService } from '../../services/pandl-employee-tab.service';


@Component({
  selector: 'app-canvas-chart',
  templateUrl: './canvas-chart.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class CanvasChartComponent implements OnInit, OnDestroy {
  empUtilCanvas: Chart;
   widget: any;
  rawData: any;
  isReady: boolean = false;
  constructedData: any[] = [];

  chartLabels: any[] = [];
  data: any = [];

  @Input('rawData')
  set setRawData(value: any[]) {
    this.rawData = value;
    setTimeout(()=>{                   
      // this.prepareChartDetails();
    }, 500);
  } 

  @Input('widget')
  set setWidgetData(value: any[]) {
    this.widget = value;
    setTimeout(()=>{   
      this.createWidget();
    }, 500);
  } 

  constructor(
    private pandlService: PandlService,
    private pandlEmployeeTabService: PandlEmployeeTabService
  ) { }
 

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
  }

  prepareChartDetails(): void {
  
    if (this.widget && this.rawData.length) {
      if (this.empUtilCanvas) {
        this.empUtilCanvas.destroy();
      }
      if (this.widget.id === 'employeeUtilChartId') {
        this.widget = this.pandlEmployeeTabService.constructEmployeeUtilDataSet(this.data, this.widget);
      } else if (this.widget.id === 'hoursBreakdownByProjectId') {
        this.widget = this.pandlEmployeeTabService.constructHoursBreakdownByproject(this.data, this.widget);
      } else if (this.widget.id === 'revenuBreakdownByEmployeeId') {
        this.widget = this.pandlEmployeeTabService.constructRevenuBreakdownByEmployee(this.data, this.widget);
      } else if (this.widget.id === 'yearMonthId') {
        this.widget = this.pandlEmployeeTabService.constructYearMonth(this.data, this.widget);
      } else if (this.widget.id === 'hoursBreakdownChartId') {
        this.widget = this.pandlEmployeeTabService.constructHoursBreakdown(this.data, this.widget);
      }

    }
    
  }

  createWidget(): void {
    if (this.widget.caluclateHeight) {
      this.pandlService.calcHeight(this.widget.details.data.labels.length, this.widget.id);
    }
    this.widget.details.plugins = [ChartDataLabels];
    // this.widget.details.data.labels = this.chartLabels;
    this.empUtilCanvas = new Chart('canvas'+this.widget.id,this.widget.details);
  }

  ngOnDestroy(): void {
    if (this.empUtilCanvas) {
      this.empUtilCanvas.destroy();
    }
  }

}