import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-create-extra-curricular-activities-model',
  templateUrl: './create-extra-curricular-activities-model.component.html',
  styleUrls: ['./create-extra-curricular-activities-model.component.css']
})
export class CreateExtraCurricularActivitiesModelComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
