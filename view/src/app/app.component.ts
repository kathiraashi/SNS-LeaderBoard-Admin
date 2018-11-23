import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { ToastrService } from './services/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  UserLoggedIn: boolean;

  ToastrList: any[] = [];
  HiddenToastrCount = 0;

   constructor(private router: Router, public Toastr: ToastrService) {
      // Find Page Url
         router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
               if (event.url === '/Login' || event.url === '/' ) {
                  this.UserLoggedIn = false;
               } else {
                  this.UserLoggedIn = true;
               }
            }
         });
      // Toastr Message
         this.Toastr.WaitingToastr.subscribe(Message => {
            setTimeout(() => {
               this.ToastrList.push(Message);
               this.RefreshToastrPosition();
               setTimeout(() => {
                  this.ToastrList.splice(0, 1);
                  this.RefreshToastrPosition();
               }, 4000);
            }, 100);
         });
   }

   HideToastr(_index) {
      this.ToastrList[_index].Type = 'Hidden';
      this.RefreshToastrPosition();
   }

   RefreshToastrPosition() {
      let _Count = 0;
      this.ToastrList.map(toastr => {
         if (toastr.Type !== 'Hidden') {
            toastr.Top = _Count * 80 + 10 ; _Count = _Count + 1;
         }
      });
   }
}
