import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from './../LoginService/login.service';

const API_URL = 'http://localhost:5000/API/AdminManagement/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

   headers;
   constructor(private http: Http, private Service: LoginService) {
      this.headers = new Headers();
   }

   ValidateEveryRequest() {
      let Message = JSON.stringify({Status: false, Message: 'Your Login Expired! Please Login Again'});
      if (sessionStorage.getItem('Token') && sessionStorage.getItem('SessionKey') && sessionStorage.getItem('SessionToken') ) {
         const LastSession = new Date(atob(sessionStorage.getItem('SessionKey'))).getTime();
         const NowSession = new Date().getTime();
         const SessionDiff: number = NowSession - LastSession;
         const SessionDiffMinutes: number = SessionDiff / 1000 / 60 ;
         if (SessionDiffMinutes >= 20 ) {
            Message = JSON.stringify({Status: false, Message: 'Your Session Expired! Please Login Again'});
            sessionStorage.clear();
         }
      }
      return Observable.create(observer => {
         const Response = {status: 401, _body: Message };
         observer.next(Response);
         observer.complete();
      });
   }

   public User_Name_Validate(Info: any): Observable<any[]> {
      if (this.Service.If_LoggedIn()) {
         this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
         sessionStorage.setItem('SessionKey', btoa(Date()));
         return this.http.post(API_URL + 'User_Name_Validate', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
      } else {
         return this.ValidateEveryRequest();
      }
   }

   public User_Create(Info: any): Observable<any[]> {
      if (this.Service.If_LoggedIn()) {
         this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
         sessionStorage.setItem('SessionKey', btoa(Date()));
         return this.http.post(API_URL + 'User_Create', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
      } else {
         return this.ValidateEveryRequest();
      }
   }


   public Users_List(Info: any): Observable<any[]> {
      if (this.Service.If_LoggedIn()) {
         this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
         sessionStorage.setItem('SessionKey', btoa(Date()));
         return this.http.post(API_URL + 'Users_List', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
      } else {
         return this.ValidateEveryRequest();
      }
   }


   public Country_List(Info: any): Observable<any[]> {
      if (this.Service.If_LoggedIn()) {
         this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
         sessionStorage.setItem('SessionKey', btoa(Date()));
         return this.http.post(API_URL + 'Country_List', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
      } else {
         return this.ValidateEveryRequest();
      }
   }
   public State_List(Info: any): Observable<any[]> {
      if (this.Service.If_LoggedIn()) {
         this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
         sessionStorage.setItem('SessionKey', btoa(Date()));
         return this.http.post(API_URL + 'State_List', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
      } else {
         return this.ValidateEveryRequest();
      }
   }
   public City_List(Info: any): Observable<any[]> {
      if (this.Service.If_LoggedIn()) {
         this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
         sessionStorage.setItem('SessionKey', btoa(Date()));
         return this.http.post(API_URL + 'City_List', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
      } else {
         return this.ValidateEveryRequest();
      }
   }

}
