import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   User_Id: any;
   User_Type: any;

   constructor(public router: Router, private Login_Service: LoginService) {
       //  Get Users List
       this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
       this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
    }

   ngOnInit() {
   }

   LogOut() {
      sessionStorage.clear();
      this.router.navigate(['/Login']);
   }
}
