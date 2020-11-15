import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from "../../services/auth.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMsg: string = "";

  constructor(
    private fb: FormBuilder,
    private authServices: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // var token = localStorage.getItem("userToken");
    // if (token) {
    //   this.router.navigate(["/question-entry"]);
    // }
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });


  }

  async login() {
    this.spinner.show();
    const email = this.loginForm.get('email').value
    const pw = this.loginForm.get('password').value

    this.authServices.login(email, pw).subscribe(
      (data: any) => {

        this.spinner.hide();
        if (this.authServices.redirectUrl) {
          this.router.navigateByUrl(this.authServices.redirectUrl);
        } else {
          this.router.navigate(["/question-entry"]);
        }

      },
      (err: any) => {
        this.spinner.hide();
        console.log(err)
        this.errorMsg = err
      }
    );
  }

  isInputValid(ctrl) {
    // const isValid = this.loginForm.controls.email.valid == true
    // const isInvalid = this.loginForm.controls.email.invalid == true
    const isValid = ctrl.valid == true
    const isInvalid = ctrl.invalid == true
    return { 'is-valid': isValid, 'is-invalid': isInvalid }
  }

}
