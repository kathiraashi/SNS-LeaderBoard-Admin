import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   LoginForm: FormGroup;

   Data_1;

   UserRequired: Boolean = false;
   UserMinLengthErr: Boolean = false;

   constructor(
      private Toastr: ToastrService,
      private router: Router,
      private service: LoginService
   ) { }

   ngOnInit() {
      this.LoginForm = new FormGroup({
         User_Name: new FormControl('', Validators.required),
         User_Password: new FormControl('', Validators.required),
      });
   }

   submit() {
      if (this.LoginForm.valid) {
            const Data = this.LoginForm.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.service.User_Login_Validate({'Info': Info}).subscribe( response => {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  this.router.navigate(['/Dash_Board']);
               } else if (response['status'] === 200 || response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status ) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ReceivingData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occurred!, Error Not Defined.' });               }
            });
      }
   }
}
