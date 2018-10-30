import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-create-staffs-model',
  templateUrl: './create-staffs-model.component.html',
  styleUrls: ['./create-staffs-model.component.css']
})
export class CreateStaffsModelComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
