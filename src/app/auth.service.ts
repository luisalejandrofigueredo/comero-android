import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { getAuth,signInWithRedirect  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private angularFireStore = inject(AngularFirestore);
  private angularFireAuth = inject(AngularFireAuth);
  private userData: any;
  public token: string | null = null;
  public userUid: string = '';
  private router = inject(Router);
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

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['']);
    });
  }

  AuthLogin(provider: any) {
    const auto = getAuth()
    return this.angularFireAuth
      .signInWithRedirect(provider)
      .then((result) => {
        this.angularFireAuth.currentUser.then(user => {
          this.SetUserData(user);
        })
        this.router.navigate(['']);
      })
      .catch((error) => {
        window.alert(error);
      });
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
}
