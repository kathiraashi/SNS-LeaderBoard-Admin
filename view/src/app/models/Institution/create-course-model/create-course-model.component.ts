import { Component, OnInit } from '@angular/core';


import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-create-course-model',
  templateUrl: './create-course-model.component.html',
  styleUrls: ['./create-course-model.component.css']
})
export class CreateCourseModelComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
