import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { OsiIsrEventEntriesDTO } from '../shared/models/isr-event-definitions.model';
import { IsrEventDefinitionsService } from '../shared/services/isr-event-definitions/isr-event-definitions.service';

declare var $: any;

@Component({
  selector: 'app-isr-event-report',
  templateUrl: './isr-event-report.component.html',
  styleUrls: ['./isr-event-report.component.css']
})
export class IsrEventReportComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  eventType = '';
  startDate;
  startDateMax;
  endDateMin;
  endDate;
  today;
  eventEntriesList: OsiIsrEventEntriesDTO[] = [];
  crntpage: number;
  eventTypes = [
    {
      'name': 'BOUNCED MAILS',
      'value': 'BOUNCED_MAILS'
    },
    {
      'name': 'UNSUBSCRIBED MAILS',
      'value': 'UNSUBSCRIBED_MAILS'
    },
  ];

  constructor(
    config: NgbDatepickerConfig,
    private isrEventDefinitionsService: IsrEventDefinitionsService,
    private toastrService: ToastrService,
    private datePipe: DatePipe
  ) {
    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
    });
    this.today=new Date();
  }

  ngOnInit() {
    this.startDateMax = this.today;
  }

  onEndDateChange(): void {
    if (this.endDate) {
      this.startDateMax = new Date(this.endDate);
    } else {
      this.startDateMax = this.today;
    }
  }

  onStartDateChange(): void {
    if (this.startDate) {
      this.endDateMin = new Date(this.startDate);
    }
  }

  searchDataByFilter(): void {
    if (!this.eventType || !this.startDate || !this.endDate) {
      this.toastrService.warning('Please fill all the fields');
    } else {
      $('#eventEntriesReportLoadingModal').modal('show');
      this.eventEntriesList = [];
      this.isrEventDefinitionsService.getEventEntriesReport(this.eventType,
        this.datePipe.transform(new Date(this.startDate), 'yyyy-MM-dd'),
        this.datePipe.transform(new Date(this.endDate), 'yyyy-MM-dd'))
        .subscribe((res: OsiIsrEventEntriesDTO[]) => {
        if (res.length) {
          this.eventEntriesList = res;
        }
        $('#eventEntriesReportLoadingModal').modal('hide');
      }, (errorResponse) => {
        $('#eventEntriesReportLoadingModal').modal('hide');
        this.toastrService.error(errorResponse);
      })
    }
  }

  clearSearch(): void {
    this.eventType = '';
    this.startDate = '';
    this.endDate = '';
    this.startDateMax = this.today;
    this.endDateMin = new Date(this.startDate);
    this.eventEntriesList = [];
  }

  onChangeEventType(event: any): void {
    this.eventEntriesList = [];
  }

}
