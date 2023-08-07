import { Component, OnInit } from '@angular/core';
import { ResourceUtilizationService } from '../shared/services/resource-utilization.service';
declare var $: any;

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.css']
})
export class AccountManagerComponent implements OnInit {

  constructor(private resource: ResourceUtilizationService) { }

  accountManagerData = [];
  page: Number = 1;
  cnt: Number = 10;
  searchString : String = '';

  ngOnInit() {
    this.getAccountManagerData();
  }

  getAccountManagerData(){
    $('#loadingInvoiceDetailsModal').modal('show');
    this.resource.getAccountManagerDashboardData().subscribe(response => {
      this.accountManagerData = response;
      $('#loadingInvoiceDetailsModal').modal('hide');
    });
  }
}
