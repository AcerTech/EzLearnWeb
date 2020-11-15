import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { User } from '../models/interfaces';
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  login(email, password) {

    const userData = {
      email: email,
      password: password
    }

    return this.http.post(url + "auth", userData).pipe(
      map((data: any) => <any>data),
      tap(data => {
        // console.log(data);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      }),
      catchError(this.handleError)
    );
  }


  registerUser(user: any) {
    // const body = {
    //   name: user.name,
    //   email: user.email,
    //   password: user.password
    // };

    return this.http.post(url + "users", user).pipe(
      map((data: any) => <any>data),
      tap(data => {
        console.log(data);
        // localStorage.setItem("userToken", data.token);
        // localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }),
      catchError(this.handleError)
    );
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;

    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo == null) return false;
    if (userInfo.role != null) {
      allowedRoles.forEach(element => {
        if (userInfo.role.indexOf(element) > -1) {
          isMatch = true;
          return false;
        }
      });
    }

    return isMatch;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("userToken");// to convert object ot boolean we use "!!" 
  }

  loggedinUserName() {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo == null) return "";
    return userInfo.name;
  }

  logOut() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    let msg = `Error status ${error.statusText} code ${error.status}  at ${error.url}`;
    return throwError(msg);
  }


  forgotPassword(email: any) {
    const body = {
      email: email
    }

    return this.http.post(url + "auth/forgotpassword", body).pipe(
      map((data: any) => <any>data),
      tap(data => {
        // console.log(data);
        // localStorage.setItem("userToken", data.token);
        // localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(newPassword, resetToken) {
    const body = {
      newPassword: newPassword,
      resetToken: resetToken
    }

    return this.http.post(url + "auth/reset-password", body).pipe(
      map((data: any) => <any>data),
      tap(data => {
        // console.log(data);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      }),
      catchError(this.handleError)
    );


  }

}
