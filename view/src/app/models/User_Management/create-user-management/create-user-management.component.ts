import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { LoginService } from './../../../services/LoginService/login.service';
import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { StaffsService } from './../../../services/Staffs/staffs.service';
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
   Data: any;
   _Institutions: any[] = [];
   _UserTypes: any[] =  ['Sub Admin', 'Principal', 'HOD', 'Professor', 'Assistant Professor', 'User'];
   Uploading: Boolean = false;
   User_Id: any;
   User_Type: any;

   _Staffs: any[] = [];

   Form: FormGroup;

  constructor(
               public bsModalRef: BsModalRef,
               public Login_Service: LoginService,
               public Service: AdminService,
               private Toastr: ToastrService,
               public Institution_Service: InstitutionsService,
               public Staff_Service: StaffsService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               if (this.Login_Service.LoginUser_Info()['User_Type'] === 'Principal') {
                  this._UserTypes = this._UserTypes.slice(2);
               }
               if (this.Login_Service.LoginUser_Info()['User_Type'] === 'HOD') {
                  this._UserTypes = this._UserTypes.slice(3);
               }
            }

   ngOnInit() {
      this.onClose = new Subject();

      this.Form = new FormGroup({
         User_Id: new FormControl(this.User_Id ),
         User_Name: new FormControl('', { validators: Validators.required,
                                          asyncValidators: [this.UserNameAsyncValidate.bind(this)],
                                          updateOn: 'blur' }),
         User_Password: new FormControl('', Validators.required),
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

   UserType_Change() {
      const Type = this.Form.controls['User_Type'].value;
      this.Form.removeControl('Institution');
      this.Form.removeControl('Staff');
      this.Form.removeControl('Name');
      this.Form.removeControl('Email');
      this.Form.removeControl('Phone');

      if (Type && Type !== null && Type !== '') {
         if (Type !== 'Sub Admin') {
            if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
               this._Institutions.push(this.Login_Service.LoginUser_Info()['Staff']['Institution']);
               this.Form.addControl('Institution', new FormControl(this.Login_Service.LoginUser_Info()['Staff']['Institution']['_id'], Validators.required));
               this.Institution_Change();
            } else {
               this.Form.addControl('Institution', new FormControl(null, Validators.required));
               const Data = {'User_Id' : this.User_Id };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Institution_Service.Institution_SimpleList({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._Institutions = DecryptedData;
                  } else if (response['status'] === 400 || response['status'] === 401 || response['status'] === 417 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institution List Getting Error!, But not Identify!' });
                  }
               });
            }
         } else {
            this.Form.addControl('Name', new FormControl(null, Validators.required));
            this.Form.addControl('Email', new FormControl(null, [Validators.required, Validators.email]));
            this.Form.addControl('Phone', new FormControl(null));
         }
      }
   }

   Institution_Change() {
      const Institution = this.Form.controls['Institution'].value;
      const Type = this.Form.controls['User_Type'].value;
      if (Institution && Institution !== null && Institution !== '') {
         this.Form.addControl('Staff', new FormControl(null, Validators.required));
         const Data = {'User_Id' : this.User_Id, Institution: Institution, Roll: Type };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Staff_Service.InstitutionAndRollBased_StaffsSimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  if (obj['Department'] !== null) {
                     obj['NameAndDepartment'] = obj['Name'] + ' - ' +  obj['Department']['Department'];
                  } else {
                     obj['NameAndDepartment'] = obj['Name'];
                  }
                  return obj;
               });
               this._Staffs = DecryptedData;
            } else if (response['status'] === 400 || response['status'] === 401 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Staffs List Getting Error!, But not Identify!' });
            }
         });
      }
   }

   submit() {
      if (this.Form.valid && this.Form.status === 'VALID') {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
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
