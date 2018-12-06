import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelBatchesCreateComponent } from './../../../models/Institution-Management/model-batches-create/model-batches-create.component';
import { ModelBatchesViewComponent } from './../../../models/Institution-Management/model-batches-view/model-batches-view.component';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-list-yearly-batches',
  templateUrl: './list-yearly-batches.component.html',
  styleUrls: ['./list-yearly-batches.component.css']
})
export class ListYearlyBatchesComponent implements OnInit {

   bsModalRef: BsModalRef;
   _Basic_Data;
   _Batches_List: any[] = [];
   Loader: Boolean = true;
   InsManagement_Id;

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
               this.InsManagement_Id = this.active_route.snapshot.params['InsManagement_Id'];
               const Data = {'User_Id' : this.User_Id, 'InstitutionManagement_Id': this.InsManagement_Id};
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Loader = true;
               this.Service.InstitutionManagement_YearlyBatchesList({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  this.Loader = false;
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Basic_Data'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._Basic_Data = DecryptedData;
                     const CryptoBytes_1  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData_1 = JSON.parse(CryptoBytes_1.toString(CryptoJS.enc.Utf8));
                     this._Batches_List = DecryptedData_1;
                     console.log(DecryptedData_1);
                     this._Batches_List.map(obj => {
                        let NoOfSemesters = 0;
                        obj['Years_Array'].map(obj_1 => {
                           NoOfSemesters = NoOfSemesters + obj_1['NoOfSemesters'];
                        });
                        obj['NoOfSemesters'] = NoOfSemesters;
                        return obj;
                     });
                     this.Loader = false;
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status'] || response['status'] === 401) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Yearly Batches List Getting Error!, But not Identify!' });
                  }
               });
            });
         }

   ngOnInit() {

   }

      // Create Yearly Batch
      CreateYearlyBatch() {
         const initialState = { Type: 'Create', Data: this._Basic_Data };
         this.bsModalRef = this.modalService.show(ModelBatchesCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-80' }));
         this.bsModalRef.content.onClose.subscribe(response => {
            if (response['Status']) {
               this._Batches_List.splice(0, 0, response['Response']);
            }
         });
      }

      // View Yearly Batch
      ViewYearlyBatch(_index) {
         const initialState = { Type: 'View', Data: this._Batches_List[_index] };
         this.bsModalRef = this.modalService.show(ModelBatchesViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-80' }));
      }

}
