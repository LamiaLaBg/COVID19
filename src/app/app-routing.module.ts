import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { Covid19Component } from './covid19/covid19.component';
import { Covid19PerCountyComponent } from './covid19-per-county/covid19-per-county.component';

const routes: Routes = [
  {path: "news", component: NewsComponent },
  {path: "COVID19", component: Covid19Component },
  {path: "COVID19-per-country/:id", component: Covid19PerCountyComponent },
  {path: "", pathMatch: "full",redirectTo:"COVID19" },
  {path: "**",redirectTo:"COVID19" },
  /*
  {

    path: '',
    component: Covid19PerCountyComponent ,
    children:[
                {
                  path:'/COVID19-per-country/:type', //:type is dynamic here
                  component:Covid19PerCountyComponent ,
                }
              ]
  }
  */
  
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
