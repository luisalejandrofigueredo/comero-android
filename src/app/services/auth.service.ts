import { Injectable, inject, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';
import * as auth from 'firebase/auth';
import { getAuth } from '@angular/fire/auth';
import { Auth, idToken } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private angularFireStore = inject(AngularFirestore);
  private angularFireAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private userData: any;
  public token: string | null = null;
  public userUid: string = ''

  constructor() {
    this.angularFireAuth.user.subscribe((user) => {
      if (user) {
        setInterval(() => {
          user.getIdToken(true).then(() => {
            // El token ha sido refrescado
          }).catch((_error) => {
            // Error al refrescar el token
          });
        }, 50 * 60 * 1000); // 50 minutos en milisegundos      }
        this.userUid = user.uid;
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.removeItem('user');
        this.userUid = "";
        this.router.navigate(['']);
      }
    });
    this.angularFireAuth.idToken.subscribe({
      next: (token: string | null) => {
        //handle idToken changes here. Note, that user will be null if there is no currently logged in user.
        this.token = token;
        //console.log('nuevo token',this.token);
      }
    })
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.angularFireAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  getUserData() {
    return this.userData
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.angularFireStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  get isLoggedIn(): boolean {
    const user = (localStorage.getItem('user') !== null) ? JSON.parse(localStorage.getItem('user')!) : null;
    return user !== null && user.emailVerified !== false ? true : false;
  }

  SignOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
    });
  }

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['']);
    });
  }

  AuthLogin(provider: any) {
    const auto = getAuth()
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.angularFireAuth.currentUser.then(user => {
        })
        this.SetUserData(result.user);
        this.router.navigate(['']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
}
