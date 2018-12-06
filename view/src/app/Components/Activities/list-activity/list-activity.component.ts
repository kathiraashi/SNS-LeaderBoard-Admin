import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as CryptoJS from 'crypto-js';

import { LoginService } from './../../../services/LoginService/login.service';
import { ActivitiesService } from './../../../services/Activities/activities.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';


import { CreateActivityModelComponent } from '../../../models/Activities/create-activity-model/create-activity-model.component';
import { ViewActivityModelComponent } from '../../../models/Activities/view-activity-model/view-activity-model.component';
import { DeleteConfirmationComponent } from '../../Common-Components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-list-activity',
  templateUrl: './list-activity.component.html',
  styleUrls: ['./list-activity.component.css']
})
export class ListActivityComponent implements OnInit {

   bsModalRef: BsModalRef;
   User_Id;

   Activities_List: any[] = [];
   Loader: Boolean = true;

   constructor(   private modalService: BsModalService,
                  public Login_Service: LoginService,
                  public Service: ActivitiesService,
                  private Toastr: ToastrService
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  // Get Institutions List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Service.Activities_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Activities_List = DecryptedData;
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
   }

   CreateActivity() {
      const initialState = {
      Type: 'Create'
      };
      this.bsModalRef = this.modalService.show(CreateActivityModelComponent, Object.assign({initialState}, { ignoreBackdropClick: true, class: 'modal-lg max-width-75' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this.Activities_List.splice(0, 0, response['Response']);
         }
      });
   }

   ViewActivity(_index) {
      const initialState = {
      Data: this.Activities_List[_index]
      };
      this.bsModalRef = this.modalService.show(ViewActivityModelComponent, Object.assign({initialState}, { ignoreBackdropClick: true, class: 'modal-lg' }));
   }

   DeleteActivity() {
      const initialState = {
         Text: 'Activity'
      };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { ignoreBackdropClick: true, class: 'modal-sm' }));
   }

}
