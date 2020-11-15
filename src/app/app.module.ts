import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOASTR_TOKEN } from "./common/toaster.service";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuestionModule } from './questions/question.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModule } from './auth/auth.module';
import { NgxSpinnerModule } from "ngx-spinner";

import { AuthInterceptor } from "./auth/auth.interceptor";
import { GradeModule } from './grades/grade.module';
import { AdminLinksComponent } from './admin-links/admin-links.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavbarComponent,
    AdminLinksComponent,

  ],
  imports: [
    FormsModule,

    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    QuestionModule,
    GradeModule,
    AuthModule,
    //we should put all other modules before the AppRoutingModule 
    AppRoutingModule,
    


  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
