import { Component, OnInit } from '@angular/core';
import { Covid19Service } from '../covid19.service';
import { News } from '../news.model';
import { User } from '../user.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  user!: User;
  elements: any = [];
  isSignedUp:boolean =false;
  isEligible:boolean =false;
  isDataNewsuploaded = false;
  news!: News[];

  //variables of the form
  date:any;
  description!:string;
  country!:string;

  countries: any;
  userInfo!: User;


  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
    this.user = this.covid19Service.getUser();
    if (this.user==null){
      this.isSignedUp=false;
    }else{
      this.isSignedUp=true;
    }

    if (this.isSignedUp){
      this.covid19Service.getUserInfo(this.user.uid).subscribe(_user => {
        this.userInfo=_user as User;
        this.isEligible= this.userInfo.eligible;//get updated data of user for eligibility
      });
    }

    this.covid19Service.getCountry().subscribe(countries=>{
      this.countries=countries;
    })
    
    this.covid19Service.getNews().subscribe((news)=>{
      this.news=news as News[];
      this.isDataNewsuploaded = true;
    });
  }

  useraddingNews(){
    this.covid19Service.userAddNews(this.date, this.description, this.country);
    console.log(this.date + this.description+ this.country);
    this.date=undefined;
    this.country="";
    this.description="";
  }
}

