import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { RequestlistComponent } from './requestlist/requestlist.component';
import { RequesttableComponent } from './requesttable/requesttable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewRequestComponent } from './view-request/view-request.component';
import { AddprofileComponent } from '../profile/addprofile/addprofile.component';
import { ProfileModule } from '../profile/profile.module';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [RequestlistComponent, RequesttableComponent, ViewRequestComponent],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileModule,
    SharedComponentsModule
  ],
  entryComponents : [AddprofileComponent]
})
export class RequestsModule { }
