import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMsg: string = "";
  resetToken: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authServices: AuthService,) { }

  ngOnInit(): void {
    this.resetToken = this.route.snapshot.params['resetToken'];
    this.resetPasswordForm = this.fb.group({
      /*
      At least 6 characters in length
      Lowercase letters
      Uppercase letters
      Numbers
      Special characters
      */
      password: [null, [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')]],

    }, {
      validator: this.checkPasswords
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  submit() {
    const newPassword = this.resetPasswordForm.get('password').value

    this.authServices.changePassword(newPassword, this.resetToken).subscribe(
      (data: any) => {


        if (this.authServices.redirectUrl) {
          this.router.navigateByUrl(this.authServices.redirectUrl);
        } else {
          this.router.navigate(["/question-entry"]);
        }

      },
      (err: any) => {

        console.log(err)
        this.errorMsg = err
      }
    );
  }

}
