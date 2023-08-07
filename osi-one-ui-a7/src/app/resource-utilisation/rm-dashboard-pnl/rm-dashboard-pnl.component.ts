import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Router } from "@angular/router";
import { ElasticsearchService } from '../../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { Chart } from 'chart.js';
import { GridOptions } from "ag-grid-community";
import * as moment from 'moment'
import { ExportFileService } from '../../shared/services/export-file.service';
import { GridService } from '../../dashboard-grid/grid.service';
declare var $: any;

@Component({
  selector: 'app-rm-dashboard-pnl',
  templateUrl: './rm-dashboard-pnl.component.html',
  styleUrls: ['./rm-dashboard-pnl.component.css']
})

export class RmDashboardPnlComponent implements OnInit {
  @Output() isPageLoaded = new EventEmitter<boolean>();
  public searchString: string;
  public secondSearchString: string;
  title;
  titlePnL;
  selected;
  titlePnLSec;
  selectedRecord;
  selectedRecordSec;
  p: Number = 1;
  count: Number = 10;
  page: Number = 1;
  cnt: Number = 10;
  chartPiePnL = Chart;
  piePnLLabels = [];
  piePnLData = [];
  chartBarPnLPracticeswise = Chart;
  pnLPractices = [];
  costPnLPracticeswise = [];
  revenuePnLPracticeswise = [];
  chartBarPnLSubPracticeswise = Chart;
  pnLSubPractices = [];
  costPnLSubPracticeswise = [];
  revenuePnLSubPracticeswise = [];
  chartLineEmpPnL = Chart;
  employeePnLLineLabels = [];
  employeePnLLineCost = [];
  employeePnLLineRevenue = [];
  chartLineSecPnL = Chart;
  secondPnLLineLabels = [];
  // secondPnLLineCost = [];
  secondPnLLineReveue = [];
  empOrgData = [];
  empProjectData = [];
  empBUData = [];
  empPracticeData = [];
  empSubPracticeData = [];
  empYearData = [];
  empMonthData = [];
  empNameData = [];
  empOrg = "*";
  empProject = "*";
  empBU = "*";
  empPractice = "*";
  empSubPractice = "*";
  firstTableBU = "*";
  firstTablePractice = "*";
  firstTableSubPractice = "*";
  secondTableBU = "*";
  secondTablePractice = "*";
  secondTableSubPractice = "*";
  empMonth = ".*";
  empYear = moment().year();
  field: string = "Project";
  projectFieldValue = [];
  empFieldValue = [];
  projectsJSON = {
    data: []
  };
  empJSON = {
    data: []
  };
  monthsInWord = {
    data: []
  };

  paginationPageSize: Number = 5;

  gridApiProjects;
  gridColumnApiProjects;
  gridOptionsProjects = <GridOptions>{};
  columnDefsProjects = [];
  defaultColDef = { resizable: true };

  gridApiEmployee;
  gridColumnApiEmployee;
  gridOptionsEmployee = <GridOptions>{};
  columnDefsEmployee = [];
  showLoader: boolean = false;

  constructor(
    private es: ElasticsearchService,
    private resource: ResourceUtilizationService,
    private router: Router,
    private gridService: GridService,
    private downloadFile: ExportFileService
  ) {
    this.setPreservedFilter();
  }

  ngOnInit() {
    this.defaultView();
    this.isPageLoaded.emit(false);
    this.columnDefsEmployee = this.createColumnDefsEmployee();
    this.columnDefsProjects = this.createColumnDefsProjects();
  } // ----------------->> onInit END

