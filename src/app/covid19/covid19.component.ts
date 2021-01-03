import { Component, OnInit } from '@angular/core';
import { Country } from '../country.model';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';
import { Global} from '../global.model';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Router } from '@angular/router'; //import router

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {
  user: User;
  data1: any;
  data: any;
  countries: any;
  countryName: string;
  global: Global;
  TotalCases:any;
  TotalDeaths_perc:any;
  TotalRecovered_perc:any;
  ActiveCases_perc:any;


  
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];

  doughnutChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  doughnutChartData: MultiDataSet;
  doughnutChartType: ChartType = 'doughnut';



  /*
  doughnutChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  doughnutChartData: any;
  doughnutChartType: ChartType = 'doughnut';
  */
  
  constructor(public covid19Service: Covid19Service, public router: Router) { 
    /*
    let Total=parseInt(this.global.TotalCases)
    let TotalCases_perc= (parseInt(this.global.TotalDeaths)/Total)*100
    let TotalRecovered_perc= (parseInt(this.global.TotalRecovered)/Total)*100
    let ActiveCases_perc= (parseInt(this.global.ActiveCases)/Total)*100
    */
   /*
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
        /*
        console.log("TotalDeaths_perc",Math.floor(this.TotalDeaths_perc))
        console.log("TotalRecovered_perc",Math.floor(this.TotalRecovered_perc))
        console.log("ActiveCases_perc",Math.ceil(this.ActiveCases_perc))
        */
        //this.doughnutChartData= [[Math.floor(this.TotalDeaths_perc), Math.floor(this.TotalRecovered_perc), Math.ceil(this.ActiveCases_perc) ]];
        //this.doughnutChartData= [[this.TotalDeaths_perc, this.TotalRecovered_perc, this.ActiveCases_perc ]];
    //});
    
    //this.doughnutChartData= [[ Math.floor(this.TotalCases_perc),  Math.floor(this.TotalRecovered_perc),  Math.ceil(this.ActiveCases_perc)]];
    //this.doughnutChartData= [[2, 56, 42]];
  }

  ngOnInit(): void {
    this.user = this.covid19Service.getUser();
    this.covid19Service.loadingCovid19Summary();
    this.covid19Service.getCountry().subscribe(countries=>{
      this.countries=countries;
    })
    
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

}
