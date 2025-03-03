import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OtpInputComponent } from './components/otp-input/otp-input.component';
import { OtpInfoComponent } from './components/otp-info/otp-info.component';

@NgModule({
  declarations: [
    AppComponent,
    OtpInputComponent,
    OtpInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
