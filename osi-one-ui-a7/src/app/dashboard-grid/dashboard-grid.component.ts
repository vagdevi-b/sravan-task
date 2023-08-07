import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, Injector, ChangeDetectorRef } from '@angular/core';
import { Dashboard } from './grid.module';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GridService } from './grid.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsModalComponent } from './reports-modal/reports-modal.component';
import { ModalOptions } from 'ngx-bootstrap';
import { WidgetListComponent } from './widget-list/widget-list.component';
import { AppConstants } from '../shared/app-constants';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-grid',
  templateUrl: './dashboard-grid.component.html',
  styleUrls: ['./dashboard-grid.component.css']
})
export class DashboardGridComponent implements OnInit, OnDestroy {
  userInfo$: any;
  @ViewChild('toolBarRef') toolBarRef: ElementRef;
  @ViewChild('checkRef') checkRef: ElementRef;
  dashboard: Dashboard;
  size: {}[];
  openModalStatus: false;
  externalSubscription: Subscription[] = [];
  dashboardDirty: boolean;
  toolbarDirty: boolean;
  dashboardClone: Dashboard;
  popUpItems: any[];
  @ViewChild('modalClose') modalClose: ElementRef;
  @ViewChild('modalOpen') modalOpen: ElementRef;
  isDashboard: boolean;
  clienCode: any;
  userEmail: string;
  privilege_codes: any;
  myPrivilegeKeys: any[];
  isNotif: boolean;
  userType: string;
  userId: any;
  inc = 0;
  userRole$: any;
  innerWidth = window.innerWidth;
  searchText: any;
  calenderDropDownData: any;
  activeTab = 1;
  dropDownValue: string;
  ImageData: Subscription;
  dbwidgets = 0;
  dashboardImages = AppConstants.dashboardImages;
  spinner: boolean;
  itemsTable: Array<any[]>;
  temp: Array<any[]>;

  constructor(
    private router: Router,
    private gridService: GridService,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    private injector: Injector,
    private toasterService: ToastrService
  ) {
  }

  @HostListener('window:resize', ['$event']) onResize(_event: any): void {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getAllWidgets();
    this.ImageData = this.gridService.getThumbnail().subscribe(res => {
      if (res && res.image) {
        this.dashboard[res.idx]['imageUrl'] = res.image;
      }
    });
  }

  openWidList(): void {
    const wList = this.modalService.open(WidgetListComponent, {
      // windowClass: 'modal-right',
      backdrop: 'static',
      injector: Injector.create([{
        provide: ModalOptions,
        useValue: {
          data: this.dashboard,
          dashBoardType: 'Analytics'
        }
      }], this.injector)
    });
    wList.result.then(resp => {
      if (resp) {
        this.getAllWidgets();
      }
    });
    this.modal.close();
  }

  getWidgetName(name: string) {
    const uid = localStorage.getItem('userId');
    name = (name).replace(/ /g, '');
    return `${this.dashboardImages}${name}_${uid}.png`;
    // `${this.dashboardImages}${name}_${uid}.png`;
  }

  openModal(widget: any, index): void {
    const modalRef = this.modalService.open(ReportsModalComponent, {
      centered: true, backdrop: 'static',
      windowClass: 'CustomModalClass',
      injector: Injector.create([{
        provide: ModalOptions,
        useValue: {
          data: { ...widget, index }
        }
      }], this.injector)
    });
  }

  closeModal(): void {
    this.modal.close();
  }

  getAllWidgets(): void {
    this.spinner = true;
    this.gridService.getEmpWidgets().subscribe(
      (res) => {
        this.spinner = false;
        if (res) {
          this.dbwidgets = 0;
          res.forEach((a) => {
            a.imageUrl = (a && a.widget && a.widget.name) ? this.getWidgetName(a.widget.name) : '';
            if (a.isVisible) {
              this.dbwidgets += 1;
            }
          });
          this.dashboard = res;
          this.dashboardClone = res;
        }
      },
      (err) => {
        this.spinner = false;
      });
  }

