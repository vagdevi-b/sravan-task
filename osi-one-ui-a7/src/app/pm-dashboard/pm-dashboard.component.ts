import { Component, OnInit } from '@angular/core';

import { ElasticsearchService } from '../shared/services/elasticsearchService';
import { ResourceUtilizationService } from '../shared/services/resource-utilization.service';
import { Chart } from 'chart.js';
import * as moment from 'moment'
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-pm-dashboard',
  templateUrl: './pm-dashboard.component.html',
  styleUrls: ['./pm-dashboard.component.css']
})
export class PmDashboardComponent implements OnInit {

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
  chartLineEmpProjectType = Chart;
  employeeLineLabels = [];
  chartLineEmpPnL = Chart;
  employeePnLLineLabels = [];
  employeePnLLineCost = [];
  employeePnLLineRevenue = [];
  chartLineSecPnL = Chart;
  secondPnLLineLabels = [];
  secondPnLLineCost = [];
  secondPnLLineReveue = [];
  allTableData = [];
  prjOrgData = [];
  prjProjectData = [];
  prjBUData = [];
  prjPracticeData = [];
  prjSubPracticeData = [];
  prjYearData = [];
  prjMonthData = [];
  prjNameData = [];
  empOrg = "*";
  empProject = "*";
  empBU = "*";
  empPractice = "*";
  empSubPractice = "*";
  empBUTable = "*";
  empPracticeTable = "*";
  empSubPracticeTable = "*";
  prjTableBU = "*";
  prjTablePractice = "*";
  prjTableSubPractice = "*";
  firstTableBU = "*";
  firstTablePractice = "*";
  firstTableSubPractice = "*";
  secondTableBU = "*";
  secondTablePractice = "*";
  secondTableSubPractice = "*";
  empMonth = ".*";
  empYear = moment().year();
  projectFieldValue = [];
  projectsJSON = {
    data: []
  };
  empJSON = {
    data: []
  };
  monthsInWord = {
    data: []
  };

  constructor(private es: ElasticsearchService, private resource: ResourceUtilizationService, private router: Router) { }

  ngOnInit() {
    this.defaultView();
  } //----------------->> onInit END

