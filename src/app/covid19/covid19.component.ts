import { Component, OnInit } from '@angular/core';
import { Country } from '../country.model';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';
@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {
  
  user: User;
  data1: any;
  countries: Country[];
  countryName: string;
  
  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
    this.user = this.covid19Service.getUser();
    this.covid19Service.loadingCovid19Summary();
    this.covid19Service.getCountry().subscribe(countries=>{
      this.countries=countries as Country[];
    })
  }
  showSummary() {
    this.covid19Service.getCovid19Summary()
      .subscribe(data => {
          this.data1=data;
          let countryname=this.data1.Countries[0].Country
          console.log("data",this.data1)
          console.log("countries", this.data1.Countries[0])
          //Document.getElementbyId('countryname').innerHTML=this.data1.Countries[0].Country
      });
  }
  showCountries(){
    console.log(this.covid19Service.getCountry())
    console.log(this.countries)
    /*
    this.covid19Service.getCountry().subscribe(country=>{
      this.country=country as Country;
      console.log("chopop",this.country)
    })
    */
  }
}
