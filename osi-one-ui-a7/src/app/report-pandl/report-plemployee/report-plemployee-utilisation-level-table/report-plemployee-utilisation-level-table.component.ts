import { Component, Input, OnInit } from '@angular/core';
import { PandlService } from '../../../shared/services/pandl.service';

@Component({
  selector: 'app-report-plemployee-utilisation-level-table',
  templateUrl: './report-plemployee-utilisation-level-table.component.html',
  styleUrls: ['../../../../../src/assets/css/light.css'],
})
export class ReportPlemployeeUtilisationLevelTableComponent implements OnInit {
  utilByLevelsGridData: any[] = [];
  utilByLevelsGridColumns: any[] = [];
  utilByLevelsObj: any = {};
  utilByLevelsRowData: any[];
  yearMonths: any = [];
  uniqueYearMonths: any = [];
  chartData: any[] = [];
  jobCodes: any[] = [];
  uniquejobCodes: any[] = [];
  utilByLevelsColumnDefs: any = [];

  @Input('rawData')
  set setRawData(value: any) {
    this.chartData = [];
    this.utilByLevelsGridData = [];
    this.utilByLevelsGridColumns = [];
    if (value) {
      this.chartData = value;
    }
    this.getdata();
  }

  constructor(
    private pAndlService: PandlService
  ) { }

  ngOnInit() {
  }

  getdata(): void {
    if (this.chartData) {
      this.getBasicDetails();
      this.utilByLevelsGrid();
    }
  }

  getBasicDetails(): void {
    this.yearMonths = this.pAndlService.getUniqueDataAfterFilter(this.chartData, 'yearmonth');
    this.uniqueYearMonths = this.yearMonths && this.yearMonths.length ? this.yearMonths.map((ele: any) => { return ele.yearmonth }) : [];
    this.jobCodes = this.pAndlService.getUniqueDataAfterFilter(this.chartData, 'Job_Code');
    this.uniquejobCodes = this.jobCodes && this.jobCodes.length ? this.jobCodes.map((ele: any) => { return ele.Job_Code }) : [];
  }

  utilByLevelsGrid() {
    this.utilByLevelsGridData = [];
    this.utilByLevelsGridColumns = [];

    //console.log(uniquejobCodes);
    for (let i = 0; i < this.uniqueYearMonths.length; i++) {
      this.utilByLevelsObj['YearMonth'] = this.uniqueYearMonths[i];
      for (let j = 0; j < this.uniquejobCodes.length; j++) {
        let obj = {
          "yearmonth": this.uniqueYearMonths[i],
          "Job_Code": this.uniquejobCodes[j]
        }

        let yearMonthLevelData = [];
        yearMonthLevelData = this.pAndlService.filterArray(this.chartData, obj);
        let utilization = 0;
        let billableHoursSum = 0;
        let nonBillableHoursSum = 0;
        let internalHoursSum = 0;
        let ptoHoursSum = 0;
        let holidayHoursSum = 0;
        for (let k = 0; k < yearMonthLevelData.length; k++) {
          billableHoursSum = billableHoursSum + yearMonthLevelData[k].billable_hours;
          nonBillableHoursSum = nonBillableHoursSum + yearMonthLevelData[k].non_billable_hours;
          internalHoursSum = internalHoursSum + yearMonthLevelData[k].internal_hours;
          ptoHoursSum = ptoHoursSum + yearMonthLevelData[k].pto_hours;
          holidayHoursSum = holidayHoursSum + yearMonthLevelData[k].holiday_hours;
        }
        let totalhours = billableHoursSum + nonBillableHoursSum + internalHoursSum + holidayHoursSum + ptoHoursSum;
        utilization = this.pAndlService.roundTo((billableHoursSum / totalhours) * 100, 2);
        if (!isFinite(utilization)) {
          utilization = 0;
        }
        this.utilByLevelsObj[this.uniquejobCodes[j].toString()] = utilization;


      }
      this.utilByLevelsGridData.push(this.utilByLevelsObj);
      this.utilByLevelsObj = {};

    }
    this.utilByLevelsColumnDefs = this.pAndlService.generateColumns(this.utilByLevelsGridData);
    this.utilByLevelsGridColumns = this.utilByLevelsColumnDefs.map(x => x.field);
  }

}
