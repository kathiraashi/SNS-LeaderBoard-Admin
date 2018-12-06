import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as CryptoJS from 'crypto-js';

import { LoginService } from './../../../services/LoginService/login.service';
import { LevelsService } from './../../../services/levels/levels.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';


import { CreateLevelModelComponent } from '../../../models/Levels/create-level-model/create-level-model.component';
import { ViewLevelModelComponent } from '../../../models/Levels/view-level-model/view-level-model.component';
import { DeleteConfirmationComponent } from '../../Common-Components/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-list-levels',
  templateUrl: './list-levels.component.html',
  styleUrls: ['./list-levels.component.css']
})
export class ListLevelsComponent implements OnInit {


   bsModalRef: BsModalRef;
   User_Id;

   Levels_List: any[] = [];
   Loader: Boolean = true;

   constructor(   private modalService: BsModalService,
                  public Login_Service: LoginService,
                  public Service: LevelsService,
                  private Toastr: ToastrService
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  // Get Institutions List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Service.Levels_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Levels_List = DecryptedData;
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Levels List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
   }

   CreateLevel() {
      const initialState = {
      Type: 'Create'
      };
      this.bsModalRef = this.modalService.show(CreateLevelModelComponent, Object.assign({initialState}, { ignoreBackdropClick: true, class: 'modal-lg max-width-75' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this.Levels_List.splice(0, 0, response['Response']);
         }
      });
   }

   ViewLevel(_index) {
      const initialState = {
      Data: this.Levels_List[_index]
      };
      this.bsModalRef = this.modalService.show(ViewLevelModelComponent, Object.assign({initialState}, { ignoreBackdropClick: true, class: 'modal-lg' }));
   }

}
