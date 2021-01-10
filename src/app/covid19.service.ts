import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import firebase from 'firebase/app';
import{AngularFireAuth} from '@angular/fire/auth';
import{AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Country } from './country.model';
import { User } from './user.model';
import { Global } from './global.model';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service {

  private user: User;
  private country: Country;
  private data: any;
  private data1:any;

  url_covid19_summary="https://api.covid19api.com/summary"
  //dataSummary: any;

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
    this.router.navigate([""]); // TODO: à modifier
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

  async signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("users");
    this.user=null;
    await this.router.navigate(["COVID19"]);
    location.reload();
  }

  async loadingCovid19Summary(){
    await this.getCovid19Summary()
      .subscribe(data => {
          this.data=data;
          /*
          console.log("length",this.data.Countries.length)
          console.log("country",this.data1.Country)
          console.log("DATE", this.data1.Date)
          */

          //we add the global info

          //we add info for each country
          for (let i=0; i<this.data.Countries.length; i++){
            let data1 =this.data.Countries[i];
            this.country={
              uid: i.toString(),
              Country: data1.Country,
              CountryCode: data1.CountryCode,
              Slug: data1.Slug,
              NewConfirmed: data1.NewConfirmed,
              TotalConfirmed: data1.TotalConfirmed,
              NewDeaths: data1.NewDeaths,
              TotalDeaths: data1.TotalDeaths,
              NewRecovered: data1.NewRecovered,
              TotalRecovered: data1.TotalRecovered,
              Date: data1.Date,
            }
            
            localStorage.setItem('countries', JSON.stringify(this.country));
            this.updateCovid19Summary();
          }

      });
      //this.country=this.data.Countries[1]
      console.log("countries", this.data1)
      console.log("countries", this.country)
    
    
  }
  private updateCovid19Summary(){
    this.firestore.collection("countries").doc(this.country.uid).set({
      //Country: this.country,
      uid: this.country.uid,
      Country: this.country.Country,
      CountryCode: this.country.CountryCode,
      Slug: this.country.Slug,
      NewConfirmed: this.country.NewConfirmed,
      TotalConfirmed: this.country.TotalConfirmed,
      NewDeaths: this.country.NewDeaths,
      TotalDeaths: this.country.TotalDeaths,
      NewRecovered: this.country.NewRecovered,
      TotalRecovered: this.country.TotalRecovered,
      Date: this.country.Date,
    },{merge: true});// to update if the data changed
  }
  
  

  getCovid19Summary(): Observable<any> {
    return this.http.get(this.url_covid19_summary)
  }

  //retrive information from the firebase
  getCountry(){
    return this.firestore.collection("countries").valueChanges();// get the modified values
  }

  countryUploaded(): boolean{
    return JSON.parse(localStorage.getItem("countries")) != null;
  }

  /// Per country

  getCovid19PerDay(url_perDay_covid: string): Observable<any> {
    return this.http.get(url_perDay_covid)
  }




  //retrieving other information for first tabel
  async FirstTable(){
    await this.getCovid19Summary()
      .subscribe(data => {
          this.data=data;
          
          console.log("TotalCases",this.data.Global.TotalConfirmed)
          console.log("NewCases",this.data.Global.NewConfirmed)
          console.log("ActiveCases")
          console.log("TotalRecovered",this.data.Global.TotalRecovered)
          console.log("NewRecovered",this.data.Global.NewRecovered)
          console.log("RecoveryRate")
          console.log("TotaDeaths",this.data.Global.TotaDeaths)
          console.log("NewDeaths",this.data.Global.NewDeaths)
          console.log("MortalityRate")

          //we add info for each country
          /*
          this.country={
            TotalCases: any;
            NewCases: any;
            ActiveCases: any;
            TotalRecovered: any;
            NewRecovered: any;
            RecoveryRate:any;
            TotalDeaths: any
            NewDeaths:any;
            MortalityRate:any;
          }
          */
      });
  }



  addNews(){
    this.router.navigate(["news"]);
  }


}
