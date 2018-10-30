import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DeleteConfirmationComponent } from '../../../Common-Components/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-list-institution',
  templateUrl: './list-institution.component.html',
  styleUrls: ['./list-institution.component.css']
})
export class ListInstitutionComponent implements OnInit {

   bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
 DeleteInstitution() {
   const initialState = {
      Text: 'User'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}

}
