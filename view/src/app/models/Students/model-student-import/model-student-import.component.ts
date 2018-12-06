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

@Component({
  selector: 'app-model-student-import',
  templateUrl: './model-student-import.component.html',
  styleUrls: ['./model-student-import.component.css']
})
export class ModelStudentImportComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   _Data;
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
                  } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
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
         Institution_Management: new FormControl({value: null, disabled: true}, Validators.required),
         Yearly_Badge: new FormControl({value: null, disabled: true}, Validators.required),
         Year: new FormControl({value: null, disabled: true}, Validators.required),
         Semester: new FormControl({value: null, disabled: true}, Validators.required),
         Section: new FormControl({value: null, disabled: true}, Validators.required),
         Students_Array: new FormArray([]),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
      for (let index = 0; index < this._Data.length; index++) {
         this.CreateStudents_Array(this._Data[index]);
      }
      setTimeout(() => {
         console.log(this.Form);
      }, 5000);
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
               Roll_No: new FormControl(Data.Roll_No, Validators.required),
               Name: new FormControl(Data.Name, Validators.required),
               Gender: new FormControl(Data.Gender, Validators.required),
               Blood_Group: new FormControl(Data.Blood_Group, Validators.required),
               Contact_Number: new FormControl(Data.Contact_Number, Validators.required),
               Email: new FormControl(Data.Email, Validators.required),
            });
   }
   InstitutionChange() {
      const Ins = this.Form.controls['Institution'].value;
      this.Form.controls['Institution_Management'].setValue(null);
      this.Form.controls['Institution_Management'].disable();
      this.Form.controls['Yearly_Badge'].setValue(null);
      this.Form.controls['Yearly_Badge'].disable();
      this.Form.controls['Year'].setValue(null);
      this.Form.controls['Year'].disable();
      this.Form.controls['Semester'].setValue(null);
      this.Form.controls['Semester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Ins !== null && Ins !== undefined && Ins !== '') {
         // Get Institution Management List
            const Data = {'User_Id' : this.User_Id, Institution_Id: Ins };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Async_Loading = true;
            this.InstitutionManagement_Service.InstitutionManagement_List({'Info': Info}).subscribe( response => {
               this.Async_Loading = false;
               const ResponseData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ResponseData['Status'] ) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  DecryptedData.map(obj => {
                     obj['CourseAndDepartment'] = obj['Course']['Course'] + ' - ' + obj['Department']['Department'];
                     return obj;
                  });
                  this.Institution_Management_List = DecryptedData;
                  console.log(this.Institution_Management_List);
                  this.Form.controls['Institution_Management'].enable();
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Courses List Getting Error!, But not Identify!' });
               }
            });
      }
   }
   InsManagementChange() {
      const Ins_Management = this.Form.controls['Institution_Management'].value;
      this.Form.controls['Yearly_Badge'].setValue(null);
      this.Form.controls['Yearly_Badge'].disable();
      this.Form.controls['Year'].setValue(null);
      this.Form.controls['Year'].disable();
      this.Form.controls['Semester'].setValue(null);
      this.Form.controls['Semester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Ins_Management !== null && Ins_Management !== undefined && Ins_Management !== '') {
         // Get Yearly Batches List
            const Data = {'User_Id' : this.User_Id, InstitutionManagement_Id: Ins_Management };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Async_Loading = true;
            this.InstitutionManagement_Service.InstitutionManagement_YearlyBatchesList({'Info': Info}).subscribe( response => {
               this.Async_Loading = false;
               const ResponseData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ResponseData['Status'] ) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  DecryptedData.map(obj => {
                     obj['Batch'] = formatDate(new Date(obj['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(obj['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
                     return obj;
                  });
                  this.Yearly_Badge_List = DecryptedData;
                  this.Form.controls['Yearly_Badge'].enable();
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Yearly Batches List Getting Error!, But not Identify!' });
               }
            });
      }
   }
   YearlyBatch_Change() {
      const Batch = this.Form.controls['Yearly_Badge'].value;
      this.Form.controls['Year'].setValue(null);
      this.Form.controls['Year'].disable();
      this.Form.controls['Semester'].setValue(null);
      this.Form.controls['Semester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Batch !== null && Batch !== undefined && Batch !== '') {
         const _index = this.Yearly_Badge_List.findIndex(obj => obj._id === Batch);
         this.Years_List = this.Yearly_Badge_List[_index]['Years_Array'];
         this.Form.controls['Year'].enable();
      }
   }
   Year_Change() {
      const Year = this.Form.controls['Year'].value;
      this.Form.controls['Semester'].setValue(null);
      this.Form.controls['Semester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Year !== null && Year !== undefined && Year !== '') {
         const Years_index = this.Years_List.findIndex(obj => obj._id === Year);
         this.Semesters_List = this.Years_List[Years_index]['Semesters'];
         this.Form.controls['Semester'].enable();
      }
   }
   Semester_Change() {
      const Semester = this.Form.controls['Semester'].value;
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Semester !== null && Semester !== undefined && Semester !== '') {
         const Semester_index = this.Semesters_List.findIndex(obj => obj._id === Semester);
         this.Sections_List = this.Semesters_List[Semester_index]['Sections_Arr'];
         this.Form.controls['Section'].enable();
      }
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
