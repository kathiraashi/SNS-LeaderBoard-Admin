import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { LoginService } from './../../../services/LoginService/login.service';
import { AdminService  } from './../../../services/Admin/admin.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-create-user-management',
  templateUrl: './create-user-management.component.html',
  styleUrls: ['./create-user-management.component.css']
})
export class CreateUserManagementComponent implements OnInit {


   onClose: Subject<any>;

   Type: String;
   Data;
   _Institutions: any[] = [];
   _Departments: any[] = [];
   _UserTypes: any[] =  ['Sub-Admin'];
   Uploading: Boolean = false;
   User_Id;
   Form: FormGroup;

  constructor(
               public bsModalRef: BsModalRef,
               public Login_Service: LoginService,
               public Service: AdminService,
               private Toastr: ToastrService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            }

   ngOnInit() {
      this.onClose = new Subject();

      this.Form = new FormGroup({
         User_Id: new FormControl(this.User_Id ),
         User_Name: new FormControl('', { validators: Validators.required,
                                          asyncValidators: [this.UserNameAsyncValidate.bind(this)],
                                          updateOn: 'blur' }),
         User_Password: new FormControl('', Validators.required),
         Name: new FormControl('', Validators.required ),
         Email: new FormControl('', [Validators.required, Validators.email]),
         Phone: new FormControl(''),
         User_Type: new FormControl(null, Validators.required),
      });
   }

   UserNameAsyncValidate( control: AbstractControl ) {
      const Data = { User_Id: this.User_Id, User_Name: control.value };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.User_Name_Validate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { UserName_NotAvailable: true};
         }
      }));
   }

   submit() {
      if (this.Form.valid && this.Form.status === 'VALID') {
         this.Uploading = true;
         const Data = this.Form.value;
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.User_Create({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData['Status']) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 && !ReceivingData['Status']) {
               this.onClose.next({Status: false, Message: ReceivingData['Message'] });
               this.bsModalRef.hide();
            } else {
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }


}
