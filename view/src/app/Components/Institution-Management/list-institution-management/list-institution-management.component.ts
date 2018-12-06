import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-list-institution-management',
  templateUrl: './list-institution-management.component.html',
  styleUrls: ['./list-institution-management.component.css']
})
export class ListInstitutionManagementComponent implements OnInit {

   _Institutions_List: any[] = [];
   _List: any[] = [];
   Loader: Boolean = true;
   Loader_1: Boolean = true;
   Institution_Id;

   User_Id;

   constructor(
            private Service: InstitutionsService,
            private Toastr: ToastrService,
            public Login_Service: LoginService,
            public Institution_ManagementService: InstitutionManagementService,
            private active_route: ActivatedRoute,
         ) {
            this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            this.active_route.url.subscribe((u) => {
               this.Institution_Id = this.active_route.snapshot.params['Institution_Id'];
            });
            // Get Institutions List
               const Data = {'User_Id' : this.User_Id };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Loader = true;
               this.Service.Institution_SimpleList({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  this.Loader = false;
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._Institutions_List = DecryptedData;
                     this._Institutions_List = this._Institutions_List.map(obj => {
                        obj.class = '';
                        return obj;
                     });
                     if (this.Institution_Id && this.Institution_Id !== '') {
                        const _index = this._Institutions_List.findIndex(obj => obj._id === this.Institution_Id);
                        this.Load_Courses(_index);
                     } else {
                        this.Load_Courses(0);
                     }
                     this.Loader = false;
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else if (response['status'] === 401 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institution List Getting Error!, But not Identify!' });
                  }
               });
         }

   ngOnInit() {

   }

   Load_Courses(_index) {
      this.Loader_1 = true;
      this._Institutions_List = this._Institutions_List.map(obj => { obj.class = ''; return obj; } );
      this._Institutions_List[_index].class = 'active';
      // Get Courses List
      const Data = {'User_Id' : this.User_Id, Institution_Id: this._Institutions_List[_index]._id };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Institution_ManagementService.InstitutionManagement_List({'Info': Info}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         this.Loader_1 = false;
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._List = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Courses List Getting Error!, But not Identify!' });
         }
      });
   }


}
