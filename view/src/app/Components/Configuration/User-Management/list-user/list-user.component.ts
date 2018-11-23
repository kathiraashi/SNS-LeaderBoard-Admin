import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { CreateUserManagementComponent } from './../../../../models/User_Management/create-user-management/create-user-management.component';

import { AdminService } from './../../../../services/Admin/admin.service';
import { LoginService } from './../../../../services/LoginService/login.service';
import { ToastrService } from './../../../../services/common-services/toastr-service/toastr.service';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

   bsModalRef: BsModalRef;
   Loader: Boolean = true;
   _List: any[] = [];
   User_Id;
   User_Type;

   constructor(
               private modalService: BsModalService,
               private Service: AdminService,
               private Login_Service: LoginService,
               private Toastr: ToastrService
            ) {
               //  Get Users List
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               this.Loader = true;
               const Data = { User_Id : this.User_Id };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Service.Users_List({'Info': Info}).subscribe( response => {
                  this.Loader = false;
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._List = DecryptedData;
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage( { Type: 'Error', Message: response['Message'] } );
                  } else if (response['status'] === 401 && !ResponseData['Status']) {
                    this.Toastr.NewToastrMessage( { Type: 'Error', Message: response['Message'] } );
                  } else {
                     this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Users List Getting Error!, Error not Identify!' } );
                  }
               });
            }

   ngOnInit() {
   }

   CreateUser() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(CreateUserManagementComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this._List.splice(0, 0, response['Response']);
         }
      });
   }

}
