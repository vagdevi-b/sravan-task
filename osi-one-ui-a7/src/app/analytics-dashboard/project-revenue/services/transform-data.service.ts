import { Injectable } from '@angular/core';
// import { LineChartDatasetModel } from '../models/line-chart-dataset.model';
import { TypeOfDataModel } from '../models/type-of-data.model';
import { BubbleChartDatasetModel } from '../models/bubble-chart-dataset.model';
import { UtilsService } from './utils.service';
import { Range } from '../models/Range';
import { Observable } from 'rxjs';


@Injectable()
export class TransformDataService {

  private chartTitle = {
    display: true, // the default
    position: 'top'
    // text: 'Revenue',
    // fontSize: 25
  };

  private chartLayout = {
    padding: {
      left: 0,
      right: 30,
      top: -15,
      bottom: 5
    }
  };

  // min and max radius of bubble in bubble chart
  public bubbleRadiusRange = new Range(18, 50);

  // while drawing a bubble chart, this holds the min and max values
  // of the project revenue
  // Needed for calculating radius of a bubble
  public projectsRevenueRange: Range = undefined;

  /* to increase the bubble radius by 1 pixel,
   * what should be the difference between current value and min value
   * in the dataset */
  private perPixelIncreaseValue: number;

  private projectNames: string[] = [];

  private defaultTypeOfData = 'top_20_valid';

