import { Component, OnInit } from '@angular/core';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  user: User;

  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
    this.user = this.covid19Service.getUser();
  }
}
