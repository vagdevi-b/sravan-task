import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildHistoryRoutingModule } from './build-history-routing.module';
import { BuildHistoryComponent } from './build-history.component';
import { NewBuildComponent } from './new-build/new-build.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    NewBuildComponent,
    BuildHistoryComponent
  ],
  imports: [
    CommonModule,
    BuildHistoryRoutingModule,
    SharedComponentsModule,
    AngularEditorModule
  ]
})
export class BuildHistoryModule { }
