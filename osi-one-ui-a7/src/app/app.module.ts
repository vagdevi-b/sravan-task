import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { BlockUIModule } from 'ng-block-ui';
import { UserIdleModule } from 'angular-user-idle';

import {
  SidebarComponent,
  HeaderComponent,
  FooterComponent,
  MegaMenuComponent
} from './page-layout/index';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import { CreateExpenseService } from './shared/services/createexpense.service';
import { EditExpensesService } from './shared/services/editexpense.service';
import { ManagerExpenseService } from './shared/services/manager.expense.service';
import { ManagerApproveExpenseService } from './shared/services/managerapproveexpense.service';
import { ViewExpensesService } from './shared/services/viewexpenses.service';
import { HttpUtilities, CommonUtilities } from './shared/utilities';
import { LandingComponent } from './landing/landing.component';
import { ReportService } from './report/report.service';

import { BookFilterPipe } from './shared/pipes/book-filter.pipe';


import { UploadFileService } from './shared/services/upload-file.service';
import { NumberOnlyDirective } from './shared/utilities/number-only.directive';
import { DecimalDirective } from './shared/utilities/decimal.directive';
import { Decimal3Directive } from './shared/utilities/decimal3.directive';
import { NavigateDataService } from './shared/services/navigateData.service';
import { DepartmentMappingService } from './shared/services/department-mapping.service';
import { ReimburseExpenseService } from './shared/services/reimburseExpense.service';
import { InvoiceServices } from './shared/services/invoice-services.service';
import { ElasticsearchService } from './shared/services/elasticsearchService';
import { ResourceUtilizationService } from './shared/services/resource-utilization.service';

import { UndeliveredInvoicesService } from './shared/services/undelivered-invoices.service';


import { MillionFormatterPipe } from './shared/pipes/million-formatter.pipe';
import { AppraisalService } from './shared/services/appraisal-cycle/appraisal.service';
import { ShowHideDirective } from './shared/directives/show-hide.directive';
import { ToastrModule } from 'ngx-toastr';
import { ExportFileService } from './shared/services/export-file.service';
import { PmoAdminService } from './shared/services/pmo-admin.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularDraggableModule } from 'angular2-draggable';
import { GridService } from './dashboard-grid/grid.service';
import { WidgetListComponent } from './dashboard-grid/widget-list/widget-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PersonalDashboardService } from './shared/services/personal-dashboard.service';
import { GridComponent } from './shared/grid';
import { FavouriteSettingsComponent } from './page-layout/favourite-settings/favourite-settings.component';
import { PaginationService } from './shared/services/pagination.service';
import { LoginService } from './page-layout/sidebar/login.service';
import { EmployeeSearchComponent } from './shared/component/employee-search/employee-search.component';
import { TableListComponent } from './shared/component/table-list/table-list.component';
import { SharedComponentsModule } from './shared/component/shared-components/shared-components.module';
import { LeaveRequestService } from './shared/services/leaveRequest.service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    MegaMenuComponent,
    FooterComponent,
    GridComponent,
    LandingComponent,
    WidgetListComponent,
    FavouriteSettingsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    BsDropdownModule.forRoot(),
    BlockUIModule,
    HttpClientModule,
    HttpModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true
    }), // ToastrModule added
    NgMultiSelectDropDownModule.forRoot(),
    UserIdleModule.forRoot({ idle: 2700, timeout: 5, ping: 0 }),
    AngularDraggableModule,
    DragDropModule,
    FlexLayoutModule,
    // ProfileModule,
    // RequestsModule,
    SharedComponentsModule,
  ],
  providers: [
    HttpUtilities,
    CommonUtilities,
    CreateExpenseService,
    EditExpensesService,
    ManagerExpenseService,
    ManagerApproveExpenseService,
    ViewExpensesService,
    SimpleTimer,
    DepartmentMappingService,
    UploadFileService,
    NavigateDataService,
    ReportService,
    InvoiceServices,
    ReimburseExpenseService,
    ElasticsearchService,
    ResourceUtilizationService,
    ReimburseExpenseService,
    UndeliveredInvoicesService,
    AppraisalService,
    NgbActiveModal,
    ExportFileService,
    PmoAdminService,
    ExportFileService,
    GridService,
    PersonalDashboardService,
    DatePipe,
    PaginationService,
    LoginService,
    LeaveRequestService
  ],
  entryComponents: [
    WidgetListComponent,
    FavouriteSettingsComponent,
    EmployeeSearchComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
