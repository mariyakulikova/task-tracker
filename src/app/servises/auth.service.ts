import {Injectable, NgZone} from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;
  private authenticated = false;

  provider = new firebase.auth.GoogleAuthProvider();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone) { }

  singInGoogle(): Promise<any> {
    return firebase.auth().signInWithPopup(this.provider).then(result => {
      this.user = this.firebaseAuth.auth.currentUser;
      this.authenticated = true;
      this.ngZone.run(() => {
        this.router.navigateByUrl('/calendar').then(r => console.log('navigation by url ended'));
      });
    });
  }

  signUp(email: string, password: string): Promise<any> {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.user = this.firebaseAuth.auth.currentUser; // TODO process sing up user
      });
  }

  login(email: string, password: string): Promise<any> {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.user = this.firebaseAuth.auth.currentUser;
        this.authenticated = true;
        this.router.navigateByUrl('/calendar');
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut().then(data => {
      this.authenticated = false;
    });
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  get currentUser(): firebase.User {
    return this.user;
  }

}
