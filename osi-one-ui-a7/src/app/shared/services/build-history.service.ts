import {Injectable} from '@angular/core';
import {HttpUtilities} from '../utilities';
import {AppConstants} from '../app-constants';
import {Observable} from 'rxjs';

@Injectable()
export class BuildHistoryService {
  private readonly appData = AppConstants;
  private readonly buildHistoryApiPath = 'build-history/';

  constructor(
    private httpUtilities: HttpUtilities
  ) {
  }

  getBuildHistoryByBuildId(buildId: number) {
    const url = `${this.appData.appUrl}${this.buildHistoryApiPath}${buildId}`;
    return this.httpUtilities.get(url)
      .catch(this.handleError);
  }

  saveBuildHistory(buildHistory: any) {
    const url = `${this.appData.appUrl}${this.buildHistoryApiPath}save`;
    return this.httpUtilities.post(url, buildHistory)
      .catch(this.handleError);
  }

  getAll() {
    const url = `${this.appData.appUrl}${this.buildHistoryApiPath}getAll`;
    return this.httpUtilities.get(url)
      .catch(this.handleError);
  }

  handleError(error) {
    return Observable.throwError(error.json());
  }
}