  setPreservedFilter() {
    let widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      let filter = res ? JSON.parse(res.filters) : null;
      this.empOrg = filter && Object.keys(filter).length > 0 ? filter.org : this.empOrg;
      this.empProject = filter && Object.keys(filter).length > 0 ? filter.project : this.empProject;
      this.empBU = filter && Object.keys(filter).length > 0 ? filter.bu : this.empBU;
      this.empPractice = filter && Object.keys(filter).length > 0 ? filter.practice : this.empPractice;
      this.empSubPractice = filter && Object.keys(filter).length > 0 ? filter.subPractice : this.empSubPractice;
      this.firstTableBU = filter && Object.keys(filter).length > 0 ? filter.firstTableBU : this.firstTableBU;
      this.firstTablePractice = filter && Object.keys(filter).length > 0 ? filter.firstTablePractice : this.firstTablePractice;
      this.firstTableSubPractice = filter && Object.keys(filter).length > 0 ? filter.firstTableSubPractice : this.firstTableSubPractice;
      this.secondTableBU = filter && Object.keys(filter).length > 0 ? filter.secondTableBU : this.secondTableBU;
      this.secondTablePractice = filter && Object.keys(filter).length > 0 ? filter.secondTablePractice : this.secondTablePractice;
      this.secondTableSubPractice = filter && Object.keys(filter).length > 0 ? filter.secondTableSubPractice : this.secondTableSubPractice;
      this.empMonth = filter && Object.keys(filter).length > 0 ? filter.empMonth : this.empMonth;
      this.empYear = filter && Object.keys(filter).length > 0 ? filter.empYear : this.empYear;
      this.isPageLoaded.emit(true);
    });
  }

  defaultView() {

    // ----------------------------------------- DROPDOWNS -----------------------------------------------------
    this.showLoader = true;
    this.resource.getResourcesList().subscribe(response => {

      this.empNameData = response.employee;
      this.empOrgData = response.org;
      this.empBUData = response.bu;
      this.empPracticeData = response.practice;
      this.empProjectData = response.project;
      this.empSubPracticeData = response.subpractice;

      this.empOrgData = this.empOrgData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empBUData = this.empBUData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empPracticeData = this.empPracticeData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empProjectData = this.empProjectData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.empSubPracticeData = this.empSubPracticeData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });

      this.es.getFromService(0).subscribe(response => {

        this.empYearData = response.aggregations.by_year.buckets;
        this.empYearData = this.empYearData.sort((a, b) => a.key - b.key);

        this.empMonthData = response.aggregations.by_month.buckets;
        this.empMonthData = this.empMonthData.sort((a, b) => a.key - b.key);
        this.inWords(this.empMonthData);


      }, error => {
        console.log('error');
      });


      // ------------------------------------- PnL PIE CHART(DEFAULT VIEW) ---------------------------------------------------

      this.projectFieldValue = this.empProjectData;
      this.empFieldValue = this.empNameData;
      this.es.filterPnLPie(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
        this.empYear + this.empMonth, this.empFieldValue);
      this.es.getFromService(9).subscribe(response => {
        let totalCost = 0;
        let totalRevenue = 0;
        response.aggregations.filtered.by_selection.buckets.forEach(x => {
          x.by_monthAvgCost.buckets.forEach(cost => {
            totalCost = totalCost + cost.total.value;
          });
          totalRevenue = totalRevenue + x.total_revenue.value;
        });
        this.piePnLData = [];
        this.piePnLLabels = [];
        this.piePnLData.push(totalCost.toFixed());
        this.piePnLLabels.push("Cost");

        this.piePnLData.push(totalRevenue.toFixed());
        this.piePnLLabels.push("Revenue");
      });

      // ------------------------------------- PnL PRACTICEWISE BAR CHART(DEFAULT VIEW) ----------------------------------------

      this.es.filterPracticeswisePnL(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
        this.empYear + this.empMonth, this.empFieldValue);
      this.es.getFromService(10).subscribe(response => {

        let practiceCostJSON = {
          data: []
        };
        let practiceRevenueJSON = {
          data: []
        };

        response.aggregations.filtered.by_practicewiseCost.buckets.forEach(x => {
          let totalCost = 0;
          x.by_selection.buckets.forEach(rec => {
            rec.total.buckets.forEach(cost => {
              totalCost = totalCost + cost.total.value;
            });

          });
          practiceCostJSON.data.push({
            "key": x.key,
            "value": totalCost
          });
        });

        response.aggregations.filtered.by_practicewiseCost.buckets.forEach(x => {
          x.by_practicewiseRevenue.buckets.forEach(rev => {
            practiceRevenueJSON.data.push({
              "key": rev.key,
              "value": rev.total.value
            });
          });
        });


        this.costPnLPracticeswise = [];
        this.revenuePnLPracticeswise = [];
        let cost = practiceCostJSON.data;
        this.pnLPracticeswiseLabel(cost, this.costPnLPracticeswise, this.empYear, this.empOrgData, this.empPracticeData,
          this.empBUData, this.empSubPracticeData, this.empYear + this.empMonth, this.empFieldValue, 0);

        let revenue = practiceRevenueJSON.data;
        this.pnLPracticeswiseLabel(revenue, this.revenuePnLPracticeswise, this.empYear, this.empOrgData, this.empPracticeData,
          this.empBUData, this.empSubPracticeData, this.empYear + this.empMonth, this.empFieldValue, 1);

        // ------------------------------------- PnL SUB-PRACTICESWISE BAR CHART -----------------------------------------------
        this.es.filterSubPracticeswisePnL(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
          this.empYear + this.empMonth, this.empFieldValue);
        this.es.getFromService(12).subscribe(response => {
          let practiceCostJSON = {
            data: []
          };
          let practiceRevenueJSON = {
            data: []
          };

          response.aggregations.filtered.by_subPracticewiseCost.buckets.forEach(x => {
            let totalCost = 0;
            x.by_selection.buckets.forEach(rec => {
              rec.total.buckets.forEach(cost => {
                totalCost = totalCost + cost.total.value;
              });

            });
            practiceCostJSON.data.push({
              "key": x.key,
              "value": totalCost
            });
          });

          response.aggregations.filtered.by_subPracticewiseCost.buckets.forEach(x => {
            x.by_subPracticewiseRevenue.buckets.forEach(rev => {
              practiceRevenueJSON.data.push({
                "key": rev.key,
                "value": rev.total.value
              });
            });
          });

          this.costPnLSubPracticeswise = [];
          this.revenuePnLSubPracticeswise = [];
          let cost = practiceCostJSON.data;
          this.pnLSubPracticeswiseLabel(cost, this.costPnLSubPracticeswise, this.empYear, this.empOrgData, this.empPracticeData,
            this.empBUData, this.empSubPracticeData, this.empYear + this.empMonth, this.empFieldValue, 0);

          let revenue = practiceRevenueJSON.data;
          this.pnLSubPracticeswiseLabel(revenue, this.revenuePnLSubPracticeswise, this.empYear, this.empOrgData, this.empPracticeData,
            this.empBUData, this.empSubPracticeData, this.empYear + this.empMonth, this.empFieldValue, 1);

          // ------------------------------------- PnL PROJECT TABLE DATA(DEFAULT) -------------------------------------------------
          this.es.filterPnLProjectTableData(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.empYear + this.empMonth, this.empFieldValue);
          this.es.getFromService(14).subscribe(response => {
            this.projectsJSON = {
              data: []
            };
            console.log(response);
            response.aggregations.filtered.by_selection.buckets.forEach(y => {
              y.by_department.buckets.forEach(x => {
                let totalSum = 0;
                x.by_monthAvgCost.buckets.forEach(cost => {
                  totalSum = totalSum + cost.total.value;
                });
                if (x.length != 0) {
                  let temp = x.key.split('.');
                  let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
                  this.projectsJSON.data.push({
                    "name": y.key,
                    // "bu": x.by_employeeBU.buckets[0].key,
                    // "practice": x.by_practices.buckets[0].key,
                    // "subPractice": x.by_sub_practices.buckets[0].key,
                    "department": dept,
                    "dept_original": x.key,
                    "region": x.region.buckets[0].key,
                    "hours": x.total_hours.value != 0 ? x.total_hours.value : "0",
                    "cost": totalSum != 0 ? totalSum.toFixed() : "0",
                    "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
                  });
                }
              })
            });
            this.projectsJSON.data = this.projectsJSON.data.sort(function sortAll(a, b) {
              return a.name > b.name ? 1
                : a.name < b.name ? -1
                  : 0;
            });

            // ------------------------------------------- PnL FIRST EMPLOYEE/PROJECT MONTHLY TREND(DEFAULT) -------------------------------
            this.selectedRecord = this.titlePnL = this.projectsJSON.data[0] ? this.projectsJSON.data[0].name : '';
            // this.titlePnL = this.projectsJSON.data[0].name;
            let department = this.projectsJSON.data[0] ? this.projectsJSON.data[0].dept_original : '';
            this.es.filterPnLMonthlyTrend(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
              this.empFieldValue, this.titlePnL, department);
            this.es.getFromService(15).subscribe(response => {

              console.log("COST", response.aggregations.filtered);
              let cost = response.aggregations.filtered.by_monthCost.buckets;
              this.employeePnLLineCost = [];
              this.employeePnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
                this.projectFieldValue, cost, this.employeePnLLineCost, 0);

              let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
              this.employeePnLLineRevenue = [];
              this.employeePnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
                this.projectFieldValue, revenue, this.employeePnLLineRevenue, 1);

              // ------------------------------------------- PnL 2nd TABLE(DEFAULT) -------------------------------------------
              this.selectedRecord = this.projectsJSON.data[0].name;
              this.titlePnL = this.projectsJSON.data[0].name;
              this.selected = this.projectsJSON.data[0].name;
              let department = this.projectsJSON.data[0] ? this.projectsJSON.data[0].dept_original : '';
              this.es.filterPnLSecondTableData(this.empYear, this.empYear + this.empMonth, this.empFieldValue, this.titlePnL, department);
              this.es.getFromService(16).subscribe(response => {
                this.empJSON = {
                  data: []
                };
                response.aggregations.filtered.by_selection.buckets.forEach(x => {
                  if (x.by_employeeBU.buckets.length != 0 && x.total_revenue.value > 0) {
                    let temp = x.by_department.buckets[0].key.split('.');
                    let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
                    this.empJSON.data.push({
                      "name": x.key,
                      "bu": x.by_employeeBU.buckets[0].key,
                      "practice": x.by_practices.buckets[0].key,
                      "subPractice": x.by_sub_practices.buckets[0].key,
                      "department": dept,
                      "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed() : "0",
                      "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
                    });
                  }
                });
                this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
                  return a.name > b.name ? 1
                    : a.name < b.name ? -1
                      : 0;
                });

                // ------------------------------------------- PnL SECOND EMPLOYEE/PROJECT MONTHLY TREND(DEFAULT) --------------------------
                this.selectedRecordSec = this.titlePnLSec = this.empJSON.data[0] ? this.empJSON.data[0].name : '';
                // this.titlePnLSec = this.empJSON.data[0].name;
                // let prj = [];
                // let emp = [];
                // emp.push(this.empJSON.data[0].name);
                this.es.filterPnLMonthlySecondTrend(this.empYear, this.titlePnLSec, this.titlePnL);
                this.es.getFromService(17).subscribe(response => {

                  // let cost = response.aggregations.filtered.by_monthCost.buckets;
                  // this.secondPnLLineCost = [];
                  // this.secondPnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
                  // this.projectFieldValue, cost, this.secondPnLLineCost, 0);

                  let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
                  this.secondPnLLineReveue = [];
                  this.secondPnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
                    this.projectFieldValue, revenue, this.secondPnLLineReveue, 0);

                  this.setFilters();
                  this.renderChart();
                  this.showLoader = false;

                  this.isPageLoaded.emit(true);
                }, error => {
                  this.showLoader = false;
                  this.isPageLoaded.emit(true);
                });

              }, error => {
                this.showLoader = false;
                this.isPageLoaded.emit(true);
              });

            }, error => {
              this.showLoader = false;
              this.isPageLoaded.emit(true);
            });

          }, error => {
            this.showLoader = false;
            this.isPageLoaded.emit(true);
          });

        }, error => {
          this.showLoader = false;
          this.isPageLoaded.emit(true);
        });

      }, error => {
        this.isPageLoaded.emit(true);
      });

    }, error => {
      this.showLoader = false;
      this.isPageLoaded.emit(true);
    });


  }



  pnLPracticeswiseLabel(data, value, year, org, practice, bu, subPractice, month, emp, dataset) {
    this.es.filterPracticeswisePnLLabel(year, org, practice, bu, subPractice, month, emp);
    this.es.getFromService(11).subscribe(response => {
      this.pnLPractices = [];
      response.aggregations.filtered.by_practicewise.buckets.forEach(x => {
        this.pnLPractices.push(x.key);
      });
      response.aggregations.filtered.by_practicewise.buckets.forEach(x => {
        let b = data.find(xx => xx.key == x.key);
        value.push(b ? b.value : '');
      });

      if (this.chartBarPnLPracticeswise.data) {
        this.chartBarPnLPracticeswise.data.labels = this.pnLPractices;
        this.chartBarPnLPracticeswise.data.datasets[dataset].data = value;
        this.chartBarPnLPracticeswise.chart.update();
      }

    }, error => {
      console.log('error');
    });
  }

  pnLSubPracticeswiseLabel(data, value, year, org, practice, bu, subPractice, month, emp, dataset) {
    this.es.filterSubPracticeswisePnLLabel(year, org, practice, bu, subPractice, month, emp);
    this.es.getFromService(13).subscribe(response => {
      this.pnLSubPractices = [];
      response.aggregations.filtered.by_SubPracticewise.buckets.forEach(x => {
        this.pnLSubPractices.push(x.key);
      });
      response.aggregations.filtered.by_SubPracticewise.buckets.forEach(x => {
        let b = data.find(xx => xx.key == x.key);
        value.push(b ? b.value : '');
      });

      if (this.chartBarPnLSubPracticeswise.data) {
        this.chartBarPnLSubPracticeswise.data.labels = this.pnLSubPractices;
        this.chartBarPnLSubPracticeswise.data.datasets[dataset].data = value;
        this.chartBarPnLSubPracticeswise.chart.update();
      }

    }, error => {
      console.log('error');
    });
  }

  employeePnLMonth(year, org, practice, bu, subPractice, project, data, value, dataset) {
    this.es.projectMonthsLabel(year, org, project, practice, bu, subPractice);
    this.es.getFromService(6).subscribe(response => {
      let months = [];
      this.employeePnLLineLabels = [];
      response.aggregations.filtered.by_projectmonth.buckets.forEach(x => {
        months.push(x.key);
      });

      months = months.sort((a, b) => a - b);

      months.forEach(x => {
        switch (x) {
          case 1: this.employeePnLLineLabels.push("Jan");
            break;
          case 2: this.employeePnLLineLabels.push("Feb");
            break;
          case 3: this.employeePnLLineLabels.push("Mar");
            break;
          case 4: this.employeePnLLineLabels.push("Apr");
            break;
          case 5: this.employeePnLLineLabels.push("May");
            break;
          case 6: this.employeePnLLineLabels.push("Jun");
            break;
          case 7: this.employeePnLLineLabels.push("Jul");
            break;
          case 8: this.employeePnLLineLabels.push("Aug");
            break;
          case 9: this.employeePnLLineLabels.push("Sep");
            break;
          case 10: this.employeePnLLineLabels.push("Oct");
            break;
          case 11: this.employeePnLLineLabels.push("Nov");
            break;
          case 12: this.employeePnLLineLabels.push("Dec");
        }
      });
      months.forEach(key => {
        let x = data.find(object => object.key == key);
        value.push(x ? x.total.value : '');
      });

      if (this.chartLineEmpPnL.data) {
        this.chartLineEmpPnL.data.labels = this.employeePnLLineLabels;
        this.chartLineEmpPnL.data.datasets[dataset].data = value;
        this.chartLineEmpPnL.chart.update();
      }

    }, error => {
      console.log('error');
    });
  }

  secondPnLMonth(year, org, practice, bu, subPractice, project, data, value, dataset) {
    this.es.projectMonthsLabel(year, org, project, practice, bu, subPractice);
    this.es.getFromService(6).subscribe(response => {
      let months = [];
      this.secondPnLLineLabels = [];
      response.aggregations.filtered.by_projectmonth.buckets.forEach(x => {
        months.push(x.key);
      });

      months = months.sort((a, b) => a - b);

      months.forEach(x => {
        switch (x) {
          case 1: this.secondPnLLineLabels.push("Jan");
            break;
          case 2: this.secondPnLLineLabels.push("Feb");
            break;
          case 3: this.secondPnLLineLabels.push("Mar");
            break;
          case 4: this.secondPnLLineLabels.push("Apr");
            break;
          case 5: this.secondPnLLineLabels.push("May");
            break;
          case 6: this.secondPnLLineLabels.push("Jun");
            break;
          case 7: this.secondPnLLineLabels.push("Jul");
            break;
          case 8: this.secondPnLLineLabels.push("Aug");
            break;
          case 9: this.secondPnLLineLabels.push("Sep");
            break;
          case 10: this.secondPnLLineLabels.push("Oct");
            break;
          case 11: this.secondPnLLineLabels.push("Nov");
            break;
          case 12: this.secondPnLLineLabels.push("Dec");
        }
      });

      months.forEach(key => {
        if (data.length != 0) {
          let x = data.find(object => object.key == key);
          value.push(x ? x.total.value : '');
        }
      });

      this.chartLineSecPnL.data.labels = this.secondPnLLineLabels;
      this.chartLineSecPnL.data.datasets[dataset].data = value;
      this.chartLineSecPnL.chart.update();

    }, error => {
      console.log('error');
    });
  }

  // ------------------------------------- PnL EMPLOYEE MONTHLY TREND(ON-CLICK) ----------------------------------------

  pnLProjectsTableData(PnLTableData) {
    let bu = [];
    let practice = [];
    let subPractice = [];
    bu.push(PnLTableData.bu);
    practice.push(PnLTableData.practice);
    subPractice.push(PnLTableData.subPractice);
    this.selectedRecordSec = '';
    this.titlePnLSec = '';
    this.selectedRecord = PnLTableData.name;
    this.titlePnL = PnLTableData.name;
    this.selected = PnLTableData.name;
    let department = PnLTableData ? PnLTableData.dept_original : '';
    this.es.filterPnLMonthlyTrend(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
      this.empFieldValue, this.titlePnL, department);
    this.es.getFromService(15).subscribe(response => {

      let cost = response.aggregations.filtered.by_monthCost.buckets;
      this.employeePnLLineCost = [];
      this.employeePnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
        this.projectFieldValue, cost, this.employeePnLLineCost, 0);

      let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
      this.employeePnLLineRevenue = [];
      this.employeePnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
        this.projectFieldValue, revenue, this.employeePnLLineRevenue, 1);

      let department = PnLTableData ? PnLTableData.dept_original : '';
      this.es.filterPnLSecondTableData(this.empYear, this.empYear + this.empMonth, this.empFieldValue, this.titlePnL, department);
      this.es.getFromService(16).subscribe(response => {
        this.empJSON = {
          data: []
        };
        response.aggregations.filtered.by_selection.buckets.forEach(x => {
          if (x.length != 0 && x.total_revenue.value > 0) {
            let temp = x.by_department.buckets[0].key.split('.');
            let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
            this.empJSON.data.push({
              "name": x.key,
              "bu": x.by_employeeBU.buckets[0].key,
              "practice": x.by_practices.buckets[0].key,
              "subPractice": x.by_sub_practices.buckets[0].key,
              "department": dept,
              "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed() : "0",
              "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
            });
          }
        });
        this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
          return a.name > b.name ? 1
            : a.name < b.name ? -1
              : 0;
        });


        this.selectedRecordSec = this.titlePnLSec = this.empJSON.data[0] ? this.empJSON.data[0].name : '';
        // this.titlePnLSec = this.empJSON.data[0].name;
        // let prj = [];
        // let emp = [];
        // prj.push(this.selectedRecord);
        // emp.push(this.empJSON.data[0].name);
        this.es.filterPnLMonthlySecondTrend(this.empYear, this.titlePnLSec, this.titlePnL);
        this.es.getFromService(17).subscribe(response => {

          // let cost = response.aggregations.filtered.by_monthCost.buckets;
          // this.secondPnLLineCost = [];
          // this.secondPnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData,
          // this.empSubPracticeData, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

          let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
          this.secondPnLLineReveue = [];
          this.secondPnLMonth(this.empYear, this.empOrgData, this.empPracticeData, this.empBUData, this.empSubPracticeData,
            this.projectFieldValue, revenue, this.secondPnLLineReveue, 0);


        }, error => {
          console.log('error');
        });


      }, error => {
        console.log('error');
      });

    }, error => {
      console.log('error');
    });
  }

  // ------------------------------------  PnL SECOND EMPLOYEE MONTHLY TREND(ON-CLICK)  --------------------------------

  pnLEmpTableData(secondTableData) {
    let bu = [];
    let practice = [];
    let subPractice = [];
    bu.push(secondTableData.bu);
    practice.push(secondTableData.practice);
    subPractice.push(secondTableData.subPractice);
    this.selectedRecordSec = this.titlePnLSec = secondTableData ? secondTableData.name : '';

    // let prj = [];
    // let emp = [];
    // prj.push(this.selectedRecord);
    // emp.push(secondTableData.name);
    this.es.filterPnLMonthlySecondTrend(this.empYear, this.titlePnLSec, this.titlePnL);
    this.es.getFromService(17).subscribe(response => {

      // let cost = response.aggregations.filtered.by_monthCost.buckets;
      // this.secondPnLLineCost = [];
      // this.secondPnLMonth(this.empYear, this.empOrgData, practice, bu, subPractice,
      // this.projectFieldValue, cost, this.secondPnLLineCost, 0);

      let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
      this.secondPnLLineReveue = [];
      this.secondPnLMonth(this.empYear, this.empOrgData, practice, bu, subPractice, this.projectFieldValue, revenue,
        this.secondPnLLineReveue, 0);

    }, error => {
      console.log('error');
    });

  }

  // ------------------------------------- PnL (APPLYING GLOBAL FILTERS) ------------------------------------------------------

  filterPnLCharts() {
    this.isPageLoaded.emit(false);
    this.secondSearchString = '';
    this.searchString = '';
    let bu = [];
    let practice = [];
    let subPractice = [];
    let secTableBU = [];
    let secTablePractice = [];
    let secTableSubPractice = [];
    let globalBU = [];
    let globalPractice = [];
    let globalSubPractice = [];

    let year = this.empYear;
    let month = this.empYear + this.empMonth;
    let org = this.empOrg == '*' ? this.empOrgData : [this.empOrg];

    bu = this.firstTableBU == '*' ? (this.empBU == '*' ? this.empBUData : [this.empBU]) : [this.firstTableBU];
    practice = this.firstTablePractice == '*' ?
      (this.empPractice == '*' ? this.empPracticeData : [this.empPractice]) : [this.firstTablePractice];
    subPractice = this.firstTableSubPractice == '*' ?
      (this.empSubPractice == '*' ? this.empSubPracticeData : [this.empSubPractice]) : [this.firstTableSubPractice];

    secTableBU = this.secondTableBU == '*' ? bu : [this.secondTableBU];
    secTablePractice = this.secondTablePractice == '*' ? practice : [this.secondTablePractice];
    secTableSubPractice = this.secondTableSubPractice == '*' ? subPractice : [this.secondTableSubPractice];

    globalBU = this.empBU == '*' ? this.empBUData : [this.empBU];
    globalPractice = this.empPractice == '*' ? this.empPracticeData : [this.empPractice];
    globalSubPractice = this.empSubPractice == '*' ? this.empSubPracticeData : [this.empSubPractice];

    // ----------------------------------------  UPDATE PnL PIE CHART  ---------------------------------------------------------

    this.es.filterPnLPie(year, org, globalPractice, globalBU, globalSubPractice, month, this.empFieldValue);
    this.es.getFromService(9).subscribe(response => {

      let totalCost = 0;
      let totalRevenue = 0;
      response.aggregations.filtered.by_selection.buckets.forEach(x => {
        x.by_monthAvgCost.buckets.forEach(cost => {
          totalCost = totalCost + cost.total.value;
        });
        totalRevenue = totalRevenue + x.total_revenue.value;
      });
      this.piePnLData = [];
      this.piePnLLabels = [];
      this.piePnLData.push(totalCost.toFixed());
      this.piePnLLabels.push("Cost");

      this.piePnLData.push(totalRevenue.toFixed());
      this.piePnLLabels.push("Revenue");

      this.chartPiePnL.data.labels = this.piePnLLabels;
      this.chartPiePnL.data.datasets[0].data = this.piePnLData;
      this.chartPiePnL.chart.update();
      this.isPageLoaded.emit(true);
    }, error => {
      console.log('error');
    });

    // ---------------------------------------  UPDATE PnL PRACTICESWISE CHART  ------------------------------------

    this.es.filterPracticeswisePnL(year, org, globalPractice, globalBU, globalSubPractice, month, this.empFieldValue);
    this.es.getFromService(10).subscribe(response => {
      let practiceCostJSON = {
        data: []
      };
      let practiceRevenueJSON = {
        data: []
      };

      response.aggregations.filtered.by_practicewiseCost.buckets.forEach(x => {
        let totalCost = 0;
        x.by_selection.buckets.forEach(rec => {
          rec.total.buckets.forEach(cost => {
            totalCost = totalCost + cost.total.value;
          });

        });
        practiceCostJSON.data.push({
          "key": x.key,
          "value": totalCost
        });
      });

      response.aggregations.filtered.by_practicewiseCost.buckets.forEach(x => {
        x.by_practicewiseRevenue.buckets.forEach(rev => {
          practiceRevenueJSON.data.push({
            "key": rev.key,
            "value": rev.total.value
          });
        });
      });


      this.costPnLPracticeswise = [];
      this.revenuePnLPracticeswise = [];

      let cost = practiceCostJSON.data;
      this.pnLPracticeswiseLabel(cost, this.costPnLPracticeswise, year, org, globalPractice, globalBU, globalSubPractice,
        month, this.empFieldValue, 0);

      let revenue = practiceRevenueJSON.data;
      this.pnLPracticeswiseLabel(revenue, this.revenuePnLPracticeswise, year, org, globalPractice, globalBU, globalSubPractice,
        month, this.empFieldValue, 1);

    }, error => {
      console.log('error');
    });

    // ----------------------------------------  UPDATE PnL SUB-PRACTICESWISE CHART  -------------------------------------
    this.es.filterSubPracticeswisePnL(year, org, globalPractice, globalBU, globalSubPractice, month, this.empFieldValue);
    this.es.getFromService(12).subscribe(response => {
      let practiceCostJSON = {
        data: []
      };
      let practiceRevenueJSON = {
        data: []
      };

      response.aggregations.filtered.by_subPracticewiseCost.buckets.forEach(x => {
        let totalCost = 0;
        x.by_selection.buckets.forEach(rec => {
          rec.total.buckets.forEach(cost => {
            totalCost = totalCost + cost.total.value;
          });

        });
        practiceCostJSON.data.push({
          "key": x.key,
          "value": totalCost
        });
      });

      response.aggregations.filtered.by_subPracticewiseCost.buckets.forEach(x => {
        x.by_subPracticewiseRevenue.buckets.forEach(rev => {
          practiceRevenueJSON.data.push({
            "key": rev.key,
            "value": rev.total.value
          });
        });
      });

      this.costPnLSubPracticeswise = [];
      this.revenuePnLSubPracticeswise = [];

      let cost = practiceCostJSON.data;
      this.pnLSubPracticeswiseLabel(cost, this.costPnLSubPracticeswise, year, org, globalPractice, globalBU, globalSubPractice,
        month, this.empFieldValue, 0);

      let revenue = practiceRevenueJSON.data;
      this.pnLSubPracticeswiseLabel(revenue, this.revenuePnLSubPracticeswise, year, org, globalPractice, globalBU, globalSubPractice,
        month, this.empFieldValue, 1);

    }, error => {
      console.log('error');
    });

    // ------------------------------------- UPDATE PnL PROJECT TABLE DATA(APPLYING FILTERS) ---------------------------------------

    this.projectsJSON.data = [];
    this.es.filterPnLProjectTableData(year, org, practice, bu, subPractice, month, this.empFieldValue);
    this.es.getFromService(14).subscribe(response => {

      this.projectsJSON = {
        data: []
      };
      response.aggregations.filtered.by_selection.buckets.forEach(y => {
        y.by_department.buckets.forEach(x => {
          let totalSum = 0;
          x.by_monthAvgCost.buckets.forEach(cost => {
            totalSum = totalSum + cost.total.value;
          });
          if (x.length != 0) {
            let temp = x.key.split('.');
            let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
            this.projectsJSON.data.push({
              "name": y.key,
              // "bu": x.by_employeeBU.buckets[0].key,
              // "practice": x.by_practices.buckets[0].key,
              // "subPractice": x.by_sub_practices.buckets[0].key,
              "department": dept,
              "dept_original": x.key,
              "hours": x.total_hours.value != 0 ? x.total_hours.value : "0",
              "cost": totalSum != 0 ? totalSum.toFixed() : "0",
              "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
            });
          }
        })
      });
      this.projectsJSON.data = this.projectsJSON.data.sort(function sortAll(a, b) {
        return a.name > b.name ? 1
          : a.name < b.name ? -1
            : 0;
      });

      // ---------------------------------------  UPDATE FIRST MONTLY TREND(APPLYING FILTERS)  ----------------------------------
      if (this.projectsJSON.data.length == 0) {
        this.title = 'Project/Resource';
        this.chartLineEmpPnL.data.labels = [];
        this.chartLineEmpPnL.data.datasets[0].data = [];
        this.chartLineEmpPnL.data.datasets[1].data = [];
        this.chartLineEmpPnL.chart.update();

        this.selected = '';
        this.empJSON.data = [];

        this.titlePnL = 'Project/Resource';
        this.titlePnLSec = 'Project/Resource';
        this.chartLineSecPnL.data.labels = [];
        this.chartLineSecPnL.data.datasets[0].data = [];
        this.chartLineSecPnL.data.datasets[1].data = [];
        this.chartLineSecPnL.chart.update();
      }

      this.selectedRecord = this.projectsJSON.data[0].name;
      this.titlePnL = this.projectsJSON.data[0].name;
      let department = this.projectsJSON.data[0] ? this.projectsJSON.data[0].dept_original : '';
      this.es.filterPnLMonthlyTrend(year, org, practice, bu, subPractice, this.empFieldValue, this.titlePnL, department);
      this.es.getFromService(15).subscribe(response => {

        let cost = response.aggregations.filtered.by_monthCost.buckets;
        this.employeePnLLineCost = [];
        this.employeePnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, cost, this.employeePnLLineCost, 0);

        let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
        this.employeePnLLineRevenue = [];
        this.employeePnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, revenue, this.employeePnLLineRevenue, 1);


        // ------------------------------------------- UPDATE PnL 2nd TABLE(APPLYING FILTERS) --------------------------------------------

        this.empJSON.data = [];
        this.selectedRecord = this.projectsJSON.data[0].name;
        this.titlePnL = this.projectsJSON.data[0].name;
        this.selected = this.projectsJSON.data[0].name;
        this.es.filterPnLSecondTableData(year, month, this.empFieldValue, this.titlePnL, this.projectsJSON.data[0].dept_original);
        this.es.getFromService(16).subscribe(response => {
          this.empJSON = {
            data: []
          };
          response.aggregations.filtered.by_selection.buckets.forEach(x => {
            if (x.length != 0 && x.total_revenue.value > 0) {
              let temp = x.by_department.buckets[0].key.split('.');
              let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
              this.empJSON.data.push({
                "name": x.key,
                "bu": x.by_employeeBU.buckets[0].key,
                "practice": x.by_practices.buckets[0].key,
                "subPractice": x.by_sub_practices.buckets[0].key,
                "department": dept,
                "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed() : "0",
                "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
              });
            }
          });
          this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
            return a.name > b.name ? 1
              : a.name < b.name ? -1
                : 0;
          });

          // ---------------------------------------------  UPDATE 2nd MONTHLY CHART(APPLYING FILTERS)  ---------------------------------

          if (this.empJSON.data.length == 0) {
            this.titlePnLSec = 'Project/Resource';
            this.chartLineSecPnL.data.labels = [];
            this.chartLineSecPnL.data.datasets[0].data = [];
            this.chartLineSecPnL.data.datasets[1].data = [];
            this.chartLineSecPnL.chart.update();
          }

          this.selectedRecordSec = this.titlePnLSec = this.empJSON.data[0] ? this.empJSON.data[0].name : '';
          // this.titlePnLSec = this.empJSON.data[0].name;
          // let prj = [];
          // let emp = [];
          // emp.push(this.empJSON.data[0].name);
          this.es.filterPnLMonthlySecondTrend(year, this.titlePnLSec, this.titlePnL);
          this.es.getFromService(17).subscribe(response => {

            // let cost = response.aggregations.filtered.by_monthCost.buckets;
            // this.secondPnLLineCost = [];
            // this.secondPnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

            let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
            this.secondPnLLineReveue = [];
            this.secondPnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, revenue, this.secondPnLLineReveue, 0);




            // ----------------------------------------------  UPDATE 2nd TABLE(APPLYING 2nd TABLE FILTER)  --------------------------

            this.selectedRecord = this.projectsJSON.data[0].name;
            this.titlePnL = this.projectsJSON.data[0].name;
            this.selected = this.projectsJSON.data[0].name;
            this.es.filterPnLSecondTableData(year, month, this.empFieldValue, this.titlePnL, this.projectsJSON.data[0].dept_original);
            this.es.getFromService(16).subscribe(response => {
              this.empJSON = {
                data: []
              };
              response.aggregations.filtered.by_selection.buckets.forEach(x => {
                if (x.length != 0 && x.total_revenue.value > 0) {
                  let temp = x.by_department.buckets[0].key.split('.');
                  let dept = temp[0] + '.' + temp[1] + '.' + temp[2] + '.' + temp[3] + '.' + temp[4];
                  this.empJSON.data.push({
                    "name": x.key,
                    "bu": x.by_employeeBU.buckets[0].key,
                    "practice": x.by_practices.buckets[0].key,
                    "subPractice": x.by_sub_practices.buckets[0].key,
                    "department": dept,
                    "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed() : "0",
                    "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed() : "0"
                  });
                }
              });
              this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
                return a.name > b.name ? 1
                  : a.name < b.name ? -1
                    : 0;
              });

              // ---------------------------------------------  UPDATE 2nd MONTHLY CHART(APPLYING 2nd TABLE FILTERS)  ----------------

              if (this.empJSON.data.length == 0) {
                this.titlePnLSec = 'Project/Resource';
                this.chartLineSecPnL.data.labels = [];
                this.chartLineSecPnL.data.datasets[0].data = [];
                this.chartLineSecPnL.data.datasets[1].data = [];
                this.chartLineSecPnL.chart.update();
              }
              this.selectedRecordSec = this.titlePnLSec = this.empJSON.data[0] ? this.empJSON.data[0].name : '';
              // this.titlePnLSec = this.empJSON.data[0].name;
              // let prj = [];
              // let emp = [];
              // emp.push(this.empJSON.data[0].name);
              this.es.filterPnLMonthlySecondTrend(year, this.titlePnLSec, this.titlePnL);
              this.es.getFromService(17).subscribe(response => {

                // let cost = response.aggregations.filtered.by_monthCost.buckets;
                // this.secondPnLLineCost = [];
                // this.secondPnLMonth(year, org, secTablePractice, secTableBU, secTableSubPractice,
                // this.projectFieldValue, cost, this.secondPnLLineCost, 0);

                let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
                this.secondPnLLineReveue = [];
                this.secondPnLMonth(year, org, secTablePractice, secTableBU, secTableSubPractice, this.projectFieldValue, revenue,
                  this.secondPnLLineReveue, 0);


              }, error => {
                console.log('error');
              });

            }, error => {
              console.log('error');
            });

          }, error => {
            console.log('error');
          });

        }, error => {
          console.log('error');
        });

      }, error => {
        console.log('error');
      });

    }, error => {
      console.log('error');
    });
  }

  inWords(month) {
    this.monthsInWord = {
      data: []
    };
    month.forEach(x => {
      switch (x.key) {
        case 1: this.monthsInWord.data.push({ "key": "Jan", "value": "0" + x.key });
          break;
        case 2: this.monthsInWord.data.push({ "key": "Feb", "value": "0" + x.key });
          break;
        case 3: this.monthsInWord.data.push({ "key": "Mar", "value": "0" + x.key });
          break;
        case 4: this.monthsInWord.data.push({ "key": "Apr", "value": "0" + x.key });
          break;
        case 5: this.monthsInWord.data.push({ "key": "May", "value": "0" + x.key });
          break;
        case 6: this.monthsInWord.data.push({ "key": "Jun", "value": "0" + x.key });
          break;
        case 7: this.monthsInWord.data.push({ "key": "Jul", "value": "0" + x.key });
          break;
        case 8: this.monthsInWord.data.push({ "key": "Aug", "value": "0" + x.key });
          break;
        case 9: this.monthsInWord.data.push({ "key": "Sept", "value": "0" + x.key });
          break;
        case 10: this.monthsInWord.data.push({ "key": "Oct", "value": x.key });
          break;
        case 11: this.monthsInWord.data.push({ "key": "Nov", "value": x.key });
          break;
        case 12: this.monthsInWord.data.push({ "key": "Dec", "value": x.key });

      }
    });

  }

  renderChart() {

    // ----------------------------------------  PnL PIE CHART  -------------------------------------------

    this.chartPiePnL = new Chart('piePnLCanvas', {
      type: 'pie',
      data: {
        labels: this.piePnLLabels,
        datasets: [
          {
            label: 'PnL',
            data: this.piePnLData,
            backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
            hoverBackgroundColor: ["#ffc107", "#28a745", "#dc3545"],
            hoverBorderWidth: 0
          }
        ]
      },
      options: {
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.labels[tooltipItem.index] + ': $' +
                data.datasets[0].data[tooltipItem.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              // return data.datasets[tooltipItem.datasetIndex].label +
              //   ': ' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%';
            }
          }
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            fontSize: 11,
            boxWidth: 10
          }
        }
      }
    });
    // ------------------------------------------ PnL PRACTICESWISE BAR CHART ----------------------------------------

    this.chartBarPnLPracticeswise = new Chart('barPnLPracticeswise', {
      type: 'bar',
      data: {
        labels: this.pnLPractices,
        datasets: [
          {
            label: 'Cost',
            data: this.costPnLPracticeswise,
            backgroundColor: "#ffc107",
            hoverBackgroundColor: "#ffc107",
            // hidden: true,
          },
          {
            label: 'Revenue',
            data: this.revenuePnLPracticeswise,
            backgroundColor: "#28a745",
            hoverBackgroundColor: "#28a745",
            // hidden: true,
          }
        ]
      },
      options: {
        aspectRatio: 4.1,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              if (!data) {
                return false;
              }
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + '$' +
                tooltipItem.yLabel.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
        },
        scales: {
          xAxes: [{
            // maxBarThickness: 15,
            // categoryPercentage: 0.5,
            // barPercentage: 1.0,
            stacked: false,
            gridLines: { display: false },
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            stacked: false,
            ticks: {
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
            }
          }],
        },
        onClick: function (c) {

          var elementEvent = chartPnLPract.getElementsAtEvent(c);
          var datasetsIndex = chartPnLPract.getDatasetAtEvent(c);

          if (elementEvent.length > 0 && datasetsIndex.length > 0) {
            var indexElementEvent = elementEvent[0]._index;
            var indexDataset = datasetsIndex[0]._datasetIndex
            var practice = this.data.labels[indexElementEvent];
            var label = this.data.datasets[indexDataset].label;
          }
        }
      }
    });
    let chartPnLPract = this.chartBarPnLPracticeswise;

    // -------------------------------------- PnL SUB-PRACTICESWISE BAR CHART -------------------------------

    this.chartBarPnLSubPracticeswise = null;
    this.chartBarPnLSubPracticeswise = new Chart('barPnLSubPracticeswise', {
      type: 'bar',
      data: {
        labels: this.pnLSubPractices,
        datasets: [
          {
            label: 'Cost',
            data: this.costPnLSubPracticeswise,
            backgroundColor: "#ffc107",
            hoverBackgroundColor: "#ffc107",
            // hidden: true,
          },
          {
            label: 'Revenue',
            data: this.revenuePnLSubPracticeswise,
            backgroundColor: "#28a745",
            hoverBackgroundColor: "#28a745",
            // hidden: true,
          }
        ]
      },
      options: {
        aspectRatio: 6,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              if (!data) {
                return false;
              }
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + '$' +
                tooltipItem.yLabel.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
        },
        scales: {
          xAxes: [{
            // maxBarThickness: 15,
            // categoryPercentage: 0.5,
            // barPercentage: 1.0,
            stacked: false,
            gridLines: { display: false },
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            stacked: false,
            ticks: {
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
            }
          }],
        },
        onClick: function (c) {

          var elementEvent = chartPnLSubPract.getElementsAtEvent(c);
          var datasetsIndex = chartPnLSubPract.getDatasetAtEvent(c);

          if (elementEvent.length > 0 && datasetsIndex.length > 0) {
            var indexElementEvent = elementEvent[0]._index;
            var indexDataset = datasetsIndex[0]._datasetIndex
            var practice = this.data.labels[indexElementEvent];
            var label = this.data.datasets[indexDataset].label;
          }
        }
      }
    });
    let chartPnLSubPract = this.chartBarPnLSubPracticeswise;

    // ------------------------------------  PnL FIRST MONTHLY TREND -----------------------------------------


    this.chartLineEmpPnL = new Chart('lineEmpPnL', {
      type: 'line',
      data: {
        labels: this.employeePnLLineLabels,
        datasets: [
          {
            label: 'Cost',
            fill: false,
            data: this.employeePnLLineCost,
            backgroundColor: "#ffc107",
            borderColor: "#ffc107",
            hoverBackgroundColor: "#ffc107"
          },
          {
            label: 'Revenue',
            fill: false,
            data: this.employeePnLLineRevenue,
            backgroundColor: "#28a745",
            borderColor: "#28a745",
            hoverBackgroundColor: "#28a745"
          }
        ]
      },
      options: {
        aspectRatio: 3.5,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + '$' +
                tooltipItem.yLabel.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: { display: false },
          }],
          yAxes: [{
            stacked: false,
            ticks: {
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
            }
          }],
        }
      }
    });

    // ----------------------------------------  PnL SECOND MONTHLY TREND  --------------------------------------------


    this.chartLineSecPnL = new Chart('lineSecPnL', {
      type: 'line',
      data: {
        labels: this.secondPnLLineLabels,
        datasets: [
          // {
          //   label: 'Cost',
          //   fill: false,
          //   data: this.secondPnLLineCost,
          //   backgroundColor: "#ffc107",
          //   borderColor: "#ffc107",
          //   hoverBackgroundColor: "#ffc107"
          // },
          {
            label: 'Revenue',
            fill: false,
            data: this.secondPnLLineReveue,
            backgroundColor: "#28a745",
            borderColor: "#28a745",
            hoverBackgroundColor: "#28a745"
          }
        ]
      },
      options: {
        aspectRatio: 3.5,
        animation: {
          duration: 10,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + '$' +
                tooltipItem.yLabel.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: { display: false },
          }],
          yAxes: [{
            stacked: false,
            ticks: {
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
            }
          }],
        }
      }
    });

  }

  downloadDetailsInExel(name) {
    let downloadDetails;
    let file_name;
    if (this.empJSON.data && name === 'Project_Details') {
      downloadDetails = this.empJSON.data;
      file_name = name + '_of_' + this.selected;
    } else if (this.projectsJSON.data && name === 'Employee_Details') {
      downloadDetails = this.projectsJSON.data;
      file_name = name;
    }
    this.downloadFile.exportAsExcelFile(downloadDetails, file_name);
  }

  private createColumnDefsEmployee() {
    const columnDefsEmployee = [
      {
        headerName: "Employee Name",
        field: "name",
        width: 350,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Department",
        field: "department",
        width: 250,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Hours",
        field: "hours",
        width: 140,
        valueFormatter: this.numberFormatter,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Cost",
        field: "cost",
        valueFormatter: this.currencyFormatter,
        width: 140,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      },
      {
        headerName: "Revenue",
        field: "revenue",
        valueFormatter: this.currencyFormatter,
        width: 140,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsEmployee;
  }

  onGridReadyEmployee(params) {
    this.gridApiEmployee = params.api;
    this.gridColumnApiEmployee = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  getRowHeightEmployee = function (params) {
    let lineCount = Math.floor(params.data.name.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  onEmployeeSelection(params) {
    let selectedEmployee = this.gridApiEmployee.getSelectedRows();
    this.pnLProjectsTableData(selectedEmployee[0]);
  }

  private createColumnDefsProjects() {
    const columnDefsProjects = [
      {
        headerName: "Project",
        field: "name",
        width: 350,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        cellStyle: { 'white-space': 'normal' },
        sortable: true
      },
      {
        headerName: "Department",
        field: "department",
        width: 250,
        suppressSizeToFit: true,
        filter: "agTextColumnFilter",
        sortable: true
      },
      {
        headerName: "Revenue",
        field: "revenue",
        valueFormatter: this.currencyFormatter,
        width: 100,
        filter: "agNumberColumnFilter",
        comparator: this.numberComparator,
        cellStyle: { 'text-align': 'right' },
        sortable: true
      }
    ];
    return columnDefsProjects;
  }

  onGridReadyProjects(params) {
    this.gridApiProjects = params.api;
    this.gridColumnApiProjects = params.columnApi;
    this.gridApiProjects.sizeColumnsToFit();
  }

  getRowHeightProjects = function (params) {
    let lineCount = Math.floor(params.data.name.length / 32) + 1;
    return (12 * lineCount) + 24;
  };

  onProjectSelection(params) {
    let selectedProject = this.gridApiProjects.getSelectedRows();
    this.pnLEmpTableData(selectedProject[0]);
  }

  currencyFormatter(params) {
    if (params.value) {
      return "$" + params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  percentageFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "%";
    } else {
      return '';
    }
  }

  numberFormatter(params) {
    if (params.value) {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  }

  numberComparator(num1, num2) {
    return num1 - num2;
  }

  setFilters(): any {
    const obj = {
      'org': this.empOrg,
      'project': this.empProject,
      'bu': this.empBU,
      'practice': this.empPractice,
      'subPractice': this.empSubPractice,
      'firstTableBU': this.firstTableBU,
      'firstTablePractice': this.firstTablePractice,
      'firstTableSubPractice': this.firstTableSubPractice,
      'secondTableBU': this.secondTableBU,
      'secondTablePractice': this.secondTablePractice,
      'secondTableSubPractice': this.secondTableSubPractice,
      'empMonth': this.empMonth,
      'empYear': this.empYear
    }
    this.gridService.setFilters(obj);
  }
}

