import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as CryptoJS from 'crypto-js';

import { ModelStudentImportComponent } from './../../../models/Students/model-student-import/model-student-import.component';
import { DeleteConfirmationComponent } from '../../Common-Components/delete-confirmation/delete-confirmation.component';
import { LoginService } from './../../../services/LoginService/login.service';
import { StudentsService } from './../../../services/Students/students.service';

import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';

import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

   @ViewChild('fileInputFile') fileInputFile: ElementRef;
   bsModalRef: BsModalRef;
   User_Id;

   Students_List: any[] = [];
   Loader: Boolean = true;

   constructor(
      private modalService: BsModalService,
      public Service: LoginService,
      public Students_Service: StudentsService,
      private Toastr: ToastrService,
      ) {
         this.User_Id = this.Service.LoginUser_Info()['_id'];
          // Get Institutions List
          const Data = {'User_Id' : this.User_Id };
          let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
          Info = Info.toString();
          this.Loader = true;
          this.Students_Service.Students_List({'Info': Info}).subscribe( response => {
             const ResponseData = JSON.parse(response['_body']);
             this.Loader = false;
             if (response['status'] === 200 && ResponseData['Status'] ) {
                const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                this.Students_List = DecryptedData;
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

   onUploadFileChange(event) {
      const reader = new FileReader();
      const target = event.target;
      let Result = [];
      reader.onload = function() {
         const fileData = reader.result;
         const WorkBook = XLSX.read(fileData, {type : 'binary'});
         const FirstSheet = WorkBook.SheetNames[0];
         Result = XLSX.utils.sheet_to_json(WorkBook.Sheets[FirstSheet]);
      };
      setTimeout(() => {
         if (Result.length > 0) {
            this.UploadedFileView(Result);
         }
      }, 500);
      reader.readAsBinaryString(target.files[0]);
   }


   UploadedFileView(_Data) {
      this.fileInputFile.nativeElement.value = '';
      const initialState = {
         Type: 'Import',
         _Data: _Data
      };
      this.bsModalRef = this.modalService.show(ModelStudentImportComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-85' }));
      // this.bsModalRef.content.onClose.subscribe(response => {
      //    if (response['Status']) { }
      //    console.log(this.Students_List);
      // });
   }

   ImportStudent() {
      const initialState = {
         Text: 'Import'
      };
      this.bsModalRef = this.modalService.show(ModelStudentImportComponent, Object.assign({initialState}, { class: 'modal-md' }));
   }

   DeleteStudent() {
      const initialState = {
         Text: 'Student'
      };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
   }

}
