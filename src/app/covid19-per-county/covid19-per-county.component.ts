import { Component, OnInit } from '@angular/core';
import { Country } from '../country.model';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';

@Component({
  selector: 'app-covid19-per-county',
  templateUrl: './covid19-per-county.component.html',
  styleUrls: ['./covid19-per-county.component.css']
})
export class Covid19PerCountyComponent implements OnInit {
    user: User;
    countries: Country[];

  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
  }

}
