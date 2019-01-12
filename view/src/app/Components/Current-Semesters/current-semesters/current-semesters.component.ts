import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { CurrentSemestersService } from './../../../services/Current-Semesters/current-semesters.service';
import { InstitutionsService } from './../../../services/Configurations/institutions.service';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-current-semesters',
  templateUrl: './current-semesters.component.html',
  styleUrls: ['./current-semesters.component.css']
})
export class CurrentSemestersComponent implements OnInit {

   _Institutions: any[] = [];
   bsModalRef: BsModalRef;
   _List: any[] = [];
   _YearlyBatches: any[] = [];

   Loader: Boolean = true;
   Loader_1: Boolean = true;
   User_Id: any;
   User_Type: any;

   Form: FormGroup;

  constructor( private modalService: BsModalService,
               private Toastr: ToastrService,
               public Login_Service: LoginService,
               public Service: CurrentSemestersService,
               public Institutions_Service: InstitutionsService,
               public Institution_Management: InstitutionManagementService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin') {
                  this._Institutions.push(this.Login_Service.LoginUser_Info()['Staff']['Institution']);
                  setTimeout(() => {
                     this.Form.controls['Institution'].setValue(this._Institutions[0]['_id']);
                     this.Form.controls['Institution'].disable();
                     this.InstitutionChange();
                     this.Loader = false;
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
                        this.LoadCurrentSemestersDetails(this._Institutions[0]['_id']);
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
         Institution: new FormControl(null, Validators.required ),
         Courses_Array: new FormArray([]),
      });
   }

   InstitutionChange() {
      const Institution = this.Form.controls['Institution'].value;
      const ArrayForm = <FormArray>this.Form.controls['Courses_Array'];
      ArrayForm.controls = [];
      this._YearlyBatches = [];
      if (Institution !== null && Institution !== undefined) {
         if ( this.User_Type !== 'Admin' && this.User_Type !== 'Sub Admin' && this.User_Type !== 'Principal') {
            const Department = this.Login_Service.LoginUser_Info()['Staff']['Department']['_id'];
            this.LoadDepartmentBased_CurrentSemestersDetails(Institution, Department);
         } else {
            this.LoadCurrentSemestersDetails(Institution);
         }
      }
   }

