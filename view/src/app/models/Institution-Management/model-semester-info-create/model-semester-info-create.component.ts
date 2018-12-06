import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { StaffsService } from './../../../services/Staffs/staffs.service';
import { SubjectsService } from './../../../services/Configurations/subjects.service';
import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-model-semester-info-create',
  templateUrl: './model-semester-info-create.component.html',
  styleUrls: ['./model-semester-info-create.component.css']
})
export class ModelSemesterInfoCreateComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;

   Show_Course;
   Show_YearlyBatch;
   Show_BatchYear;
   Show_YearSemester;


   Uploading: Boolean = false;
   Proceed_Stage = 'Stage_1';
   Semesters_Count = 0;
   Form: FormGroup;
   User_Id;
   BatchYears_List: any[] = [];
   YearSemesters_List: any[] = [];
   Subject_List: any[] = [];
   Staffs_List: any[] = [];

   constructor(public bsModalRef: BsModalRef,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
                  public Subjects_Service: SubjectsService,
                  public Staffs_Service: StaffsService,
                  private Service: InstitutionManagementService) {
                     this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                     // Get Staff's List
                     const Data = {'User_Id' : this.User_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Staffs_Service.Staff_List({'Info': Info}).subscribe( response => {
                        const ResponseData = JSON.parse(response['_body']);
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this.Staffs_List = DecryptedData;
                        } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Staffs List Getting Error!, But not Identify!' });
                        }
                     });
                  }


   ngOnInit() {
      this.onClose = new Subject();

      // Get Subjects List
      const VarData = {'User_Id' : this.User_Id, Institution: this.Data.InstitutionManagement.Institution._id };
      let VarInfo = CryptoJS.AES.encrypt(JSON.stringify(VarData), 'SecretKeyIn@123');
      VarInfo = VarInfo.toString();
      this.Subjects_Service.Subject_SimpleList({'Info': VarInfo}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this.Subject_List = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Subject List Getting Error!, But not Identify!' });
         }
      });

      this.Show_Course = this.Data.InstitutionManagement.Course.Course + ' - ' + this.Data.InstitutionManagement.Department.Department;
      this.Show_YearlyBatch = formatDate(new Date(this.Data.Starting_MonthAndYear), 'MMM-yyyy', 'en-US', '+0530') + ' - ' + formatDate(new Date(this.Data.Ending_MonthAndYear), 'MMM-yyyy', 'en-US', '+0530');
      this.Form = new FormGroup({
         InstitutionManagement: new FormControl(this.Data.InstitutionManagement._id, Validators.required ),
         YearlyBatch: new FormControl(this.Data._id, Validators.required),
         BatchYear: new FormControl(null, Validators.required),
         YearSemester: new FormControl({value: null, disabled: true}, { validators: Validators.required,
                                                                        asyncValidators: [this.Semester_AsyncValidate.bind(this)] }),
         Subjects: new FormControl(null, Validators.required),
         Sections_Arr: new FormArray([]),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });

      const Data = {'User_Id' : this.User_Id, 'YearlyBatch_Id': this.Data._id};
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Service.InstitutionManagement_YearlyBatchView({'Info': Info}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this.BatchYears_List = DecryptedData['Years_Array'];
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status'] || response['status'] === 401) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Semesters List Getting Error!, But not Identify!' });
         }
      });
   }

   ChangeBatchYear() {
      const BatchYear = this.Form.controls['BatchYear'].value;
      if (BatchYear && BatchYear !== null && BatchYear !== '') {
         const _index = this.BatchYears_List.findIndex(obj => obj._id === BatchYear);
         this.YearSemesters_List = this.BatchYears_List[_index].Semesters;
         this.Show_BatchYear = this.BatchYears_List[_index].Show_Year;
         this.Form.controls['YearSemester'].setValue(null);
         this.Form.controls['YearSemester'].enable();
      } else {
         this.Form.controls['YearSemester'].setValue(null);
         this.Form.controls['YearSemester'].disable();
      }
   }

   Semester_AsyncValidate( control: AbstractControl ) {
      const Data = { Semester: control.value, User_Id: this.User_Id  };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.InstitutionManagement_SemesterManagementsAsyncValidate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { Semester_NotAvailable: true};
         }
      }));
   }

   GoToProceed() {
      if (this.Proceed_Stage === 'Stage_1') {
         this.Proceed_Stage = 'Stage_2';
         const YearSemester = this.Form.controls['YearSemester'].value;
         if (YearSemester && YearSemester !== null && YearSemester !== '') {
            const _index = this.YearSemesters_List.findIndex(obj => obj._id === YearSemester);
            const Sections_Arr = this.YearSemesters_List[_index].Sections_Arr;
            this.Show_YearSemester = this.YearSemesters_List[_index].Semester_Name;
            Sections_Arr.map(obj => {
               const control = <FormArray>this.Form.get('Sections_Arr');
               control.push(new FormGroup({
                  Section: new FormControl(obj, Validators.required),
                  More: new FormArray([]),
               }));
            });
            setTimeout(() => {
               Sections_Arr.map((obj, i) => {
                  const SubControl = <FormArray>this.Form.controls['Sections_Arr']['controls'][i].get('More');
                  const Subjects = this.Form.controls['Subjects'].value;
                  Subjects.map(obj_1 => {
                     SubControl.push(new FormGroup({
                        Section: new FormControl(obj, Validators.required),
                        Subject: new FormControl( {value: obj_1, disabled: true}, Validators.required),
                        Staff: new FormControl(null, Validators.required),
                     }));
                  });
               });
            }, 100);
         }
      } else {
         this.onSubmit();
      }
   }


   onSubmit() {
      if (this.Form.valid && this.Form.status === 'VALID' && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.InstitutionManagement_SemesterManagementsCreate({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Semester Successfully Updated' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updated Semester Details Update!' } );
               this.bsModalRef.hide();
            }
         });
      }
   }

}
