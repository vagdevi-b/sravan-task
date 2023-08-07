import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExportFileService } from '../../shared/services/export-file.service';
import { ResourceUtilizationService } from '../../shared/services/resource-utilization.service';
import { GridOptions } from "ag-grid-community";
import { GridService } from '../../dashboard-grid/grid.service';

const MONTHS_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_MAP = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
};

const COLOR_PALETTES = {
  current: [
    '#05B8CC', // cerulean bright
    '#FF8000', // orange dark
    '#993300', // chocolate dark
    '#FFFF00', // yellow bright
    '#8B8878', // cornsilk4 dark
    '#003F87', // sign blue dark
    '#006633', // starbucks dark
    '#FF0066', // broadwaypink bright
    '#802A2A', // brown dark
    '#A020F0', // purple bright
    '#F8171B', // burgundy bright
    '#2C5F2D', // forest green(dark)
    '#F2C080', // orange dark
    '#B44A56', // space cherry
    '#9B8271', // toffee
    '#628CBE', // deep blue
  ],

  previous: [
    '#8CF1FC', // cerulean pale
    '#FFCC99', // orange pale
    '#FFA477', // chocolate pale
    '#FFFF99', // yellow pale
    '#D0CFC9', // cornsilk4 pale
    '#71B3FF', // sign blue pale
    '#66FFB2', // starbucks pale
    '#FF99C2', // broadwaypink pale
    '#DF9D9D', // brown pale
    '#D9A5F9', // purple pale
    '#FB7E81', // burgundy pale
    '#B3CD8E', // moss green(pale)
    '#E7D9A3', // dusky citron (pale)
    '#DE778D', // raspberry
    '#F3EFDF', // sweet corn
    '#A7C6DC', // northern sky
  ]
};



@Component({
  selector: 'app-project-estimated-vs-actual',
  templateUrl: './project-estimated-vs-actual.component.html',
  styleUrls: ['./project-estimated-vs-actual.component.css'],
  host: {
    '(document:click)': 'onClose($event)'
  },
})
export class ProjectEstimatedVsActualComponent implements OnInit {

  @Output()
  isPageLoaded = new EventEmitter<boolean>();

  spinner = false;
  isGridModeOn = false;
  isCompareOn = false;

  // will be disabled if year selected is the least one
  // as we don't have previous year to compare to
  disableCompare = false;
  paginationPageSize = 10;

  months: any = [
    { 'value': 'Jan', 'id': 1 }, { 'value': 'Feb', 'id': 2 }, { 'value': 'Mar', 'id': 3 }, { 'value': 'Apr', 'id': 4 },
    { 'value': 'May', 'id': 5 }, { 'value': 'Jun', 'id': 6 }, { 'value': 'Jul', 'id': 7 }, { 'value': 'Aug', 'id': 8 },
    { 'value': 'Sep', 'id': 9 }, { 'value': 'Oct', 'id': 10 }, { 'value': 'Nov', 'id': 11 }, { 'value': 'Dec', 'id': 12 }
  ];

  estimatedVsActualData: ChartDataModel[];
  excelData: any[] = [];
  hierarchicalData: any;
  columnDefs: any[] = undefined;
  gridRowData: any[] = undefined;

  gridOptions = <GridOptions>{
    onFirstDataRendered: (event) => {
      this.autoSizeGrid(event);
    },
    onRowDataChanged: (event) => {
      this.autoSizeGrid(event);
    },
    autoSizePadding: 1
  };

  defaultColDef = { resizable: true };

  // the object of filter values we send while getting chart/grid data
  // made it a separate field because needed to use it in export excel method
  chartDataFilterPayload: any;

  // all projects id and names we get from backend to use in filter
  projectsData: DropdownFilterDataModel[];
  selectedProjects: DropdownFilterDataModel[];

  // all employees id and names we get from backend
  yearsList: number[];

  // year current selected in UI
  selectedYear: number;

  // latest and oldest years in yearsData
  maxYear: number;
  minYear: number;

  dropdownSettings: any;

  projectEstimatedVsActualChart: Chart;
  chartDatasets: any = {};
  lastChanedDd = '';

  employeeTypes: Set<string> = new Set();

  currentYear = moment().year();
  currentMonth = moment().month();

