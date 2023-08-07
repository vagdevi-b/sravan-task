import { 
    Component, 
    OnInit, 
    ViewChild,
    TemplateRef,
    ViewEncapsulation } from '@angular/core';
import { Headers, 
         Http, 
         Response, 
         RequestOptionsArgs, 
         URLSearchParams, 
         RequestMethod, 
         RequestOptions  } from '@angular/http';
import { NgForm } from '@angular/forms';         
         
import { EmployeeService } from './employees.service';
import { Profile } from './profile';

@Component({
  selector: 'app-my-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ EmployeeService ]
})
export class ProfileComponent implements OnInit {

  private jsonData: string; 
  private data: string;   
  profileData = null;  
  @ViewChild('f') profileDataForm: NgForm; 
  submitted = false; 
  
  private employeeId: string; 
  
  constructor(private employeeService: EmployeeService ) {     
    this.loadProfileData(); 
  }

  ngOnInit() {
      this.employeeId = 'AAAA';
      this.profileDataForm.form.setValue({
          profileData: {
              employeeId: '123' 
          }
      });
  }
  
  loadProfileData() {       
      this.employeeService.getEmpDetails()
        .subscribe(response => this.parseResponse(response));         
  }
  
  private parseResponse(response: Response) {
      this.jsonData = JSON.stringify(response);      
      let content = JSON.parse(this.jsonData);      
      console.log(content);
  }
  
  onSubmit() {
      console.log('49');
  }
  

}
