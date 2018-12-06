import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-view-activity-model',
  templateUrl: './view-activity-model.component.html',
  styleUrls: ['./view-activity-model.component.css']
})
export class ViewActivityModelComponent implements OnInit {

   Data;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
