import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduledRoutingModule } from './scheduled-routing.module';
import { ScheduledlistComponent } from './scheduledlist/scheduledlist.component';

@NgModule({
  declarations: [ScheduledlistComponent],
  imports: [
    CommonModule,
    ScheduledRoutingModule
  ]
})
export class ScheduledModule { }
