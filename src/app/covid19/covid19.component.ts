import { Component, OnInit } from '@angular/core';
import { Country } from '../country.model';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';
import { Global} from '../global.model';
import { Router } from '@angular/router'; //import router
import {DatePipe} from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {
  user!: User;
  data1: any;
  data: any;
  countries: any;
  countryName!: string;
  global!: Global;
  TotalCases:any;
  TotalDeaths_perc:any;
  TotalRecovered_perc:any;
  ActiveCases_perc:any;
  isDataLoaded=false;

  lackOfInfoBarChart:boolean=true;
  

  //pie chart
  doughnutChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  doughnutChartData: any;
  doughnutChartType: ChartType = 'doughnut';

  // bar chart
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins: any  = [];
  barChartData: ChartDataSets[] = [];
  tabDeaths:any=[];
  tabRecovered:any=[];
  tabNewCases:any=[];
  tabDeaths7:any=[];
  tabRecovered7:any=[];
  tabNewCases7:any=[];

  Date_7 : any;
  Date_6 : any;
  Date_5 : any;
  Date_4 : any;
  Date_3 : any;
  Date_2 : any;
  Date_1: any;
  url_perDay_covid!: string;
  url_since_13_April!: string;

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
  lineChartType = 'line';

  
  constructor(public covid19Service: Covid19Service, private datePipe: DatePipe, public router: Router) { }

  ngOnInit(): void {
    
    this.user = this.covid19Service.getUser();
    this.covid19Service.loadingCovid19Summary();
    this.covid19Service.getCountry().subscribe(countries=>{
      this.countries=countries;
    })
    //Pie chart
    this.covid19Service.getCovid19Summary()
      .subscribe(data => {
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
        this.doughnutChartData= [[this.TotalDeaths_perc, this.TotalRecovered_perc, this.ActiveCases_perc ]];
        
    });

    //the last 7 days data in a chart
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


    //curb since 13 april
    //this.url_since_13_April ="https://api.covid19api.com/world?from=2021-01-01T00:00:00Z&to=2021-01-01T00:00:00Z"
    
    this.url_since_13_April ="https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to="+this.Date_7+"T00:00:00Z"
    console.log(this.url_since_13_April);
    
    this.covid19Service.getCovid19PerDay(this.url_since_13_April).subscribe(data_ => {
      try{
        let i=0;
        while(i < data_.length){
          this.tabDeaths.push(parseInt(data_[i].TotalDeaths))
          this.tabNewCases.push(parseInt(data_[i].TotalConfirmed))
          this.tabRecovered.push(parseInt(data_[i].TotalRecovered))
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
      for (let i=data_.length-1; i>=0;i--){
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
    

    //bar chart 7 last days
    this.url_perDay_covid="https://api.covid19api.com/world?from="+ this.Date_1+"T00:00:00Z&to=" +this.Date_7+"T00:00:00Z"
    console.log("this.url_perDay_covid",this.url_perDay_covid)
    
    
    this.covid19Service.getCovid19PerDay(this.url_perDay_covid).subscribe(data_ => {
      try{
        let i=0;
        while(i < data_.length){
          this.tabDeaths7.push(parseInt(data_[i].NewDeaths))
          this.tabNewCases7.push(parseInt(data_[i].NewConfirmed))
          this.tabRecovered7.push(parseInt(data_[i].NewRecovered))
          i++;
        }
        let j=0;
        while(this.tabDeaths7.length<7){
          this.tabDeaths7.push(0);
          this.tabNewCases7.push(0);
          this.tabRecovered7.push(0);
          j++
        }
      }catch(error){
        console.error("error")
        this.lackOfInfoBarChart=false;
        console.log("lack of information");
      }
      //this.tab=[parseInt(data_[0].Deaths), parseInt(data_[1].Deaths), parseInt(data_[2].Deaths) ,parseInt(data_[3].Deaths), parseInt(data_[4].Deaths), parseInt(data_[4].Deaths),parseInt(data_[4].Deaths)]
      //this.tab_dailyDeath=[45, 37, 60, 70, 46, 33,10]
      this.barChartLabels=[this.Date_1, this.Date_2, this.Date_3, this.Date_4, this.Date_5,this.Date_6,this.Date_7]
      this.barChartData = [
        { data: this.tabDeaths7, label: 'Daily Death' },
        {data: this.tabRecovered7, label: 'Daily Recovered'},
        {data: this.tabNewCases7, label: 'Daily New Cases'},
      ];
      console.log(this.barChartData)
    });
    

    this.isDataLoaded=true;
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
}
