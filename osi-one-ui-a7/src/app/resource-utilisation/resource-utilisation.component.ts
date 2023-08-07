import { Component, OnInit } from '@angular/core';
import { ResourceUtilizationService } from '../shared/services/resource-utilization.service';

@Component({
  selector: 'app-resource-utilisation',
  templateUrl: './resource-utilisation.component.html',
  styleUrls: ['./resource-utilisation.component.css']
})
export class ResourceUtilisationComponent implements OnInit {

  navBar : String ;
  isLevel3User : boolean = false;
  
  constructor(private resource: ResourceUtilizationService) { 
    this.resource.getEmployeeGrade().subscribe(response =>{
      let grade = response.grade;
     if(grade.startsWith("L3") || grade.startsWith("L4") || grade.startsWith("L5")){
       this.isLevel3User = true;
       this.navBar = 'myresources';
     }else {
      this.navBar = 'resourceUtilization';
     }
    });
  }

  ngOnInit() {
  } //----------------->> onInit END


  onNavClick(param) {
    this.navBar = param;
    // if (params === "accural") {
    //   this.disableOnAccural = true;
    // } else {
    //   this.disableOnAccural = false;
    // }
  }

}