  generateItemsForSettings(): void {
    this.popUpItems = [];
    let emptyColumns = 0;
    let hasBanner = false;
    let oneWidgetVisible = false;
    Object.keys(this.dashboard).forEach(col => {
      if (typeof this.dashboard[col] === 'object') {
        if (this.dashboard[col].length > 0) {
          this.dashboard[col].filter(widget => widget.type !== 'banner' && widget.type !== 'noItem').forEach(widget => this.popUpItems.push(widget));
          this.dashboard[col].forEach(widget => {
            if (widget.is_visible && widget.type !== 'banner') {
              oneWidgetVisible = true;
            }
            if (widget.type === 'banner') {
              hasBanner = true;
            }
          });
        } else {
          emptyColumns++;
        }
      }
    });
    if (emptyColumns > 2 || (hasBanner && emptyColumns === 2) || !oneWidgetVisible) {
      this.dashboard['col1'].push({
        is_visible: true,
        name: '',
        seq_num: 1,
        status: true,
        type: 'noItem',
        widget_setting: {
          enable_settings: '',
          is_maximizable: false,
          is_minimizable: false,
          is_movable: false,
          is_resizable: false,
          is_closable: true,
          id: 0
        }
      });
    }
    this.popUpItems.sort((a, b): number => {
      if (a.id > b.id) { return 1; }
      if (a.id < b.id) { return -1; }
      if (a) { return 1; }
      if (b) { return -1; }
    });
  }

  boxWidth = 400;
  columnSize: number;

  items: Array<any[]>;

  initTable() {
    this.items = this.temp.filter((item) => {
      return item && item['isVisible'] == true;
    });
    this.itemsTable = this.items
      .filter((_, outerIndex) => outerIndex % this.columnSize == 0)
      .map((
        _,
        rowIndex
      ) =>
        this.items.slice(
          rowIndex * this.columnSize,
          rowIndex * this.columnSize + this.columnSize
        )
      );
  }

  getItemsTable(rowLayout: Element): number[][] {
    const { width } = rowLayout.getBoundingClientRect();
    const columnSize = Math.round(width / this.boxWidth);
    if (columnSize != this.columnSize) {
      this.columnSize = columnSize;
      this.initTable();
    }
    return this.itemsTable;
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.dashboard = this.itemsTable.reduce(
      (previous, current) => previous.concat(current),
      []
    );

    this.initTable();
  }

  updateSequenceNum(fromColumn: number, toColumn: number): void {
    this.dashboard['col' + fromColumn].forEach((widget, index) => widget.seq_num = index + 1);
    if (fromColumn !== toColumn) {
      this.dashboard['col' + toColumn].forEach((widget, index) => widget.seq_num = index + 1);
    }

  }

  close(count: any, array: any, i: number): any {
    if (count && count.is_visible) {
      count.is_visible = false;
    } else if (count) {
      count.is_visible = true;
    }
    array[i].is_visible = count.is_visible;
    this.dashboardDirty = true;
    this.generateItemsForSettings();
    // this.store.dispatch(new SaveDashboard(this.dashboard));
  }

  search(text: string): void {
    this.searchText = text.trim();
  }

  calendardata(event: any): void {
    if (event && event.length) {
      this.calenderDropDownData = event;
      if ((this.dropDownValue && !this.calenderDropDownData.find(cddd => cddd === this.dropDownValue)) || !this.dropDownValue) {
        this.dropDownValue = this.calenderDropDownData[0];
      }
    }
  }

  calenderView(dropDownText: string): void {
    // this.commonDashboardService.setDropDown(dropDownText);
  }

  topNav(widget: any): void {
    if (widget && widget.name === 'Onboarding') {
      this.router.navigate([widget.preferences.header.action1]);
    }
  }

  tabClicked(val: number): void {
    this.activeTab = val;
    // this.baseService.setTabActive(val);
  }

  removeWidget(wid: any): void {
    //  this.dashboard.splice(wid, 1);
    const payload = {
      "widgetCol": wid.widgetCol,
      "seqNum": wid.seqNum,
      "isVisible": false,
      "widget": {
        "id": wid.widget.id
      },
      "id": wid.id
    }
    this.spinner = true;
    this.gridService.createWidget(payload).subscribe((res) => {
      this.spinner = false;
      this.getAllWidgets();
    },
      (err) => {
        this.spinner = false;
        this.toasterService.error('Error removing widget');
      });

  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  ngOnDestroy(): void {
    this.ImageData.unsubscribe();
    this.externalSubscription.forEach(subscription => subscription ? subscription.unsubscribe() : '');
  }
}
