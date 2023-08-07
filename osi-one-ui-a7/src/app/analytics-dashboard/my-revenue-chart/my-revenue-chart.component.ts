import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-my-revenue-chart',
  templateUrl: './my-revenue-chart.component.html',
  styleUrls: ['./my-revenue-chart.component.css']
})
export class MyRevenueChartComponent implements OnInit {
  year: any;
  empSubPract: any;
  empXferOrg: any;
  empOrg: any;
  empPract: any;

  constructor() { }

  ngOnInit() {
    this.createCanvas();
  }
  createCanvas() {
    var canvas = <HTMLCanvasElement>document.getElementById("barChart");
    var ctx = canvas.getContext('2d');
    var data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "2018",
        lineTension: 0.1,
        fill: false,
        borderColor: "blue",
        borderCapStyle: 'butt',
        borderDash: [],
        borderJoinStyle: 'miter',
        pointBorderColor: "white",
        pointBackgroundColor: "black",
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "yellow",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: [10000, 30000, 20000, 41230, 10234, 43345, 21456, 44454, 56162, 27541, 13342, 76456],
        spanGaps: false,
      }, {
        label: "2019",
        lineTension: 0.1,
        borderColor: "yellow",
        fill: false,
        borderCapStyle: 'butt',
        borderDash: [],
        borderJoinStyle: 'miter',
        pointBorderColor: "white",
        pointBackgroundColor: "black",
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "blue",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: [22445, 43450, 22310, 42220, 32240, 24222 ,24553,56334,78345,12333,74458,23533],
        spanGaps: false,
      }]
    };
  
      var options = {
        tooltips: {
         enabled: true, 
         mode: 'label'
       },          
        legend: {
          display: true,
        },
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true,
                  min: 1,
                  callback: function (value) {
                    var ranges = [
                      { divider: 1e6, suffix: 'M' },
                      { divider: 1e3, suffix: 'k' }
                    ];
                    function formatNumber(n) {
                      for (var i = 0; i < ranges.length; i++) {
                        if (n >= ranges[i].divider) {
                          return (n / ranges[i].divider).toString() + ranges[i].suffix;
                        }
                      }
                      return n;
                    }
                    return '$' + formatNumber(value);
                  }
              },
              scaleLabel: {
                   display: true,
                   labelString: 'Revenue',
                   fontSize: 20 
                }
          }]            
      }    
      };
    // Chart declaration:
    var myBarChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  }

  changeYear() {

  }
}