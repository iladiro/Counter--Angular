import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CounterLibrary';

  counteDownExpired(event: boolean) {
    console.log(event);
  }
}
