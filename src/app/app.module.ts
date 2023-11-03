import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IladiroCounterModule } from 'projects/counter/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IladiroCounterModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
