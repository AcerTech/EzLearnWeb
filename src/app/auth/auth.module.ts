import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoggedinUserInfoComponent } from './loggedin-user-info/loggedin-user-info.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "./auth.interceptor";
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotpasswordComponent, LoggedinUserInfoComponent, ResetPasswordComponent, ForbiddenComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AuthRoutingModule
  ],
  providers: [

  ]
})
export class AuthModule { }
