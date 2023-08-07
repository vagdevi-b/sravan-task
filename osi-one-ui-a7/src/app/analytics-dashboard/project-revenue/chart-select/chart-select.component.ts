import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartService } from '../services/chart.service';


@Component({
  selector: 'app-chart-select',
  templateUrl: './chart-select.component.html',
  styleUrls: ['./chart-select.component.css']
})
export class ChartSelectComponent implements OnInit {

  @ViewChild('dataSelect')
  dataSelect: ElementRef;

  @ViewChild('plotTypeSelect')
  plotTypeSelect: ElementRef;

  @Input()
  plotType: string;

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
  }

  onFilterChange() {

    if (this.dataSelect.nativeElement.value !== '') {

      this.chartService.renderNewChart(
        this.dataSelect.nativeElement.value,
        this.plotType
      );
    }

    else {
      console.log('select value is empty');
    }
  }


}
