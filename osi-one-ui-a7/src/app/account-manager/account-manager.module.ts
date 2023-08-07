import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountManagerRoutingModule } from './account-manager-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { AccountManagerComponent } from './account-manager.component';

@NgModule({
  declarations: [
    AccountManagerComponent
  ],
  imports: [
    CommonModule,
    AccountManagerRoutingModule,
    SharedComponentsModule
  ]
})
export class AccountManagerModule { }