  private requestBody = {
    size: 0,
    aggs: {
      filtered: {
        filter: {
          bool: {
            must: [
              {
                wildcard: {
                  'prj_practice.keyword': '*'
                }
              },
              {
                wildcard: {
                  'prj_region.keyword': '*'
                }
              },
              {
                wildcard: {
                  'prj_bu.keyword': '*'
                }
              },
              {
                term: {
                  year: 2019
                }
              }
            ]
          }
        },
        aggs: {
          by_project: {
            terms: {
              field: 'project.keyword',
              size: 100
            },
            aggs: {
              by_month: {
                terms: {
                  field: 'month',
                  size: 100
                },
                aggs: {
                  total_revenue: {
                    sum: {
                      field: 'project_revenue'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  private requestUrl = 'http://192.168.32.63:9200/osi_rev_rec_index/_search';

  private requestOptions = {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.requestBody)
  };

  private revenueData;

  // lineChartData = {
  //   type: 'line',

  //   data: {

  //     labels: [
  //       'January', 'February', 'March', 'April', 'May', 'June',
  //       'July', 'August', 'September', 'October', 'November', 'December'
  //     ],

  //     datasets: []
  //   },

  //   options: {
  //     hover: {
  //       animationDuration: 0
  //     },
  //     responsive: true,
  //     // maintainAspectRatio: false,

  //     animation: {
  //       duration: 0
  //     },

  //     layout: this.chartLayout,

  //     elements: {
  //       line: {
  //         tension: 0, // to draw straight lines instead of curves
  //         borderWidth: 4, // width of line in the line chart
  //         spanGaps: true, // if there is a break in data, draws the line
  //       },
  //       point: {
  //         hitRadius: 8
  //       }
  //     },

  //     // chart title
  //     title: this.chartTitle,

  //     legend: {
  //       position: 'left',

  //       labels: {
  //         fontSize: 13,
  //         boxWidth: 40,
  //       }
  //     },

  //     scales: {
  //       xAxes: [{
  //         gridLines: {
  //           display: false
  //         },
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'Month \u27F6',
  //           fontSize: 25,
  //           fontFamily: 'Calibri'
  //         }
  //       }],
  //       yAxes: [{
  //         ticks: {
  //           // padding between the y-axis and tick-labels
  //           padding: 30,
  //           callback: (value, index, values) => {
  //             return UtilsService.shortenMoney(value);
  //           }
  //         },
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'Revenue \u27F6',
  //           fontSize: 25,
  //           fontFamily: 'Calibri'
  //         }
  //       }]
  //     },
  //   }
  // };

  bubbleChartData = {
    // The type of chart we want to create
    type: 'bubble',
    data: {
      datasets: []
    },
    plugins: [{
      // afterDraw: (chart, options) => {
      //   // function that will be called every time a change happens in the chart
      //   // for example like a tooltip being shown
      // }
    }],
    options: {
      // aspectRatio: 2,
      hover: {
        animationDuration: 0
      },
      // onHover: (event, activeElements) => {
      //   // this function is called when mouse moves over the chart
      //   // if mouse is on any element drawn by the chart, then activeElements
      //   // array will not be empty
      // },
      animation: {
        duration: 0
      },
      title: this.chartTitle,
      legend: {
        display: false
      },
      layout: this.chartLayout,
      tooltips: {
        callbacks: {
          // displays company name and revenue in the tooltip
          label: (tooltipItem, data) => {
            return 'Revenue: $ ' + UtilsService.shortenMoney(tooltipItem.xLabel);
          },
          title: (tooltipItemArray, data) => {
            const projectNames = data.datasets[tooltipItemArray[0].datasetIndex].projectNames;
            return projectNames[tooltipItemArray[0].index];
          }
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            callback: (value, index, values) => {
              return UtilsService.shortenMoney(value);
            },
            autoSkip: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Revenue \u27F6',
            fontSize: 25,
            fontFamily: 'Calibri'
          }
        }],
        yAxes: [{
          ticks: {
            autoSkip: false,
            gridLines: {
              display: false
            },
            stepSize: 1,
            // padding: 20,
            // reverse: true,
            // returns the project name instead of number
            callback: (value, index, values) => {

              if (Number.isInteger(value)) {
                return this.projectNames[value];
              }
              return undefined;
            },
            autoSkipPadding: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Project Name ',
            fontSize: 25,
            fontFamily: 'Calibri'
          }
          // afterDataLimits: (axis) => {
          // //  this function is called after data limits of chart are set
          // }
        }]
      }
    },
  };

  // colors for lines in the chart
  private customColorsPalette: string[] = [
    'rgb(57, 106, 177)', 'rgb(218, 124, 48)', 'rgb(62, 150, 81)',
    'rgb(204, 37, 41)', 'rgb(83, 81, 84)', 'rgb(107, 76, 154)',
    'rgb(146, 36, 40)', 'rgb(148, 139, 61)',
    '#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#dc3545',
    '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8',
    '#6c757d', '#343a40', '#007bff', '#6c757d', '#28a745',
    '#17a2b8', '#ffc107', '#dc3545', '#f8f9fa', '#343a40',
  ];

  /* used to sort projects by revenue DESCENDING */
  private static sortByRevenue(project1, project2): number {
    const revenue1 = project1.project_revenue;
    const revenue2 = project2.project_revenue;

    if (revenue1 > revenue2) {
      return -1;
    }
    if (revenue1 < revenue2) {
      return 1;
    }

    return 0;
  }

  /* returns the total revenue of a project */
  private static getProjectRevenue(project): number {
    let revenue = 0;

    for (const eachMonthData of project.by_month.buckets) {
      revenue += eachMonthData.total_revenue.value;
    }

    return revenue;
  }

  /* Takes an array of projects and returns an array of the
   * projects' revenues */
  private static getProjectsRevenue(projects: any[]): number[] {

    const projectsRevenue: number[] = [];
    for (const project of projects) {
      projectsRevenue.push(project.project_revenue);
    }

    return projectsRevenue;
  }

  /* sets the projectsRevenueRange variable to
   * current plot's(about to plot) Revenue Range */
  private setProjectsRevenueRange(projects: any[]) {

    this.projectsRevenueRange = UtilsService.getArrayRange(
      TransformDataService.getProjectsRevenue(projects)
    );
  }

  /* sets the bubble radius range for current dataset
   * current dataset range must already be set via projectsRevenueRange */
  private setBubbleRadiusRangeForDataset() {
    if (this.projectsRevenueRange.absoluteDiff > 500000) {
      this.bubbleRadiusRange.max = 38;
    }
    else if (this.projectsRevenueRange.absoluteDiff > 100000) {
      this.bubbleRadiusRange.max = 35;
    }
    else if (this.projectsRevenueRange.absoluteDiff > 50000) {
      this.bubbleRadiusRange.max = 30;
    }
    else if (this.projectsRevenueRange.absoluteDiff > 10000) {
      this.bubbleRadiusRange.max = 25;
    }
    else {
      this.bubbleRadiusRange.max = 21;
    }
  }

  /* sets the perPixelIncreaseValue for current dataset */
  private setPerPixelIncreaseValue() {

    this.perPixelIncreaseValue = Math.round(
      this.projectsRevenueRange.absoluteDiff / this.bubbleRadiusRange.absoluteDiff
    );
  }

  /* returns the radius of the bubble */
  private calculateBubbleRadius(currentValue: number): number {

    // if all values in a dataset are equal
    if (this.projectsRevenueRange.min === this.projectsRevenueRange.max) {
      return this.bubbleRadiusRange.min;
    }

    return Math.round(
      (currentValue - this.projectsRevenueRange.min) / this.perPixelIncreaseValue
      + this.bubbleRadiusRange.min
    );
  }

  
  fetchProjectsData(projectRevData: any): any {

    // uses local file
    // return fetch('assets/revenue-data.json')

    //  fetches file from the osi server
    // return fetch(this.requestUrl, this.requestOptions)
    // return fetch(projectRev, this.requestOptions)
    // .then(response => response.text())
    //   .then(data => {

        this.revenueData = projectRevData ? projectRevData : [];
        console.log(projectRevData);
        this.addProjectRevenueKeyToEachProject();

        // sorting the projects by revenue in place
        this.revenueData.aggregations.filtered.by_project.buckets.sort(TransformDataService.sortByRevenue);
        // this.revenueData.sort(TransformDataService.sortByRevenue);

        // this.transformToLineChartData();  --------------------------------------
        this.transformToBubbleChartData();
      // });
      return this.revenueData;
  }

  /* adds a property called 'project_revenue' to all project objects */
  addProjectRevenueKeyToEachProject() {
    const allProjects = this.revenueData.aggregations ? this.revenueData.aggregations.filtered.by_project.buckets : [];

    for (const eachProject of allProjects) {
      eachProject.project_revenue = TransformDataService.getProjectRevenue(eachProject);
    }
  }

  /* TODO: remove code duplication in transformToLineChartData() and transformToBubbleChartData() */

  /* transforms the data from the server into format required by chart.js */
  // transformToLineChartData(typeOfData: string = this.defaultTypeOfData) {
  //   const fill = false;

  //   let label;
  //   let borderColor;
  //   let moneyData;

  //   const requiredProjects = this.getBuckets(this.transformTypeOfData(typeOfData));

  //   this.lineChartData.data.datasets = [];
  //   // for each project
  //   // for (const [idx, projectBucket] of requiredProjects.entries() {
  //   for (let id = 0; id < requiredProjects.length; id++) {
  //     const idx = id;
  //     const projectBucket = requiredProjects[id];
  //     moneyData = [];
  //     label = projectBucket.key;

  //     // using color from the colors list
  //     borderColor = this.customColorsPalette[idx];

  //     // for each month in the project
  //     // reading the data values
  //     for (const monthBucket of projectBucket.by_month.buckets) {
  //       moneyData[Number(monthBucket.key) - 1] = monthBucket.total_revenue.value;
  //     }

  //     this.lineChartData.data.datasets.push(
  //       new LineChartDatasetModel(label, fill, borderColor, moneyData)
  //     );
  //   }
  // }

  /* using the typeOfData, transforms the data from server to an object
   * that can be passed to new Chart()
   * */
  transformToBubbleChartData(typeOfData: string = this.defaultTypeOfData) {
    const requiredProjects = this.getBuckets(this.transformTypeOfData(typeOfData));

    this.setProjectsRevenueRange(requiredProjects);
    this.setBubbleRadiusRangeForDataset();
    this.setPerPixelIncreaseValue();

    this.bubbleChartData.data.datasets = [];

    this.projectNames = [];
    const borderColorArray = [];
    const bubblesData: object[] = [];

    for (let id = 0; id < requiredProjects.length; id++) {
      const idx = id;
      const projectBucket = requiredProjects[id];
      // for (const [idx, projectBucket] of requiredProjects.entries()) {

      this.projectNames.push(projectBucket.key);
      borderColorArray.push(this.customColorsPalette[idx]);

      bubblesData.push({
        x: projectBucket.project_revenue,
        y: idx,
        r: this.calculateBubbleRadius(projectBucket.project_revenue)
      });
    }

    this.bubbleChartData.data.datasets.push(
      new BubbleChartDatasetModel(
        bubblesData,
        borderColorArray,
        this.projectNames,
        borderColorArray
      )
    );
  }

  /* returns all projects that match any one of typeOfData conditions
  *
  * NOTE: CAN'T MIX PROFITABLE ONLY AND NORMAL PROJECTS AS OF NOW
  * EX: 'top_5,bottom_5_valid' WON'T WORK */
  getBuckets(typeOfDataArray: TypeOfDataModel[]): any[] {

    let allBuckets = this.revenueData.aggregations ? this.revenueData.aggregations.filtered.by_project.buckets : [];

    const lastProfitableProjectIdx = this.getLastProfitableProjectIdx();

    if (typeOfDataArray[0].validOnly) {
      if (lastProfitableProjectIdx === undefined) {
        return [];
      }

      // now contains only profitable projects
      allBuckets = allBuckets.slice(0, lastProfitableProjectIdx);
    }

    const requiredBuckets: any[] = [];

    for (const eachTypeOfData of typeOfDataArray) {
      if (!eachTypeOfData.top) {

        // multiplying with -1 makes the Array.Prototype.slice() returns n elements from last
        requiredBuckets.push(...allBuckets.slice(-eachTypeOfData.count));
      }
      else {
        requiredBuckets.push(...allBuckets.slice(0, eachTypeOfData.count));
      }
    }

    return requiredBuckets;
  }

  /* returns the index of first profitable(revenue > 0) project from the last
   *
   * Important: Requires that the projects array is already sorted by revenue descending*/
  getLastProfitableProjectIdx() {

    const allBuckets = this.revenueData.aggregations ? this.revenueData.aggregations.filtered.by_project.buckets : [];

    for (const [index, bucket] of allBuckets.entries()) {
      if (bucket.project_revenue <= 0) {
        if (index > 0) {
          return index - 1;
        }

        // first project itself was not profitable
        return undefined;
      }
    }

    // if it reaches here, it means all projects are profitable
    return allBuckets.length - 1;
  }

  /* transforms a string to object
   * examples:
   * 1. 'top_5_valid' -> { top: true, count: 5, validOnly: true }
   * 2. 'top_5' -> { top: true, count: 5, validOnly: false }
   * 3. 'bottom_5_valid' -> { top: false, count: 5, validOnly: true }
   *
   * Note: ASSUMES THAT {typeOfData} IS IN A VALID FORMAT AS SPECIFIED ABOVE
   * */
  transformTypeOfData(typeOfData: string): TypeOfDataModel[] {

    // separates multiple TypeOfDataModel values. Ex: 'top_5,bottom_5'
    const outerSeparator = ',';

    // separates properties of one TypeOfDataModel value
    const innerSeparator = '_';

    const typeOfDataArray: TypeOfDataModel[] = [];

    const outerTokens = typeOfData.split(outerSeparator);

    for (const outerToken of outerTokens) {
      const innerTokens = outerToken.split(innerSeparator);

      const top = innerTokens[0] === 'top';
      const count = Number(innerTokens[1]);
      const validOnly = innerTokens[2] !== undefined && innerTokens[2] === 'valid';

      typeOfDataArray.push(new TypeOfDataModel(top, count, validOnly));
    }

    return typeOfDataArray;
  }

  // changeChartData(typeOfData: string) {
  //   this.transformToLineChartData(typeOfData);
  // }

}
