import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../loading/loading.component';
import { AgGridModule } from 'ag-grid-angular';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbDateFormatPipe } from '../../pipes/date-format/ngb-date-format.pipe';
import { OrderModule } from 'ngx-order-pipe';
import { PaginationComponent } from '../../directives/pagination/pagination.component';
import { SearchPipe } from '../../pipes/search.pipe';
import { OsiInputMonthPicker } from '../osi-month-picker/osi-month-picker-input.directive';
import { OsiMonthPickerComponent } from '../osi-month-picker/osi-month-picker.component';
import { EmployeeSearchInputDirective } from '../employee-search/employee-search-input.directive';
import { EmployeeSearchComponent } from '../employee-search/employee-search.component';
import { LeaveRequestService } from '../../services/leaveRequest.service';
import { DecimalDirective } from '../../utilities/decimal.directive';
import { Decimal3Directive } from '../../utilities/decimal3.directive';
import { BookFilterPipe } from '../../pipes/book-filter.pipe';
import { MillionFormatterPipe } from '../../pipes/million-formatter.pipe';
import { NumberOnlyDirective } from '../../utilities/number-only.directive';
import { TableListComponent } from '../table-list/table-list.component';
import { ShowHideDirective } from '../../directives/show-hide.directive';
import { CanvasChartComponent } from '../canvas-chart/canvas-chart.component';
import { ShortNumberhPipe } from '../../pipes/short-number.pipe';
import { GridWidgetComponent } from '../grid-widget/grid-widget.component';
import { DataTableExternalComponent } from '../data-table-external/data-table-external.component';
import { DataTablesModule } from 'angular-datatables';
import { RouterModule } from '@angular/router';
import { LocalStringPipe } from '../../pipes/local-string.pipe';

@NgModule({
  declarations: [
    LoadingComponent,
    PaginationComponent,
    TableListComponent,
    NgbDateFormatPipe,
    SearchPipe,
    OsiMonthPickerComponent,
    OsiInputMonthPicker,
    EmployeeSearchComponent,
    EmployeeSearchInputDirective,
    DecimalDirective,
    Decimal3Directive,
    MillionFormatterPipe,
    NumberOnlyDirective,
    BookFilterPipe,
    ShowHideDirective,
    CanvasChartComponent,
    ShortNumberhPipe,
    GridWidgetComponent,
    DataTableExternalComponent,
    LocalStringPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    BsDatepickerModule.forRoot(),
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule,
    OrderModule,
    DataTablesModule,
    RouterModule
  ],
  exports: [
    LoadingComponent,
    PaginationComponent,
    TableListComponent,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    BsDatepickerModule,
    NgMultiSelectDropDownModule,
    NgbModule,
    NgxPaginationModule,
    NgbDateFormatPipe,
    OrderModule,
    SearchPipe,
    OsiMonthPickerComponent,
    OsiInputMonthPicker,
    EmployeeSearchComponent,
    EmployeeSearchInputDirective,
    DecimalDirective,
    Decimal3Directive,
    MillionFormatterPipe,
    NumberOnlyDirective,
    BookFilterPipe,
    ShowHideDirective,
    CanvasChartComponent,
    ShortNumberhPipe,
    GridWidgetComponent,
    DataTableExternalComponent,
    RouterModule,
    LocalStringPipe
  ],
  entryComponents: [
    LoadingComponent,
    OsiMonthPickerComponent,
    EmployeeSearchComponent
  ],
  providers: [
    LeaveRequestService
  ]
})
export class SharedComponentsModule { }
