import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-edit-queries',
  templateUrl: './edit-queries.component.html',
  styleUrls: ['./edit-queries.component.css']
})
export class EditQueriesComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