   LoadCurrentSemestersDetails(Institution) {
      this.Form.controls['Institution'].setValue(Institution);
      const Data = {'User_Id' : this.User_Id, 'Institution': Institution };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Loader_1 = true;
      this.Service.CurrentSemesters_List({'Info': Info}).subscribe( response => {
         this.Loader_1 = false;
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._List = DecryptedData;
            this.LoadFormArray();
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Current Semesters List Getting Error!, But not Identify!' });
         }
      });
   }

   LoadDepartmentBased_CurrentSemestersDetails(Institution, Department) {
      this.Form.controls['Institution'].setValue(Institution);
      const Data = {'User_Id' : this.User_Id, 'Institution': Institution, 'Department': Department};
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Loader_1 = true;
      this.Service.DepartmentBased_CurrentSemesters_List({'Info': Info}).subscribe( response => {
         this.Loader_1 = false;
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._List = DecryptedData;
            this.LoadFormArray();
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Current Semesters List Getting Error!, But not Identify!' });
         }
      });
   }

   LoadFormArray() {
      this._List.map(Obj => {
         const NewGroup =  new FormGroup({
            Institution: new FormControl(Obj.Institution, Validators.required ),
            Department: new FormControl(Obj.Department._id, Validators.required ),
            Institution_Management: new FormControl(Obj._id, Validators.required ),
            Course: new FormControl(Obj.Course.Course, Validators.required ),
            Show_Department: new FormControl(Obj.Department.Department, Validators.required ),
            Expend: new FormControl(false),
            Edit: new FormControl(false),
            Update: new FormControl(false),
            Batches_Array: new FormArray([], Validators.required),
            Created_By: new FormControl(this.User_Id, Validators.required ),
         });
         this.LoadBatchesArray(NewGroup, Obj);
         const Data = {'User_Id' : this.User_Id, 'InstitutionManagement': Obj._id };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Institution_Management.InstitutionManagement_YearlyBatches_SimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               DecryptedData.map(obj => {
                  obj['Batch'] = formatDate(new Date(obj['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(obj['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
                  return obj;
               });
               this._YearlyBatches.push({Institution_Management: Obj._id, Batches_Array: DecryptedData} );
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Yearly Batches List Getting Error!, But not Identify!' });
            }
         });
      });
   }

   UpdateCancel(Group: FormGroup) {
      if (Group.controls['Update'].value) {
         Group.controls['Update'].setValue(false);
         const _index = this._List.findIndex(obj => obj._id ===  Group.controls['Institution_Management'].value);
         const ArrayData = this._List[_index];
         const SubArray = <FormArray>Group.controls['Batches_Array'];
         SubArray.controls = [];
         const Length = ArrayData.Course.NoOfYears;
         for (let index = 0; index < Length; index++) {
            const Data = ArrayData.Batches_Array[index];
            if (Data !== null && Data !== undefined) {
               const NewGroup =  new FormGroup({
                  Yearly_Badge: new FormControl({value: Data.Yearly_Badge._id, disabled: true}, Validators.required ),
                  Year: new FormControl({value: Data.Year._id, disabled: true}, Validators.required ),
                  Semester: new FormControl({value: Data.Semester._id, disabled: true}, Validators.required ),
               });
               SubArray.push(NewGroup);
            } else {
               const NewGroup =  new FormGroup({
                  Yearly_Badge: new FormControl({value: null, disabled: true}, Validators.required ),
                  Year: new FormControl({value: null, disabled: true}, Validators.required ),
                  Semester: new FormControl({value: null, disabled: true}, Validators.required ),
               });
               SubArray.push(NewGroup);
            }
         }
      }
   }

   LoadBatchesArray(Group: FormGroup, Obj) {
      const ArrayForm = <FormArray>this.Form.controls['Courses_Array'];
      const SubArray = <FormArray>Group.controls['Batches_Array'];
      const Length = Obj.Course.NoOfYears;
      for (let index = 0; index < Length; index++) {
         const Data = Obj.Batches_Array[index];
         if (Data !== null && Data !== undefined) {
            const NewGroup =  new FormGroup({
               Yearly_Badge: new FormControl({value: Data.Yearly_Badge._id, disabled: true}, Validators.required ),
               Year: new FormControl({value: Data.Year._id, disabled: true}, Validators.required ),
               Semester: new FormControl({value: Data.Semester._id, disabled: true}, Validators.required ),
            });
            SubArray.push(NewGroup);
         } else {
            const NewGroup =  new FormGroup({
               Yearly_Badge: new FormControl({value: null, disabled: true}, Validators.required ),
               Year: new FormControl({value: null, disabled: true}, Validators.required ),
               Semester: new FormControl({value: null, disabled: true}, Validators.required ),
            });
            SubArray.push(NewGroup);
         }
      }
      setTimeout(() => {
         ArrayForm.push(Group);
      }, 50);
   }

   GetBatchesArray(Ins_Mng) {
      const _index = this._YearlyBatches.findIndex(obj => obj.Institution_Management === Ins_Mng );
      return this._YearlyBatches[_index]['Batches_Array'];
   }

   BatchChange(Batches: FormGroup) {
      const YearlyBatch = Batches.controls['Yearly_Badge'].value;
      if (YearlyBatch !== null && YearlyBatch !== undefined) {
         Batches.controls['Year'].setValue(null);
         Batches.controls['Year'].enable();
         Batches.controls['Semester'].setValue(null);
         Batches.controls['Semester'].disable();
      } else {
         Batches.controls['Year'].setValue(null);
         Batches.controls['Year'].disable();
         Batches.controls['Semester'].setValue(null);
         Batches.controls['Semester'].disable();
      }
   }
   GetYearsArray(Ins_Mng, Batches: FormGroup) {
      const _index = this._YearlyBatches.findIndex(obj => obj.Institution_Management === Ins_Mng );
      const Batches_List = <any[]>this._YearlyBatches[_index]['Batches_Array'];
      const YearlyBatch = Batches.controls['Yearly_Badge'].value;
      if (YearlyBatch !== null && YearlyBatch !== undefined) {
         const BatchIndex = Batches_List.findIndex(obj => obj._id === YearlyBatch);
         return Batches_List[BatchIndex]['Years_Array'];
      } else {
         Batches.controls['Year'].setValue(null);
         Batches.controls['Year'].disable();
         Batches.controls['Semester'].setValue(null);
         Batches.controls['Semester'].disable();
         return null;
      }
   }
   YearChange(_index, Batches: FormGroup) {
      const Year = Batches.controls['Year'].value;
      if (Year !== null && Year !== undefined) {
         Batches.controls['Semester'].setValue(null);
         Batches.controls['Semester'].enable();
      } else {
         Batches.controls['Semester'].setValue(null);
         Batches.controls['Semester'].disable();
      }
   }

   GetSemestersArray(Ins_Mng, Batches: FormGroup) {
      const _index = this._YearlyBatches.findIndex(obj => obj.Institution_Management === Ins_Mng );
      const Batches_List = <any[]>this._YearlyBatches[_index]['Batches_Array'];
      const YearlyBatch = Batches.controls['Yearly_Badge'].value;
      if (YearlyBatch !== null && YearlyBatch !== undefined) {
         const BatchIndex = Batches_List.findIndex(obj => obj._id === YearlyBatch);
         const Years_Array = Batches_List[BatchIndex]['Years_Array'];
         const Year = Batches.controls['Year'].value;
         if (Year !== null && Year !== undefined) {
            const YearIndex = Years_Array.findIndex(obj => obj._id === Year);
            return Years_Array[YearIndex]['Semesters'];
         } else {
            Batches.controls['Semester'].setValue(null);
            Batches.controls['Semester'].disable();
            return null;
         }
      } else {
         return null;
      }
   }

   EditBatches(Group: FormGroup) {
      Group.controls['Edit'].setValue(true);
      Group.controls['Update'].setValue(true);
      const Length = Group.controls['Batches_Array']['controls'].length;
      for (let index = 0; index < Length; index++) {
         Group.controls['Batches_Array']['controls'][index]['controls']['Yearly_Badge'].enable();
         Group.controls['Batches_Array']['controls'][index]['controls']['Year'].enable();
         Group.controls['Batches_Array']['controls'][index]['controls']['Semester'].enable();
      }
   }

   UpdateBatch(Group: FormGroup) {
      if (Group.status === 'VALID') {
         const Data = Group.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.CurrentSemesters_Create({'Info': Info}).subscribe( response => {
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               Group.controls['Update'].setValue(false);
               const Length = Group.controls['Batches_Array']['controls'].length;
               for (let index = 0; index < Length; index++) {
                  Group.controls['Batches_Array']['controls'][index]['controls']['Yearly_Badge'].disable();
                  Group.controls['Batches_Array']['controls'][index]['controls']['Year'].disable();
                  Group.controls['Batches_Array']['controls'][index]['controls']['Semester'].disable();
               }
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Successfully Updated' } );
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Updated Failed !, Error Not Identified!' } );
            }
         });
      }
   }

}
