import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { DepartmentService } from './../../../services/Configurations/department.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-model-institution-config',
  templateUrl: './model-institution-config.component.html',
  styleUrls: ['./model-institution-config.component.css']
})
export class ModelInstitutionConfigComponent implements OnInit {


   onClose: Subject<any>;

   Type: string;
   Data;
   _List: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id;

   constructor( public bsModalRef: BsModalRef,
                public Department_Service: DepartmentService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                private Service: InstitutionsService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  // Get Departments List
                     const Data = {'User_Id' : this.User_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Department_Service.Department_SimpleList({'Info': Info}).subscribe( response => {
                        const ResponseData = JSON.parse(response['_body']);
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this._List = DecryptedData;
                           this.updateDepartments();
                        } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else if (response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Departments List Getting Error!, But not Identify!' });
                        }
                     });
            }

   ngOnInit() {
      this.onClose = new Subject();

      // If Create New Institution
         if (this.Type === 'Create') {
            this.Form = new FormGroup({
               Institution: new FormControl( '', {  validators: Validators.required,
                                                      asyncValidators: [this.Institution_AsyncValidate.bind(this)],
                                                      updateOn: 'blur' } ),
               Institution_Code: new FormControl('', Validators.required ),
               YearOfIncorporation: new FormControl('', Validators.required ),
               Email: new FormControl('', Validators.required ),
               Phone: new FormControl('', Validators.required ),
               Website: new FormControl('', Validators.required ),
               Address: new FormControl('', Validators.required ),
               Departments: new FormControl(null, Validators.required ),
               Created_By: new FormControl( this.User_Id, Validators.required ),
            });
         }
      // If Edit New Institution
         if (this.Type === 'Edit') {
            this.Form = new FormGroup({
               Institution_Id: new FormControl(this.Data._id, Validators.required),
               Institution: new FormControl(this.Data.Institution, { validators: Validators.required,
                                                                        asyncValidators: [this.Institution_AsyncValidate.bind(this)],
                                                                        updateOn: 'blur' }),
               Institution_Code: new FormControl(this.Data.Institution_Code, Validators.required ),
               YearOfIncorporation: new FormControl(this.Data.YearOfIncorporation, Validators.required ),
               Email: new FormControl(this.Data.Email, Validators.required ),
               Phone: new FormControl(this.Data.Phone, Validators.required ),
               Website: new FormControl(this.Data.Website, Validators.required ),
               Address: new FormControl(this.Data.Address, Validators.required ),
               Departments: new FormControl(null, Validators.required ),
               Modified_By: new FormControl(this.User_Id, Validators.required)
            });
         }
   }

   updateDepartments() {
      if (this.Type === 'Edit') {
         const Departments = this.Data.Departments.map(obj => obj._id);
         this.Form.controls['Departments'].setValue(Departments);
         this.Form.controls['Departments'].disable();

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

      Institution_AsyncValidate( control: AbstractControl ) {
         const Data = { Institution: control.value, User_Id: this.User_Id  };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         return this.Service.Institution_AsyncValidate({'Info': Info}).pipe(map( response => {
            if (this.Type === 'Edit' && this.Data.Institution === control.value) {
               return null;
            } else {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
                  return null;
               } else {
                  return { Institution_NotAvailable: true};
               }
            }
         }));
      }

   // Submit New Institution
      submit() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Institution_Create({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Institution Successfully Created' } );
                  this.onClose.next({Status: true, Response: DecryptedData});
                  this.bsModalRef.hide();
               } else if (response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else if (response['status'] === 401 || response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Institution!' } );
                  this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                  this.bsModalRef.hide();
               }
            });
         }
      }

   // Update New Institution
      update() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.getRawValue();
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Institution_Update({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Institution Successfully Updated' } );
                  this.onClose.next({Status: true, Response: DecryptedData});
                  this.bsModalRef.hide();
               } else if (response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else if (response['status'] === 401 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Institution!' } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               }
            });
         }
      }


}
