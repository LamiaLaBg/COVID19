import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { Covid19Component } from './covid19/covid19.component';
import { Covid19PerCountyComponent } from './covid19-per-county/covid19-per-county.component';
import { NewsComponent } from './news/news.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { DatePipe} from '@angular/common';
import { Covid19Service } from './covid19.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    Covid19Component,
    Covid19PerCountyComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    ChartsModule,
    MDBBootstrapModule.forRoot(),
    DataTablesModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
