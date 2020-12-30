import { Component, OnInit } from '@angular/core';
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
  
  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
    this.user = this.covid19Service.getUser();
  }
  showSummary() {
    this.covid19Service.getCovid19Summary()
      .subscribe(data => {
          this.data1=data;
          console.log("data",this.data1)
          console.log("global", this.data1.Countries)
      });
  }

}
