import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './../services/LoginService/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _router: Router, private _service: LoginService) {

  }

  canActivate(): boolean {
    if (this._service.If_LoggedIn()) {
      return true;
    } else {
      this._router.navigate(['/Login']);
      return false;
    }
  }

}
