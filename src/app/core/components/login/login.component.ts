import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isSubmitted = false;
  public loading = false;

  constructor(private fb: FormBuilder, private commonService: CommonService) {}

  // INITIALIZE FORM CONTROLS
  async initForm(): Promise<any> {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(18),
        ],
      ],
    });
  }

  // GET FORM CONTROLS TO USE IN SHOWING ERRORS
  get f() {
    return this.loginForm.controls;
  }

  // ON LOGIN BUTTON PRESS, EXECUTE FUNCTION
  async onLogin(): Promise<any> {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    this.commonService
      .post('UserAccounts/login', this.loginForm.value, { include: 'user' })
      .subscribe(
        res => {
          console.log('Response for login: ', res);
        },
        err => console.log(err)
      );
    this.isSubmitted = false;
  }

  // LIFECYCLE HOOK, RUN ON START
  async ngOnInit(): Promise<any> {
    await this.initForm(); // INITIALIZE FORM
  }
}
