import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';

@Component({
  selector: 'app-retain-employee-popup',
  templateUrl: './retain-employee-popup.component.html',
  styleUrls: ['./retain-employee-popup.component.css']
})
export class RetainEmployeePopupComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(public fb: FormBuilder, private activemodel: NgbActiveModal, private toastrService: ToastrService, private employeeResignationService: EmployeeResignationService) { }
  noteDetailForm: FormGroup;
  completeEmpInfo: any;
  role: any;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.noteDetailForm = this.fb.group({
      notes: ['']

    });
  }
  save() {
    if (this.noteDetailForm.controls['notes'].value != "") {
      const obj = {
        "notes": this.noteDetailForm.get('notes').value,
        "notesType": true,
        "roleId": localStorage.getItem('userId'),
        "role": "PD",
        "updatedBy": localStorage.getItem('userName'),
        "osiResignationRequestDto": this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto

      }
      this.employeeResignationService.saveNotes(obj).subscribe(response => {
        const textdata = this.noteDetailForm.controls['notes'].value
        this.activemodel.close({ status: "success", notes: response });
        this.toastrService.success("Notes Added Successfully");
        const payloadData = this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto;
        payloadData["status"] = "Retained"
        this.employeeResignationService.saveResignationRequest(payloadData).subscribe(res => {
          if(res){
          this.activemodel.close({ status: "success", data: payloadData });
          }
        });
      });

    } else {
      this.toastrService.error("Please Enter Notes");

    }

    // this.activemodel.close({ status: "success" });
  }

  close() {
    this.activemodel.close();
    this.passEntry.emit({ status: "cancel" });
  }
}
