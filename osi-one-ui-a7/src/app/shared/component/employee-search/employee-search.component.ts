import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LeaveRequestService} from '../../services/leaveRequest.service';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.css']
})
export class EmployeeSearchComponent implements OnInit {

  @Output()
  employeeSelected = new EventEmitter<any>();

  @Input()
  employeeList: any[];

  searchText: string;

  constructor(
    private leaveRequestService: LeaveRequestService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.sanitizeEmployeeStatus();
  }

  searchEmployee(): void {
    if (!this.searchText) {
      return;
    }

    this.leaveRequestService
      .getMailSuggestion(this.searchText)
      .subscribe(
        response => {
          if (response && response.length > 10) {
            response = response.slice(0, 10);
          }
          this.employeeList = response;
          this.sanitizeEmployeeStatus();
        },
        error => {
          this.toastr.error(
            error.errorMessage
            || `Error occurred while searching for ${this.searchText}`
          );
        }
      );
  }

  sanitizeEmployeeStatus() {
    if (this.employeeList) {
      this.employeeList.forEach(each => {
        each.employeeStatus = each.employeeStatus === 1 ? 'Active' : 'In Active';
      });
    }
  }

  onEmployeeSelect(employee: any): void {
    this.employeeSelected.emit(employee);
  }

}
