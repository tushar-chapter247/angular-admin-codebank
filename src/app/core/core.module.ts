import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { CoreRoutingModule } from './core-routing.module';

// ALL COMPONENTS IMPORTS
import { LoginComponent } from './components/login/login.component';
import { ErrorModule } from './error/error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CoreRoutingModule,
    MaterialModule,
    ErrorModule,
  ],
  declarations: [LoginComponent],
})
export class CoreModule {}
