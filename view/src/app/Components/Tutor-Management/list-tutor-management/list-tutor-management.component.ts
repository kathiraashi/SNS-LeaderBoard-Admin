import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelTutorManagementCreateComponent } from './../../../models/Tutor-Management/model-tutor-management-create/model-tutor-management-create.component';
import { ModelTutorManagementViewComponent } from './../../../models/Tutor-Management/model-tutor-management-view/model-tutor-management-view.component';


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
   _Tutors_List: any[] = [];
   _TutorManagements_List: any[] = [];

   Loader: Boolean = true;
   User_Id;

  constructor(
                  private modalService: BsModalService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
                  public Service: TutorManagementService,
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  // Get Staff's List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Service.TutorManagement_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._TutorManagements_List = DecryptedData;
                        console.log(this._TutorManagements_List);
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Tutor Management List Getting Error!, But not Identify!' });
                     }
                  });
               }

  ngOnInit() {

   setTimeout(() => {
      this.Loader = false;
   }, 1000);
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
