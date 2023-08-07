import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilelistComponent } from './profilelist/profilelist.component';
import { AddprofileComponent } from './addprofile/addprofile.component';
import { ProfiletableComponent } from './profiletable/profiletable.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [ProfilelistComponent, ProfiletableComponent,AddprofileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedComponentsModule
  ],
  entryComponents : [AddprofileComponent],
  exports:[AddprofileComponent]
})
export class ProfileModule { }
