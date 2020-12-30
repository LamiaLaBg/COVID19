import { Component, OnInit } from '@angular/core';
import { Covid19Service } from '../covid19.service';
@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {

  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
  }

}
