import { Component, OnInit } from '@angular/core';
import {BuildHistoryService} from '../shared/services/build-history.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonUtilities} from '../shared/utilities';

declare var $: any;

@Component({
  selector: 'app-build-history',
  templateUrl: './build-history.component.html',
  styleUrls: ['./build-history.component.css'],
  providers: [BuildHistoryService]
})
export class BuildHistoryComponent implements OnInit {

  // true means ascending, false means descending
  sortFlags = {
    // backend sends data sorted by buildDate desc
    buildDate: false,
    buildType: true,
    isDeployed: true,
  };

  buildHistoryRows: any = [];
  selectedRow: any;
  currentPage: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private buildHistoryService: BuildHistoryService,
    private toastrService: ToastrService,
    private commonUtilities: CommonUtilities
  ) { }

  ngOnInit() {
    this.showLoadingModal();
    this.buildHistoryService
      .getAll()
      .subscribe(
         (response: any[]) => {
          this.hideLoadingModal();
          for (const eachRow of response) {
            eachRow.isDeployed = eachRow.isDeployed ? 'Yes' : 'No';
          }
          this.buildHistoryRows = response;
        },
        error => {
          this.hideLoadingModal();
          this.toastrService.error(
            error.errorMessage
            || 'Error Occurred While Fetching Total Builds History.'
          );
        }
      );
  }

  sortByRow(rowName) {
    this.sortFlags[rowName] = !this.sortFlags[rowName];

    this.commonUtilities.
      sortArrayOfObjectsByProperty(
        this.buildHistoryRows,
        rowName,
        this.sortFlags[rowName]
    );
  }

  onRowClick(selectedRow) {
    this.selectedRow = selectedRow;
  }

  onRowDoubleClick(selectedRow) {
    this.router.navigate(
      [`/build-history/edit-build/${selectedRow.buildId}`],
      { relativeTo: this.route }
    );
  }

  resetSelectedRow() {
    this.selectedRow = undefined;
  }

  navigateToCreateBuild() {
    this.router.navigate(
      ['/build-history/new-build'],
      { relativeTo: this.route }
    );
  }

  navigateToEditBuild() {
    if (this.selectedRow) {
      this.onRowDoubleClick(this.selectedRow);
    }
  }

  showLoadingModal() {
    $('#loadingModal').modal('show');
  }

  hideLoadingModal() {
    $('#loadingModal').modal('hide');
  }
}
