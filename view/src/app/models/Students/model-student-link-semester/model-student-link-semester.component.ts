import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as CryptoJS from 'crypto-js';

import { StudentsService } from './../../../services/Students/students.service';

import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-model-student-link-semester',
  templateUrl: './model-student-link-semester.component.html',
  styleUrls: ['./model-student-link-semester.component.css']
})
export class ModelStudentLinkSemesterComponent implements OnInit {

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

   Students_List: any[] = [];

   Uploading: Boolean = false;
   Async_Loading: Boolean = false;
   Form: FormGroup;
   User_Id;

   AllStudentSelected: Boolean = false;

   constructor(   public bsModalRef: BsModalRef,
                  private Service: StudentsService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               }

   ngOnInit() {
      this.onClose = new Subject();
      this.Institutions_List.push(this._BasicData['Institution']);
      this.Institution_Management_List.push(this._BasicData['Institution_Management']);
      this.Yearly_Badge_List.push(this._BasicData['Yearly_Badge']);
      this.Years_List.push(this._BasicData['Year']);
      this.Semesters_List.push(this._BasicData['Semester']);
      this.Sections_List = this._BasicData['Sections_Arr'];

      this.Form = new FormGroup({
         Institution: new FormControl({value: this._BasicData['Institution']['_id'], disabled: true}, Validators.required ),
         Institution_Management: new FormControl({value: this._BasicData['Institution_Management']['_id'], disabled: true}, Validators.required),
         Yearly_Badge: new FormControl({value: this._BasicData['Yearly_Badge']['_id'], disabled: true}, Validators.required),
         Year: new FormControl({value: this._BasicData['Year']['_id'], disabled: true}, Validators.required),
         Semester: new FormControl({value: this._BasicData['Semester']['_id'], disabled: true}, Validators.required),
         Section: new FormControl(null, Validators.required),
         Students_Array: new FormControl(null, Validators.required),
         Created_By: new FormControl( this.User_Id, Validators.required ),
         User_Id: new FormControl( this.User_Id, Validators.required ),
      });


      let Info = CryptoJS.AES.encrypt(JSON.stringify(this.Form.getRawValue()), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Service.SemesterUnlinked_StudentsList({'Info': Info}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            console.log(DecryptedData);
            DecryptedData.map(obj => {
               obj['Selected'] = false;
               return obj;
            });
            this.Students_List = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
         }
      });
   }


   SelectAll() {
      if (this.AllStudentSelected) {
         let Students_Array = [];
         this.Students_List = this.Students_List.map(obj => {  obj['Selected'] = true;
                                                               Students_Array.push(obj['_id']);
                                                               return obj;
                                                            });
         if (Students_Array.length <= 0) { Students_Array = null; }
         this.Form.controls['Students_Array'].setValue(Students_Array);
      }
   }
   SomeSelectChange() {
      let Students_Array = [];
      this.Students_List.map(obj => { if ( !obj['Selected'] ) { this.AllStudentSelected = false;  } });
      this.Students_List.map(obj => { if ( obj['Selected'] ) { Students_Array.push(obj['_id']); } });
      if (Students_Array.length <= 0) { Students_Array = null; }
      this.Form.controls['Students_Array'].setValue(Students_Array);
   }


   Submit() {
      if (this.Form.status === 'VALID' && !this.Async_Loading && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Students_LinkSection({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               console.log(DecryptedData);
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Students Successfully Linked' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Failed !, Error Not Identified!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
