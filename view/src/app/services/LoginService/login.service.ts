import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:5000/API/RegisterAndLogin/';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

   constructor(private http: Http) {
   }


   public User_Login_Validate(Info: any): Observable<any[]> {
      return this.http.post(API_URL + 'User_Login_Validate', Info)
      .pipe( map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData.Status) {
            const Security = (ReceivingData['Response'].slice(0, -2)).slice(-32);
            const encData = (ReceivingData['Response'].slice(0, -34));
            const CryptoBytes  = CryptoJS.AES.decrypt(encData, Security);
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            sessionStorage.setItem('Token', btoa(JSON.stringify(DecryptedData)));
            sessionStorage.setItem('SessionToken', btoa(DecryptedData._id + Security));
            sessionStorage.setItem('SessionKey', btoa(Date()));
         }
         delete ReceivingData['Response'];
         response['_body'] = JSON.stringify(ReceivingData);
        return response;
      }
      ), catchError(error => of(error)));
   }

   public If_LoggedIn() {
      if (sessionStorage.getItem('Token') && sessionStorage.getItem('SessionKey') && sessionStorage.getItem('SessionToken') ) {
         const LastSession = new Date(atob(sessionStorage.getItem('SessionKey'))).getTime();
         const NowSession = new Date().getTime();
         const SessionDiff: number = NowSession - LastSession;
         const SessionDiffMinutes: number = SessionDiff / 1000 / 60 ;
         if (SessionDiffMinutes < 20 ) { return true;
         } else {
            sessionStorage.clear();
            return false;
         }
      } else { sessionStorage.clear(); return false;  }
   }

   public LoginUser_Info() {
      return JSON.parse(atob(sessionStorage.getItem('Token')));
   }

}
