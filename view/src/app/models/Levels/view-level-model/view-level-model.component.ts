import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-view-level-model',
  templateUrl: './view-level-model.component.html',
  styleUrls: ['./view-level-model.component.css']
})
export class ViewLevelModelComponent implements OnInit {

   Data: any;
   BatchURL: String = 'http://localhost:5000/API/Uploads/Batches/';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
     console.log(this.Data);
  }
}
