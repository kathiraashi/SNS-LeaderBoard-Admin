import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { LoginService } from './../../../services/LoginService/login.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';

import { StaffsService } from './../../../services/Staffs/staffs.service';

import {NativeDateAdapter} from '@angular/material';
import {DateAdapter} from '@angular/material/core';
export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
   }
}


@Component({
  selector: 'app-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrls: ['./staff-create.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class StaffCreateComponent implements OnInit {

   _StaffRole: any[] =  [ 'Principal', 'HOD', 'Professor', 'Assistant Professor', 'User'];
   _Gender: any[] = ['Male', 'Female', 'Other' ];

   User_Id;

   Loader: Boolean = true;
   Async_Loading: Boolean = true;
   Show_Department: Boolean = true;

   Institutions_List: any[] = [];
   Departments_List: any[] = [];

   Form: FormGroup;

   Uploading: Boolean = false;


  constructor(
               public Login_Service: LoginService,
               private Toastr: ToastrService,
               private Institutions_Service: InstitutionsService,
               private Staffs_Service: StaffsService,
               public router: Router
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               // Get Institutions List
               const Data = {'User_Id' : this.User_Id };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Institutions_Service.Institution_List({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this.Institutions_List = DecryptedData;
                  } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                  }
               });
            }

   ngOnInit() {
      this.Form = new FormGroup({
         Institution: new FormControl(null, Validators.required ),
         Department: new FormControl({value: null, disabled: true}, Validators.required),
         StaffRole: new FormControl(null, Validators.required),

         Name: new FormControl(null, Validators.required),
         Qualification: new FormControl(null, Validators.required),
         DateOfJoining: new FormControl(null, Validators.required),
         Gender: new FormControl('Male', Validators.required),
         BloodGroup: new FormControl(null, Validators.required),
         DateOfBirth: new FormControl(null, Validators.required),
         Mobile: new FormControl(null, Validators.required),
         Email: new FormControl(null, Validators.required),
         Address: new FormControl(null, Validators.required),

         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
   }

   NotAllow(): boolean {return false; }

   StaffRoll_Change(Roll) {
      if (Roll === 'Principal') {
         this.Form.controls['Department'].setValue(null);
         this.Form.controls['Department'].clearValidators();
         this.Form.updateValueAndValidity();
         this.Show_Department = false;
      } else {
         this.Show_Department = true;
         this.Form.controls['Department'].setValidators(Validators.required);
         if (this.Form.controls['Institution'].status === 'VALID') {
            this.Form.controls['Department'].enable();
         } else {
            this.Form.controls['Department'].disable();
         }
      }
   }

   Institution_Change(Ins) {
      if (Ins !== null && Ins !== undefined && Ins !== '') {
         this.Departments_List = Ins['Departments'];
         this.Form.controls['Department'].enable();
      } else {
         this.Form.controls['Department'].setValue(null);
         this.Form.controls['Department'].disable();
      }
   }

   Submit() {
       if (this.Form.status === 'VALID' && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Staffs_Service.Staff_Create({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Staff Successfully Created' } );
               this.router.navigate(['/Staff_List']);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Staff Create Failed !, Error Not Identified!' } );
            }
         });
       }
   }
}
