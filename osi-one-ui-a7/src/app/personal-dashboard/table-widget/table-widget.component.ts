import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.css']
})
export class TableWidgetComponent implements OnInit {
  @Input() config;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('at table component-----', this.config);
  }

  onRowClick(config, item) {
    console.log('config------', config, item);
    const { widget: { name } } = config;
    const { leaveId, reportid } = item;
    if (name === 'Leaves To Approve') {
      this.router.navigate([`leaves/approve-leave/appliedleaves/${leaveId}`])
    } else if(name === 'Expenses to Approve') {
      this.router.navigate([`/expenses/manager-approve/${reportid}`]);
    }
  }

  onCellClick(config, item) {
    const { widget: { name }, weekStartDate } = config;
    const { projectId } = item;
    if(name === 'Weekly Project Status') {
      this.router.navigate([`projects/addactivities/${projectId}/${weekStartDate}`]);
    }
   
  }

}
