import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-semester-info-view',
  templateUrl: './model-semester-info-view.component.html',
  styleUrls: ['./model-semester-info-view.component.css']
})
export class ModelSemesterInfoViewComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;

   constructor(public bsModalRef: BsModalRef) { }

   ngOnInit() {
      this.onClose = new Subject();
      console.log(this.Data);
   }
}
