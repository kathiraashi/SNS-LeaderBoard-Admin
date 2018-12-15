import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject, from } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as CryptoJS from 'crypto-js';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { StudentsService } from './../../../services/Students/students.service';


import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-model-student-import',
  templateUrl: './model-student-import.component.html',
  styleUrls: ['./model-student-import.component.css']
})
export class ModelStudentImportComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   _Data;
   _BasicData: Object = {};
   Institutions_List: any[] = [];
   Institution_Management_List: any[] = [];
   Yearly_Badge_List: any[] = [];
   Years_List: any[] = [];
   Semesters_List: any[] = [];
   Sections_List: any[] = [];

   Uploading: Boolean = false;
   Async_Loading: Boolean = false;
   Form: FormGroup;
   User_Id;

constructor(   public bsModalRef: BsModalRef,
               private Service: StudentsService,
               private Toastr: ToastrService,
               private Institutions_Service: InstitutionsService,
               private InstitutionManagement_Service: InstitutionManagementService,
               public Login_Service: LoginService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            }

   ngOnInit() {
      this.onClose = new Subject();
      this.Institutions_List.push(this._BasicData['Institution']);
      this.Institution_Management_List.push(this._BasicData['Institution_Management']);
      this.Yearly_Badge_List.push(this._BasicData['Yearly_Badge']);

      this.Form = new FormGroup({
         Institution: new FormControl({value: this._BasicData['Institution']['_id'], disabled: true}, Validators.required ),
         Institution_Management: new FormControl({value: this._BasicData['Institution_Management']['_id'], disabled: true}, Validators.required),
         Yearly_Badge: new FormControl({value: this._BasicData['Yearly_Badge']['_id'], disabled: true}, Validators.required),
         Students_Array: new FormArray([]),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
      for (let index = 0; index < this._Data.length; index++) {
         this.CreateStudents_Array(this._Data[index]);
      }
   }

   CreateStudents_Array(Data) {
      const control = <FormArray>this.Form.get('Students_Array');
      control.push(this.NewStudentFormGroup(Data));
   }
   Remove_Student(_index: number) {
      const control = <FormArray>this.Form.controls['Students_Array'];
      control.removeAt(_index);
   }

   NewStudentFormGroup(Data) {
      return new FormGroup({
               Reg_No: new FormControl(Data.Reg_No, { validators: Validators.required,
                                                      asyncValidators: [this.RegNo_AsyncValidate.bind(this)],
                                                      updateOn: 'blur' }),
               Name: new FormControl(Data.Name, Validators.required),
               Gender: new FormControl(Data.Gender, Validators.required),
               Blood_Group: new FormControl(Data.Blood_Group, Validators.required),
               Contact_Number: new FormControl(Data.Contact_Number, Validators.required),
               Email: new FormControl(Data.Email, Validators.required),
            });
   }


   RegNo_AsyncValidate( control: AbstractControl ) {
      const Data = { Reg_No: control.value, User_Id: this.User_Id, Institution: this._BasicData['Institution']['_id']  };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.StudentRegNo_AsyncValidate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { Course_NotAvailable: true};
         }
      }));
   }


   Submit() {
      if (this.Form.status === 'VALID' && !this.Async_Loading && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Students_Import({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               console.log(DecryptedData);
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Students Successfully Imported' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Students Import Failed !, Error Not Identified!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
