import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import firebase from 'firebase/app';
import{AngularFireAuth} from '@angular/fire/auth';
import{AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service {

  private user: User;
  url_covid19_summary="https://api.covid19api.com/summary"
  dataSummary: any;

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, private http: HttpClient) { }

  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      
    this.user={
      uid: credentials.user.uid,
      displayName: credentials.user.displayName,
      email: credentials.user.email
    };
    localStorage.setItem('users', JSON.stringify(this.user));
    //this.updateCovid19Summary()
    this.updateUserData();
    this.router.navigate(["news"]); // TODO: à modifier
    
  }
  
  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
    },{merge: true});// to update if the user already exists
  }

  getUser(){
    
    if(this.user == null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("users"));
    }
    return this.user;
  
  }

  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("users")) != null;
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("users");
    this.user=null;
    this.router.navigate(["COVID19"]);
  }

  /*
  private updateCovid19Summary(){
    this.firestore.collection("Summary").doc("4").set({
      dataSummmary: this.dataSummary,
    },{merge: true});// to update if the data changed
  }
  */

  getCovid10Summary(): Observable<any> {
    console.log(this.http.get(this.url_covid19_summary))
    return this.http.get(this.url_covid19_summary)

  }
  addNews(){
    this.router.navigate(["news"]);
  }


}
