import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['../../../../../src/assets/css/resignation.css']
})
export class CancelRequestComponent implements OnInit {
  cancelDetailForm: FormGroup;
  completeEmpInfo: any;
  role: any
  constructor(public router: Router, public fb: FormBuilder, private toastrService: ToastrService, private activemodel: NgbActiveModal, private employeeResignationService: EmployeeResignationService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.cancelDetailForm = this.fb.group({
      notes: ['']

    });
  }

  close() {
    if (this.cancelDetailForm.controls['notes'].value != "") {
      const obj = {
        "notes": this.cancelDetailForm.get('notes').value,
        "notesType": true,
        "roleId": localStorage.getItem('userId'),
        "role": this.role,
        "updatedBy": localStorage.getItem('userName'),
        "osiResignationRequestDto": this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto

      }
      this.employeeResignationService.saveNotes(obj).subscribe(response => {
        const textdata = this.cancelDetailForm.controls['notes'].value
        this.activemodel.close({ status: "success", notes: response });
        this.toastrService.success("Notes Added Successfully");
      });
      this.cancelRequest();
    } else {
      this.toastrService.error("Please Enter Notes");
    }
  }

  cancelRequest() {
    const info = this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto;
    info["status"] = "Cancelled",
      this.employeeResignationService.saveResignationRequest(info).subscribe(res => {
        if (res) {
          this.toastrService.success("Resignation Request Cancelled");
          this.router.navigate(['resignation/list']);
        }

      });

  }

  cancel() {
    this.activemodel.close({ status: "cancel" });
  }
}
