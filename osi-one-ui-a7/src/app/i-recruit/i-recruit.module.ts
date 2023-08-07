import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRecruitRoutingModule } from './i-recruit-routing.module';
import { NavbarComponent } from './shared/component/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddprofileComponent } from './profile/addprofile/addprofile.component';

@NgModule({
  imports: [
    CommonModule,
    IRecruitRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [NavbarComponent],
  entryComponents : [AddprofileComponent]
})
export class IRecruitModule { }
