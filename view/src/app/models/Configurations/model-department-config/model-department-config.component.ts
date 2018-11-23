import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { CourseService } from './../../../services/Configurations/course.service';
import { DepartmentService } from './../../../services/Configurations/department.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-model-department-config',
  templateUrl: './model-department-config.component.html',
  styleUrls: ['./model-department-config.component.css']
})
export class ModelDepartmentConfigComponent implements OnInit {



   onClose: Subject<any>;

   Type: string;
   Data;
   _List: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id;

   constructor( public bsModalRef: BsModalRef,
                public Service: DepartmentService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                private Course_Service: CourseService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  // Get Courses List
                     const Data = {'User_Id' : this.User_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Course_Service.Course_SimpleList({'Info': Info}).subscribe( response => {
                        const ResponseData = JSON.parse(response['_body']);
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this._List = DecryptedData;
                           this.updateCourses();
                        } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else if (response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Course List Getting Error!, But not Identify!' });
                        }
                     });
            }

   ngOnInit() {
      this.onClose = new Subject();

      // If Create New Department
         if (this.Type === 'Create') {
            this.Form = new FormGroup({
               Department: new FormControl( '', {  validators: Validators.required,
                                                      asyncValidators: [this.Department_AsyncValidate.bind(this)],
                                                      updateOn: 'blur' } ),
               Department_Code: new FormControl('', Validators.required ),
               Courses: new FormControl(null, Validators.required ),
               Created_By: new FormControl( this.User_Id, Validators.required ),
            });
         }
      // If Edit New Department
         if (this.Type === 'Edit') {
            this.Form = new FormGroup({
               Department: new FormControl(this.Data.Department, { validators: Validators.required,
                                                                        asyncValidators: [this.Department_AsyncValidate.bind(this)],
                                                                        updateOn: 'blur' }),
               Department_Code: new FormControl(this.Data.Department_Code, Validators.required ),
               Department_Id: new FormControl(this.Data._id, Validators.required),
               Courses: new FormControl(null, Validators.required ),
               Modified_By: new FormControl(this.User_Id, Validators.required)
            });
         }
   }

   updateCourses() {
      if (this.Type === 'Edit') {
         const Courses = this.Data.Courses.map(obj => obj._id);
         this.Form.controls['Courses'].setValue(Courses);
         this.Form.controls['Courses'].disable();

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

      Department_AsyncValidate( control: AbstractControl ) {
         const Data = { Department: control.value, User_Id: this.User_Id  };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         return this.Service.Department_AsyncValidate({'Info': Info}).pipe(map( response => {
            if (this.Type === 'Edit' && this.Data.Department === control.value) {
               return null;
            } else {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
                  return null;
               } else {
                  return { Department_NotAvailable: true};
               }
            }
         }));
      }

   // Submit New Department
      submit() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Department_Create({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Department Successfully Created' } );
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
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Department!' } );
                  this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                  this.bsModalRef.hide();
               }
            });
         }
      }

   // Update New Department
      update() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.getRawValue();
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Department_Update({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Department Successfully Updated' } );
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
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Department!' } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               }
            });
         }
      }


}
