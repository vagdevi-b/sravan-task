import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {
  pager: any;
  _list: any = [];
  @Input() parentPage: string;
  @Input() parentComponent: any;
  @Output() readonly emiter = new EventEmitter<any>();
  recordsPerPage = 10;
  pagedItems: any[] = [];

  constructor(
    private paginationService: PaginationService
  ) {
  }

  ngOnInit() {
  }

  get list(): any {
      return this._list;
  }
  @Input('list')
  set list(value: any) {
      this._list = value;
      this.setPage(1);
  }



  setPage(page: number): void {
    if (this.list && this.list.length) {
      this.pager = this.paginationService.getPager(
        this.list.length,
        page,
        this.recordsPerPage
      );
      this.pagedItems = this.list.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.emiter.emit(this.pagedItems);
    }

  }
}
