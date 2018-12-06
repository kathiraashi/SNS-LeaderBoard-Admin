import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { ActivitiesService } from './../../../services/Activities/activities.service';
import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { LevelsService } from './../../../services/levels/levels.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-create-level-model',
  templateUrl: './create-level-model.component.html',
  styleUrls: ['./create-level-model.component.css']
})
export class CreateLevelModelComponent implements OnInit {


   onClose: Subject<any>;

   Type: string;
   Data;
   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Activities: any[] = [];
   _Previous_Levels: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id;

   constructor( public bsModalRef: BsModalRef,
                public Service: LevelsService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                private Institution_Service: InstitutionsService,
                private Activities_Service: ActivitiesService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               // Get Institution List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._Institutions = DecryptedData;
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
      this.onClose = new Subject();

      this.Form = new FormGroup({
         Level_Name: new FormControl('', Validators.required ),
         Institution: new FormControl({value: null, disabled: true}, Validators.required ),
         Department: new FormControl({value: null, disabled: true}, Validators.required ),
         Activities: new FormControl({value: null, disabled: true}, Validators.required ),
         ItsBaseLevel: new FormControl({value: true, disabled: true}, Validators.required ),
         EligiblePoints: new FormControl(null),
         EligiblePreviousLevel: new FormControl(null),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
   }

   LevelNameChange(_event) {
      if (_event !== '') {
         this.Form.controls['Institution'].enable();
      } else {
         this.Form.controls['Institution'].disable();
      }
   }

   InstitutionChange(_event) {
      if (_event && _event !== null && _event !== '') {
         this.Form.controls['Department'].setValue(null);
         this.Form.controls['Activities'].setValue(null);
         this.Form.controls['Department'].enable();
         this._Departments = _event['Departments'];
         // Get Activities List
         const Data = {'User_Id' : this.User_Id, 'Institution': _event['_id'] };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Activities_Service.Activities_SimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._Activities = DecryptedData;
               this.Form.controls['Activities'].enable();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Activities List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.Form.controls['Department'].setValue(null);
         this.Form.controls['Department'].disable();
         this.Form.controls['Activities'].disable();
      }
   }

   ValidateNameAndDepartment() {
      const Name = this.Form.controls['Level_Name'].value;
      const Department = this.Form.controls['Department'].value;
      if (Name && Name !== '' && Department && Department !== null) {
         const Data = {'User_Id' : this.User_Id, 'Level_Name': Name, 'Department': Department };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Levels_Create_Validate({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               if (ResponseData['NameAvailable']) {
                  this.Form.controls['Level_Name'].setErrors(null);
               } else {
                  this.Form.controls['Level_Name'].setErrors({LevelName_NotAvailable: true});
               }
               this.Form.controls['ItsBaseLevel'].setValue(ResponseData['ItsBaseLevel']);
               this.BaseLevelChangeCheck();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Level Create Validate Getting Error!, But not Identify!' });
            }
         });
      }
   }

   BaseLevelChangeCheck() {
      if (!this.Form.controls['ItsBaseLevel'].value) {
         const Department = this.Form.controls['Department'].value;
         const Data = {'User_Id' : this.User_Id, 'Department': Department };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.DepartmentBased_Levels_SimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._Previous_Levels = DecryptedData;
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Level Create Validate Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.Form.controls['EligiblePoints'].setValue(null);
         this.Form.controls['EligiblePreviousLevel'].setValue(null);
      }
   }


   // Submit New Level
       onSubmit() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.getRawValue();
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Levels_Create({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Levels Successfully Created' } );
                  this.onClose.next({Status: true, Response: DecryptedData});
                  console.log(DecryptedData);
                  this.bsModalRef.hide();
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Levels!' } );
                  this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                  this.bsModalRef.hide();
               }
            });
         }
      }

}
