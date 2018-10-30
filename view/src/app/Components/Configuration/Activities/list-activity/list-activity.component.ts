import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { CreateActivityModelComponent } from '../../../../models/Activities/create-activity-model/create-activity-model.component';
import { DeleteConfirmationComponent } from '../../../Common-Components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-list-activity',
  templateUrl: './list-activity.component.html',
  styleUrls: ['./list-activity.component.css']
})
export class ListActivityComponent implements OnInit {

   bsModalRef: BsModalRef;

   constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  CreateActivity() {
   const initialState = {
     Type: 'Create'
   };
   this.bsModalRef = this.modalService.show(CreateActivityModelComponent, Object.assign({initialState}, { class: 'modal-lg' }));
 }
 ViewActivity() {
   const initialState = {
     Type: 'View'
   };
   this.bsModalRef = this.modalService.show(CreateActivityModelComponent, Object.assign({initialState}, { class: '' }));
 }
 DeleteActivity() {
   const initialState = {
      Text: 'Activity'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}
}
