import { Component } from '@angular/core';
import { City } from './AutoComplete/autocomplete.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sail-point-exam';
  city: City;

  setCity($event) {
  	this.city = $event.city;
  }
}
