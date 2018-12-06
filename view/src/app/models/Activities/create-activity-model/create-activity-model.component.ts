import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { ActivitiesService } from './../../../services/Activities/activities.service';
import { ActivityLevelService } from './../../../services/Configurations/Activities-config/activity-level.service';
import { AchievementTypeService } from './../../../services/Configurations/Activities-config/achievement-type.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-create-activity-model',
  templateUrl: './create-activity-model.component.html',
  styleUrls: ['./create-activity-model.component.css']
})
export class CreateActivityModelComponent implements OnInit {

   onClose: Subject<any>;

   Institutions_List: any[] = [];
   ActivityLevels_List: any[] = [];
   AchievementTypes_List: any[] = [];
   Activity_Types: any[] = [  {Key: 'Academic', Value: 'Academic'},
                              {Key: 'Co_Curricular', Value: 'Co-curricular'},
                              {Key: 'Extra_Curricular', Value: 'Extra Curricular'} ];
   ShowMaxPoints_Table: Boolean = false;

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id;

   constructor(   public bsModalRef: BsModalRef,
                  public Institutions_Service: InstitutionsService,
                  public ActivityLevel_Service: ActivityLevelService,
                  public AchievementType_Service: AchievementTypeService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
                  private Service: ActivitiesService
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  // Get Institutions List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Institutions_Service.Institution_SimpleList({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Institutions_List = DecryptedData;
                     } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401  && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
      this.onClose = new Subject();

      this.Form = new FormGroup({
         Institution: new FormControl(null, Validators.required ),
         Activity_Name: new FormControl( '', Validators.required ),
         Activity_Type: new FormControl({value: null, disabled: true}, Validators.required ),
         Max_Points: new FormControl('', Validators.required ),
         Description: new FormControl('', Validators.required ),
         Form_Extended: new FormControl(false, Validators.required ),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });

   }

   InstitutionChange(_event) {
      if (_event && _event !== '') {
         this.Form.controls['Activity_Type'].enable();
         this.Form.controls['Activity_Type'].setValue(null);
         this.Form.controls['Activity_Type'].reset();
         const Data = {'User_Id' : this.User_Id, Institution: _event['_id'] };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         // Get Activity Levels List
         this.ActivityLevel_Service.ActivityLevel_SimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.ActivityLevels_List = DecryptedData;
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401  && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Activity Levels List Getting Error!, But not Identify!' });
            }
         });
         // Get Achievement Types List
         this.AchievementType_Service.AchievementType_SimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.AchievementTypes_List = DecryptedData;
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401  && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Achievement Types List Getting Error!, But not Identify!' });
            }
         });
         if (this.Form.controls['Form_Extended'].value) {
            this.Form.controls['Activity_Levels'].setValue(null);
            this.Form.controls['Activity_Levels'].reset();
            this.Form.controls['Achievement_Types'].setValue(null);
            this.Form.controls['Achievement_Types'].reset();
            this.ActivityTypeChange(undefined);
         }
      } else {
         this.Form.controls['Activity_Type'].setValue(null);
         this.Form.controls['Activity_Type'].reset();
         this.Form.controls['Activity_Type'].disable();
         this.ActivityTypeChange(undefined);
      }
   }

   ActivityTypeChange(_event) {
      if (_event && _event['Key'] !== 'Academic') {
         this.Form.addControl('Activity_Levels',  new FormControl(null, Validators.required ));
         this.Form.addControl('Achievement_Types',  new FormControl(null, Validators.required ));
         this.Form.addControl('Skip_Activity',  new FormControl(false, Validators.required ));
         this.Form.addControl('MaxPoints_Array',  new FormArray([]));
         this.Form.controls['Max_Points'].clearValidators();
         this.Form.controls['Max_Points'].setErrors(null);
         this.Form.controls['Form_Extended'].setValue(true);
      } else {
         this.Form.removeControl('Activity_Levels');
         this.Form.removeControl('Achievement_Types');
         this.Form.removeControl('Skip_Activity');
         this.Form.removeControl('MaxPoints_Array');
         this.Form.controls['Form_Extended'].setValue(false);
         this.ShowMaxPoints_Table = false;
      }
   }

   Proceed() {
      this.Form.controls['Activity_Levels'].disable();
      this.Form.controls['Achievement_Types'].disable();
      this.Form.controls['Institution'].disable();
      this.Form.controls['Activity_Type'].disable();
      this.ShowMaxPoints_Table = true;
      const Activity_Lists: any[] = this.Form.controls['Activity_Levels'].value;
      const Achievement_Types: any[] = this.Form.controls['Achievement_Types'].value;
      const control = <FormArray>this.Form.get('MaxPoints_Array');
      Activity_Lists.map(obj => {
         Achievement_Types.map(obj_1 => {
            const value = obj['ActivityLevel'] + ' - ' + obj_1['AchievementType'];
            control.push(new FormGroup({
               ActivityLevel_And_AchievementType: new FormControl({value: value, disabled: true}, Validators.required),
               Activity_Level: new FormControl(obj['_id'], Validators.required),
               Achievement_Type: new FormControl(obj_1['_id'], Validators.required),
               Max_Points: new FormControl('', Validators.required),
            }));
         });
      });
   }


   // Submit New Activity
   onSubmit() {
      if (this.Form.valid && this.Form.status === 'VALID' && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Activities_Create({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Activity Successfully Created' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Activity!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
