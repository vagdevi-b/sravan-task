import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsrRoutingModule } from './isr-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { IsrRegistrationComponent } from '../isr-registration/isr-registration/isr-registration.component';
import { IsrEventDefinitionComponent } from '../isr-event-definition/isr-event-definition/isr-event-definition.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { IsrFilterPipe } from '../shared/pipes/isr-filter.pipe';

@NgModule({
  declarations: [
    IsrRegistrationComponent,
    IsrEventDefinitionComponent,
    IsrFilterPipe
  ],
  imports: [
    CommonModule,
    IsrRoutingModule,
    SharedComponentsModule,
    CKEditorModule
  ]
})
export class IsrModule { }
