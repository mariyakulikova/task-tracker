import { Component, OnInit } from '@angular/core';
import {AuthService} from '../servises/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

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

  ngOnInit(): void {
  }

}
