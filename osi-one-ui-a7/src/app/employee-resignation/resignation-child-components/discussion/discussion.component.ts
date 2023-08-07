import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';



@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css'],

})
export class DiscussionComponent implements OnInit, OnChanges {
  @Input() selectedValues: any = [];
  @Input() reasons: any = [];

  @Input() displayData: any;
  @Input() populateData: any;
  @Input() completeEmpData: any;

  sla: any = "";
  selectedReasonValue = [];
  reasonForResignation = [];
  changeReason: any;
  @Output() selectedDiscussion = new EventEmitter<any>();
  selectedlist: any = [];
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  reason_values: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  selectedData: any = [];
  discussionForm: FormGroup;
  displaySelectedReasons: any = [];
  selectedResponseItems: any = [];
  reasonsChoosen: any = [];
  reasonsChoosen1: any = [];


  constructor(public fb: FormBuilder, private employeeResignationService: EmployeeResignationService, private toastrService: ToastrService,) {
    this.reason_values = JSON.parse(localStorage.getItem("reasons_response"));
    // this.getallresignationreason();
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "lookupValue",
      textField: "lookupDesc",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.createForm();
    // this.showData();
    if (this.displayData == "RM") {
      this.discussionForm.controls["reason"].setValidators(Validators.required);
    }
  }

  showData() {
    this.reason_values = this.reasons;
    this.selectedResponseItems = this.selectedValues;
    this.selectedResponseItems.forEach(ele => {
      this.reason_values.forEach(data => {
        if (data.reasonCode == ele) {
          this.selectedItems.push(data);
        }
      });
    });
  }

  getallresignationreason() {
    this.employeeResignationService.getallreasonsdata().subscribe(response => {
      this.reason_values = response.osiLookupValueses;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.reason_values = [];
    this.reason_values = JSON.parse(localStorage.getItem("reasons_response"));
    for (const propName in changes) {

      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        switch (propName) {

          case 'selectedValues':
            {
              this.selectedResponseItems = change.currentValue;
              if (this.selectedResponseItems && this.selectedResponseItems != "" && this.selectedResponseItems != null) {
                this.reasonsChoosen.push(Array.prototype.map.call(this.selectedResponseItems, function (item) {
                  return item.reasonCodes
                }).join(","));
                this.reasonsChoosen1 = this.reasonsChoosen[0].split(",");
                this.reasonsChoosen1.forEach(ele => {
                  this.reason_values.forEach(data => {
                    if (data.lookupValue == ele) {
                      this.selectedItems.push(data);
                    }
                  });
                });
              }
              break;
            }

        }
      }
    }

    // this.selectedItems = this.displaySelectedReasons
  }

  createForm() {
    this.discussionForm = this.fb.group({
      reason: [this.selectedItems]
    });
  }


  onSelectAll(items: any) {
    items.forEach(element => {
      const currentlySelectedValue = element.lookupValue
      this.selectedData.push(currentlySelectedValue);
      this.selectedDiscussion.emit(this.selectedData);
      this.selectedData = this.selectedData.filter((el, i, a) => i === a.indexOf(el))
    });

  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }



  resignationChangeEvent(event) {

    const currentlySelectedValue = event.target.value;


    if (currentlySelectedValue) {

      const existingvalue = this.selectedReasonValue.length ? this.selectedReasonValue.filter((item) => {
        return item.lookupValue == currentlySelectedValue
      }) : []

      this.selectedDiscussion.emit(this.selectedReasonValue);
      event.target.value = "";
    }
  }

  onItemSelect(item: any) {
    const currentlySelectedValue = item.lookupValue;
    this.selectedData.push(currentlySelectedValue);
    this.selectedDiscussion.emit(this.selectedData);
    this.selectedData = this.selectedData.filter((el, i, a) => i === a.indexOf(el))
  }


  onItemDeSelect(items: any) {
    const currentlySelectedValue = items.lookupValue;
    // this.selectedData.forEach(element => {
    //   element == currentlySelectedValue
    //   const index = this.selectedData.indexOf(currentlySelectedValue);
    //   this.selectedData.splice(index, 1)
    // });
    const index = this.selectedData.indexOf(currentlySelectedValue);
    this.selectedData.splice(index, 1);
    this.selectedDiscussion.emit(this.selectedData);
    // this.selectedData = this.selectedData.filter((el, i, a) => i === a.indexOf(el));
  }




  removeSelectedValue(indexValue: number): void {
    this.selectedReasonValue = this.selectedReasonValue.filter((_, index) => index !== indexValue);

  }

  saveReasons() {
    const reasoncodedata = Array.prototype.map.call(this.discussionForm.value['reason'], function (item) {
      return item.lookupValue
    }).join(",");
    if (this.selectedResponseItems && this.selectedResponseItems.length) {
      const obj1 = {
        "reasonCodes": reasoncodedata,
        "roleId": this.selectedResponseItems[0].roleId,
        "role": this.displayData,
        "osiResignationRequestDto": this.completeEmpData.resignationResponseDto.osiResignationRequestDto
      }
      obj1["id"] = this.selectedResponseItems[0].id;
      this.employeeResignationService.updateReasons(obj1).subscribe(res => {
        if (res) {
          this.toastrService.success("Selected Reasons Saved Successfully");
          // const obj = {
          //   "notes": "Updated Reasons are" + reasoncodedata,
          //   "notesType": true,
          //   "roleId": localStorage.getItem('userId'),
          //   "role": this.displayData,
          //   "updatedBy": localStorage.getItem('userName'),
          //   "osiResignationRequestDto": this.completeEmpData.resignationResponseDto.osiResignationRequestDto

          // }
          // this.employeeResignationService.saveNotes(obj).subscribe(response => { });
        }
      });
    } else {
      const obj = {
        "reasonCodes": reasoncodedata,
        "roleId": localStorage.getItem('userId'),
        "role": this.displayData,
        "osiResignationRequestDto": this.completeEmpData.resignationResponseDto.osiResignationRequestDto
      }
      this.employeeResignationService.saveReasons(obj).subscribe(res => {
        if (res) {
          this.toastrService.success("Selected Reasons Saved Successfully");
        }
      });
    }
  }

}

