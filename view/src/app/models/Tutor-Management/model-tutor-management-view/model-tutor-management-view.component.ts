import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-tutor-management-view',
  templateUrl: './model-tutor-management-view.component.html',
  styleUrls: ['./model-tutor-management-view.component.css']
})
export class ModelTutorManagementViewComponent implements OnInit {

   Data;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
