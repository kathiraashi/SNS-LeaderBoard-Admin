import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-view-level-model',
  templateUrl: './view-level-model.component.html',
  styleUrls: ['./view-level-model.component.css']
})
export class ViewLevelModelComponent implements OnInit {

   Data;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
}
