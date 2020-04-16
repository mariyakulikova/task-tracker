import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;

  provider = new firebase.auth.GoogleAuthProvider();

  constructor(private firebaseAuth: AngularFireAuth) {
    // this.user = firebaseAuth.authState;
    this.user = firebaseAuth.user;
  }


  singInGoogle() {
    firebase.auth().signInWithPopup(this.provider).then(result => {
      console.log('success', result.user.email);
      const token = result.credential.accessToken;
      this.user = result.user;
    }).catch(e => {
      console.log('Something went wrong:', e.message);
      const errorCode = e.code;
      const errorMessage = e.message;
      const email = e.email;
      const credential = e.credential;
    });
  }

  signUp(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut().then(data => {
        console.log('success logout');
    });
  }

}
