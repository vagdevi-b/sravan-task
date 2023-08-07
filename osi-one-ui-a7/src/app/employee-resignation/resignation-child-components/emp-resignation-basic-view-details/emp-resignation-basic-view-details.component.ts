import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-emp-resignation-basic-view-details',
  templateUrl: './emp-resignation-basic-view-details.component.html',
  styleUrls: ['./emp-resignation-basic-view-details.component.css']
})
export class EmpResignationBasicViewDetailsComponent implements OnInit {
  @Input() basicDetails: any;
  rowdata: any;
  constructor() { }

  ngOnInit() {
    this.rowdata = this.basicDetails;
  }

}
