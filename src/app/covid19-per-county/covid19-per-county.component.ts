import { Component, OnInit } from '@angular/core';
import { Country } from '../country.model';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router'; //import router

@Component({
  selector: 'app-covid19-per-county',
  templateUrl: './covid19-per-county.component.html',
  styleUrls: ['./covid19-per-county.component.css']
})
export class Covid19PerCountyComponent implements OnInit {
    user: User;
    countries: Country[];
    

  constructor(public covid19Service: Covid19Service, private activatedRoute: ActivatedRoute) { }
  public id: string;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
     console.log(this.id);
  }

}
