import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { formatDate } from '@angular/common';
import { FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { StudentsService } from './../../../services/Students/students.service';
import { StaffsService } from './../../../services/Staffs/staffs.service';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { CurrentSemestersService } from './../../../services/Current-Semesters/current-semesters.service';

import { TutorManagementService } from './../../../services/Tutor-Management/tutor-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';


@Component({
  selector: 'app-model-tutor-management-create',
  templateUrl: './model-tutor-management-create.component.html',
  styleUrls: ['./model-tutor-management-create.component.css']
})
export class ModelTutorManagementCreateComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;
   Institutions_List: any[] = [];
   Institution_Management_List: any[] = [];
   _CurrentSemesters: any[] = [];
   Sections_List: any[] = [];
   Staffs_List: any[] = [];
   Students_List: any[] = [];

   Uploading: Boolean = false;
   Async_Loading: Boolean = false;
   Form: FormGroup;
   User_Id: any;
   User_Type: any;
   Min_StudentValidate: Boolean = false;


   constructor(   public bsModalRef: BsModalRef,
                  public Institution_Management: InstitutionManagementService,
                  public Staffs_Service: StaffsService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
                  public Service: TutorManagementService,
                  private Institution_Service: InstitutionsService,
                  public Current_Semesters: CurrentSemestersService,
                  public Students_Service: StudentsService
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
                  if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
                     this.Institutions_List.push(this.Login_Service.LoginUser_Info()['Staff']['Institution']);
                     setTimeout(() => {
                        this.Form.controls['Institution'].setValue(this.Institutions_List[0]['_id']);
                        this.Form.controls['Institution'].disable();
                        if (this.User_Type !== 'Principal') {
                           this.DepartmentChange(this.Login_Service.LoginUser_Info()['Staff']['Department']['_id']);
                        } else {
                           this.InstitutionChange();
                        }
                     }, 100);
                  } else {
                     // Get Institutions List
                     const Data = {'User_Id' : this.User_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Institution_Service.Institution_SimpleList({'Info': Info}).subscribe( response => {
                        const ResponseData = JSON.parse(response['_body']);
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this.Institutions_List = DecryptedData;
                        } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                        }
                     });
                  }
               }

   ngOnInit() {
      this.onClose = new Subject();

      this.Form = new FormGroup({
         Institution: new FormControl(null, Validators.required ),
         Institution_Management: new FormControl({value: null, disabled: true}, Validators.required),
         CurrentSemester: new FormControl({value: null, disabled: true}),
         Section: new FormControl({value: null, disabled: true}, Validators.required),
         Staff: new FormControl({value: null, disabled: true}, Validators.required ),
         AllStudents_Selected: new FormControl(false),
         Students: new FormArray([]),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
   }

   InstitutionChange() {
      const Ins = this.Form.controls['Institution'].value;
      this.Form.controls['Institution_Management'].setValue(null);
      this.Form.controls['Institution_Management'].disable();
      this.Form.controls['CurrentSemester'].setValue(null);
      this.Form.controls['CurrentSemester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      this.Form.controls['Staff'].setValue(null);
      this.Form.controls['Staff'].disable();
      this.ClearStudentArray();
      if (Ins !== null && Ins !== undefined && Ins !== '') {
         // Get Institution Management List
            const Data = {'User_Id' : this.User_Id, Institution: Ins };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Async_Loading = true;
            this.Institution_Management.InstitutionManagement_List({'Info': Info}).subscribe( response => {
               this.Async_Loading = false;
               const ResponseData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ResponseData['Status'] ) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  DecryptedData.map(obj => {
                     obj['CourseAndDepartment'] = obj['Course']['Course'] + ' - ' + obj['Department']['Department'];
                     return obj;
                  });
                  this.Institution_Management_List = DecryptedData;
                  this.Form.controls['Institution_Management'].enable();
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Courses List Getting Error!, But not Identify!' });
               }
            });
      }
   }


   DepartmentChange(Department: any) {
      const Institution = this.Form.controls['Institution'].value;
      this.Form.controls['Institution_Management'].setValue(null);
      this.Form.controls['Institution_Management'].disable();
      this.Form.controls['CurrentSemester'].setValue(null);
      this.Form.controls['CurrentSemester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      this.Form.controls['Staff'].setValue(null);
      this.Form.controls['Staff'].disable();
      this.ClearStudentArray();
      if (Institution !== null && Institution !== undefined && Department !== null && Department !== undefined) {
         const Data = {'User_Id' : this.User_Id, Institution: Institution, Department: Department };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Institution_Management.DepartmentBased_InstitutionManagement_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['CourseAndDepartment'] = obj['Course']['Course']  + ' - ' + obj['Department']['Department'];
                  return obj;
               });
               this.Institution_Management_List = DecryptedData;
               this.Form.controls['Institution_Management'].enable();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Course and Department List Getting Error!, But not Identify!' });
            }
         });
      }
   }

   InsManagementChange() {
      const Ins_Management = this.Form.controls['Institution_Management'].value;
      this.Form.controls['CurrentSemester'].setValue(null);
      this.Form.controls['CurrentSemester'].disable();
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      this.Form.controls['Staff'].setValue(null);
      this.Form.controls['Staff'].disable();
      this.ClearStudentArray();
      let Ins_Management_Loading = false;
      let Staffs_List_Loading = false;
      this.Async_Loading = true;
      if (Ins_Management !== null && Ins_Management !== undefined && Ins_Management !== '') {
         // Get Yearly Batches List
         const Data = {'User_Id' : this.User_Id, InstitutionManagement: Ins_Management };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         Ins_Management_Loading = true;
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
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Current Semester List Getting Error!, But not Identify!' });
            }
         });
         // Get Staff's List
         const Ins_Management_Index = this.Institution_Management_List.findIndex(obj => obj._id === Ins_Management);
         const Department = this.Institution_Management_List[Ins_Management_Index]['Department']['_id'];
         const Ins = this.Form.controls['Institution'].value;
         const Data_One = {'User_Id' : this.User_Id, 'Institution': Ins, 'Department': Department };
         let Info_One = CryptoJS.AES.encrypt(JSON.stringify(Data_One), 'SecretKeyIn@123');
         Info_One = Info_One.toString();
         Staffs_List_Loading = true;
         this.Staffs_Service.DepartmentBased_StaffsSimpleList({'Info': Info_One}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            Staffs_List_Loading = false;
            if (!Staffs_List_Loading && !Ins_Management_Loading) {
               this.Async_Loading = false;
            }
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Staffs_List = DecryptedData;
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Yearly Batches List Getting Error!, But not Identify!' });
            }
         });
      } else {
         if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin' && this.User_Type !== 'Principal') {
            this.InstitutionChange();
         } else {
            this.DepartmentChange(this.Login_Service.LoginUser_Info()['Staff']['Department']['_id']);
         }
      }
   }
   CurrentSemesterChange() {
      const CurrentSemester = this.Form.controls['CurrentSemester'].value;
      this.Form.controls['Section'].setValue(null);
      this.Form.controls['Section'].disable();
      if (CurrentSemester !== null && CurrentSemester !== undefined) {
         const _index = this._CurrentSemesters.findIndex(obj => obj['Semester']._id === CurrentSemester);
         this.Sections_List = this._CurrentSemesters[_index]['Semester']['Sections_Arr'];
         this.Form.controls['Section'].enable();
      } else {
         this.InsManagementChange();
      }
   }
   Section_Change() {
      const Section = this.Form.controls['Section'].value;
      this.ClearStudentArray();
      this.Form.controls['AllStudents_Selected'].setValue(false);
      if (Section !== null && Section !== undefined && Section !== '') {
         this.Form.controls['Staff'].enable();
         const _indexTwo = this._CurrentSemesters.findIndex(obj => obj['Semester']._id === this.Form.controls['CurrentSemester'].value);
         const Yearly_Badge = this._CurrentSemesters[_indexTwo]['Yearly_Badge']['_id'];
         const Semester = this._CurrentSemesters[_indexTwo]['Semester']['_id'];
         const Data = { 'User_Id' : this.User_Id,
                        'Yearly_Badge': Yearly_Badge,
                        'Semester': Semester,
                        'Section': Section
                     };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Async_Loading = true;
         this.Students_Service.SectionBased_StudentsList({'Info': Info}).subscribe( response => {
            this.Async_Loading = false;
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Students_List = DecryptedData;
               this.Students_List.map( obj => { this.AddStudent(obj); } );
               setTimeout(() => {
                  this.Form.controls['Students'].setErrors({'invalid': true});
                  this.Form.updateValueAndValidity();
               }, 50);
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Students List Getting Error!, But not Identify!' });
            }
         });
      }
   }
   ClearStudentArray() {
      const FormArr = <FormArray>this.Form.controls['Students'];
      FormArr.controls = [];
   }

   AddStudent(Data) {
      const FormArr = <FormArray>this.Form.controls['Students'];
      FormArr.push(this.CreateStudentsArr(Data));
   }

   CreateStudentsArr(Data) {
      return new FormGroup({
         Student: new FormControl({value: Data['_id'], disabled: true}, Validators.required ),
         Name: new FormControl({value: Data['Name'], disabled: true}, Validators.required ),
         Reg_No: new FormControl({value: Data['Reg_No'], disabled: true}, Validators.required ),
         Action: new FormControl(false, Validators.required ),
      });
   }

   SelectAllStudent_Change() {
      if (this.Form.controls['AllStudents_Selected'].value) {
         const Length = this.Form.controls['Students']['controls'].length;
         for (let index = 0; index < Length; index++) {
            this.Form.controls['Students']['controls'][index]['controls']['Action'].setValue(true);
         }
         this.Form.controls['Students'].setErrors(null);
      }
   }

   SomeStudent_ActionChange() {
      let Selected_AllStudent = true;
      this.Form.controls['Students'].setErrors({'invalid': true});
      const Length = this.Form.controls['Students']['controls'].length;
      for (let index = 0; index < Length; index++) {
         const value = this.Form.controls['Students']['controls'][index]['controls']['Action'].value;
         if (!value) {
            Selected_AllStudent = false;
         } else {
            this.Form.controls['Students'].setErrors(null);
         }
      }
      setTimeout(() => {
         if (Selected_AllStudent) {
            this.Form.controls['AllStudents_Selected'].setValue(true);
         } else {
            this.Form.controls['AllStudents_Selected'].setValue(false);
         }
      }, 100);
   }

   Submit() {
      if (this.Form.status === 'VALID' && !this.Uploading && !this.Async_Loading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         Data['Students'] = Data['Students'].filter(obj => obj['Action'] );
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.TutorManagement_Create({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Tutor Management Successfully Updated' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Tutor Management!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
