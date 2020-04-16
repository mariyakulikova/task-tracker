import { Component } from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  email: string;
  password: string;
  title = 'task-tracker';

  constructor(public authService: AuthService) {}

  signUp() {
    this.authService.signUp(this.email, this.password);
    this.email = this.password = '';
  }

  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
  }

  logout() {
    this.authService.logout();
  }
  singInWithGoogle() {
    this.authService.singInGoogle();
  }
}
