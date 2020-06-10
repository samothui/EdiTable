import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EdiTable';

  columns = ['Company', 'Contact', 'Country']

  doSomething(event){
    console.log(event);
  }
}
