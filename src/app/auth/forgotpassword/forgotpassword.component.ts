import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorMsg: string = "";

  email: FormControl = new FormControl("", [Validators.required]);

  constructor(
    private authServices: AuthService,
    // @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: this.email
    });
  }

  resetPassword() {
    this.spinner.show();
    this.authServices.forgotPassword(this.email.value).subscribe(
      (data: any) => {
        this.spinner.hide();
        // this.router.navigate(["/login"]);
        // this.loginForm.reset();
        // this.toastr.success("Please check your email");
        
      },
      (err: any) => {
        this.spinner.hide();
        // this.toastr.error(err);
        this.errorMsg = err;
      }, () => alert("Please check your email, you should get a reset passwrod link shortly")
    );
  }
}
