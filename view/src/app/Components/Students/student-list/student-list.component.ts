import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { ModelStudentImportComponent } from './../../../models/Students/model-student-import/model-student-import.component';
import { ModelStudentLinkSemesterComponent } from './../../../models/Students/model-student-link-semester/model-student-link-semester.component';
import { StudentsService } from './../../../services/Students/students.service';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { CurrentSemestersService } from './../../../services/Current-Semesters/current-semesters.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../services/LoginService/login.service';

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

   _Institutions: any[] = [];
   _Institution_Managements: any[] = [];
   _CurrentSemesters: any[] = [];
   _Sections: any[] = [];
   Students_List: any[] = [];
   Loader: Boolean = true;
   Loader_1: Boolean = true;

   Form: FormGroup;

   constructor(
      public modalService: BsModalService,
      public Login_Service: LoginService,
      public Students_Service: StudentsService,
      public Toastr: ToastrService,
      public Institutions_Service: InstitutionsService,
      public Institution_Management: InstitutionManagementService,
      public Current_Semesters: CurrentSemestersService
      ) {
         this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
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

   ngOnInit() {
      this.Form = new FormGroup({
         Institution: new FormControl(null),
         Institution_Management: new FormControl({value: null, disabled: true}),
         CurrentSemester: new FormControl({value: null, disabled: true}),
         Section: new FormControl({value: null, disabled: true}),
      });
   }


   InstitutionChange() {
      const Institution = this.Form.controls['Institution'].value;
      this.Form.controls['Institution_Management'].setValue(null);
      this.Form.controls['Institution_Management'].disable();
      this.Form.controls['CurrentSemester'].setValue(null);
      this.Form.controls['CurrentSemester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Institution !== null && Institution !== undefined) {
         // Institution Based Students List
         const Data = {'User_Id' : this.User_Id, Institution: Institution };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Institution_Management.InstitutionManagement_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['CourseAndDepartment'] = obj['Course']['Course']  + ' - ' + obj['Department']['Department'];
                  return obj;
               });
               this._Institution_Managements = DecryptedData;
               this.Form.controls['Institution_Management'].enable();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Course and Department List Getting Error!, But not Identify!' });
            }
         });
         this.Loader_1 = true;
         this.Students_Service.InstitutionBased_StudentsList({'Info': Info}).subscribe( response => {
            this.Loader_1 = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['Yearly_Badge']['Batch'] = formatDate(new Date(obj['Yearly_Badge']['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(obj['Yearly_Badge']['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
                  return obj;
               });
               this.Students_List = DecryptedData;
               console.log(this.Students_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this._Institution_Managements = [];
         this.Students_List = [];
      }
   }

   InstitutionManagementChange() {
      const Institution_Management = this.Form.controls['Institution_Management'].value;
      this.Form.controls['CurrentSemester'].setValue(null);
      this.Form.controls['CurrentSemester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (Institution_Management !== null && Institution_Management !== undefined) {
         this.Form.controls['Institution_Management'].setValue(Institution_Management);
         // Institution Management Based Students List
         const Data = {'User_Id' : this.User_Id, InstitutionManagement: Institution_Management };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Students_Service.InstitutionManagementBased_StudentsList({'Info': Info}).subscribe( response => {
            this.Loader_1 = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['Yearly_Badge']['Batch'] = formatDate(new Date(obj['Yearly_Badge']['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(obj['Yearly_Badge']['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
                  return obj;
               });
               this.Students_List = DecryptedData;
               console.log(this.Students_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
            }
         });
         this.Current_Semesters.InstitutionManagementBased_CurrentSemestersList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  // tslint:disable-next-line:max-line-length
                  obj['ShowData'] = obj['Year']['Show_Year'] + ' - ' +  obj['Semester']['Semester_Name']  +  ' (' + formatDate(new Date(obj['Yearly_Badge']['Starting_MonthAndYear']), 'yyyy', 'en-US')  + '-' + formatDate(new Date(obj['Yearly_Badge']['Ending_MonthAndYear']), 'yyyy', 'en-US') + ')';
                  obj['Yearly_Badge']['Batch'] = formatDate(new Date(obj['Yearly_Badge']['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + '-' + formatDate(new Date(obj['Yearly_Badge']['Ending_MonthAndYear']), ' MMM yyyy', 'en-US') ;
                  return obj;
               });
               this._CurrentSemesters = DecryptedData;
               this.Form.controls['CurrentSemester'].enable();
               console.log(DecryptedData);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Current Semester List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.InstitutionChange();
      }
   }


   CurrentSemesterChange() {
      const CurrentSemester = this.Form.controls['CurrentSemester'].value;
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (CurrentSemester !== null && CurrentSemester !== undefined) {
         const _index = this._CurrentSemesters.findIndex(obj => obj['Semester']._id === CurrentSemester);
         this._Sections = this._CurrentSemesters[_index]['Semester']['Sections_Arr'];
         this.Form.controls['Section'].enable();
         const Yearly_Badge = this._CurrentSemesters[_index]['Yearly_Badge']['_id'];
         const Semester = this._CurrentSemesters[_index]['Semester']['_id'];
         // Get Semester Based Students List
         const Data = {'User_Id' : this.User_Id, Yearly_Badge: Yearly_Badge, Semester: Semester };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Students_Service.SemesterBased_StudentsList({'Info': Info}).subscribe( response => {
            this.Loader_1 = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['Yearly_Badge']['Batch'] = formatDate(new Date(obj['Yearly_Badge']['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(obj['Yearly_Badge']['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
                  return obj;
               });
               this.Students_List = DecryptedData;
               console.log(this.Students_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.InstitutionManagementChange();
      }
   }

   SectionChange() {
      const Section = this.Form.controls['Section'].value;
      const CurrentSemester = this.Form.controls['CurrentSemester'].value;
      if (Section !== null && Section !== undefined) {
         const _index = this._CurrentSemesters.findIndex(obj => obj['Semester']._id === CurrentSemester);
         const Yearly_Badge = this._CurrentSemesters[_index]['Yearly_Badge']['_id'];
         const Semester = this._CurrentSemesters[_index]['Semester']['_id'];
         // Get Semester Based Students List
         const Data = {'User_Id' : this.User_Id, Yearly_Badge: Yearly_Badge, Semester: Semester, Section: Section };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Loader_1 = true;
         this.Students_Service.SectionBased_StudentsList({'Info': Info}).subscribe( response => {
            this.Loader_1 = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['Yearly_Badge']['Batch'] = formatDate(new Date(obj['Yearly_Badge']['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(obj['Yearly_Badge']['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
                  return obj;
               });
               this.Students_List = DecryptedData;
               console.log(this.Students_List);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.CurrentSemesterChange();
      }
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
      const _index = this._Institutions.findIndex(obj => obj._id === this.Form.controls['Institution'].value);
      const Institution = this._Institutions[_index];
      const _indexOne = this._Institution_Managements.findIndex(obj => obj._id === this.Form.controls['Institution_Management'].value);
      const Institution_Management = this._Institution_Managements[_indexOne];
      const _indexTwo = this._CurrentSemesters.findIndex(obj => obj['Semester']._id === this.Form.controls['CurrentSemester'].value);
      const Yearly_Badge = this._CurrentSemesters[_indexTwo]['Yearly_Badge'];
      const initialState = {
         Type: 'Import',
         _BasicData: {Institution: Institution, Institution_Management: Institution_Management, Yearly_Badge: Yearly_Badge},
         _Data: _Data
      };
      this.bsModalRef = this.modalService.show(ModelStudentImportComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-85' }));
      this.bsModalRef.content.onClose.subscribe( response => {
         if (response['Status']) {
            this.CurrentSemesterChange();
         }
      });
   }

   LinkSemester() {
      this.fileInputFile.nativeElement.value = '';
      const _index = this._Institutions.findIndex(obj => obj._id === this.Form.controls['Institution'].value);
      const Institution = this._Institutions[_index];
      const _indexOne = this._Institution_Managements.findIndex(obj => obj._id === this.Form.controls['Institution_Management'].value);
      const Institution_Management = this._Institution_Managements[_indexOne];
      const _indexTwo = this._CurrentSemesters.findIndex(obj => obj['Semester']._id === this.Form.controls['CurrentSemester'].value);
      const Yearly_Badge = this._CurrentSemesters[_indexTwo]['Yearly_Badge'];
      const Year = this._CurrentSemesters[_indexTwo]['Year'];
      const Semester = this._CurrentSemesters[_indexTwo]['Semester'];
      const Sections_Arr = this._CurrentSemesters[_indexTwo]['Semester']['Sections_Arr'];
      const initialState = {
         Type: 'Import',
         _BasicData: {Institution: Institution, Institution_Management: Institution_Management, Yearly_Badge: Yearly_Badge, Year: Year, Semester: Semester, Sections_Arr: Sections_Arr },
      };
      this.bsModalRef = this.modalService.show(ModelStudentLinkSemesterComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-85' }));
      this.bsModalRef.content.onClose.subscribe( response => {
         if (response['Status']) {
            this.CurrentSemesterChange();
         }
      });
   }

}
