import { Component, HostListener, Input, OnInit } from '@angular/core';
import { PaginationService } from '../../services/pagination.service';
import { RequistionsService } from '../../services/requistions.service';

@Component({
  selector: 'app-data-table-external',
  templateUrl: './data-table-external.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class DataTableExternalComponent implements OnInit {
  inputDetails: any = {};
  dtOptions: DataTables.Settings = {};
  gridData: any[] = [];
  displayList: any[] = [];
  gridTotals: any = {}
  gridFooterList: any[] = [];
  pageNumber = 0;

  pager: any;
  @Input() gridColumns: any[] = [];
  sortType: string;
  selectedHeaderTh: string;
  isFullScreenReq: boolean = false;
  @Input('details')
  set setDetails(value: any) {
    this.inputDetails = value;
    this.extractDetailsFromInput();
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if ((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) && this.pageNumber <= this.pager.totalPages) {
      this.updateAndSetPage();
    }
  }
  constructor(
    private paginationService: PaginationService,
    protected requistionSvc: RequistionsService
  ) { }

  extractDetailsFromInput(): void {
    this.gridData = [];
    this.displayList = [];
    this.gridFooterList = [];
    if (this.inputDetails) {
      this.isFullScreenReq = this.inputDetails['isFullScreenReq'] ? this.inputDetails['isFullScreenReq'] : false;
      if (this.inputDetails['dataHeaders'] && this.inputDetails['dataHeaders'].length) {
        // this.isNormalTable = true;
        this.gridColumns = this.inputDetails['dataHeaders'];
        this.gridColumns = this.gridColumns.map((column: any) => {
          return {
            dispalyName: column,
            key: column
          }
        })
      } else {
        // this.isNormalTable = true;
        this.gridFooterList = this.inputDetails['dataTotals'] && Object.keys(this.inputDetails['dataTotals']).length ?
          Object.keys(this.inputDetails['dataTotals']).map(key => ({ type: key, value: this.inputDetails['dataTotals'][key] })) : []
      }
      this.gridData = this.inputDetails['dataList'];
      if (this.gridData.length) {
        this.pageNumber = 0;
        this.updateAndSetPage();
      }
      this.setDtOptions();
    }
  }

  updateAndSetPage(): void {
    this.pageNumber = this.pageNumber + 1;
    this.setPage(this.pageNumber, this.gridData);

  }

  ngOnInit() {

  }

  setDtOptions(): void {
    this.dtOptions = {
      "paging": false,
      "searching": false,
      "info": false
    }
  }

  setPage(page: number, originalDataList: any[]): void {
    let list = [];
    if (originalDataList && originalDataList.length) {
      this.pager = this.paginationService.getPager(
        originalDataList.length,
        page,
        40
      );
      list = originalDataList.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
    }
    list.forEach(element => {
      this.displayList.push(element);
    });


  }

  getClass(field): any {
    return this.requistionSvc.getClass(
      field,
      this.sortType,
      this.selectedHeaderTh
    );
  }

  sort(sortKey: any): void {
    // $('#loadingEditSubmitModal').modal('show');
    let sortResult: any;
    this.selectedHeaderTh = sortKey;
    sortResult = this.requistionSvc.sort(sortKey, this.gridData, this.sortType);
    this.gridData = sortResult['result'];
    this.sortType = sortResult['sortType'];
    this.pageNumber = 0;
    this.displayList = [];
    this.updateAndSetPage();
    // $('#loadingEditSubmitModal').modal('hide');
    // if (this.pagination) {
    //   this.pagination.setPage(1);
    // }
  }


}
