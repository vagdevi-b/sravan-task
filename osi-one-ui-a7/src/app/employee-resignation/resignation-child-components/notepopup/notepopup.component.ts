import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';

@Component({
  selector: 'app-notepopup',
  templateUrl: './notepopup.component.html',
  styleUrls: ['../../../../../src/assets/css/resignation.css']
})
export class NotepopupComponent implements OnInit {
  // @Output() complete = new EventEmitter<boolean>();
  @Output() onTextInput = new EventEmitter<any>();

  data: any
  noteDetailForm: FormGroup;
  textdata: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  completeEmpInfo: any;
  role: any;
  mandatory: any
  constructor(public fb: FormBuilder, private toastrService: ToastrService, private activemodel: NgbActiveModal, private employeeResignationService: EmployeeResignationService) { }

  ngOnInit() {
    this.createForm();
    if (this.mandatory == "Mandatory") {
      this.noteDetailForm.get('notes').setValidators(Validators.required);
      this.noteDetailForm.get('notes').updateValueAndValidity();
    }
  }

  createForm() {
    this.noteDetailForm = this.fb.group({
      notes: ['']

    });
  }

  save(): any {

    if (this.noteDetailForm.controls['notes'].value != "") {
      const obj = {
        "notes": this.noteDetailForm.get('notes').value,
        "notesType": true,
        "roleId": localStorage.getItem('userId'),
        "role": this.role,
        "updatedBy": localStorage.getItem('userName'),
        "osiResignationRequestDto": this.completeEmpInfo.resignationResponseDto.osiResignationRequestDto

      }
      this.employeeResignationService.saveNotes(obj).subscribe(response => {
        const textdata = this.noteDetailForm.controls['notes'].value
        this.activemodel.close({ status: "success", notes: response });
        this.toastrService.success("Notes Added Successfully");
      });

    } else {
      this.toastrService.error("Please Enter Notes");

    }

  }

  close(): void {
    // this.activemodel.close();
    this.activemodel.close({ status: "Cancel" });

  }
}
