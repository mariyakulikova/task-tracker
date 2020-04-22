import { Injectable } from '@angular/core';

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
    private router: Router) { }

  // TODO process errors
  singInGoogle() {
    firebase.auth().signInWithPopup(this.provider).then(result => {
      this.user = this.firebaseAuth.auth.currentUser;
      this.authenticated = true;
      this.router.navigate(['/calendar']);
    }).catch(e => {
      console.log('Something went wrong:', e.message);
    });
  }

  signUp(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.user = this.firebaseAuth.auth.currentUser; // TODO process sing up user
        console.log('Success!', this.user);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  // TODO process errors
  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.user = this.firebaseAuth.auth.currentUser;
        this.authenticated = true;
        this.router.navigate(['/calendar']);
        console.log('Nice, it worked!', this.user);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
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
