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
  id!: any;
  user!: User;
  news!: News[];
  current_country!: Country;
  data1: any;
  data: any;
  country_page: any;
  countryuid:any;
  countries: any;
  
  countryName!: string;
  global!: Global;
  TotalCases:any;
  TotalDeaths_perc:any;
  TotalRecovered_perc:any;
  ActiveCases_perc:any;

  //NEWS for the country
  countryNews: News[]=[];

  //boolean values
  lackOfInfo: boolean = true;
  isNewsLoaded:boolean=false;
  isDataLoaded=false;
  isSignedUp:boolean= false;
  lackOfInfoBarChart!:boolean;
  

  //for the 7 last days per day info
  tab_data_per_day:any = []
  Date_7 : any;
  Date_6 : any;
  Date_5 : any;
  Date_4 : any;
  Date_3 : any;
  Date_2 : any;
  Date_1 : any;
  Date_0 : any;
  Date_i:any; //used for the linechart since 13 april

  //url of the By country all status api
  url_perDay_covid!: string;
  url_since_13_April!: string;
  
  //pie chart parameters
  doughnutChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  doughnutChartData: MultiDataSet=[];
  doughnutChartType: ChartType = 'doughnut';

  // bar chart parameters
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
  
  //line chart parameters
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

  constructor(public covid19Service: Covid19Service, private activatedRoute: ActivatedRoute,private http: HttpClient,private datePipe: DatePipe, router: Router) { 
  }

  ngOnInit() {
    this.country_page=[]
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.user = this.covid19Service.getUser();
    if (this.user==null){
      this.isSignedUp=false;
    }else{
      this.isSignedUp=true;
    }
    
   this.covid19Service.getCountry().subscribe(countries=>{
      // uploading the database if not in the firebase
      if (countries.length==0){
        this.covid19Service.loadingCovid19Summary();//load Covid19 Summary in the firestore
        //console.log("uploading")
      }
      
      this.countries=countries;
      //we can use queries
      //find the country corresponding to the id of the page (=country.slug)
      for (let i=0; i<countries.length; i++){
        if (this.countries[i].Slug==this.id){
          this.country_page=this.countries[i];//define the country with Slug=this.id
          this.countryuid=i;
          break
        }
      }

      //updating the firebase if the datas are from yesterday
      let dataBaseDate = new Date(this.country_page.Date)
      let dataBaseDate_noHours= new Date(dataBaseDate.getFullYear(),dataBaseDate.getMonth(),dataBaseDate.getDate())
      let experitionDate=new Date(Date.now());
      let experitionDate_noHours= new Date(experitionDate.getFullYear(),experitionDate.getMonth(),experitionDate.getDate())
      
      if (dataBaseDate_noHours<experitionDate_noHours){
        this.covid19Service.loadingCovid19Summary();
      }
      this.country_page=this.countries[this.countryuid];
      this.isDataLoaded=true;

      //define the pie chart data
      this.TotalCases=parseInt(this.country_page.TotalConfirmed)
      this.TotalDeaths_perc= (parseInt(this.country_page.TotalDeaths)/this.TotalCases)*100
      this.TotalRecovered_perc= (parseInt(this.country_page.TotalRecovered)/this.TotalCases)*100
      this.ActiveCases_perc= (parseInt(this.country_page.ActiveCases)/this.TotalCases)*100
      this.doughnutChartData= [[this.TotalDeaths_perc, this.TotalRecovered_perc, this.ActiveCases_perc]];
   });


   //retriving the news from the firestore
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
      this.isNewsLoaded=true;
    });

    //defining the dates for the bar chart of the last 7 days data
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
    this.Date_0=new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    this.Date_0=this.datePipe.transform(this.Date_0,"yyyy-MM-dd")

    // DATA for the last 7 days
    this.url_perDay_covid="https://api.covid19api.com/country/"+this.id+"?from="+ this.Date_0+"T00:00:00Z&to=" +this.Date_7+"T00:00:00Z"
    //console.log("url7= " + this.url_perDay_covid )
    
    this.covid19Service.getCovid19PerDay(this.url_perDay_covid).subscribe(data_ => {
      try{
        let i=1;
        this.tab_data_per_day=[]
        while(i < data_.length){
          if (data_[i].Province==""){// The api return the results by province we only show the global values per country
            this.tab_data_per_day.push(i)
          }
          i++;
        }
        let ind=0
        let previous_ind=0
        for (let i=1; i< this.tab_data_per_day.length; i++){
            ind = this.tab_data_per_day[i]
            previous_ind = this.tab_data_per_day[i-1]
            this.tabDeaths7.push(parseInt(data_[ind].Deaths)-parseInt(data_[previous_ind].Deaths))
            this.tabNewCases7.push(parseInt(data_[ind].Confirmed) - parseInt(data_[previous_ind ].Confirmed))
            this.tabRecovered7.push(parseInt(data_[ind].Recovered)-parseInt(data_[previous_ind].Recovered))   
        }
        let j=0;

        //if no info putting values at 0
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
        
      this.barChartData = [
        { data: this.tabDeaths7, label: 'Daily Death' },
        {data: this.tabRecovered7, label: 'Daily Recovered'},
        {data: this.tabNewCases7, label: 'Daily New Cases'},
      ];      
    });
    this.barChartLabels=[this.Date_1, this.Date_2, this.Date_3, this.Date_4, this.Date_5,this.Date_6,this.Date_7]

    // data from 13 april
    this.url_since_13_April ="https://api.covid19api.com/country/"+this.id+"?from=2020-04-13T00:00:00Z&to="+this.Date_7+"T00:00:00Z"
    //console.log("this.url_since_13_April : "+this.url_since_13_April);
    
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
      
      for (let i=nbData13April; i>=1;i--){
        this.Date_i = new Date(Date.now() - i*24 * 60 * 60 * 1000)
        this.Date_i = this.datePipe.transform(this.Date_i,"yyyy-MM-dd")
        this.lineChartLabels.push(this.Date_i);
      }
    
      this.lineChartData = [
        { data: this.tabDeaths, label: 'Total Death' },
        {data: this.tabRecovered, label: 'Total Recovered'},
        {data: this.tabNewCases, label: 'Total New Cases'},
      ];
    });
  }
}