  defaultView() {

    //----------------------------------------- DROPDOWNS -----------------------------------------------------

    this.resource.getByProjectsList().subscribe(response => {

      $('#loadingInvoiceDetailsModal').modal('show');
      this.prjOrgData = response.org;
      this.prjBUData = response.bu;
      this.prjPracticeData = response.practice;
      this.prjProjectData = response.project;
      this.prjSubPracticeData = response.subpractice;

      this.prjOrgData = this.prjOrgData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.prjBUData = this.prjBUData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.prjPracticeData = this.prjPracticeData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.prjProjectData = this.prjProjectData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });
      this.prjSubPracticeData = this.prjSubPracticeData.sort(function sortAll(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
      });

      this.es.getFromService(0).subscribe(response => {

        this.prjYearData = response.aggregations.by_year.buckets;
        this.prjYearData = this.prjYearData.sort((a, b) => a.key - b.key);

        this.prjMonthData = response.aggregations.by_month.buckets;
        this.prjMonthData = this.prjMonthData.sort((a, b) => a.key - b.key);
        this.inWords(this.prjMonthData);


      }, error => {
        console.log('error');
      });

      this.projectFieldValue = this.prjProjectData;

      //------------------------------------- PnL PROJECT TABLE DATA(DEFAULT) -------------------------------------------------
      console.log("FILTERS",this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.empYear + this.empMonth, this.projectFieldValue);
      this.es.getProjectPnlFirstTable(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.empYear + this.empMonth, this.projectFieldValue);
      this.es.getFromService(19).subscribe(response => {
        this.projectsJSON = {
          data: []
        };
        console.log("RESPONSE",response);
        response.aggregations.filtered.by_selection.buckets.forEach(x => {
          let totalSum = 0;
          x.by_monthAvgCost.buckets.forEach(cost => {
            totalSum = totalSum + cost.total.value;
          });
          if (x.length != 0) {
            this.projectsJSON.data.push({
              "name": x.key,
              "bu": x.by_employeeBU.buckets[0].key,
              "practice": x.by_practices.buckets[0].key,
              "subPractice": x.by_sub_practices.buckets[0].key,
              "cost": totalSum != 0 ? totalSum.toFixed(2) : "0",
              "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed(2) : "0"
            });
          }
        });
        this.projectsJSON.data = this.projectsJSON.data.sort(function sortAll(a, b) {
          return a.name > b.name ? 1
            : a.name < b.name ? -1
              : 0;
        });

        //------------------------------------------- PnL FIRST EMPLOYEE/PROJECT MONTHLY TREND(DEFAULT) ------------------------------------------
        this.selectedRecord = this.projectsJSON.data[0].name;
        this.titlePnL = this.projectsJSON.data[0].name;

        this.es.getFirstMonthlyTrendByProject(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, this.titlePnL);
        this.es.getFromService(20).subscribe(response => {

          let cost = response.aggregations.filtered.by_monthCost.buckets;
          this.employeePnLLineCost = [];
          this.employeePnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, cost, this.employeePnLLineCost, 0);

          let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
          this.employeePnLLineRevenue = [];
          this.employeePnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, revenue, this.employeePnLLineRevenue, 1);

          //------------------------------------------- PnL 2nd TABLE(DEFAULT) ---------------------------------------------------------
          this.selectedRecord = this.projectsJSON.data[0].name;
          this.titlePnL = this.projectsJSON.data[0].name;
          this.selected = this.projectsJSON.data[0].name;
          console.log("FILTERS",this.empYear, this.empYear + this.empMonth, this.projectFieldValue, this.titlePnL);
          this.es.getProjectPnLSecondTable(this.empYear, this.empYear + this.empMonth, this.projectFieldValue, this.titlePnL);
          this.es.getFromService(21).subscribe(response => {
            this.empJSON = {
              data: []
            };

            response.aggregations.filtered.by_selection.buckets.forEach(x => {
              if (x.by_employeeBU.buckets.length != 0) {
                this.empJSON.data.push({
                  "name": x.key,
                  "bu": x.by_employeeBU.buckets[0].key,
                  "practice": x.by_practices.buckets[0].key,
                  "subPractice": x.by_sub_practices.buckets[0].key,
                  "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed(2) : "0",
                  "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed(2) : "0"
                });
              }
            });
            this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
              return a.name > b.name ? 1
                : a.name < b.name ? -1
                  : 0;
            });

            //------------------------------------------- PnL SECOND EMPLOYEE/PROJECT MONTHLY TREND(DEFAULT) ------------------------------------------
            this.selectedRecordSec = this.empJSON.data[0].name;
            this.titlePnLSec = this.empJSON.data[0].name;
            let prj = [];
            let emp = [];
            prj.push(this.projectsJSON.data[0].name);
            emp.push(this.empJSON.data[0].name);
            this.es.getSecondMonthlyTrendByProject(this.empYear, this.projectFieldValue, this.titlePnLSec, this.titlePnL);
            this.es.getFromService(22).subscribe(response => {

              let cost = response.aggregations.filtered.by_monthCost.buckets;
              this.secondPnLLineCost = [];
              this.secondPnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

              let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
              this.secondPnLLineReveue = [];
              this.secondPnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, revenue, this.secondPnLLineReveue, 1);


              this.renderChart();
              $('#loadingInvoiceDetailsModal').modal('hide');

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

    this.chartLineEmpPnL.data.labels = this.employeePnLLineLabels;
    this.chartLineEmpPnL.data.datasets[dataset].data = value;
    this.chartLineEmpPnL.chart.update();

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


//------------------------------------- PnL EMPLOYEE MONTHLY TREND(ON-CLICK) ----------------------------------------

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
  this.es.getFirstMonthlyTrendByProject(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, this.titlePnL);
  this.es.getFromService(20).subscribe(response => {

    let cost = response.aggregations.filtered.by_monthCost.buckets;
    this.employeePnLLineCost = [];
    this.employeePnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, cost, this.employeePnLLineCost, 0);

    let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
    this.employeePnLLineRevenue = [];
    this.employeePnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, revenue, this.employeePnLLineRevenue, 1);

    this.es.getProjectPnLSecondTable(this.empYear, this.empYear + this.empMonth, this.projectFieldValue, this.titlePnL);
    this.es.getFromService(21).subscribe(response => {
      this.empJSON = {
        data: []
      };
      response.aggregations.filtered.by_selection.buckets.forEach(x => {
        if (x.by_employeeBU.buckets.length != 0) {
          this.empJSON.data.push({
            "name": x.key,
            "bu": x.by_employeeBU.buckets[0].key,
            "practice": x.by_practices.buckets[0].key,
            "subPractice": x.by_sub_practices.buckets[0].key,
            "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed(2) : "0",
            "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed(2) : "0"
          });
        }
      });
      this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
        return a.name > b.name ? 1
          : a.name < b.name ? -1
            : 0;
      });


      this.selectedRecordSec = this.empJSON.data[0].name;
      this.titlePnLSec = this.empJSON.data[0].name;
      let prj = [];
      let emp = [];
      prj.push(this.selectedRecord);
      emp.push(this.empJSON.data[0].name);
      this.es.getSecondMonthlyTrendByProject(this.empYear, this.projectFieldValue, this.titlePnLSec, this.titlePnL);
      this.es.getFromService(22).subscribe(response => {

        let cost = response.aggregations.filtered.by_monthCost.buckets;
        this.secondPnLLineCost = [];
        this.secondPnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

        let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
        this.secondPnLLineReveue = [];
        this.secondPnLMonth(this.empYear, this.prjOrgData, this.prjPracticeData, this.prjBUData, this.prjSubPracticeData, this.projectFieldValue, revenue, this.secondPnLLineReveue, 1);


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

//------------------------------------  PnL SECOND EMPLOYEE MONTHLY TREND(ON-CLICK)  --------------------------------

pnLEmpTableData(secondTableData) {
  let bu = [];
  let practice = [];
  let subPractice = [];
  bu.push(secondTableData.bu);
  practice.push(secondTableData.practice);
  subPractice.push(secondTableData.subPractice);
  this.selectedRecordSec = secondTableData.name;
  this.titlePnLSec = secondTableData.name;
  let prj = [];
  let emp = [];
  prj.push(this.selectedRecord);
  emp.push(secondTableData.name);
  this.es.getSecondMonthlyTrendByProject(this.empYear, this.projectFieldValue, this.titlePnLSec, this.titlePnL);
  this.es.getFromService(22).subscribe(response => {

    let cost = response.aggregations.filtered.by_monthCost.buckets;
    this.secondPnLLineCost = [];
    this.secondPnLMonth(this.empYear, this.prjOrgData, practice, bu, subPractice, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

    let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
    this.secondPnLLineReveue = [];
    this.secondPnLMonth(this.empYear, this.prjOrgData, practice, bu, subPractice, this.projectFieldValue, revenue, this.secondPnLLineReveue, 1);

  }, error => {
    console.log('error');
  });

}

//------------------------------------- PnL (APPLYING GLOBAL FILTERS) ------------------------------------------------------

filterPnLCharts() {
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
  let org = this.empOrg == '*' ? this.prjOrgData : [this.empOrg];

  bu = this.firstTableBU == '*' ? (this.empBU == '*' ? this.prjBUData : [this.empBU]) : [this.firstTableBU];
  practice = this.firstTablePractice == '*' ? (this.empPractice == '*' ? this.prjPracticeData : [this.empPractice]) : [this.firstTablePractice];
  subPractice = this.firstTableSubPractice == '*' ? (this.empSubPractice == '*' ? this.prjSubPracticeData : [this.empSubPractice]) : [this.firstTableSubPractice];

  secTableBU = this.secondTableBU == '*' ? bu : [this.secondTableBU];
  secTablePractice = this.secondTablePractice == '*' ? practice : [this.secondTablePractice];
  secTableSubPractice = this.secondTableSubPractice == '*' ? subPractice : [this.secondTableSubPractice];

  globalBU = this.empBU == '*' ? this.prjBUData : [this.empBU];
  globalPractice = this.empPractice == '*' ? this.prjPracticeData : [this.empPractice];
  globalSubPractice = this.empSubPractice == '*' ? this.prjSubPracticeData : [this.empSubPractice];

  //------------------------------------- UPDATE PnL PROJECT TABLE DATA(APPLYING FILTERS) ---------------------------------------

  this.projectsJSON.data = [];
  this.es.getProjectPnlFirstTable(year, org, practice, bu, subPractice, month, this.projectFieldValue);
  this.es.getFromService(19).subscribe(response => {

    this.projectsJSON = {
      data: []
    };
    response.aggregations.filtered.by_selection.buckets.forEach(x => {
      let totalSum = 0;
      x.by_monthAvgCost.buckets.forEach(cost => {
        totalSum = totalSum + cost.total.value;
      });
      if (x.length != 0) {
        this.projectsJSON.data.push({
          "name": x.key,
          "bu": x.by_employeeBU.buckets[0].key,
          "practice": x.by_practices.buckets[0].key,
          "subPractice": x.by_sub_practices.buckets[0].key,
          "cost": totalSum != 0 ? totalSum.toFixed(2) : "0",
          "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed(2) : "0"
        });
      }
    });
    this.projectsJSON.data = this.projectsJSON.data.sort(function sortAll(a, b) {
      return a.name > b.name ? 1
        : a.name < b.name ? -1
          : 0;
    });

    //---------------------------------------  UPDATE FIRST MONTLY TREND(APPLYING FILTERS)  ----------------------------------
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
    this.es.getFirstMonthlyTrendByProject(year, org, practice, bu, subPractice, this.projectFieldValue, this.titlePnL);
    this.es.getFromService(20).subscribe(response => {

      let cost = response.aggregations.filtered.by_monthCost.buckets;
      this.employeePnLLineCost = [];
      this.employeePnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, cost, this.employeePnLLineCost, 0);

      let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
      this.employeePnLLineRevenue = [];
      this.employeePnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, revenue, this.employeePnLLineRevenue, 1);


      //------------------------------------------- UPDATE PnL 2nd TABLE(APPLYING FILTERS) ---------------------------------------------------------

      this.empJSON.data = [];
      this.selectedRecord = this.projectsJSON.data[0].name;
      this.titlePnL = this.projectsJSON.data[0].name;
      this.selected = this.projectsJSON.data[0].name;
      this.es.getProjectPnLSecondTable(year, month, this.projectFieldValue, this.titlePnL);
      this.es.getFromService(21).subscribe(response => {
        this.empJSON = {
          data: []
        };
        response.aggregations.filtered.by_selection.buckets.forEach(x => {
          if (x.length != 0) {
            this.empJSON.data.push({
              "name": x.key,
              "bu": x.by_employeeBU.buckets[0].key,
              "practice": x.by_practices.buckets[0].key,
              "subPractice": x.by_sub_practices.buckets[0].key,
              "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed(2) : "0",
              "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed(2) : "0"
            });
          }
        });
        this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
          return a.name > b.name ? 1
            : a.name < b.name ? -1
              : 0;
        });

        //---------------------------------------------  UPDATE 2nd MONTHLY CHART(APPLYING FILTERS)  -------------------------------------------

        if (this.empJSON.data.length == 0) {
          this.titlePnLSec = 'Project/Resource';
          this.chartLineSecPnL.data.labels = [];
          this.chartLineSecPnL.data.datasets[0].data = [];
          this.chartLineSecPnL.data.datasets[1].data = [];
          this.chartLineSecPnL.chart.update();
        }

        this.selectedRecordSec = this.empJSON.data[0].name;
        this.titlePnLSec = this.empJSON.data[0].name;
        let prj = [];
        let emp = [];
        prj.push(this.projectsJSON.data[0].name);
        emp.push(this.empJSON.data[0].name);
        this.es.getSecondMonthlyTrendByProject(year, this.projectFieldValue, this.titlePnLSec, this.titlePnL);
        this.es.getFromService(22).subscribe(response => {

          let cost = response.aggregations.filtered.by_monthCost.buckets;
          this.secondPnLLineCost = [];
          this.secondPnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

          let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
          this.secondPnLLineReveue = [];
          this.secondPnLMonth(year, org, practice, bu, subPractice, this.projectFieldValue, revenue, this.secondPnLLineReveue, 1);




          //----------------------------------------------  UPDATE 2nd TABLE(APPLYING 2nd TABLE FILTER)  --------------------------------------

          this.selectedRecord = this.projectsJSON.data[0].name;
          this.titlePnL = this.projectsJSON.data[0].name;
          this.selected = this.projectsJSON.data[0].name;
          this.es.getProjectPnLSecondTable(year, month, this.projectFieldValue, this.titlePnL);
          this.es.getFromService(21).subscribe(response => {
            this.empJSON = {
              data: []
            };
            response.aggregations.filtered.by_selection.buckets.forEach(x => {
              if (x.length != 0) {
                this.empJSON.data.push({
                  "name": x.key,
                  "bu": x.by_employeeBU.buckets[0].key,
                  "practice": x.by_practices.buckets[0].key,
                  "subPractice": x.by_sub_practices.buckets[0].key,
                  "cost": x.total_cost.value != 0 ? x.total_cost.value.toFixed(2) : "0",
                  "revenue": x.total_revenue.value != 0 ? x.total_revenue.value.toFixed(2) : "0"
                });
              }
            });
            this.empJSON.data = this.empJSON.data.sort(function sortAll(a, b) {
              return a.name > b.name ? 1
                : a.name < b.name ? -1
                  : 0;
            });

            //---------------------------------------------  UPDATE 2nd MONTHLY CHART(APPLYING 2nd TABLE FILTERS)  -------------------------------------------

            if (this.empJSON.data.length == 0) {
              this.titlePnLSec = 'Project/Resource';
              this.chartLineSecPnL.data.labels = [];
              this.chartLineSecPnL.data.datasets[0].data = [];
              this.chartLineSecPnL.data.datasets[1].data = [];
              this.chartLineSecPnL.chart.update();
            }
            this.selectedRecordSec = this.empJSON.data[0].name;
            this.titlePnLSec = this.empJSON.data[0].name;
            let prj = [];
            let emp = [];
            prj.push(this.projectsJSON.data[0].name);
            emp.push(this.empJSON.data[0].name);
            this.es.getSecondMonthlyTrendByProject(year, this.projectFieldValue, this.titlePnLSec, this.titlePnL);
            this.es.getFromService(22).subscribe(response => {

              let cost = response.aggregations.filtered.by_monthCost.buckets;
              this.secondPnLLineCost = [];
              this.secondPnLMonth(year, org, secTablePractice, secTableBU, secTableSubPractice, this.projectFieldValue, cost, this.secondPnLLineCost, 0);

              let revenue = response.aggregations.filtered.by_monthRevenue.buckets;
              this.secondPnLLineReveue = [];
              this.secondPnLMonth(year, org, secTablePractice, secTableBU, secTableSubPractice, this.projectFieldValue, revenue, this.secondPnLLineReveue, 1);


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

updateEmployeeMonth(data, value, dataset, totalHours, year, org, project, practice, bu, subPractice) {
  this.es.projectMonthsLabel(year, org, project, practice, bu, subPractice);
  this.es.getFromService(6).subscribe(response => {
    let months = [];
    this.employeeLineLabels = [];
    response.aggregations.filtered.by_projectmonth.buckets.forEach(x => {
      months.push(x.key);
    });

    months = months.sort((a, b) => a - b);

    months.forEach(x => {
      switch (x) {
        case 1: this.employeeLineLabels.push("Jan");
          break;
        case 2: this.employeeLineLabels.push("Feb");
          break;
        case 3: this.employeeLineLabels.push("Mar");
          break;
        case 4: this.employeeLineLabels.push("Apr");
          break;
        case 5: this.employeeLineLabels.push("May");
          break;
        case 6: this.employeeLineLabels.push("Jun");
          break;
        case 7: this.employeeLineLabels.push("Jul");
          break;
        case 8: this.employeeLineLabels.push("Aug");
          break;
        case 9: this.employeeLineLabels.push("Sep");
          break;
        case 10: this.employeeLineLabels.push("Oct");
          break;
        case 11: this.employeeLineLabels.push("Nov");
          break;
        case 12: this.employeeLineLabels.push("Dec");
      }
    });

    months.forEach(key => {
      let x = data.find(object => object.key == key);
      value.push(x ? ((x.by_employeehours.value / totalHours) * 100) : '');
    });

    this.chartLineEmpProjectType.data.labels = this.employeeLineLabels;
    this.chartLineEmpProjectType.data.datasets[dataset].data = value;
    this.chartLineEmpProjectType.chart.update();

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

  //------------------------------------  PnL FIRST MONTHLY TREND -----------------------------------------


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
      aspectRatio: 1.7,
      animation: {
        duration: 10,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + ': ' + '$' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  //----------------------------------------  PnL SECOND MONTHLY TREND  --------------------------------------------


  this.chartLineSecPnL = new Chart('lineSecPnL', {
    type: 'line',
    data: {
      labels: this.secondPnLLineLabels,
      datasets: [
        {
          label: 'Cost',
          fill: false,
          data: this.secondPnLLineCost,
          backgroundColor: "#ffc107",
          borderColor: "#ffc107",
          hoverBackgroundColor: "#ffc107"
        },
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
      animation: {
        duration: 10,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + ': ' + '$' + tooltipItem.yLabel.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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


  

}