  private chartOptions: any = {
    type: 'bar',

    data: {
      labels: MONTHS_SHORT_NAMES
    },

    options: {

      animation: {
        duration: 0,
      },

      maintainAspectRatio: false,

      tooltips: {
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {

            if (!data) {
              return false;
            } else if (data.datasets[tooltipItem.datasetIndex].yAxisID === 'line') {
              return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
                tooltipItem.yLabel.toString();
            }

            return data.datasets[tooltipItem.datasetIndex].label + ' : ' +
              tooltipItem.yLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        },
        mode: 'label'
      },

      legend: {
        display: true,
      },

      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            drawOnChartArea: false,
            color: 'none'
          },
        }],
        yAxes: [
          // settings for bar y axis
          {
            id: 'bar',
            position: 'left',
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              min: 1,
              callback: value => {
                return value;
              }
            }
          },
        ],
      }
    }
  };

  constructor(
    private resourceUtilizationService: ResourceUtilizationService,
    private toastrService: ToastrService,
    private gridService: GridService,
    private exportFileService: ExportFileService
  ) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'itemName',
      itemsShowLimit: 1,
      classes: 'myclass custom-class'
    };

    this.setYearsData();
    this.setPreservedFilter();
  }

  setPreservedFilter() {
    this.spinner = true;
    const widgetId = this.gridService.getWidgetId();
    this.gridService.getEmpReportByWidgetId(widgetId).subscribe((res) => {
      const filter = res && res.filters ? JSON.parse(res.filters) : null;
      if (filter) {
        this.selectedProjects = filter && Object.keys(filter).length > 0 ? filter.project : this.selectedProjects;
        this.projectsData = filter && Object.keys(filter).length > 0 ? filter.projectData : this.projectsData;
        this.isCompareOn = filter && Object.keys(filter).length > 0 ? filter.compare : this.isCompareOn;
        this.isGridModeOn = filter && Object.keys(filter).length > 0 ? filter.grid : this.isGridModeOn;
        this.selectedYear = filter && Object.keys(filter).length > 0 ? filter.year : this.selectedYear;
        if (this.isCompareOn) {
          document.getElementById('toggle').classList.add('active');
        }
        if (this.isGridModeOn) {
          document.getElementById('toggleGrid').classList.add('active');
        }
        this.getEstimatedVsActualData(this.selectedProjects);
      } else {
        this.setYearsData();
        this.getProjectsData();
      }
    }, (errorResponse) => {
      this.spinner = false;
      this.setYearsData();
      this.getProjectsData();
    });
  }

  setYearsData() {
    const currentYear = moment().year();
    this.yearsList = [currentYear - 2, currentYear - 1, currentYear];
    this.maxYear = currentYear;
    this.minYear = this.yearsList[0];
    this.selectedYear = this.maxYear;
  }

  getProjectsData() {
    this.spinner = true;

    this.resourceUtilizationService
      .getAllProjects()
      .subscribe(
        (response) => {
          this.spinner = false;
          this.projectsData = response.Projects;
          this.getEstimatedVsActualData(this.selectedProjects);
        },
        this.dataFetchErrorHandler
      );
  }

  /* gets the data to display the chart */
  getEstimatedVsActualData(projects: any[]) {

    if (!projects || projects.length === 0) {
      this.spinner = false;
      if (this.projectEstimatedVsActualChart) {
        this.projectEstimatedVsActualChart.destroy();
      }
      this.estimatedVsActualData = [];
      this.setGridRowData();
      this.setFilter();
      return;
    }

    this.spinner = true;

    this.chartDataFilterPayload = {
      'years': this.getYearFilterForReportData(),
      'projects': this.getIdsFromFilterData(projects),
    };

    this.resourceUtilizationService
      .getProjectEstimatedVsActualData(this.chartDataFilterPayload)
      .subscribe(
        (response) => {
          this.spinner = false;
          this.estimatedVsActualData = response.EstVsActualData;
          this.excelData = this.estimatedVsActualData.slice(0);
          this.setGridRowData();
          this.sanitizeRows();
          this.transformTabularDataToHierarchical();
          this.setColumnDefs();
          this.populateChartDatasets();
          this.isGridModeOn ? this.populateGrid() : this.drawChart();
        },
        this.dataFetchErrorHandler
      );
    this.setFilter();
  }

  onYearChange() {
    this.getEstimatedVsActualData(this.selectedProjects);
  }

  onCompareToggle() {
    this.isCompareOn = !this.isCompareOn;
    this.setFilter();
    this.isCompareOn && this.isGridModeOn ? this.populateGrid() : this.drawChart();
  }

  onGridToggle() {
    this.isGridModeOn = !this.isGridModeOn;

    if (this.isGridModeOn) {
      this.autoSizeGrid(undefined, true);
    } else {
      this.drawChart();
    }

    this.setFilter();
  }

  populateGrid() {
    this.isPageLoaded.emit(true);
  }

  drawChart() {

    if (this.projectEstimatedVsActualChart) {
      this.projectEstimatedVsActualChart.destroy();
    }

    this.setDatasetsInChartOptions();
    this.projectEstimatedVsActualChart = new Chart(
      'projectEstimatedVsActualChart', this.chartOptions
    );

    this.isPageLoaded.emit(true);
  }

  /* Removes rows where all 4 cost and hours,
   * estimated and actual data is 0
   * and employee types will be converted to upper case.
   * */
  sanitizeRows() {

    this.estimatedVsActualData = this
      .estimatedVsActualData
      .map(eachRow => {
        eachRow['Emp_Level'] = eachRow['Emp_Level'].toUpperCase();
        return eachRow;
      })
      .filter(eachRow => {
        return eachRow['Estimated_Cost'] !== 0
          || eachRow['Project_Cost'] !== 0
          || eachRow['Estimated_Hours'] !== 0
          || eachRow['Billed_Hours'] !== 0;
      });
  }

  /* this method transforms the tabular data received from server to a hierarchical format
   * this makes it easy to pass data to new Chart() */
  transformTabularDataToHierarchical() {
    const years = [Number(this.selectedYear)];

    this.employeeTypes = new Set();
    for (const row of this.estimatedVsActualData) {
      this.employeeTypes.add(row['Emp_Level']);
    }

    this.hierarchicalData = {};

    for (const eachYear of years) {
      const singleYearData = {};

      this.employeeTypes.forEach((eachType) => {
        singleYearData[eachType] = {
          estimatedCost: this.getZeroFilledArray(),
          actualCost: this.getZeroFilledArray(),
          estimatedHours: this.getZeroFilledArray(),
          actualHours: this.getZeroFilledArray()
        };
      });

      this.hierarchicalData[eachYear] = singleYearData;
    }

    let monthIndex;
    let dataObj;
    for (const eachRow of this.estimatedVsActualData) {
      monthIndex = Number(eachRow['Month']) - 1;

      dataObj = this.hierarchicalData
        [eachRow['Year']]
        [eachRow['Emp_Level']];

      dataObj.estimatedCost[monthIndex] += eachRow['Estimated_Cost'];
      dataObj.actualCost[monthIndex] += eachRow['Project_Cost'];
      dataObj.estimatedHours[monthIndex] += eachRow['Estimated_Hours'];
      dataObj.actualHours[monthIndex] += eachRow['Billed_Hours'];
    }
  }

  setDatasetsInChartOptions() {
    // setting datasets into chart options
    let datasetType: string;
    if (this.isCompareOn) {
      datasetType = 'hoursDatasets';
    } else {
      datasetType = 'costDatasets';
    }
    this.chartOptions.data.datasets = this
      .chartDatasets[this.selectedYear][datasetType];
  }

  getDatasetData(year: any, type: any) {
    return this.estimatedVsActualData
      .filter((item: any) => item.Year === year)
      .map((item: any) => item[type]);
  }

  populateChartDatasets() {
    for (const year of Object.keys(this.hierarchicalData)) {
      this.chartDatasets[year] = {
        costDatasets: [],
        hoursDatasets: []
      };

      // a temporary object to populate the datasets for each type of chart
      // cost and hours
      const obj = {
        cost: {
          estimated: {
            costProperty: 'estimatedCost',
            colorProperty: 'previous',
            labelShort: 'EST'
          },
          actual: {
            costProperty: 'actualCost',
            colorProperty: 'current',
            labelShort: 'ACT'
          }
        },
        hours: {
          estimated: {
            hoursProperty: 'estimatedHours',
            colorProperty: 'previous',
            labelShort: 'EST'
          },
          actual: {
            hoursProperty: 'actualHours',
            colorProperty: 'current',
            labelShort: 'ACT'
          }
        }
      };

      let costIndex = 0;
      let hoursIndex = 0;
      let eachCostDataset;
      let eachHoursDataset;
      for (const empType of Object.keys(this.hierarchicalData[year])) {
        for (const eachKey of ['estimated', 'actual']) {

          const propertiesObj = obj.cost[eachKey];

          eachCostDataset = {
            data: this.hierarchicalData[year][empType][propertiesObj.costProperty],
            label: `${year}-${propertiesObj.labelShort}-${empType}`,
            backgroundColor: COLOR_PALETTES[propertiesObj.colorProperty][costIndex]
          };

          this.chartDatasets[year].costDatasets.push(eachCostDataset);
        }

        for (const eachKey of ['estimated', 'actual']) {

          const propertiesObj = obj.hours[eachKey];

          eachHoursDataset = {
            data: this.hierarchicalData[year][empType][propertiesObj.hoursProperty],
            label: `${year}-${propertiesObj.labelShort}-${empType}`,
            backgroundColor: COLOR_PALETTES[propertiesObj.colorProperty][hoursIndex]
          };

          this.chartDatasets[year].hoursDatasets.push(eachHoursDataset);
        }

        costIndex++;
        hoursIndex++;
      }
    }
  }

  /* returns currently selected year or current and previous year */
  getYearFilterForReportData() {

    let currentYear: number;

    if (!this.selectedYear) {
      currentYear = this.maxYear;
    } else {
      currentYear = Number(this.selectedYear);
    }

    return [currentYear];
  }

  dataFetchErrorHandler(error) {
    this.spinner = false;
    this.toastrService.error('Error occurred while getting projects data!');
  }

  getIdsFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray && objArray.length > 0 ? objArray.map(eachObj => eachObj.id) : [];
  }

  getItemNamesFromFilterData(objArray: DropdownFilterDataModel[]) {
    return objArray && objArray.length > 0 ? objArray.map(eachObj => eachObj.itemName) : [];
  }

  setColumnDefs() {
    if (this.columnDefs === undefined && this.estimatedVsActualData.length > 0) {

      this.columnDefs = Object.keys(this.estimatedVsActualData[0])
        .map(eachColumnName => {
          const singleColumnDef = {
            field: eachColumnName,
            headerName: eachColumnName.toUpperCase(),
            sortable: true,
            filter: true
          };

          const fieldUpper = singleColumnDef.field.toUpperCase();

          if (
            fieldUpper === 'YEAR'
            || fieldUpper === 'MONTH'
            || fieldUpper === 'ORG'
            || fieldUpper === 'EMP_LEVEL'
          ) {
            singleColumnDef['pinned'] = 'left';
          }

          if (fieldUpper === 'PROJECT') {
            singleColumnDef['hide'] = true;
          }

          return singleColumnDef;
        });
    }
  }

  /* even when multiple year's data is fetched, grid should only show currently selected year's data */
  setGridRowData() {
    this.gridRowData = this.estimatedVsActualData
      .filter(eachRow => eachRow.Year == this.selectedYear);
  }

  onRefresh() {
    this.maxYear = moment().year();
    this.minYear = this.maxYear - 1;
    this.selectedYear = moment().year();
    this.getProjectsData();
  }

  onSelectDeselectAll(item: any, selectModelName: any) {
    this[selectModelName] = item;
  }

  onClose(event: any): void {
    let { target } = event;
    let count = 5;
    let eleFound = '';
    while (
      target.parentElement
      && (target.parentElement.nodeName.toLowerCase() !== 'body' || target.parentElement.id !== 'modal-container')
      && count > 0
    ) {
      if (
        target.id.includes('mdd')
        || (target.parentElement && target.parentElement.id.includes('mdd'))
      ) {
        eleFound = target.id.includes('mdd')
          ? target.id
          : (target.parentElement.id.includes('mdd')
            ? target.parentElement.id
            : '').split('mdd')[1].toLowerCase();
        break;
      }
      target = target.parentElement;
      count--;
    }
    if (!eleFound) {
      this.getData();
      this.lastChanedDd = '';
    } else if (eleFound !== this.lastChanedDd) {
      this.getData();
      this.lastChanedDd = eleFound;

    }
  }

  getData(): void {
    if (
      this.lastChanedDd === 'project'
      || (this.selectedProjects && this.selectedProjects.length === 0)
    ) {
      this.getEstimatedVsActualData(this.selectedProjects);
    }
  }

  onExportToExcel() {
    const fileName = 'project_estimated_vs_actual_';

    const dataToExport = this.excelData
      // tslint:disable-next-line:triple-equals
      .filter(each => each.Year == this.selectedYear)
      .map(each => Object.assign({}, each))
      .map(each => {
        each['Month'] = MONTHS_MAP[each['Month']];
        return each;
      });

    if (dataToExport && dataToExport.length > 0) {
      this.exportFileService.exportAsExcelFile(dataToExport, fileName);
    } else {
      this.toastrService.error('Oops! No data to export to excel.');
    }
  }

  setFilter() {
    const obj = {
      'project': this.selectedProjects,
      'projectData': this.projectsData,
      'compare': this.isCompareOn,
      'grid': this.isGridModeOn,
      'year': this.selectedYear
    };

    this.gridService.setFilters(obj);
  }

  getZeroFilledArray(size: number = 12) {
    const array = new Array(size);
    array.fill(0);

    return array;
  }

  /* Sometimes we need to call autosize asynchronously
   * because grid won't have loaded yet. */
  autoSizeGrid(event, async= false) {
    if (this.isGridModeOn) {
      if (async) {
        setTimeout(() => {
          this.gridOptions.columnApi.autoSizeAllColumns(false);
        }, 0);
      } else {
        this.gridOptions.columnApi.autoSizeAllColumns(false);
      }
    }
  }
}

class DropdownFilterDataModel {
  id: any;
  itemName: any;
}

class ChartDataModel {
  Year: number;
  Month: string;
  count: number;
  Mon: string;
}
