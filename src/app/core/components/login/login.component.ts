import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isSubmitted = false;
  public loading = false;

  constructor(private fb: FormBuilder) {}

  // INITIALIZE FORM CONTROLS
  async initForm() {
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
  async onLogin() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    console.log('login button pressed!');
    this.isSubmitted = false;
    console.log(this.loginForm.value);
  }

  // LIFECYCLE HOOK, RUN ON START
  ngOnInit() {
    this.initForm(); // INITIALIZE FORM
  }
}
