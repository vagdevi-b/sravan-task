import { Component, Input, OnInit } from '@angular/core';
import { EmployeeResignationService } from '../../../shared/services/employee-resignation.service';

@Component({
  selector: 'app-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.css']
})
export class EmpDetailsComponent implements OnInit {
  empaccordianinfo: any;
  years: string;
  empDataDto: any;
  emprequestinfo: any;
  flag: boolean = false;
  newArr: string;
  @Input('empaccordianinfo')
  set setempaccordianinfo(value: any) {
    if (value) {
      this.empaccordianinfo = value;
      this.empDataDto = this.empaccordianinfo;
      if (this.empaccordianinfo.totalExperience != "") {
        this.years = "Years";
      } else {
        this.years = "-"
      }
      if (this.empaccordianinfo.id) {

        this.getrequestdatainfo();
      } else {
        this.emprequestinfo = this.empaccordianinfo;
        this.designationToLowerCase(this.empaccordianinfo);
      }
    }
  }

  constructor(private employeeResignationService: EmployeeResignationService) { }

  ngOnInit() {
  }

  getrequestdatainfo(): void {
    this.employeeResignationService.getrequestdata(this.empDataDto.id).subscribe((res: any) => {
      this.flag == true;
      if (res.employeeDto) {
        this.emprequestinfo = res.employeeDto;
        this.designationToLowerCase(res.employeeDto);
      } else {
        console.log("No Data Found");
      }
    });


  }

  designationToLowerCase(employeeDto: any) {
    const tempArr = [];
    const empDesignation = employeeDto.designation.toLowerCase().split(" ");
    empDesignation.forEach(element => {

      const tempelement = element.charAt(0).toUpperCase() + element.slice(1);
      tempArr.push(tempelement);
    });
    this.newArr = tempArr.join(' ');
  }

}
