import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { ErrorModule } from './error/error.module';
import { CoreRoutingModule } from './core-routing.module';

// ALL COMPONENTS IMPORTS
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';

// MODULE FOR ADMIN PANEL
import { AdminModule } from './admin/admin.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    ErrorModule,
    CoreRoutingModule,
    AdminModule,
  ],
  declarations: [LoginComponent, ErrorComponent],
})
export class CoreModule {}
