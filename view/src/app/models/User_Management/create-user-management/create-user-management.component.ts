import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-create-user-management',
  templateUrl: './create-user-management.component.html',
  styleUrls: ['./create-user-management.component.css']
})
export class CreateUserManagementComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}


  ngOnInit() {
  }

}
