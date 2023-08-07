import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidaysRoutingModule } from './holidays-routing.module';
import { HolidaysComponent } from './holidays.component';
import { CreateHolidayService } from '../../shared/services/createHoliday.service';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    HolidaysComponent
  ],
  imports: [
    CommonModule,
    HolidaysRoutingModule,
    SharedComponentsModule,
    NgxPaginationModule
  ],
  providers: [
    CreateHolidayService
  ]
})
export class HolidaysModule { }
