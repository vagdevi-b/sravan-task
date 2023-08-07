import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewExpenseComponent } from './view-expense/view-expense.component';
import { CreateExpenseComponent } from './create-expense/create-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { ManagerExpenseComponent } from './manager-expense/manager-expense.component';
import { ManagerApproveComponent } from './manager-approve/manager-approve.component';
import { ApproveExpenseComponent } from './approve-expense/approve-expense.component';
import { SidebarComponent } from './../page-layout/sidebar/sidebar.component';


import { ViewExpensesService } from '../shared/services/viewexpenses.service';
import { CreateExpenseService } from '../shared/services/createexpense.service';
import { EditExpensesService } from '../shared/services/editexpense.service';
import { ManagerExpenseService } from '../shared/services/manager.expense.service';
import { ManagerApproveExpenseService } from '../shared/services/managerapproveexpense.service';

import { ExpensesRoutingModule } from './expenses-routing.module';

import { ExpensesComponent } from './expenses.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from "ag-grid-angular";
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from "ngx-bootstrap";
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { ExpensePaymentComponent } from './expense-payment/expense-payment.component';
import { ManagerApprovalHistoryComponent } from './manager-expense/manager-approval-history.component';
import { PmoExpenseComponent } from './pmo-expense/pmo-expense.component';
import { PmoManageExpenseComponent } from './pmo-manage-expense/pmo-manage-expense.component';
import { ReimbursedExpenseComponent } from './reimbursed-expense/reimbursed-expense.component';
import { ReviewExpenseComponent } from './review-expense/review-expense.component';
import { ReviewManagerExpenseComponent } from './review-expense/review-manager-expense.component';
import { ViewManagerApprovalHistoryExpenseComponent } from './viewhistory-expense/view-manager-approval-history-expense.component';
import { ViewhistoryExpenseComponent } from './viewhistory-expense/viewhistory-expense.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { DetailsUploadComponent } from './details-upload/details-upload.component';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { ListUploadComponent } from './list-upload/list-upload.component';
import { ExpenseAttachmentComponent } from './expense-attachment/expense-attachment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExpenseDecimalFormatPipe } from '../shared/pipes/expense-decimal-format.pipe';

@NgModule({

	declarations: [
		ExpensesComponent,
		ViewExpenseComponent,
		ApproveExpenseComponent,
		CreateExpenseComponent,
		ManagerExpenseComponent,
		ManagerApproveComponent,
		EditExpenseComponent,
		PmoManageExpenseComponent,
		PmoExpenseComponent,
		ExpenseDetailsComponent,
		ExpensePaymentComponent,
		ReimbursedExpenseComponent,
		ViewManagerApprovalHistoryExpenseComponent,
		ViewhistoryExpenseComponent,
		ReviewManagerExpenseComponent,
		ReviewExpenseComponent,
		ManagerApprovalHistoryComponent,
		DetailsUploadComponent,
		FormUploadComponent,
		ListUploadComponent,
		ExpenseAttachmentComponent,
		ExpenseDecimalFormatPipe
	],
	imports: [
		CommonModule,
		NgbModule.forRoot(),
		FormsModule,
		AgGridModule.withComponents(
			[]
		),
		HttpClientModule,
		ModalModule.forRoot(),
		ExpensesRoutingModule,
		SharedComponentsModule,
		NgxPaginationModule
	],
	providers: [
		ViewExpensesService,
		CreateExpenseService,
		ManagerExpenseService,
		EditExpensesService,
		ManagerApproveExpenseService
	]
})
export class ExpensesModule { }
