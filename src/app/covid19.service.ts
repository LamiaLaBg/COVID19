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
import { News } from './news.model';
import { Global } from './global.model';
import { NewsComponent } from './news/news.component';

@Injectable({
  providedIn: 'root'
})

export class Covid19Service {

  private user!: User;
  private country!: Country;
  private data: any;
  private data1:any;
  private news!: News;

  url_covid19_summary="https://api.covid19api.com/summary"

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, private http: HttpClient) { }


  //******************* signin with google ********************//
  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      
    this.user = {
      uid: credentials.user.uid,
      displayName: credentials.user.displayName,
      email: credentials.user.email,
      eligible: false, // eligibility put to false by default
    };

    localStorage.setItem('users', JSON.stringify(this.user));
    this.updateUserData();
  }
  
  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
      eligible: this.user.eligible
    },{merge: true});// to update if the user already exists
    document.location.reload();
  }

  //get user connected
  getUser(){
    
    if(this.user == null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("users"));
    }
    
    console.log(this.user)
    return this.user;
  }
  
  //get user from uid
  getUserInfo(user_uid:string){
    return this.firestore.collection("users").doc(user_uid).valueChanges();//peut etre ajouter un order by
  }
  
  //check if user signed in
  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("users")) != null;
  }

  //******************* signin out ********************/
  async signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("users");
    this.user=null;
    await this.router.navigate(["COVID19"]);
    location.reload();
  }



  //******************* add news ********************/
  userAddNews(_date:string, _description:string, _country:string){
    this.news={
      useruid:this.user.uid,
      userName: this.user.displayName,
      userEmail: this.user.email,
      date: _date,
      description: _description,
      country: _country,
    }
    this.firestore.collection("news").add(this.news);
    return this.news
  }

  getNews(){
    return this.firestore.collection("news").valueChanges();//peut etre ajouter un order by
  }


  //******************* loadind summary api in the firestore ********************/
  async loadingCovid19Summary(){
    await this.getCovid19Summary()
      .subscribe(data => {
          this.data=data;
          //we add info for each country in the firebase
          for (let i=0; i<this.data.Countries.length; i++){
            let data1 =this.data.Countries[i];
            this.country={
              uid: i.toString(),
              Country: data1.Country,
              CountryCode: data1.CountryCode,
              Slug: data1.Slug,
              NewConfirmed: data1.NewConfirmed,
              TotalConfirmed: data1.TotalConfirmed,
              ActiveCases: data1.TotalConfirmed - data1.TotalDeaths -data1.TotalRecovered,
              NewDeaths: data1.NewDeaths,
              TotalDeaths: data1.TotalDeaths,
              MortalityRate: (data1.TotalDeaths/data1.TotalConfirmed)*100,
              NewRecovered: data1.NewRecovered,
              TotalRecovered: data1.TotalRecovered,
              RecoveryRate: (data1.TotalRecovered/data1.TotalConfirmed)*100,
              Date: data1.Date,
            }
            localStorage.setItem('countries', JSON.stringify(this.country));
            this.updateCovid19Summary();
          }
      });
  }
  private updateCovid19Summary(){
    this.firestore.collection("countries").doc(this.country.uid).set({
      uid: this.country.uid,
      Country: this.country.Country,
      CountryCode: this.country.CountryCode,
      Slug: this.country.Slug,
      NewConfirmed: this.country.NewConfirmed,
      TotalConfirmed: this.country.TotalConfirmed,
      ActiveCases: this.country.ActiveCases,
      NewDeaths: this.country.NewDeaths,
      TotalDeaths: this.country.TotalDeaths,
      MortalityRate: this.country.MortalityRate,
      NewRecovered: this.country.NewRecovered,
      TotalRecovered: this.country.TotalRecovered,
      RecoveryRate: this.country.RecoveryRate,
      Date: this.country.Date,
    },{merge: true});// to update if the data changed
  }
  
  //get the info from the summary api
  getCovid19Summary(): Observable<any> {
    return this.http.get(this.url_covid19_summary)
  }

  //retrieve information from the firebase
  getCountry(){
    return this.firestore.collection("countries").valueChanges();// get the modified values
  }

  //get country by slug
  getCountrybySlug(slug: String){
    this.firestore.collection("countries", ref => ref.where("Slug", "==", slug)).valueChanges();// get the modified values
  }

  //xheck if country uploaded
  countryUploaded(): boolean{
    return JSON.parse(localStorage.getItem("countries")) != null;
  }

  //******************* retrive information from the Word wip api or the By country all status api ********************/
  getCovid19PerDay(url_perDay_covid: string): Observable<any> {
    return this.http.get(url_perDay_covid)
  }

  //******************* retrieve the global information from summary ********************/
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
      });
  }

  //******************* redirection functions ********************/
  //add the redirection the add News page
  addNews(){
    this.router.navigate(["news"]);
  }

  //aredirect to the main page
  goToMainPage(){
    this.router.navigate(["COVID19"]);
  }
}
