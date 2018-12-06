import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';

import * as CryptoJS from 'crypto-js';

import { LoginService } from './../../../services/LoginService/login.service';
import { StaffsService } from './../../../services/Staffs/staffs.service';

import { ToastrService } from './../../../services/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {

   User_Id;

   Staff_List: any[] = [];
   Loader: Boolean = true;

  constructor(
                  public Service: LoginService,
                  public Staff_Service: StaffsService,
                  private Toastr: ToastrService,
               ) {
                  this.User_Id = this.Service.LoginUser_Info()['_id'];
                  // Get Staff's List
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Staff_Service.Staff_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Staff_List = DecryptedData;
                        console.log(this.Staff_List);
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Staff List Getting Error!, But not Identify!' });
                     }
                  });
                }

  ngOnInit() {
  }

}
