import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { CreateUserManagementComponent } from '../../../../models/User_Management/create-user-management/create-user-management.component';
import { DeleteConfirmationComponent } from '../../../../Components/Common-Components/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

   bsModalRef: BsModalRef;

   constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  CreateUser() {
   const initialState = {
     Type: 'Create'
   };
   this.bsModalRef = this.modalService.show(CreateUserManagementComponent, Object.assign({initialState}, { class: 'modal-lg' }));
 }
 ViewUser() {
   const initialState = {
     Type: 'View'
   };
   this.bsModalRef = this.modalService.show(CreateUserManagementComponent, Object.assign({initialState}, { class: '' }));
 }
 DeleteUser() {
   const initialState = {
      Text: 'User'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}
}
