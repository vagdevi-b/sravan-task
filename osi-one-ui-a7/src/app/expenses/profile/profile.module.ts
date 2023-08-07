import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
    imports: [
        CommonModule,        
        FormsModule,
        ProfileRoutingModule        
    ],
    declarations: [
        ProfileComponent
    ]
})
export class ExMSProfileModule {}
