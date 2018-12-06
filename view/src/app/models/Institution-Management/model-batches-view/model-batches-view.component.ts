import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-batches-view',
  templateUrl: './model-batches-view.component.html',
  styleUrls: ['./model-batches-view.component.css']
})
export class ModelBatchesViewComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;

   constructor(public bsModalRef: BsModalRef) { }

   ngOnInit() {
      this.onClose = new Subject();
   }

}
