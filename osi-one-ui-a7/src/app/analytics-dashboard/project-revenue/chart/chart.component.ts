import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Chart } from 'chart.js';

import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges, OnInit, AfterViewInit {

  @ViewChild('myCanvas')
  myCanvas: ElementRef;

  myChart: Chart;

  ctx: CanvasRenderingContext2D;

  @Input()
  chartData;

  @Input()
  plotValues;

  @Input()
  chartType: string;

  constructor(private chartService: ChartService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.myChart = this.chartService.drawChart(this.ctx, this.chartData, this.chartType);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (!this.ctx) {
      return;
    }

    if (this.myChart) {
      this.myChart.destroy();
    }

    this.myChart = this.chartService.drawChart(this.ctx, this.chartData, this.chartType);
  }

}
