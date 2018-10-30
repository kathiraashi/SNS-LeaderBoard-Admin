import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   UserLoggedIn: boolean;

   constructor(private router: Router) {
      // Find Page Url
         router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
               if (event.url === '/Login' || event.url === '/') {
                  this.UserLoggedIn = false;
               } else {
                  this.UserLoggedIn = true;
               }
            }
         });
   }
}
