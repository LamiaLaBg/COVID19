import { Component, OnInit } from '@angular/core';
import { Country } from '../country.model';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router'; //import router
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {DatePipe} from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { Global} from '../global.model';
import { News } from '../news.model';

@Component({
  selector: 'app-covid19-per-county',
  templateUrl: './covid19-per-county.component.html',
  styleUrls: ['./covid19-per-county.component.css']
})

export class Covid19PerCountyComponent implements OnInit {
  id!: string;
  user!: User;
  news!: News[];
  data1: any;
  data: any;
  country_page: any;
  countryuid:any;
  countries: any;
  lackOfInfo: boolean = true;
  countryName!: string;
  global!: Global;
  TotalCases:any;
  TotalDeaths_perc:any;
  TotalRecovered_perc:any;
  ActiveCases_perc:any;
  isDataLoaded=false;
  isSignedUp:boolean= false;
  lackOfInfoBarChart!:boolean;

  current_country!: Country;

  Date_7 : any;
  Date_6 : any;
  Date_5 : any;
  Date_4 : any;
  Date_3 : any;
  Date_2 : any;
  Date_1: any;
  url_perDay_covid!: string;
  url_since_13_April!: string;
  
  //pie chart
  doughnutChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  doughnutChartData: MultiDataSet=[];
  doughnutChartType: ChartType = 'doughnut';

  // bar chart
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins:any = [];
  barChartData: ChartDataSets[] = [];
  tabDeaths:any=[];
  tabRecovered:any=[];
  tabNewCases:any=[];
  tabDeaths7:any=[];
  tabRecovered7:any=[];
  tabNewCases7:any=[];
  
  //curve chart
  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins:any = [];
  lineChartType: ChartType = 'line';


  //NEWS for the country
  countryNews: News[]=[];
  
  constructor(public covid19Service: Covid19Service, private activatedRoute: ActivatedRoute,private http: HttpClient,private datePipe: DatePipe, router: Router) { 
  }

