import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import {NativeDateAdapter} from '@angular/material';
import {DateAdapter} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
      const month = date.toLocaleString('en-us', {month: 'long'});
      const year = date.getFullYear();
      return `${month}-${year}`;
   }
}


import { InstitutionManagementService } from './../../../services/Institution-Management/institution-management.service';
import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../services/LoginService/login.service';

@Component({
  selector: 'app-model-batches-create',
  templateUrl: './model-batches-create.component.html',
  styleUrls: ['./model-batches-create.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class ModelBatchesCreateComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;
   _Sections: any[] = ['Section-A', 'Section-B', 'Section-C', 'Section-D', 'Section-E', 'Section-F', 'Section-G', 'Section-H', 'Section-I'];

   Uploading: Boolean = false;
   Proceed_Stage = 'Stage_1';
   Semesters_Count = 0;
   Form: FormGroup;
   User_Id;
   Year_Min: Date = null;
   Year_Max: Date = null;

   constructor( public bsModalRef: BsModalRef,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                private Service: InstitutionManagementService,
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            }

   ngOnInit() {
      this.onClose = new Subject();
      this.Form = new FormGroup({
         InstitutionManagement: new FormControl(this.Data._id, Validators.required ),
         Starting_MonthAndYear: new FormControl(null, Validators.required),
         Ending_MonthAndYear: new FormControl(null, Validators.required),
         Years_Array: new FormArray([]),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
   }

   GoToProceed() {
      // Stage 1 Proceed
         if (this.Proceed_Stage === 'Stage_1') {
            let Num = 0;
            if (this.Data.Course.NoOfYears && this.Data.Course.NoOfYears !== '' && this.Data.Course.NoOfYears !== null) {
               Num = parseInt(this.Data.Course.NoOfYears, 0);
            }
            for (let index = 1; index <= Num; index++) {
               this.CreateYears_Array(index);
            }
            this.Year_Min = this.Form.controls['Starting_MonthAndYear'].value;
            this.Year_Max = this.Form.controls['Ending_MonthAndYear'].value;
            this.Form.controls['Starting_MonthAndYear'].disable();
            this.Form.controls['Ending_MonthAndYear'].disable();
            this.Proceed_Stage = 'Stage_2';
         } else if (this.Proceed_Stage === 'Stage_2') {
            if (this.Form.controls['Years_Array']['controls'].length && this.Form.controls['Years_Array']['controls'].length > 0 ) {
               const Num = this.Form.controls['Years_Array']['controls'].length;
               for (let index = 0; index < Num; index++) {
                  const Num_1 = parseInt(this.Form.controls['Years_Array']['controls'][index]['value']['NoOfSemesters'], 0);
                  for (let index_1 = 0; index_1 < Num_1; index_1++) {
                     this.CreateSemesters_Array(index, index_1);
                  }
               }
               this.Form.controls['Years_Array'].disable();
               for (let index = 0; index < Num; index++) {
                  this.Form.controls['Years_Array']['controls'][index]['controls']['Semesters'].enable();
               }
            }
            this.Proceed_Stage = 'Stage_3';
         }
   }
   getYears_Array() {
      return this.Form.controls['Years_Array']['controls'];
   }
   getSemesters_Array(_index) {
      return this.Form.controls['Years_Array']['controls'][_index]['controls']['Semesters']['controls'];
   }

   CreateYears_Array(_index) {
      const control = <FormArray>this.Form.get('Years_Array');
      control.push(this.NewYears_Array(_index));
      if (_index === 1) {
         setTimeout(() => {
            this.Form.controls['Years_Array']['controls'][_index - 1 ]['controls']['From_Year'].disable();
         }, 500);
      }
      if (_index === parseInt(this.Data.Course.NoOfYears, 0)) {
         setTimeout(() => {
            this.Form.controls['Years_Array']['controls'][_index - 1 ]['controls']['To_Year'].disable();
         }, 500);
      }
   }
   NewYears_Array(_index) {
      let Show_Year = '1st Year';
      if (_index === 2) { Show_Year = '2nd Year'; }
      if (_index === 3) { Show_Year = '3rd Year'; }
      if (_index > 3) { Show_Year = _index + 'th Year'; }
      let From_Year = null;
      if (_index === 1) {
         From_Year = this.Form.controls['Starting_MonthAndYear'].value;
      }
      let To_Year = null;
      if (_index === parseInt(this.Data.Course.NoOfYears, 0)) {
         To_Year = this.Form.controls['Ending_MonthAndYear'].value;
      }
      return new FormGroup({
         Show_Year: new FormControl({value: Show_Year, disabled: true}, Validators.required),
         From_Year: new FormControl(From_Year, Validators.required),
         To_Year: new FormControl(To_Year, Validators.required),
         NoOfSemesters: new FormControl(1, [Validators.required, Validators.min(1)]),
         Semesters: new FormArray([ ])
       });
   }
   CreateSemesters_Array(Arr_index, _index) {
      const control = <FormArray>this.Form.controls['Years_Array']['controls'][Arr_index].get('Semesters');
      control.push(this.NewSemesters_Array(Arr_index, _index));
      setTimeout(() => {
         this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['Semesters']['controls'][_index]['controls']['Semester_Name'].disable();
      }, 500);
      if (_index === 0) {
         setTimeout(() => {
            this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['Semesters']['controls'][_index]['controls']['Semester_Start'].disable();
         }, 500);
      }
      const Num = parseInt(this.Form.controls['Years_Array']['controls'][Arr_index]['value']['NoOfSemesters'], 0);
      if (Num - 1 === _index ) {
         setTimeout(() => {
            this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['Semesters']['controls'][_index]['controls']['Semester_End'].disable();
         }, 500);
      }
      const Num_1 = parseInt(this.Form.controls['Years_Array']['controls'].length, 0);
      const Num_2 = parseInt(this.Form.controls['Years_Array']['controls'][Num_1 - 1]['value']['NoOfSemesters'], 0);
      if (Arr_index === (Num_1 - 1) && _index === (Num_2 - 1)) {
         setTimeout(() => {
            this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['Semesters']['controls'][_index]['controls']['Semester_End'].disable();
         }, 500);
      }
   }
   NewSemesters_Array(Arr_index, _index) {
      this.Semesters_Count = this.Semesters_Count + 1;
      let From_Year = null;
      if (_index === 0) {
         From_Year = this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['From_Year'].value;
      }
      let To_Year = null;
      const Num = parseInt(this.Form.controls['Years_Array']['controls'][Arr_index]['value']['NoOfSemesters'], 0);
      const Num_1 = parseInt(this.Form.controls['Years_Array']['controls'].length, 0);
      const Num_2 = parseInt(this.Form.controls['Years_Array']['controls'][Num_1 - 1]['value']['NoOfSemesters'], 0);
      if (Num - 1 === _index ) {
         To_Year = this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['To_Year'].value;
      }
      if (Arr_index === (Num_1 - 1) && _index === (Num_2 - 1)) {
         To_Year = this.Form.controls['Years_Array']['controls'][Arr_index]['controls']['To_Year'].value;
      }
      const Semester_Name = 'Semester-' + this.Semesters_Count;
      return new FormGroup({
         Semester_Name: new FormControl({value: Semester_Name, disabled: true}, Validators.required),
         Semester_Start: new FormControl(From_Year, Validators.required),
         Semester_End: new FormControl(To_Year, Validators.required),
         NoOfSections: new FormControl(1, [Validators.required, Validators.min(1)]),
         Sections_Arr: new FormControl(['Section-A'], Validators.required),
       });
   }
   NoOfSectionsChange(_event, Arr_Index, _Index) {
      const Arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      const Sections_Arr = [];
      if (_event > 0) {
         for (let index = 0; index < _event; index++) {
            Sections_Arr.push('Section-' + Arr[index]);
         }
      }
      this.Form.controls['Years_Array']['controls'][Arr_Index]['controls']['Semesters']['controls'][_Index]['controls']['Sections_Arr'].setValue(Sections_Arr);
   }
   Semester_Min(_index) {
      return this.Form.controls['Years_Array']['controls'][_index]['controls']['From_Year'].value;
   }
   Semester_Max(_index) {
      return this.Form.controls['Years_Array']['controls'][_index]['controls']['To_Year'].value;
   }
   chosenMonthHandler(Month, datepicker: MatDatepicker<any>) {
      this.Form.controls['Starting_MonthAndYear'].setValue(Month);
      datepicker.close();
    }
    chosenMonthHandler_1(Month, datepicker: MatDatepicker<any>) {
      this.Form.controls['Ending_MonthAndYear'].setValue(Month);
      datepicker.close();
    }
    chosenMonthHandler_2(Month, _index, datepicker: MatDatepicker<any>) {
      this.Form.controls['Years_Array']['controls'][_index]['controls']['From_Year'].setValue(Month);
      datepicker.close();
    }
    chosenMonthHandler_3(Month, _index, datepicker: MatDatepicker<any>) {
      this.Form.controls['Years_Array']['controls'][_index]['controls']['To_Year'].setValue(Month);
      datepicker.close();
    }
    chosenMonthHandler_4(Month, _index, _index_1, datepicker: MatDatepicker<any>) {
      this.Form.controls['Years_Array']['controls'][_index]['controls']['Semesters']['controls'][_index_1]['controls']['Semester_Start'].setValue(Month);
      datepicker.close();
    }
    chosenMonthHandler_5(Month, _index, _index_1, datepicker: MatDatepicker<any>) {
      this.Form.controls['Years_Array']['controls'][_index]['controls']['Semesters']['controls'][_index_1]['controls']['Semester_End'].setValue(Month);
      datepicker.close();
    }

   NotAllow(): boolean {return false; }

   // onSubmit Function
   onSubmit() {
      if (this.Type === 'Create') {
         this.submit();
      }
   }

   submit() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.InstitutionManagement_YearlyBatchesCreate({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Yearly Batch Successfully Created' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Institution!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
