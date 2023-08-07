import {Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {LeaveRequestService} from '../../services/leaveRequest.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {EmployeeSearchComponent} from './employee-search.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[employeeSearchInput]'
})
export class EmployeeSearchInputDirective implements ControlValueAccessor {

  private onChange: (_: any) => {};
  private modalRef: NgbModalRef;

  @Output()
  employeeSelected = new EventEmitter<number>();

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private leaveRequestService: LeaveRequestService
  ) { }

  @HostListener('blur', ['$event.target.value'])
  searchEmployee(searchText: string) {
    if (!searchText) {
      return;
    }

    this.leaveRequestService.getMailSuggestion(searchText)
      .subscribe(
        response => {
          if (!response || response.length === 0) {
            return;
          }

          if (response.length === 1) {
            this.writeValue(response[0]);
          } else {
            this.openEmployeeSearchModal(response.slice(0, 10), searchText);
          }
        },
        error => {
          this.toastr.error(
            error.errorMessage
            || `Error occurred while searching for ${searchText}`
          );
        }
      );
  }

  openEmployeeSearchModal(employeeList: any[], searchText: string) {
    this.modalRef = this.modalService.open(EmployeeSearchComponent);
    this.modalRef.componentInstance.employeeList = employeeList;
    this.modalRef.componentInstance.searchText = searchText;

    this.modalRef.componentInstance.employeeSelected.subscribe(
      value => {
        this.writeValue(value);
        this.modalRef.close();
      }
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {

    this.renderer.setProperty(
      this.elRef.nativeElement,
      'value',
      obj['fullName']
    );

    this.employeeSelected.emit(obj['employeeId']);
  }

}