  async ngOnInit(): Promise<void> {
    this.country_page=[]
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.user = this.covid19Service.getUser();
    if (this.user==null){
      this.isSignedUp=false;
    }else{
      this.isSignedUp=true;
    }
    
   await this.covid19Service.getCountry().subscribe(countries=>{
      // uploading the database if not in the firebase
      if (countries.length==0){
      this.covid19Service.loadingCovid19Summary();//load Covid19 Summary in the firestore
      console.log("uploading")
      }
      
      this.countries=countries;
      //we can use queries
      for (let i=0; i<countries.length; i++){
        if (this.countries[i].Slug==this.id){
          this.country_page=this.countries[i];//define the country with Slug=this.id
          this.countryuid=i;
          console.log(this.country_page.TotalDeaths);
          break
        }
      }

      //updating the firebase if the datas are from yesterday
      let dataBaseDate = new Date(this.country_page.Date)
      let experitionDate=new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (experitionDate>=dataBaseDate){
        console.log("before:" + dataBaseDate)
        this.covid19Service.loadingCovid19Summary();
        console.log("updading")
        console.log("after" + new Date(this.country_page.Date))
      }
      
      this.country_page=this.countries[this.countryuid];
      this.isDataLoaded=true;

      //define the pie chart datas
      this.TotalCases=parseInt(this.country_page.TotalConfirmed)
      this.TotalDeaths_perc= (parseInt(this.country_page.TotalDeaths)/this.TotalCases)*100
      this.TotalRecovered_perc= (parseInt(this.country_page.TotalRecovered)/this.TotalCases)*100
      this.ActiveCases_perc= (parseInt(this.country_page.ActiveCases)/this.TotalCases)*100
      this.doughnutChartData= [[this.TotalDeaths_perc, this.TotalRecovered_perc, this.ActiveCases_perc]];
      console.log(this.country_page);
   });

    this.covid19Service.getNews().subscribe((news)=>{
    this.news=news as News[];
    for (let i=0; i<this.news.length; i++){
      try{
        if (this.news[i].country==this.country_page.Country){
          this.countryNews.push(this.news[i])
        };
      }catch(e){
        console.error(e);
      }
      };
    });

    
    
    //this.doughnutChartData= [[50, 10, 40]];
    /*
    this.covid19Service.getCovid19Summary()
      .subscribe(data => {
        // for each country
        this.data=data;
        this.global={
          TotalCases: this.data.Global.TotalConfirmed,
          NewCases: this.data.Global.NewConfirmed,
          ActiveCases: parseInt(this.data.Global.TotalConfirmed) - parseInt(this.data.Global.TotalDeaths)-parseInt(this.data.Global.TotalRecovered),
          TotalRecovered: this.data.Global.TotalRecovered,
          NewRecovered: this.data.Global.NewRecovered,
          RecoveryRate:(parseInt(this.data.Global.TotalRecovered)/parseInt(this.data.Global.TotalConfirmed))*100 +" %",
          TotalDeaths: this.data.Global.TotalDeaths,
          NewDeaths:this.data.Global.NewDeaths,
          MortalityRate:(parseInt(this.data.Global.TotalDeaths)/parseInt(this.data.Global.TotalConfirmed))*100 +" %"
        }
        this.TotalCases=parseInt(this.global.TotalCases)
        this.TotalDeaths_perc= (parseInt(this.global.TotalDeaths)/this.TotalCases)*100
        this.TotalRecovered_perc= (parseInt(this.global.TotalRecovered)/this.TotalCases)*100
        this.ActiveCases_perc= (parseInt(this.global.ActiveCases)/this.TotalCases)*100

        this.doughnutChartData= [[this.TotalDeaths_perc, this.TotalRecovered_perc, this.ActiveCases_perc]];
      });
      */
      
      //DATA for the last 7 days
      this.Date_7 = new Date(Date.now() - 24 * 60 * 60 * 1000)
      this.Date_7=this.datePipe.transform(this.Date_7,"yyyy-MM-dd")
      this.Date_6=new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      this.Date_6=this.datePipe.transform(this.Date_6,"yyyy-MM-dd")
      this.Date_5=new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      this.Date_5=this.datePipe.transform(this.Date_5,"yyyy-MM-dd")
      this.Date_4=new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      this.Date_4=this.datePipe.transform(this.Date_4,"yyyy-MM-dd")
      this.Date_3=new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      this.Date_3=this.datePipe.transform(this.Date_3,"yyyy-MM-dd")
      this.Date_2=new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      this.Date_2=this.datePipe.transform(this.Date_2,"yyyy-MM-dd")
      this.Date_1=new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      this.Date_1=this.datePipe.transform(this.Date_1,"yyyy-MM-dd")

      // DATA forthe last 7 days
      this.url_perDay_covid="https://api.covid19api.com/country/"+this.id+"?from="+ this.Date_1+"T00:00:00Z&to=" +this.Date_7+"T00:00:00Z"
      console.log("url7= " + this.url_perDay_covid )
      this.covid19Service.getCovid19PerDay(this.url_perDay_covid).subscribe(data_ => {
        try{
          let i=0;
          
          while(i < data_.length){
            if (data_[i].Province==""){// The api return the results by province we only show the global values per country
              this.tabDeaths7.push(parseInt(data_[i].Deaths))
              this.tabNewCases7.push(parseInt(data_[i].Confirmed))
              this.tabRecovered7.push(parseInt(data_[i].Recovered))
              console.log((data_[i].Recovered))
            }
            i++;
          }
          
          let j=0;
          while(this.tabDeaths7.length<7){
            this.tabDeaths7.push(0);
            this.tabNewCases7.push(0);
            this.tabRecovered7.push(0);
            j++
          }
          
        }catch(e){
          console.error(e)
          this.lackOfInfoBarChart=false;
          console.log("lack of information");
        }
        //this.tab=[parseInt(data_[0].Deaths), parseInt(data_[1].Deaths), parseInt(data_[2].Deaths) ,parseInt(data_[3].Deaths), parseInt(data_[4].Deaths), parseInt(data_[4].Deaths),parseInt(data_[4].Deaths)]
        //this.tab_dailyDeath=[45, 37, 60, 70, 46, 33,10]
        
        this.barChartData = [
          { data: this.tabDeaths7, label: 'Daily Death' },
          {data: this.tabRecovered7, label: 'Daily Recovered'},
          {data: this.tabNewCases7, label: 'Daily New Cases'},
        ];      
      });
      this.barChartLabels=[this.Date_1, this.Date_2, this.Date_3, this.Date_4, this.Date_5,this.Date_6,this.Date_7]
      



    // data from 13 april
    this.url_since_13_April ="https://api.covid19api.com/country/"+this.id+"?from=2020-04-13T00:00:00Z&to="+this.Date_7+"T00:00:00Z"
    console.log("this.url_since_13_April : "+this.url_since_13_April);
    this.covid19Service.getCovid19PerDay(this.url_since_13_April).subscribe(data_ => {
      
      let nbData13April=0;
      try{
        let i=0;
        while(i < data_.length){
          if (data_[i].Province==""){
            this.tabDeaths.push(parseInt(data_[i].Deaths))
            this.tabNewCases.push(parseInt(data_[i].Confirmed))
            this.tabRecovered.push(parseInt(data_[i].Recovered))
            nbData13April++;
          }
          i++;
        }
      }catch(error){
        console.error("error")
        this.lackOfInfoBarChart=false;
        console.log("lack of information");
      }
      
      //this.tab=[parseInt(data_[0].Deaths), parseInt(data_[1].Deaths), parseInt(data_[2].Deaths) ,parseInt(data_[3].Deaths), parseInt(data_[4].Deaths), parseInt(data_[4].Deaths),parseInt(data_[4].Deaths)]
      //this.tab_dailyDeath=[45, 37, 60, 70, 46, 33,10]
      let Date_i=null;
      for (let i=nbData13April-1; i>=0;i--){
        Date_i = new Date(Date.now() - i*24 * 60 * 60 * 1000)
        Date_i=this.datePipe.transform(Date_i,"yyyy-MM-dd")
        this.lineChartLabels.push(Date_i);
      }
    
      this.lineChartData = [
        { data: this.tabDeaths, label: 'Daily Death' },
        {data: this.tabRecovered, label: 'Daily Recovered'},
        {data: this.tabNewCases, label: 'Daily New Cases'},
      ];
    });
    
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
  showCountry(){
    console.log(this.covid19Service.getCountry())
    console.log(this.countries)
    console.log(this.country_page)
    console.log(this.covid19Service.getCovid19Summary())
    console.log(this.global)
    /*
    this.covid19Service.getCountry().subscribe(country=>{
      this.country=country as Country;
      console.log("chopop",this.country)
    })
    */
  }

  showGlobal(){
    this.covid19Service.getCovid19Summary()
      .subscribe(data => {
        this.data=data;
        console.log("TotalCases",this.data.Global.TotalConfirmed)
        console.log("NewCases",this.data.Global.NewConfirmed)
        console.log("ActiveCases", parseInt(this.data.Global.TotalConfirmed) - parseInt(this.data.Global.TotalDeaths)-parseInt(this.data.Global.TotalRecovered))
        console.log("TotalRecovered",this.data.Global.TotalRecovered)
        console.log("NewRecovered",this.data.Global.NewRecovered)
        console.log("RecoveryRate")
        console.log("TotalDeaths",this.data.Global.TotalDeaths)
        console.log("NewDeaths",this.data.Global.NewDeaths)
        console.log("MortalityRate")
        let Total=parseInt(this.global.TotalCases)
        let TotalDeaths_perc= (parseInt(this.global.TotalDeaths)/Total)*100
        let TotalRecovered_perc= (parseInt(this.global.TotalRecovered)/Total)*100
        let ActiveCases_perc= (parseInt(this.global.ActiveCases)/Total)*100
        console.log("TotalDeaths_perc",Math.floor(TotalDeaths_perc))
        console.log("TotalRecovered_perc",Math.floor(TotalRecovered_perc))
        console.log("ActiveCases_perc",Math.ceil(ActiveCases_perc))
      });
      
  }

  showId(){
    console.log(this.id);
  }

  showCovidPerDay(){
    this.covid19Service.getCovid19PerDay(this.url_perDay_covid).subscribe(data_ => {
      console.log(data_[0])
      console.log(parseInt(data_[0].Deaths), parseInt(data_[1].Deaths), parseInt(data_[2].Deaths) ,parseInt(data_[3].Deaths), parseInt(data_[4].Deaths), parseInt(data_[4].Deaths),parseInt(data_[4].Deaths))
      console.log(this.url_perDay_covid)
      let res= this.id.replace(',', '').split(" ");
      console.log(this.id)
      console.log("res=",res)
      console.log(data_.length)
      console.log("tab", this.tabDeaths)
      let i=0;
        while(i < data_.length){
          if (data_[i].Province==""){
            console.log(parseInt(data_[i].Deaths))
          }
          i++;
        }
        //this.tab.push("choco")
        console.log("tab="+ this.tabDeaths)
      console.log("https://api.covid19api.com/country/"+this.countryName+"?from="+ this.Date_1+"T00:00:00Z&to=" +this.Date_7+"T00:00:00Z")
      this.covid19Service.getCountry().subscribe(countries=>{
        this.countries=countries;
        //this.current_country=countries.where("Country", "==", this.id);
        //console.log("current country", countries.whereEqualTo("", this.id))
      });
    
    });
  }



}
