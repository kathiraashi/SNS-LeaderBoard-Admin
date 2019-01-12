import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelRedemptionMethodComponent } from '../../../../../models/Configurations/Model_Activities_Config/model-redemption-method/model-redemption-method.component';
import { DeleteConfirmationComponent } from '../../../../Common-Components/delete-confirmation/delete-confirmation.component';

import { RedemptionMethodService } from './../../../../../services/Configurations/Activities-config/redemption-method.service';
import { ToastrService } from './../../../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../../../services/LoginService/login.service';

@Component({
  selector: 'app-list-redemption-method',
  templateUrl: './list-redemption-method.component.html',
  styleUrls: ['./list-redemption-method.component.css']
})
export class ListRedemptionMethodComponent implements OnInit {


   bsModalRef: BsModalRef;

   Loader: Boolean = true;
   _List: any[] = [];

   User_Id: any;
   User_Type: any;


   constructor(   private modalService: BsModalService,
                  private Service: RedemptionMethodService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
                  if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
                      // Get Institution Based Redemption Method List
                      const Data = {'User_Id' : this.User_Id, Institution: this.Login_Service.LoginUser_Info()['Staff']['Institution']['_id']};
                      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                      Info = Info.toString();
                      this.Loader = true;
                      this.Service.InstitutionBased_RedemptionMethod_List({'Info': Info}).subscribe( response => {
                         const ResponseData = JSON.parse(response['_body']);
                         this.Loader = false;
                         if (response['status'] === 200 && ResponseData['Status'] ) {
                            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                            this._List = DecryptedData;
                         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                         } else if (response['status'] === 401 && !ResponseData['Status']) {
                            this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                         } else {
                            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Subject List Getting Error!, But not Identify!' });
                         }
                      });
                  } else {
                     // Get Redemption Method List
                     const Data = {'User_Id' : this.User_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Loader = true;
                     this.Service.RedemptionMethod_List({'Info': Info}).subscribe( response => {
                        const ResponseData = JSON.parse(response['_body']);
                        this.Loader = false;
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this._List = DecryptedData;
                        } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else if (response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Subject List Getting Error!, But not Identify!' });
                        }
                     });
                  }
               }

   ngOnInit() {
   }

   // Create New Redemption Method
   CreateRedemptionMethod() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(ModelRedemptionMethodComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            response['Response'].map(obj => {
               this._List.splice(0, 0, obj);
            });
         }
      });
   }
   // Edit Redemption Method
   EditRedemptionMethod(_index) {
      const initialState = { Type: 'Edit', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelRedemptionMethodComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this._List[_index] = response['Response'];
         }
      });
   }
   // View Redemption Method
   ViewRedemptionMethod(_index) {
      const initialState = { Type: 'View', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelRedemptionMethodComponent, Object.assign({initialState}, { class: 'modal-lg' }));
   }
   // Delete Redemption Method
   DeleteRedemptionMethod(_index) {
      const initialState = { Text: ' Redemption Method ' };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            const Data = { 'RedemptionMethod_Id' : this._List[_index]._id, 'Modified_By' : this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.RedemptionMethod_Delete({'Info': Info}).subscribe( returnResponse => {
               const ResponseData = JSON.parse(returnResponse['_body']);
               if (returnResponse['status'] === 200 && ResponseData['Status'] ) {
                  this._List.splice(_index, 1);
                  this.Toastr.NewToastrMessage( { Type: 'Warning', Message: 'Redemption Method Successfully Deleted'} );
               } else if (returnResponse['status'] === 400 || returnResponse['status'] === 417 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
               } else if (returnResponse['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Some Error Occurred!, But not Identify!' } );
               }
            });
         }
      });
   }

}
