import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';

import { InstitutionsService } from './../../../../services/Configurations/institutions.service';
import { ActivityLevelService } from './../../../../services/Configurations/Activities-config/activity-level.service';
import { ToastrService } from './../../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../../services/LoginService/login.service';

@Component({
  selector: 'app-model-activity-level',
  templateUrl: './model-activity-level.component.html',
  styleUrls: ['./model-activity-level.component.css']
})
export class ModelActivityLevelComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;
   _List: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id: any;
   User_Type: any;

   constructor( public bsModalRef: BsModalRef,
                public Service: ActivityLevelService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                private Institution_Service: InstitutionsService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
                  this._List.push(this.Login_Service.LoginUser_Info()['Staff']['Institution']);
                  setTimeout(() => {
                     this.Form.controls['Institution'].disable();
                     if (this.Type === 'Edit') {
                        this.Form.controls['Institution'].setValue(this._List[0]['_id']);
                     } else {
                        this.Form.controls['Institution'].setValue([this._List[0]['_id']]);
                     }
                  }, 100);
               } else {
                  // Get Institutions List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._List = DecryptedData;
                        this.updateInstitutions();
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                     }
                  });
               }
            }

   ngOnInit() {
      this.onClose = new Subject();

      // If Create New Activity Level
         if (this.Type === 'Create') {
            this.Form = new FormGroup({
               ActivityLevel: new FormControl( '', Validators.required),
               Institution: new FormControl(null, Validators.required ),
               Created_By: new FormControl( this.User_Id, Validators.required ),
            });
         }
      // If Edit New Activity Level
         if (this.Type === 'Edit') {
            this.Form = new FormGroup({
               ActivityLevel: new FormControl(this.Data.ActivityLevel, Validators.required),
               ActivityLevel_Id: new FormControl(this.Data._id, Validators.required),
               Institution: new FormControl(null, Validators.required ),
               Modified_By: new FormControl(this.User_Id, Validators.required)
            });
         }
   }

   updateInstitutions() {
      if (this.Type === 'Edit') {
         this.Form.controls['Institution'].setValue(this.Data.Institution._id);
         this.Form.controls['Institution'].disable();
      }
   }
   // onSubmit Function
      onSubmit() {
         if (this.Type === 'Create') {
            this.submit();
         }
         if (this.Type === 'Edit') {
            this.update();
         }
      }

   // Submit New Activity Level
      submit() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.ActivityLevel_AsyncValidate({'Info': Info}).subscribe( response => {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {

                  this.Service.ActivityLevel_Create({'Info': Info}).subscribe( response_1 => {
                     this.Uploading = false;
                     const ReceivingData_1 = JSON.parse(response_1['_body']);
                     if (response['status'] === 200 && ReceivingData_1.Status) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData_1['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Activity Level Successfully Created' } );
                        this.onClose.next({Status: true, Response: DecryptedData});
                        this.bsModalRef.hide();
                     } else if (response_1['status'] === 400 || response_1['status'] === 417 || response_1['status'] === 401  && !ReceivingData_1.Status) {
                        this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData_1['Message'] } );
                        this.onClose.next({Status: false});
                        this.bsModalRef.hide();
                     } else {
                        this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Activity Level!' } );
                        this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                        this.bsModalRef.hide();
                     }
                  });

               } else {
                  this.Form.controls['Institution'].setErrors({NotAvailable: true});
                  this.Form.updateValueAndValidity();
                  this.Uploading = false;
               }
            });
         }
      }

   // Update Activity Level
      update() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.ActivityLevelUpdate_AsyncValidate({'Info': Info}).subscribe( response => {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {

                  this.Service.ActivityLevel_Update({'Info': Info}).subscribe( response_1 => {
                     this.Uploading = false;
                     const ReceivingData_1 = JSON.parse(response_1['_body']);
                     if (response['status'] === 200 && ReceivingData_1.Status) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData_1['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Activity Level Successfully Updated' } );
                        this.onClose.next({Status: true, Response: DecryptedData});
                        this.bsModalRef.hide();
                     } else if (response_1['status'] === 400 || response_1['status'] === 417 || response_1['status'] === 401  && !ReceivingData_1.Status) {
                        this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData_1['Message'] } );
                        this.onClose.next({Status: false});
                        this.bsModalRef.hide();
                     } else {
                        this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Activity Level!' } );
                        this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                        this.bsModalRef.hide();
                     }
                  });

               } else {
                  this.Form.controls['Institution'].setErrors({NotAvailable: true});
                  this.Form.updateValueAndValidity();
                  this.Uploading = false;
               }
            });
         }
      }

}
