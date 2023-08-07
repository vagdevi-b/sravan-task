import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent implements OnInit {
  payload: any;
  constructor(private fb: FormBuilder, private employeeResignationService: EmployeeResignationService, private activemodel: NgbActiveModal) { }
  acceptLWDForm: FormGroup;


  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.acceptLWDForm = this.fb.group({
      requestedDateOfReleasing: [""]
    });
  }

  save() {
    this.activemodel.close({ status: "success" });

  }

  close() {
    this.activemodel.close({ status: "Cancel" });
  }
}
