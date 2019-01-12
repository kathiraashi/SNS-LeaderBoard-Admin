import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelTutorManagementCreateComponent } from './../../../models/Tutor-Management/model-tutor-management-create/model-tutor-management-create.component';
import { ModelTutorManagementViewComponent } from './../../../models/Tutor-Management/model-tutor-management-view/model-tutor-management-view.component';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';

import { TutorManagementService } from './../../../services/Tutor-Management/tutor-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../services/LoginService/login.service';


@Component({
  selector: 'app-list-tutor-management',
  templateUrl: './list-tutor-management.component.html',
  styleUrls: ['./list-tutor-management.component.css']
})
export class ListTutorManagementComponent implements OnInit {

   bsModalRef: BsModalRef;

   _Institutions: any[] = [];
   _Departments: any[] = [];

   _TutorManagements_List: any[] = [];

   Loader: Boolean = true;
   Loader_1: Boolean = true;

   User_Id: any;
   User_Type: any;

   Form: FormGroup;

  constructor(
                  private modalService: BsModalService,
                  public Institutions_Service: InstitutionsService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
                  public Service: TutorManagementService,
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
                  if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
                     this._Institutions.push(this.Login_Service.LoginUser_Info()['Staff']['Institution']);
                     if (this.User_Type !== 'Principal') {
                        this._Departments.push(this.Login_Service.LoginUser_Info()['Staff']['Department']);
                     }
                     setTimeout(() => {
                        this.Form.controls['Institution'].setValue(this._Institutions[0]['_id']);
                        this.Form.controls['Institution'].disable();
                        this.Loader = false;
                        if (this.User_Type !== 'Principal') {
                           this.Form.controls['Department'].setValue(this._Departments[0]['_id']);
                           this.Form.controls['Department'].disable();
                           this.DepartmentChange();
                        } else {
                           this.InstitutionChange();
                        }
                     }, 100);
                  } else {
                     // Get Institutions List
                     const Data = {'User_Id' : this.User_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Loader = true;
                     this.Institutions_Service.Institution_SimpleList({'Info': Info}).subscribe( response => {
                        this.Loader = false;
                        const ResponseData = JSON.parse(response['_body']);
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this._Institutions = DecryptedData;
                           this.Form.controls['Institution'].setValue(this._Institutions[0]['_id']);
                           this.InstitutionChange();
                        } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                        }
                     });
                  }
               }

   ngOnInit() {
      this.Form = new FormGroup({
         Institution: new FormControl(null),
         Department: new FormControl({value: null, disabled: true})
      });
   }


   InstitutionChange() {
      const Institution = this.Form.controls['Institution'].value;
      this.Form.controls['Department'].setValue(null);
      this.Form.controls['Department'].disable();
      if (Institution !== null && Institution !== undefined) {
         // Get Staff's List
         const Data = {'User_Id' : this.User_Id, Institution: Institution };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Service.TutorManagement_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Loader_1 = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._TutorManagements_List = DecryptedData;
               console.log(this._TutorManagements_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Tutor Managements List Getting Error!, But not Identify!' });
            }
         });
         this.Institutions_Service.InstitutionBased_DepartmentsSimpleList({'Info': Info}).subscribe( response => {
            this.Loader = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._Departments = DecryptedData;
               this.Form.controls['Department'].enable();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this._TutorManagements_List = [];
         this._Departments = [];
      }
   }


   DepartmentChange() {
      const Institution = this.Form.controls['Institution'].value;
      const Department = this.Form.controls['Department'].value;
      if (Department !== null && Department !== undefined) {
         const Data = {'User_Id' : this.User_Id, Institution: Institution, Department: Department };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Service.TutorManagement_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Loader_1 = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._TutorManagements_List = DecryptedData;
               console.log(this._TutorManagements_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Tutor Managements List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.InstitutionChange();
      }
   }

   // Create Tutor Management
   CreateTutorManagement() {
      const initialState = { Type: 'Create'};
      this.bsModalRef = this.modalService.show(ModelTutorManagementCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-80' }));
   }

   ViewTutorManagement(_index) {
      const initialState = { Data: this._TutorManagements_List[_index] };
      this.bsModalRef = this.modalService.show(ModelTutorManagementViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-85' }));

   }

}
