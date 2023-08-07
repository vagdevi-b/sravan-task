import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-acceptresignationpopup',
  templateUrl: './acceptresignationpopup.component.html',
  styleUrls: ['./acceptresignationpopup.component.css']
})
export class AcceptresignationpopupComponent implements OnInit {
  @ViewChild('DatePickContainer2') datePickContainer2;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  payload: any;

  datePickContainer: any;
  mon: string;
  day: string;
  LastWorkingDate: string;
  userIdinfo: string;
  constructor(private activemodel: NgbActiveModal, private toastrService: ToastrService, private modalService: NgbModal, private fb: FormBuilder, private employeeResignationService: EmployeeResignationService,) { }
  acceptLWDForm: FormGroup;
  data: any


  ngOnInit() {
    this.userIdinfo = localStorage.getItem('userId');
    this.createForm();
  }
  createForm() {
    this.acceptLWDForm = this.fb.group({
      requestedDateOfReleasing: ["", [Validators.required]]
    });
  }
  closeFix(event, datePicker) {
    if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
      datePicker.close();
    }
  }

  save() {
    if (!this.acceptLWDForm.valid) {
      this.toastrService.error("Please Enter the Last Working Date")
    }
    const Lwd = this.acceptLWDForm.get("requestedDateOfReleasing").value
    if (Lwd.month < 10) {
      this.mon = '0' + Lwd.month;
    } else {
      this.mon = Lwd.month;
    }
    if (Lwd.day < 10) {
      this.day = '0' + Lwd.day;
    } else {
      this.day = Lwd.day
    }
    this.LastWorkingDate = Lwd.year + "-" + this.mon + "-" + this.day;
    const payloadData = {}
    payloadData["id"] = this.data.id;
    // payloadData["actualLWD"] = this.LastWorkingDate;
    // payloadData["relievingDate"] = this.LastWorkingDate;
    payloadData["expectedRelievingDate"] = this.LastWorkingDate;
    payloadData["pdDiscussionStatus"] = true;
    payloadData["decisionDate"] = moment().format('YYYY-MM-DD');
    payloadData["requestPD"] = Number(this.userIdinfo);
    payloadData["status"] = "Accepted"
    this.employeeResignationService.updatePd(payloadData).subscribe(res => {
      this.toastrService.success("Resignation Accepted Successfully")
      this.activemodel.close({ status: "success", data: payloadData });
    });

  }

  close() {
    this.activemodel.close();
    this.passEntry.emit({ status: "cancel" });
  }
}
