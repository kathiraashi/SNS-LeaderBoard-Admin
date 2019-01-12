import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { InstitutionsService } from './../../../services/Configurations/institutions.service';

import * as CryptoJS from 'crypto-js';

import { LoginService } from './../../../services/LoginService/login.service';
import { StaffsService } from './../../../services/Staffs/staffs.service';

import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {

   User_Id: any;
   User_Type: any;

   _Institutions: any[] = [];
   _Departments: any[] = [];
   Staff_List: any[] = [];
   Loader: Boolean = true;
   Loader_1: Boolean = true;

   Form: FormGroup;

  constructor( public Login_Service: LoginService,
               public Staff_Service: StaffsService,
               public Institutions_Service: InstitutionsService,
               private Toastr: ToastrService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
                  this._Institutions.push(this.Login_Service.LoginUser_Info()['Staff']['Institution']);
                  if (this.User_Type !== 'Principal') {
                     this._Departments.push(this.Login_Service.LoginUser_Info()['Staff']['Department']);
                  }
                  setTimeout(() => {
                     this.Form.controls['Institution'].setValue(this._Institutions[0]['_id']);
                     this.Form.controls['Institution'].disable();
                     this.Loader = false;
                     if (this.User_Type !== 'Principal') {
                        this.Form.controls['Department'].setValue(this._Departments[0]['_id']);
                        this.Form.controls['Department'].disable();
                        this.DepartmentChange();
                     } else {
                        this.InstitutionChange();
                     }
                  }, 100);
               } else {
                  // Get Institutions List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Institutions_Service.Institution_SimpleList({'Info': Info}).subscribe( response => {
                     this.Loader = false;
                     const ResponseData = JSON.parse(response['_body']);
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._Institutions = DecryptedData;
                        this.Form.controls['Institution'].setValue(this._Institutions[0]['_id']);
                        this.InstitutionChange();
                     } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                     }
                  });
               }
            }

   ngOnInit() {
      this.Form = new FormGroup({
         Institution: new FormControl(null),
         Department: new FormControl({value: null, disabled: true})
      });
   }


   InstitutionChange() {
      const Institution = this.Form.controls['Institution'].value;
      this.Form.controls['Department'].setValue(null);
      this.Form.controls['Department'].disable();
      if (Institution !== null && Institution !== undefined) {
         // Get Staff's List
         const Data = {'User_Id' : this.User_Id, Institution: Institution };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Staff_Service.InstitutionBased_StaffsList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Loader_1 = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Staff_List = DecryptedData;
               console.log(this.Staff_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Staff List Getting Error!, But not Identify!' });
            }
         });
         this.Institutions_Service.InstitutionBased_DepartmentsSimpleList({'Info': Info}).subscribe( response => {
            this.Loader = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._Departments = DecryptedData;
               this.Form.controls['Department'].enable();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.Staff_List = [];
         this._Departments = [];
      }
   }


   DepartmentChange() {
      const Institution = this.Form.controls['Institution'].value;
      const Department = this.Form.controls['Department'].value;
      if (Department !== null && Department !== undefined) {
         const Data = {'User_Id' : this.User_Id, Institution: Institution, Department: Department };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Staff_Service.DepartmentBased_StaffsList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Loader_1 = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Staff_List = DecryptedData;
               console.log(this.Staff_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Staff List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.InstitutionChange();
      }
   }


}
