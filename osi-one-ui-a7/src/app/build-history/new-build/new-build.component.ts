import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonUtilities, HttpUtilities} from '../../shared/utilities';
import {ToastrService} from 'ngx-toastr';
import {BuildHistoryService} from '../../shared/services/build-history.service';
import {FormGroup, NgModel} from '@angular/forms';

declare var $: any;
const MAJOR_BUILD_REGEX = /MAJOR/gi;

@Component({
  selector: 'app-new-build',
  templateUrl: './new-build.component.html',
  styleUrls: ['./new-build.component.css'],
  providers: [BuildHistoryService]
})
export class NewBuildComponent implements OnInit {

  buildMessage: string;
  buildHistory: any;
  buildId: number;

  // heading on the top of the page
  pageHeading: string;

  @ViewChild('createBuildHistoryForm')
  createBuildHistoryForm: FormGroup;

  @ViewChild('buildDate')
  buildDateRef: NgModel;

  readonly DEFAULT_BUILD_TYPE = 'MAJOR';
  readonly DEFAULT_IS_DEPLOYED = false;
  readonly CREATE_HEADING = 'Create Build';
  readonly EDIT_HEADING = 'Edit Build';

  config: AngularEditorConfig = {
    editable: true,
    minHeight: '200px',
    maxHeight: '50vh',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private buildHistoryService: BuildHistoryService,
    private commonUtilities: CommonUtilities
  ) {}

  ngOnInit() {

    this.buildHistory = {};

    this.route.params.subscribe(value => {
      this.buildId = value.buildId;
    });

    if (this.buildId) {
      this.showLoadingModal();
      this.buildHistoryService
        .getBuildHistoryByBuildId(this.buildId)
        .subscribe(
          response => {
            this.hideLoadingModal();
            this.buildHistory = response;

            this.buildHistory.buildDate = this.commonUtilities
              .getObjectFromTimestamp(this.buildHistory.buildDate);
          },
          error => {
            this.hideLoadingModal();
            this.toastrService.error(
              error
              || error.errorMessage
              || 'Error occurred while fetching build details!'
            );
          }
        );
      this.pageHeading = this.EDIT_HEADING;
    }
    else {
      this.buildHistory.buildType = this.DEFAULT_BUILD_TYPE;
      this.buildHistory.isDeployed = this.DEFAULT_IS_DEPLOYED;
      this.pageHeading = this.CREATE_HEADING;
    }
  }

  saveBuildHistory() {
    if (this.validateBuildHistoryForm()) {

      const payload = Object.assign({}, this.buildHistory);

      payload.buildDate = this
          .commonUtilities
          .getTimestampFromObject(payload.buildDate);

      this.showLoadingModal();
      this.buildHistoryService
        .saveBuildHistory(payload)
        .subscribe(
          response => {
            this.hideLoadingModal();
            this.toastrService.success('Build details saved successfully.');
            // no need to reset form since we are navigating to another component.
            // this.createBuildHistoryForm.reset(this.createBuildHistoryForm.value);
            this.goBack();
          },
          error => {
            this.hideLoadingModal();
            this.toastrService.error(
              error.errorMessage
              || 'Error occurred while saving build details.'
            );
          }
        );
    }
  }

  /**
   * Returns true if build history form is valid else false */
  validateBuildHistoryForm() {
    let errorMessage;

    if (
      this.createBuildHistoryForm.invalid
      && this.buildDateRef.invalid
    ) {
      if (this.buildDateRef.errors.required) {
        errorMessage = '"Build Date" is required.';
      }
      else {
        errorMessage = 'Field "Build Date" contains invalid data.';
      }
    }

    if (
      this.buildHistory.buildType.match(MAJOR_BUILD_REGEX)
      && this.buildHistory.isDeployed
      && !this.buildHistory.buildMessage
    ) {
      errorMessage = 'Cannot mark major build as deployed without a build message';
    }

    if (errorMessage) {
      this.toastrService.error(errorMessage);
      return false;
    }
    else {
      return true;
    }
  }

  onBack() {
    if (this.createBuildHistoryForm.touched) {
      $('#unsavedChangesModal').modal('show');
    }
    else {
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(
      ['/build-history'],
      { relativeTo: this.route }
    );
  }

  showBuildMessageModal() {
    $('#buildMessage').modal({backdrop: 'static', keyboard: false});
  }

  showLoadingModal() {
    $('#loadingModal').modal('show');
  }

  hideLoadingModal() {
    $('#loadingModal').modal('hide');
  }
}
