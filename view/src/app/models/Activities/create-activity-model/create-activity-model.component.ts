import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-create-activity-model',
  templateUrl: './create-activity-model.component.html',
  styleUrls: ['./create-activity-model.component.css']
})
export class CreateActivityModelComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
