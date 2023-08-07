import { Injectable, EventEmitter } from '@angular/core';
import { UtilsService } from './utils.service';
import { TransformDataService } from './transform-data.service';
import { Chart } from 'chart.js';
import { PointModel } from '../models/point.model';

@Injectable()
export class ChartService {

  private readonly bubbleTextFont = 'bold 15px Calibri';
  private readonly bubbleTextColor = '#fff';

  public chartDataChanged = new EventEmitter<string>();

  constructor(
    private transformDataService: TransformDataService
  ) {
  }

  /* draws the chart and returns its reference */
  public drawChart(
    ctx: CanvasRenderingContext2D,
    chartData,
    chartType: string
  ): Chart {

    if (chartType === 'line_chart') {

      // specifying the function that renders bubbled data values
      chartData.options.animation.onComplete = (animation) => {
        return this.displayBubbledValues(animation);
      };

    }
    else if (chartType === 'bubble_chart') {

      chartData.options.animation.onComplete = (animation) => {
        return this.addCustomFeaturesToBubbleChart(animation);
      };

    }
    
    // console.log(chartData);

    return new Chart(ctx, chartData);
  }

  // displays data values at the point with a circle around them
  displayBubbledValues(animation) {

    const ctx = animation.chart.ctx;

    // const datasets: any[] = animation.chart.data.datasets;
    const datasets: any[] = animation.chart.config.data.datasets;

    // font size of data labels
    ctx.font = 'bold 14px Calibri';

    for (const dataset of datasets) {

      const metaIdx = ChartService.getLastKey(dataset._meta);

      // if line is hidden, don't render bubble
      if (!dataset._meta[metaIdx].$filler.visible) {
        continue;
      }

      // selecting indices of first and last points
      // const boundaryPoints = [0, dataset.data.length - 1];
      const boundaryPoints = [
        UtilsService.getFirstValidIdx(dataset.data),
        UtilsService.getLastValidIdx(dataset.data)
      ];

      // if all values in a dataset are undefined
      if (boundaryPoints[0] === null || boundaryPoints[1] === null) {
        console.log(`Error: No valid data found for project: ${dataset.label}`);
      }

      let coordinates;
      let x;
      for (const eachPoint of boundaryPoints) {
        coordinates = dataset._meta[metaIdx].data[eachPoint]._model;

        // value to be painted at the point
        const dataValue = UtilsService.shortenMoney(dataset.data[eachPoint]);

        const textWidth = ctx.measureText(dataValue).width;

        // + 5 to make text inside circle look nice
        const radius = textWidth / 2 + 5;

        // makes text center equal to circle center
        x = coordinates.x - textWidth / 2;

        UtilsService.drawCircle(
          ctx,
          new PointModel(coordinates.x, coordinates.y),
          radius,
          dataset.borderColor
        );

        ctx.fillStyle = '#333';
        ctx.fillText(dataValue, x, coordinates.y);
      }
    }
  }

  addCustomFeaturesToBubbleChart(animation) {
    // console.log("addacustom");
    const chart = animation.chart;

    this.drawRevenueInBubbles(
      chart,
      chart.getDatasetMeta(0),
      chart.config.data.datasets[0].data
    );
  }

  drawRevenueInBubbles(chart: Chart, datasetMeta, datasetData) {
    const ctx: CanvasRenderingContext2D = chart.ctx;

    // color and font of text in bubbles
    ctx.fillStyle = this.bubbleTextColor;
    ctx.font = this.bubbleTextFont;
    // ctx.font = "bold 30px Calibri";

    // horizontal center of text coincides with the coordinates we give to ctx.fillText()
    ctx.textAlign = 'center';

    // vertical center of text coincides with the coordinates we give to ctx.fillText()
    ctx.textBaseline = 'middle';

    let bubbleCenter: PointModel;
    let radius: number;
    let textToWrite: string;
    let textToWriteSize: TextMetrics;

    // for (const [index, eachData] of datasetData.entries()) {
      for (let id = 0; id < datasetData.length; id++) {
        const index = id;
        const eachData = datasetData[id];

      bubbleCenter = new PointModel(
        datasetMeta.data[index]._model.x,
        datasetMeta.data[index]._model.y
      );

      radius = datasetMeta.data[index]._model.radius;

      // the revenue
      textToWrite = UtilsService.shortenMoney(eachData.x);

      textToWriteSize = ctx.measureText(textToWrite);

      // bubbleCenter is the text center
      // console.log(textToWrite);
      // console.log(bubbleCenter);
      ctx.fillText(textToWrite, bubbleCenter.x, bubbleCenter.y);
    }
  }

  renderNewChart(typeOfDataFilter: string, plotType: string) {

    // if (plotType === 'line_chart') {
    //   // so that displayBubbledValues function will render bubbles
    //   this.transformDataService.transformToLineChartData(typeOfDataFilter);
    // }
    // else 
    if (plotType === 'bubble_chart') {
      this.transformDataService.transformToBubbleChartData(typeOfDataFilter);
    }

    this.chartDataChanged.emit(plotType);
  }

  /* based on the chart type filter, returns appropriate data */
  getChartData(chartType: string) {
    // if (chartType === 'line_chart') {
    //   return this.transformDataService.lineChartData;
    // }
    // else 
    if (chartType === 'bubble_chart') {
      return this.transformDataService.bubbleChartData;
    }
    else {
      console.log(`Unknown chart type: ${chartType}`);
    }
  }

  /* returns the last key of obj */
  private static getLastKey(obj: any) {
    const keys = Object.keys(obj);
    return keys[keys.length - 1];
  }

}
