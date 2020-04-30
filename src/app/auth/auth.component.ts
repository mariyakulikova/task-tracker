import { Component, OnInit } from '@angular/core';
import {AuthService} from '../servises/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  email: string;
  password: string;
  hasError = false;
  errorMessage: string;
  title = 'task-tracker';

  constructor(public authService: AuthService) {}

  signUp() {
    this.authService.signUp(this.email, this.password)
      .catch(err => {
        this.hasError = true;
        this.errorMessage = err.message;
      });
    this.email = this.password = '';
  }

  login() {
    this.authService.login(this.email, this.password)
      .catch(err => {
        this.hasError = true;
        this.errorMessage = err.message;
      });
    this.email = this.password = '';
  }

  singInWithGoogle() {
    this.authService.singInGoogle()
      .catch(err => {
        this.hasError = true;
        this.errorMessage = err.message;
      });
  }
}
