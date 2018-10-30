import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { EditQueriesComponent } from '../../../../models/Queries/edit-queries/edit-queries.component';

@Component({
  selector: 'app-list-queries',
  templateUrl: './list-queries.component.html',
  styleUrls: ['./list-queries.component.css']
})
export class ListQueriesComponent implements OnInit {


   bsModalRef: BsModalRef;

   constructor(private modalService: BsModalService) { }


  ngOnInit() {
  }
  EditQueries() {
   const initialState = {
     Type: 'Edit'
   };
   this.bsModalRef = this.modalService.show(EditQueriesComponent, Object.assign({initialState}, { class: 'model-lg' }));
 }
}
