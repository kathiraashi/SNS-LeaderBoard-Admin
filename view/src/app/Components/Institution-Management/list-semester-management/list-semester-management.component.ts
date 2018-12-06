import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelSemesterInfoCreateComponent } from './../../../models/Institution-Management/model-semester-info-create/model-semester-info-create.component';
import { ModelSemesterInfoViewComponent } from './../../../models/Institution-Management/model-semester-info-view/model-semester-info-view.component';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../services/LoginService/login.service';


@Component({
  selector: 'app-list-semester-management',
  templateUrl: './list-semester-management.component.html',
  styleUrls: ['./list-semester-management.component.css']
})
export class ListSemesterManagementComponent implements OnInit {

   bsModalRef: BsModalRef;
   _Basic_Data;
   _Semesters_List: any[] = [];

   Loader: Boolean = true;
   YearlyBatch_Id;

   User_Id;

   constructor(
            private modalService: BsModalService,
            private Toastr: ToastrService,
            public Login_Service: LoginService,
            public Service: InstitutionManagementService,
            public router: Router,
            private active_route: ActivatedRoute,
         ) {
            this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            // Get Institutions List
            this.active_route.url.subscribe((u) => {
               this.YearlyBatch_Id = this.active_route.snapshot.params['YearlyBatch_Id'];
               const Data = {'User_Id' : this.User_Id, 'YearlyBatch_Id': this.YearlyBatch_Id};
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Loader = true;
               this.Service.InstitutionManagement_SemesterManagementsList({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  this.Loader = false;
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Basic_Data'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._Basic_Data = DecryptedData;
                     const CryptoBytes_1  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData_1 = JSON.parse(CryptoBytes_1.toString(CryptoJS.enc.Utf8));
                     this._Semesters_List = DecryptedData_1;
                     this.Loader = false;
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status'] || response['status'] === 401) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Semesters List Getting Error!, But not Identify!' });
                  }
               });
            });
         }

   ngOnInit() {

   }

   // Create Semester Details
   CreateSemesterDetails() {
      const initialState = { Type: 'Create', Data: this._Basic_Data };
      this.bsModalRef = this.modalService.show(ModelSemesterInfoCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-70' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            const Data = {'User_Id' : this.User_Id, 'SemesterManagement_Id': response['Response']._id};
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.InstitutionManagement_SemesterManagementView({'Info': Info}).subscribe( response_1 => {
               const ResponseData = JSON.parse(response_1['_body']);
               if (response_1['status'] === 200 && ResponseData['Status'] ) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this._Semesters_List.splice(0, 0, DecryptedData);
               } else if (response_1['status'] === 400 || response_1['status'] === 417 && !ResponseData['Status'] || response_1['status'] === 401) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Semester Details View Getting Error!, But not Identify!' });
               }
            });
         }
      });
   }

      // View Semester Details
      ViewSemesterDetails(_index) {
         const initialState = { Type: 'View', Data: this._Semesters_List[_index] };
         this.bsModalRef = this.modalService.show(ModelSemesterInfoViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-80' }));
      }

}
