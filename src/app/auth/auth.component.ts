import {Component, OnInit} from '@angular/core';
import {AuthService} from '../servises/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  form: FormGroup;
  hasError = false;
  errorMessage: string;
  title = 'task-tracker';

  constructor(
    public authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  singUp() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authService.signUp(this.form.value.email, this.form.value.password)
      .catch(err => {
        this.hasError = true;
        this.errorMessage = err.message;
      });
    this.form.reset();
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.authService.login(this.form.value.email, this.form.value.password)
      .catch(err => {
        this.hasError = true;
        this.errorMessage = err.message;
      });
    this.form.reset();
  }

  singInWithGoogle() {
    this.authService.singInGoogle()
      .catch(err => {
        this.hasError = true;
        this.errorMessage = err.message;
      });
  }

  ifControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    const errors = control.errors;

    if (!errors) {
      return '';
    }

    if (errors.minlength) {
      return `minimal password length - ${errors.minlength.requiredLength}`;
    }

    if (errors.required) {
      return `${controlName} is required`;
    }

    if (errors.email) {
      return 'e-mail is badly formatted';
    }
  }
}
